import type { AnalyzeRequestBody, RiskComputationResult, RiskLevel } from "../types";

export const riskConfig = {
  pharmaWeights: {
    low: 1,
    medium: 2,
    high: 3,
  } as Record<AnalyzeRequestBody["pharmaPresence"], number>,
  densityWeights: {
    low: 1,
    medium: 2,
    high: 3,
  } as Record<AnalyzeRequestBody["populationDensity"], number>,
  infrastructureMinScore: 1,
  infrastructureMaxScore: 5,
  rawMin: 7,
  rawMax: 25,
  thresholds: {
    high: 70,
    moderate: 40,
  },
} as const;

/**
 * Compute a 0–100 risk score and categorical level from normalized inputs.
 *
 * wasteScore is expected to be in the range 1–5, where 1 = very poor infrastructure (high risk)
 * and 5 = strong infrastructure (lower risk).
 */
export function calculateRiskScore(input: AnalyzeRequestBody): RiskComputationResult {
  const pharma = riskConfig.pharmaWeights[input.pharmaPresence]; // 1–3
  const density = riskConfig.densityWeights[input.populationDensity]; // 1–3

  // Convert wasteScore 1–5 to a "risk" contribution where higher means more risk.
  // 1 → 5 (very poor), 5 → 1 (strong).
  const clampedWaste = clamp(
    input.wasteScore,
    riskConfig.infrastructureMinScore,
    riskConfig.infrastructureMaxScore,
  );
  const infrastructureRisk = riskConfig.infrastructureMaxScore + 1 - clampedWaste; // 1–5

  // Weighted sum:
  // - pharma presence (x3)
  // - population density (x2)
  // - infrastructure risk (x2)
  const raw =
    pharma * 3 +
    density * 2 +
    infrastructureRisk * 2;

  const normalized =
    ((raw - riskConfig.rawMin) / (riskConfig.rawMax - riskConfig.rawMin)) * 100;
  const riskScore = Math.round(clamp(normalized, 0, 100));

  const riskLevel: RiskLevel =
    riskScore >= riskConfig.thresholds.high
      ? "High"
      : riskScore >= riskConfig.thresholds.moderate
        ? "Moderate"
        : "Low";

  return { riskScore, riskLevel };
}

function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

