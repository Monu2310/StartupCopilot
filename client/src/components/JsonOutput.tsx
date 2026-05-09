type Props = {
  data: unknown;
};

const JsonOutput = ({ data }: Props) => {
  return (
    <pre className="max-h-[360px] overflow-auto rounded-2xl bg-[#0b0d10] p-5 text-xs text-mint">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
};

export default JsonOutput;
