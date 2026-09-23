export default function SplitSelector({ value, onChange }) {
  return (
    <div className="split-tabs">
      {["equal", "exact", "percentage"].map((x) => (
        <button type="button" key={x} className={value === x ? "active" : ""} onClick={() => onChange(x)}>
          {x[0].toUpperCase() + x.slice(1)}
        </button>
      ))}
    </div>
  );
}
