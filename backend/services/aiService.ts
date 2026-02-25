import OpenAI from "openai";
import type { AnalyzeRequestBody, AnalyzeResponseBody } from "../types";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const AI_TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS || 10000);
const DEMO_MODE = String(process.env.DEMO_MODE || "false").toLowerCase() === "true";
const DEMO_SAFE = String(process.env.DEMO_SAFE || "false").toLowerCase() === "true";

const openai = !DEMO_MODE && OPENAI_API_KEY
  ? new OpenAI({ apiKey: OPENAI_API_KEY })
  : null;

interface AIRequestContext extends AnalyzeRequestBody {
  riskScore: number;
  riskLevel: AnalyzeResponseBody["riskLevel"];
}

interface AIPayload {
  analysis: string;
  amrImpact: string;
  recommendations: string[];
  policySuggestions: string[];
}

const FALLBACK_PAYLOAD: AIPayload = {
  analysis:
    "Due to a temporary issue, a detailed AI narrative is unavailable. The risk score is computed from the provided district parameters using a deterministic model.",
  amrImpact:
    "Antimicrobial resistance impact could be elevated in areas with high pharmaceutical activity and inadequate waste management, especially near vulnerable water bodies.",
  recommendations: [
    "Strengthen pharmaceutical effluent treatment and monitoring.",
    "Deploy continuous water quality sensors at key discharge points.",
    "Establish or expand AMR surveillance programs in local hospitals.",
  ],
  policySuggestions: [
    "Introduce stricter discharge standards for pharmaceutical effluents.",
    "Mandate regular environmental impact assessments for high-risk districts.",
    "Create incentive schemes for industries adopting green chemistry practices.",
  ],
};

export async function getAIAnalysis(
  context: AIRequestContext,
): Promise<AIPayload> {
  if (DEMO_MODE) {
    return buildDemoPayload(context);
  }

  if (!openai) {
    console.warn("[AI] OPENAI_API_KEY not set, returning fallback payload");
    return FALLBACK_PAYLOAD;
  }

  const controller = new AbortController();
  const effectiveTimeout = DEMO_SAFE ? Math.min(AI_TIMEOUT_MS, 5000) : AI_TIMEOUT_MS;
  const timeout = setTimeout(() => controller.abort(), effectiveTimeout);

  try {
    const systemPrompt =
      "You are an environmental risk intelligence assistant specializing in pharmaceutical pollution and antimicrobial resistance (AMR). " +
      "Given structured district-level inputs and a pre-computed risk score, you must return ONLY valid JSON with no additional commentary.";

    const userPrompt = buildUserPrompt(context);

    const primary = await openai.chat.completions.create(
      {
        model: OPENAI_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      },
      { signal: controller.signal as AbortSignal },
    );

    const rawContent =
      primary.choices[0]?.message?.content ?? "";

    let parsed = safeParseJson(rawContent);

    // Single repair attempt if parsing fails
    if (!parsed) {
      console.warn("[AI] Failed to parse JSON from model, attempting repair");
      const repairPrompt = buildRepairPrompt(rawContent);
      const repaired = await openai.chat.completions.create(
        {
          model: OPENAI_MODEL,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
            {
              role: "assistant",
              content: rawContent,
            },
            {
              role: "user",
              content: repairPrompt,
            },
          ],
          temperature: 0.1,
          max_tokens: 500,
        },
        { signal: controller.signal as AbortSignal },
      );

      const repairedContent =
        repaired.choices[0]?.message?.content ?? "";
      parsed = safeParseJson(repairedContent);
    }

    if (!parsed) {
      console.warn("[AI] Repair also failed, using fallback");
      return FALLBACK_PAYLOAD;
    }

    const payload = normalizeAIPayload(parsed);
    return payload;
  } catch (error) {
    if ((error as any).name === "AbortError") {
      console.error("[AI] Request timed out");
    } else {
      console.error("[AI] Error while calling OpenAI:", error);
    }
    return FALLBACK_PAYLOAD;
  } finally {
    clearTimeout(timeout);
  }
}

