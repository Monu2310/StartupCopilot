import { Route, Routes, NavLink, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import { IdeaSessionProvider } from "./hooks/useIdeaSession";

const App = () => {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <IdeaSessionProvider>
      {isLanding ? (
        <Routes>
          <Route path="/" element={<Landing />} />
        </Routes>
      ) : (
        <div className="min-h-screen grid-pattern text-white">
          <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-mint">
                AI Startup Co-Founder
              </p>
              <h1 className="text-2xl font-semibold">Idea Foundry</h1>
            </div>
            <nav className="flex gap-4 text-sm">
              <NavLink
                to="/app"
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 transition ${
                    isActive ? "bg-mint text-ink" : "text-slate-200 hover:text-mint"
                  }`
                }
                end
              >
                Generator
              </NavLink>
              <NavLink
                to="/app/dashboard"
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 transition ${
                    isActive ? "bg-mint text-ink" : "text-slate-200 hover:text-mint"
                  }`
                }
              >
                Analysis
              </NavLink>
            </nav>
          </header>
          <main className="mx-auto w-full max-w-6xl px-6 pb-12">
            <Routes>
              <Route path="/app" element={<Home />} />
              <Route path="/app/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
        </div>
      )}
    </IdeaSessionProvider>
  );
};

export default App;
