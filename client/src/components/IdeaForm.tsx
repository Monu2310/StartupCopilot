import { useState, type ChangeEvent } from "react";

type Props = {
  onSubmit: (payload: {
    skills: string;
    interests: string;
    budget: string;
    targetAudience: string;
    geography: string;
  }) => void;
  loading?: boolean;
};

const IdeaForm = ({ onSubmit, loading }: Props) => {
  const [form, setForm] = useState({
    skills: "",
    interests: "",
    budget: "",
    targetAudience: "",
    geography: ""
  });

  const handleChange = (key: keyof typeof form) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }));
    };

  return (
    <form
      className="grid gap-4 md:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(form);
      }}
    >
      {(
        [
          ["skills", "Skills"],
          ["interests", "Interests"],
          ["budget", "Budget"],
          ["targetAudience", "Target audience"],
          ["geography", "Geography"]
        ] as const
      ).map(([key, label]) => (
        <label key={key} className="text-sm text-slate-300">
          {label}
          <input
            value={form[key]}
            onChange={handleChange(key)}
            placeholder={`Enter ${label.toLowerCase()}`}
            className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate px-4 py-3 text-white focus:border-mint focus:outline-none"
            required
          />
        </label>
      ))}
      <button
        type="submit"
        disabled={loading}
        className="col-span-full mt-2 rounded-2xl bg-mint px-6 py-3 font-semibold text-ink transition hover:opacity-90"
      >
        {loading ? "Generating..." : "Generate Idea"}
      </button>
    </form>
  );
};

export default IdeaForm;
