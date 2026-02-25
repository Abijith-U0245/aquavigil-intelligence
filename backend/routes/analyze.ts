import express from "express";
import type { AnalyzeRequestBody, AnalyzeResponseBody } from "../types";
import { calculateRiskScore } from "../utils/riskCalculator";
import { getAIAnalysis } from "../services/aiService";

export const analyzeRouter = express.Router();

analyzeRouter.post(
  "/",
  async (
    req: express.Request<unknown, unknown, AnalyzeRequestBody>,
    res: express.Response<AnalyzeResponseBody | { error: unknown }>,
    next: express.NextFunction,
  ) => {
    try {
      const validationErrors = validateRequestBody(req.body);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          error: {
            message: "Invalid request body",
            code: "VALIDATION_ERROR",
            details: validationErrors,
          },
        });
      }

      const { city, pharmaPresence, wasteScore, populationDensity } = req.body;

      const trimmedCity = city.trim();

      const riskResult = calculateRiskScore({
        city: trimmedCity,
        pharmaPresence,
        wasteScore,
        populationDensity,
      });

      const aiPayload = await getAIAnalysis({
        city: trimmedCity,
        pharmaPresence,
        wasteScore,
        populationDensity,
        riskScore: riskResult.riskScore,
        riskLevel: riskResult.riskLevel,
      });

      const responseBody: AnalyzeResponseBody = {
        riskScore: riskResult.riskScore,
        riskLevel: riskResult.riskLevel,
        analysis: aiPayload.analysis,
        amrImpact: aiPayload.amrImpact,
        recommendations: aiPayload.recommendations,
        policySuggestions: aiPayload.policySuggestions,
      };

      return res.status(200).json(responseBody);
    } catch (error) {
      return next(error);
    }
  },
);

function validateRequestBody(body: any): string[] {
  const errors: string[] = [];

  if (!body || typeof body !== "object") {
    errors.push("Body must be a JSON object");
    return errors;
  }

  const { city, pharmaPresence, wasteScore, populationDensity } = body as Partial<AnalyzeRequestBody>;

  if (typeof city !== "string" || !city.trim()) {
    errors.push("city must be a non-empty string");
  } else if (city.trim().length > 200) {
    errors.push("city must be at most 200 characters");
  }

  const allowedPharma = ["low", "medium", "high"] as const;
  if (!allowedPharma.includes(pharmaPresence as any)) {
    errors.push('pharmaPresence must be one of: "low", "medium", "high"');
  }

  if (typeof wasteScore !== "number" || !Number.isFinite(wasteScore)) {
    errors.push("wasteScore must be a number");
  } else if (wasteScore < 1 || wasteScore > 5) {
    errors.push("wasteScore must be between 1 and 5");
  }

  const allowedDensity = ["low", "medium", "high"] as const;
  if (!allowedDensity.includes(populationDensity as any)) {
    errors.push('populationDensity must be one of: "low", "medium", "high"');
  }

  return errors;
}

