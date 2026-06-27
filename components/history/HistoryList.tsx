import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { HistoryListItem } from "@/components/history/HistoryListItem";
import type { HistoryItem } from "@/components/history/types";

type HistoryListProps = { history: HistoryItem[]; loading: boolean };

export function HistoryList({ history, loading }: HistoryListProps) {
  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg divide-y divide-border">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4">
            <Skeleton className="h-12 w-14 rounded-md shrink-0" />
            <div className="flex-1">
              <Skeleton className="h-4 w-44 mb-2" />
              <Skeleton className="h-3 w-64 mb-1.5" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="size-14 rounded-full bg-muted flex items-center justify-center">
          <Sparkles className="size-6 text-muted-foreground/40" />
        </div>
        <div>
          <p className="font-semibold text-sm mb-1">No analyses yet</p>
          <p className="text-sm text-muted-foreground max-w-xs">
            Score your first resume against a job description to see results here.
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/analyze">Run an analysis</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg divide-y divide-border overflow-hidden">
      {history.map((h, i) => (
        <HistoryListItem key={h.id} item={h} index={i} />
      ))}
    </div>
  );
}