function buildUserPrompt(context: AIRequestContext): string {
  const { city, pharmaPresence, wasteScore, populationDensity, riskScore, riskLevel } =
    context;

  return `
You are given district-level parameters for pharmaceutical pollution and AMR risk.

Input:
- city: ${city}
- pharmaPresence: ${pharmaPresence} (low/medium/high)
- wasteScore: ${wasteScore} (1=very poor, 5=strong infrastructure)
- populationDensity: ${populationDensity} (low/medium/high)
- computed riskScore: ${riskScore} (0-100)
- computed riskLevel: ${riskLevel}

Task:
Return ONLY a JSON object with this exact shape (no extra keys, no markdown, no comments):

{
  "analysis": "string",
  "amrImpact": "string",
  "recommendations": ["string", "..."],
  "policySuggestions": ["string", "..."]
}

The JSON MUST be syntactically valid and parseable by JSON.parse in JavaScript.
Do not include any text before or after the JSON object.`;
}

function buildRepairPrompt(previous: string): string {
  return `
The previous response was not valid JSON. Convert that previous response into a single JSON object that matches this TypeScript type exactly:

{
  "analysis": string;
  "amrImpact": string;
  "recommendations": string[];
  "policySuggestions": string[];
}

Return ONLY the JSON object with no markdown or comments. Here is the previous invalid output:

${previous}
`;
}

function safeParseJson(text: string): unknown | null {
  const trimmed = text.trim();
  if (!trimmed) return null;

  // Sometimes models wrap JSON in markdown fences; strip them if present.
  const withoutFences = trimmed
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    return JSON.parse(withoutFences);
  } catch (e) {
    console.warn("[AI] JSON.parse failed:", e);
    return null;
  }
}

function normalizeAIPayload(data: any): AIPayload {
  const maxTextLength = 4000;
  const maxItems = 10;

  const analysisRaw =
    typeof data?.analysis === "string" && data.analysis.trim()
      ? data.analysis.trim()
      : FALLBACK_PAYLOAD.analysis;
  const amrImpactRaw =
    typeof data?.amrImpact === "string" && data.amrImpact.trim()
      ? data.amrImpact.trim()
      : FALLBACK_PAYLOAD.amrImpact;

  const analysis =
    analysisRaw.length > maxTextLength
      ? analysisRaw.slice(0, maxTextLength)
      : analysisRaw;

  const amrImpact =
    amrImpactRaw.length > maxTextLength
      ? amrImpactRaw.slice(0, maxTextLength)
      : amrImpactRaw;

  const recommendations = Array.isArray(data?.recommendations)
    ? data.recommendations
        .filter((item: unknown) => typeof item === "string")
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0)
        .slice(0, maxItems)
    : [];

  const policySuggestions = Array.isArray(data?.policySuggestions)
    ? data.policySuggestions
        .filter((item: unknown) => typeof item === "string")
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0)
        .slice(0, maxItems)
    : [];

  return {
    analysis,
    amrImpact,
    recommendations:
      recommendations.length > 0
        ? recommendations
        : FALLBACK_PAYLOAD.recommendations,
    policySuggestions:
      policySuggestions.length > 0
        ? policySuggestions
        : FALLBACK_PAYLOAD.policySuggestions,
  };
}

function buildDemoPayload(context: AIRequestContext): AIPayload {
  const { city, riskScore, riskLevel } = context;

  return {
    analysis: `This is a demo-mode narrative for ${city}. The modeled pharmaceutical pollution and AMR risk is classified as ${riskLevel} with a score of ${riskScore} out of 100. The score reflects combined effects of pharmaceutical cluster intensity, waste infrastructure, population density, and proximity to water bodies.\n\nIn a production deployment, this narrative would be generated by an LLM, but here it is produced deterministically for reliability during demonstrations.`,
    amrImpact:
      "In districts with significant pharmaceutical manufacturing and constrained wastewater treatment capacity, environmental antibiotic residues can contribute to the selection and spread of multidrug-resistant organisms. Over time, this raises the burden of difficult-to-treat infections and increases pressure on local health systems.",
    recommendations: [
      "Expand water quality monitoring around industrial discharge points and downstream communities.",
      "Audit wastewater treatment plants for pharmaceutical removal performance and upgrade where needed.",
      "Improve segregation, storage, and disposal of pharmaceutical waste streams across the district.",
      "Strengthen links between environmental monitoring teams and hospital AMR surveillance programs.",
    ],
    policySuggestions: [
      "Update discharge standards for active pharmaceutical ingredients in effluents from large facilities.",
      "Require periodic environmental and AMR risk assessments as part of regulatory compliance.",
      "Create incentives for greener manufacturing processes and advanced treatment technologies.",
    ],
  };
}

