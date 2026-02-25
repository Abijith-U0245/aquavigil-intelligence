export type PharmaPresence = "low" | "medium" | "high";

export type PopulationDensity = "low" | "medium" | "high";

export interface AnalyzeRequestBody {
  city: string;
  pharmaPresence: PharmaPresence;
  wasteScore: number;
  populationDensity: PopulationDensity;
}

export type RiskLevel = "Low" | "Moderate" | "High";

export interface RiskComputationResult {
  riskScore: number;
  riskLevel: RiskLevel;
}

export interface AnalyzeResponseBody extends RiskComputationResult {
  analysis: string;
  amrImpact: string;
  recommendations: string[];
  policySuggestions: string[];
}

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code?: string;

  constructor(statusCode: number, message: string, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace?.(this, ApiError);
  }
}

