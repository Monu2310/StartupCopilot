import { useState } from "react";
import { useIdeaSession } from "../hooks/useIdeaSession";

const ChatPanel = () => {
  const { idea, analysis, chat, analyzeIdea } = useIdeaSession();
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState<"harder" | "nicer" | "neutral">("neutral");

  const handleSend = async () => {
    if (!idea || !message.trim()) return;
    await analyzeIdea({ idea, tone, context: message });
    setMessage("");
  };

  return (
    <section className="glass rounded-3xl p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-slate-400">Follow-ups</p>
          <h3 className="text-2xl font-semibold">Refine with conversation</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.3em] ${
              tone === "harder" ? "bg-ember text-ink" : "border border-ember text-ember"
            }`}
            onClick={() => setTone("harder")}
          >
            Roast harder
          </button>
          <button
            className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.3em] ${
              tone === "nicer" ? "bg-sky text-ink" : "border border-sky text-sky"
            }`}
            onClick={() => setTone("nicer")}
          >
            Be nicer
          </button>
        </div>
      </div>

      <div className="mb-4 max-h-64 space-y-3 overflow-auto rounded-2xl bg-[#0b0d10] p-4 text-sm">
        {chat.length === 0 && (
          <p className="text-slate-500">No messages yet. Ask the co-founder a follow-up.</p>
        )}
        {chat.map((item, index) => (
          <div
            key={`${item.role}-${index}`}
            className={`rounded-2xl px-4 py-2 ${
              item.role === "user" ? "bg-slate text-white" : "bg-ink text-mint"
            }`}
          >
            {item.content}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Ask a sharper question or request a pivot..."
          className="flex-1 rounded-2xl border border-slate-700 bg-slate px-4 py-3 text-white focus:border-mint focus:outline-none"
        />
        <button
          onClick={handleSend}
          disabled={!idea}
          className="rounded-2xl bg-mint px-5 py-3 font-semibold text-ink"
        >
          Send
        </button>
      </div>

      {analysis && (
        <p className="mt-3 text-xs text-slate-400">
          Last verdict: {analysis.evaluation.verdict}
        </p>
      )}
    </section>
  );
};

export default ChatPanel;
