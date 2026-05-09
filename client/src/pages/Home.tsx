import { useState } from "react";
import IdeaForm from "../components/IdeaForm";
import JsonOutput from "../components/JsonOutput";
import { useIdeaSession } from "../hooks/useIdeaSession";

const Home = () => {
  const { idea, generateIdea } = useIdeaSession();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (payload: {
    skills: string;
    interests: string;
    budget: string;
    targetAudience: string;
    geography: string;
  }) => {
    setLoading(true);
    await generateIdea(payload);
    setLoading(false);
  };

  return (
    <div className="grid gap-8">
      <section className="glass rounded-3xl p-8 shadow-glow">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.4em] text-white/70">Idea Generator</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Build a startup concept fast</h2>
        </div>
        <IdeaForm onSubmit={handleSubmit} loading={loading} />
      </section>

      <section className="glass rounded-3xl p-8">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Generated Idea</h3>
          <span className="text-xs uppercase tracking-[0.4em] text-accent">JSON</span>
        </div>
        {idea ? (
          <JsonOutput data={idea} />
        ) : (
          <p className="text-white/60">Submit your inputs to see a structured idea output.</p>
        )}
      </section>
    </div>
  );
};

export default Home;
