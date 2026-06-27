const RADIUS = 56;
const CIRCUMFERENCE = Math.PI * RADIUS;

function arcColor(score: number): string {
  return score >= 70
    ? "oklch(0.52 0.17 145)"
    : score >= 50
    ? "oklch(0.62 0.17 65)"
    : "oklch(0.577 0.245 27.325)";
}

function arcLabel(score: number): string {
  return score >= 85 ? "Strong match" :
    score >= 70 ? "Good match" :
    score >= 50 ? "Partial match" :
    score >= 30 ? "Weak match" : "Poor match";
}

type ScoreArcProps = { score: number };

export function ScoreArc({ score }: ScoreArcProps) {
  const offset = CIRCUMFERENCE * (1 - score / 100);
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
      <svg width="148" height="84" viewBox="0 0 148 84" className="shrink-0">
        <path
          d="M 10 74 A 64 64 0 0 1 138 74"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.1"
          strokeWidth="11"
          strokeLinecap="round"
        />
        <path
          d="M 10 74 A 64 64 0 0 1 138 74"
          fill="none"
          stroke={arcColor(score)}
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)" }}
        />
        <text x="74" y="66" textAnchor="middle" fontSize="24" fontWeight="700" fontFamily="var(--font-heading,serif)" fill="currentColor">
          {score}
        </text>
        <text x="74" y="79" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.4">
          / 100
        </text>
      </svg>
      <div className="text-center sm:text-left">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">ATS Score</p>
        <h2 className="font-heading text-2xl font-bold tracking-tight">{arcLabel(score)}</h2>
      </div>
    </div>
  );
}
