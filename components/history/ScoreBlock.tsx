import { cn } from "@/lib/utils";
import { scoreBlockClasses } from "@/components/history/utils";

type ScoreBlockProps = { score: number };

export function ScoreBlock({ score }: ScoreBlockProps) {
  const { color, bg, label } = scoreBlockClasses(score);
  return (
    <div className={cn("flex flex-col items-center rounded-md px-3 py-2 min-w-[54px] text-center shrink-0", bg)}>
      <span className={cn("font-heading text-xl font-bold leading-none", color)}>{score}</span>
      <span className={cn("text-[9px] font-bold uppercase tracking-wide mt-0.5 opacity-70", color)}>{label}</span>
    </div>
  );
}
