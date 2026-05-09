import { useState } from "react";

type TabItem = {
  label: string;
  content: React.ReactNode;
};

type Props = {
  tabs: TabItem[];
};

const Tabs = ({ tabs }: Props) => {
  const [active, setActive] = useState(0);

  return (
    <div className="glass rounded-3xl p-6">
      <div className="mb-4 flex flex-wrap gap-3">
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            onClick={() => setActive(index)}
            className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.3em] transition ${
              active === index ? "bg-mint text-ink" : "border border-slate-700 text-slate-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{tabs[active]?.content}</div>
    </div>
  );
};

export default Tabs;
