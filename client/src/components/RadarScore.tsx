import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer
} from "recharts";
import { InvestorPayload } from "../types";

type Props = {
  scores: InvestorPayload["scores"];
};

const RadarScore = ({ scores }: Props) => {
  const data = [
    { metric: "Feasibility", value: scores.feasibility },
    { metric: "Scalability", value: scores.scalability },
    { metric: "Uniqueness", value: scores.uniqueness },
    { metric: "Complexity", value: scores.execution_complexity }
  ];

  return (
    <div className="glass rounded-3xl p-6">
      <p className="text-sm uppercase tracking-[0.4em] text-slate-400">Radar</p>
      <h3 className="mb-4 text-xl font-semibold">Signal shape</h3>
      <div className="h-64">
        <ResponsiveContainer>
          <RadarChart data={data}>
            <PolarGrid stroke="#2f3947" />
            <PolarAngleAxis dataKey="metric" tick={{ fill: "#cbd5f5", fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: "#7b8798" }} />
            <Radar dataKey="value" stroke="#79f2d0" fill="#79f2d0" fillOpacity={0.25} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RadarScore;
