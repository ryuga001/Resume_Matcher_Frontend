import Link from "next/link";
import { FileText, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScoreBlock } from "@/components/history/ScoreBlock";
import type { HistoryItem } from "@/components/history/types";

type HistoryListItemProps = { item: HistoryItem; index: number };

export function HistoryListItem({ item, index }: HistoryListItemProps) {
  return (
    <Link
      href={`/history/${item.id}`}
      className={cn(
        "flex items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors group fade-up",
        index > 0 && index <= 3 && `fade-up-delay-${index}`
      )}
    >
      <ScoreBlock score={item.atsScore ?? 0} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <FileText className="size-3.5 shrink-0 text-muted-foreground" />
          <p className="text-sm font-medium truncate">{item.resumeName}</p>
        </div>
        {item.jobDescription && (
          <p className="text-xs text-muted-foreground truncate max-w-md mb-1">{item.jobDescription}</p>
        )}
        <p className="text-[10px] text-muted-foreground/60 flex items-center gap-1">
          <Clock className="size-3" />{new Date(item.createdAt).toLocaleString()}
        </p>
      </div>
      <ArrowRight className="size-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  );
}
