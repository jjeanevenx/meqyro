export function ProgressBar({ value, label }: { value: number; label: string }) {
  const normalized = Math.min(100, Math.max(0, value));

  return (
    <div className="progress">
      <div className="progress__label">
        <span>{label}</span>
        <span>{normalized}%</span>
      </div>
      <div
        aria-label={label}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={normalized}
        className="progress__track"
        role="progressbar"
      >
        <span className="progress__value" style={{ width: `${normalized}%` }} />
      </div>
    </div>
  );
}
