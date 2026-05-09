import { useState } from "react";
import { useIdeaSession } from "../hooks/useIdeaSession";
import ChatPanel from "../components/ChatPanel";
import ScoreCards from "../components/ScoreCards";
import RadarScore from "../components/RadarScore";
import RedFlags from "../components/RedFlags";
import Tabs from "../components/Tabs";
import JsonOutput from "../components/JsonOutput";

const Dashboard = () => {
  const { idea, analysis, analyzeIdea } = useIdeaSession();
  const [tone, setTone] = useState<"harder" | "nicer" | "neutral">("neutral");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!idea) return;
    setLoading(true);
    await analyzeIdea({ idea, tone });
    setLoading(false);
  };

  return (
    <div className="grid gap-8">
      <section className="glass rounded-3xl p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/70">Analysis Dashboard</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Score it like an investor</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.3em] transition ${
                tone === "harder" ? "bg-accent text-ink" : "border border-accent/40 text-accent hover:border-accent"
              }`}
              onClick={() => setTone("harder")}
            >
              Roast harder
            </button>
            <button
              className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.3em] transition ${
                tone === "nicer" ? "bg-ember text-ink" : "border border-ember/40 text-ember hover:border-ember"
              }`}
              onClick={() => setTone("nicer")}
            >
              Be nicer
            </button>
            <button
              className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-ink hover:bg-accent/90 transition"
              onClick={handleAnalyze}
              disabled={loading || !idea}
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </div>
        </div>
        {idea ? (
          <JsonOutput data={idea} />
        ) : (
          <p className="text-white/60">Generate an idea first to unlock analysis.</p>
        )}
      </section>

      {analysis && (
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="grid gap-6">
            <ScoreCards evaluation={analysis.evaluation} scores={analysis.investor.scores} />
            <Tabs
              tabs={[
                {
                  label: "Roast",
                  content: <JsonOutput data={analysis.roast} />
                },
                {
                  label: "Investor",
                  content: <JsonOutput data={analysis.investor} />
                },
                {
                  label: "Improvements",
                  content: <JsonOutput data={analysis.improver} />
                }
              ]}
            />
          </div>
          <div className="grid gap-6">
            <RadarScore scores={analysis.investor.scores} />
            <RedFlags flags={analysis.red_flags} />
          </div>
        </section>
      )}

      <ChatPanel />
    </div>
  );
};

export default Dashboard;
