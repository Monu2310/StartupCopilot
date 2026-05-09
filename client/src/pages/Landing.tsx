import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<number>();

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleEnter = () => {
    if (loading) return;
    setLoading(true);
    timerRef.current = window.setTimeout(() => {
      navigate("/app");
    }, 700);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0505] via-[#0b0608] to-[#050507]" />
        <div className="absolute inset-0 starfield-slow opacity-70" />
        <div className="absolute inset-0 landing-grid" />
        <div className="absolute left-1/2 top-1/2 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ef233c]/10 blur-[140px]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-[10px] uppercase tracking-[0.4em] text-white/70">
          AI Startup Co-Founder
        </div>
        <h1 className="mt-8 max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
          Design Intelligence for the
          <span className="text-accent"> Future</span>
        </h1>
        <p className="mt-4 max-w-xl text-sm text-white/65 md:text-base">
          A minimalist launch pad into Idea Foundry. Generate investor-ready startup concepts in
          minutes.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <button
            onClick={handleEnter}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5 px-8 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white transition hover:border-accent/60"
          >
            <span className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
              <span className="absolute inset-0 bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_70%,#ef233c_100%)]" />
            </span>
            <span className="relative z-10">Enter Foundry</span>
          </button>
          <span className="text-[10px] uppercase tracking-[0.4em] text-white/50">
            Minimal mode
          </span>
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="loading-dots">
              <span />
              <span />
              <span />
            </div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/70">Loading</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;
