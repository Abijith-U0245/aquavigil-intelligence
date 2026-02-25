export type RiskLevel = "Low" | "Moderate" | "High";

export interface AnalyzeResponseBody {
  riskScore: number;
  riskLevel: RiskLevel | string;
  analysis: string;
  amrImpact: string;
  recommendations: string[];
  policySuggestions: string[];
}

