export function ProgressBar({
  value,
  label,
  kicker,
}: {
  value: number;
  label: string;
  kicker?: string;
}) {
  const normalized = Math.min(100, Math.max(0, Math.round(value)));

  return (
    <div className="progress">
      <div className="progress__label">
        <div className="progress__left">
          {kicker ? <span className="progress__kicker">{kicker}</span> : null}
          <span className="progress__counter">{label}</span>
        </div>
        <span className="progress__percent">{normalized}%</span>
      </div>
      <div
        aria-label={label}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={normalized}
        className="progress__track"
        role="progressbar"
      >
        <div className="progress__value" style={{ width: `${normalized}%` }} />
      </div>
    </div>
  );
}
