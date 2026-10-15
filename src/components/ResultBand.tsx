export function MetricValue({ value }: { value: string }) {
  return <>{value.split(/(\d+(?:[.,]\d+)*(?:[xX+])?)/).map((part, index) =>
    /\d/.test(part) ? <span key={index} className="num">{part}</span> : part,
  )}</>;
}
export function ResultBand({ results }: { results: { value: string; caption: string }[] }) {
  return (
    <dl className="result-band" style={{ gridTemplateColumns: `repeat(${results.length}, minmax(0, 1fr))` }}>
      {results.map((result) => <div className="result-band__item" key={result.value}>
        <dt><MetricValue value={result.value} /></dt>
        <dd>{result.caption}</dd>
      </div>)}
    </dl>
  );
}
