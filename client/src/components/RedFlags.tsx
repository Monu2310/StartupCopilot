type Props = {
  flags: string[];
};

const RedFlags = ({ flags }: Props) => {
  return (
    <div className="glass rounded-3xl p-6">
      <p className="text-sm uppercase tracking-[0.4em] text-slate-400">Red Flags</p>
      <h3 className="mb-4 text-xl font-semibold">Risk triggers</h3>
      {flags.length === 0 ? (
        <p className="text-slate-400">No explicit red flags detected.</p>
      ) : (
        <ul className="space-y-2 text-sm text-ember">
          {flags.map((flag) => (
            <li key={flag} className="rounded-2xl bg-ember/10 px-4 py-2">
              {flag}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RedFlags;
