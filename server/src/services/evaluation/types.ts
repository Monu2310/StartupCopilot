export type ScoreInput = {
  feasibility: number;
  scalability: number;
  uniqueness: number;
  execution_complexity: number;
};

export type EvaluationResult = {
  overall_score: number;
  verdict: string;
  weighted_breakdown: {
    feasibility: number;
    scalability: number;
    uniqueness: number;
    complexity: number;
  };
};
