type RecommendationsPanelProps = { recommendations: string[] };

export function RecommendationsPanel({ recommendations }: RecommendationsPanelProps) {
  if (recommendations.length === 0) return null;
  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">Recommendations</p>
      <ol className="flex flex-col gap-3">
        {recommendations.map((r, i) => (
          <li key={i} className="flex gap-3 text-sm">
            <span className="font-mono text-[10px] font-bold text-muted-foreground/50 shrink-0 w-5 mt-0.5 text-right">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="border-l-2 border-border pl-3 leading-relaxed">{r}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
