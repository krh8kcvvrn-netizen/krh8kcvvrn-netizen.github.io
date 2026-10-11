import { formatUsd } from "../lib/money";
import { percentFunded } from "../lib/gifts";

export default function Meter({ raised, goal, label }) {
  const raw = percentFunded(raised, goal);
  const width = Math.min(100, Math.max(0, raw));

  return (
    <div className="meter">
      <div className="meter-top">
        <span>{formatUsd(raised)} raised</span>
        <span>{raw}% of {formatUsd(goal)}</span>
      </div>
      <div
        className={raw >= 100 ? "meter-track done" : "meter-track"}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={width}
        aria-valuetext={`${formatUsd(raised)} raised of ${formatUsd(goal)}`}
        aria-label={label}
      >
        <span style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}
