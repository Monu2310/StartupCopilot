import { EvaluationResult, ScoreInput } from "./types";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const evaluateScores = (scores: ScoreInput): EvaluationResult => {
  const feasibility = clamp(scores.feasibility, 1, 10);
  const scalability = clamp(scores.scalability, 1, 10);
  const uniqueness = clamp(scores.uniqueness, 1, 10);
  const complexity = clamp(scores.execution_complexity, 1, 10);

  const weightedFeasibility = feasibility * 0.3;
  const weightedScalability = scalability * 0.3;
  const weightedUniqueness = uniqueness * 0.2;
  const weightedComplexity = (10 - complexity) * 0.2;

  const overallScore =
    weightedFeasibility +
    weightedScalability +
    weightedUniqueness +
    weightedComplexity;

  const verdict = mapVerdict(overallScore);

  return {
    overall_score: Number(overallScore.toFixed(2)),
    verdict,
    weighted_breakdown: {
      feasibility: Number(weightedFeasibility.toFixed(2)),
      scalability: Number(weightedScalability.toFixed(2)),
      uniqueness: Number(weightedUniqueness.toFixed(2)),
      complexity: Number(weightedComplexity.toFixed(2))
    }
  };
};

export const mapVerdict = (score: number) => {
  if (score >= 8) return "🔥 Strong Idea";
  if (score >= 6) return "👍 Promising";
  if (score >= 4) return "⚠️ Risky";
  return "💀 Bad Idea";
};
