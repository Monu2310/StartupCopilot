type Props = {
  data: unknown;
};

const formatLabel = (value: string) =>
  value
    .replace(/_/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (letter) => letter.toUpperCase());

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const renderPrimitive = (value: unknown) => {
  if (value === null || value === undefined) {
    return <span className="text-white/40">None</span>;
  }

  if (typeof value === "string") {
    return <p className="break-words leading-6 text-smoke">{value}</p>;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return (
      <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
        {String(value)}
      </span>
    );
  }

  return <span className="text-white/60">{String(value)}</span>;
};

const renderObject = (data: Record<string, unknown>) => {
  const entries = Object.entries(data);

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {entries.map(([key, value]) => (
        <div
          key={key}
          className="rounded-2xl border border-white/8 bg-black/20 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
        >
          <p className="mb-2 text-[10px] uppercase tracking-[0.35em] text-accent/80">
            {formatLabel(key)}
          </p>
          <div className="min-w-0">{renderValue(value)}</div>
        </div>
      ))}
    </div>
  );
};

const renderValue = (value: unknown) => {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className="text-white/40">None</span>;
    }

    const primitiveItems = value.every(
      (item) => item === null || ["string", "number", "boolean"].includes(typeof item)
    );

    if (primitiveItems) {
      return (
        <div className="flex flex-wrap gap-2">
          {value.map((item, index) => (
            <span
              key={`${String(item)}-${index}`}
              className="inline-flex max-w-full rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs text-accent"
            >
              <span className="truncate">{String(item ?? "None")}</span>
            </span>
          ))}
        </div>
      );
    }

    return (
      <div className="grid gap-3">
        {value.map((item, index) => (
          <div key={index} className="rounded-2xl border border-white/8 bg-black/20 p-4">
            <p className="mb-2 text-[10px] uppercase tracking-[0.35em] text-white/40">
              Item {index + 1}
            </p>
            <div className="min-w-0">{isPlainObject(item) ? renderObject(item) : renderPrimitive(item)}</div>
          </div>
        ))}
      </div>
    );
  }

  if (isPlainObject(value)) {
    return renderObject(value);
  }

  return renderPrimitive(value);
};

const JsonOutput = ({ data }: Props) => {
  return (
    <div className="max-w-full overflow-hidden rounded-2xl border border-white/8 bg-[#0b0d10] p-5 text-sm text-white/90 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-[10px] uppercase tracking-[0.45em] text-white/40">Structured Output</p>
        <span className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-accent">
          JSON
        </span>
      </div>
      <div className="max-h-[420px] overflow-auto pr-1">
        {renderValue(data)}
      </div>
    </div>
  );
};

export default JsonOutput;
