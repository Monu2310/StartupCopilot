import { EvaluationResult, InvestorPayload } from "../types";

type Props = {
  evaluation: EvaluationResult;
  scores: InvestorPayload["scores"];
};

const ScoreCards = ({ evaluation, scores }: Props) => {
  const scoreItems = [
    { label: "Feasibility", value: scores.feasibility },
    { label: "Scalability", value: scores.scalability },
    { label: "Uniqueness", value: scores.uniqueness },
    { label: "Complexity", value: scores.execution_complexity }
  ];

  return (
    <div className="grid gap-4 rounded-3xl bg-slate p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Overall</p>
          <h3 className="text-3xl font-semibold text-mint">{evaluation.overall_score}</h3>
        </div>
        <span className="rounded-full bg-ember px-4 py-2 text-sm text-ink">
          {evaluation.verdict}
        </span>
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        {scoreItems.map((item) => (
          <div key={item.label} className="rounded-2xl bg-ink/40 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
          </div>
        ))}
      </div>
      <div className="text-xs text-slate-400">
        Weighted breakdown: feasibility {evaluation.weighted_breakdown.feasibility}, scalability {evaluation.weighted_breakdown.scalability}, uniqueness {evaluation.weighted_breakdown.uniqueness}, complexity {evaluation.weighted_breakdown.complexity}
      </div>
    </div>
  );
};

export default ScoreCards;
