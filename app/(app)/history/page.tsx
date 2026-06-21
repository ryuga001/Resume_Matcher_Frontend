"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Clock, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type HistoryItem = {
  id: string; resumeName: string; jobDescription: string; atsScore: number; createdAt: string;
};

function ScoreBlock({ score }: { score: number }) {
  const [color, bg] = score >= 70
    ? ["text-[oklch(0.38_0.16_145)]", "bg-[oklch(0.52_0.17_145/0.10)]"]
    : score >= 50
    ? ["text-[oklch(0.50_0.16_65)]", "bg-[oklch(0.62_0.17_65/0.10)]"]
    : ["text-destructive", "bg-destructive/10"];
  const label = score >= 85 ? "Strong" : score >= 70 ? "Good" : score >= 50 ? "Partial" : score >= 30 ? "Weak" : "Poor";

  return (
    <div className={cn("flex flex-col items-center rounded-md px-3 py-2 min-w-[54px] text-center shrink-0", bg)}>
      <span className={cn("font-heading text-xl font-bold leading-none", color)}>{score}</span>
      <span className={cn("text-[9px] font-bold uppercase tracking-wide mt-0.5 opacity-70", color)}>{label}</span>
    </div>
  );
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.analysis.history().then(setHistory).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="font-heading text-xl font-semibold tracking-tight">Analysis history</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Every match scored, most recent first.</p>
      </div>

      <div className="page-body">
        {loading ? (
          <div className="bg-card border border-border rounded-lg divide-y divide-border">
            {[1,2,3,4].map(i => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                <Skeleton className="h-12 w-14 rounded-md shrink-0" />
                <div className="flex-1"><Skeleton className="h-4 w-44 mb-2" /><Skeleton className="h-3 w-64 mb-1.5" /><Skeleton className="h-3 w-28" /></div>
              </div>
            ))}
          </div>
        ) : history.length === 0 ? (
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
        ) : (
          <div className="bg-card border border-border rounded-lg divide-y divide-border overflow-hidden">
            {history.map((h, i) => (
              <Link
                key={h.id}
                href={`/history/${h.id}`}
                className={cn("flex items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors group fade-up", i > 0 && i <= 3 && `fade-up-delay-${i}`)}
              >
                <ScoreBlock score={h.atsScore ?? 0} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="size-3.5 shrink-0 text-muted-foreground" />
                    <p className="text-sm font-medium truncate">{h.resumeName}</p>
                  </div>
                  {h.jobDescription && (
                    <p className="text-xs text-muted-foreground truncate max-w-md mb-1">{h.jobDescription}</p>
                  )}
                  <p className="text-[10px] text-muted-foreground/60 flex items-center gap-1">
                    <Clock className="size-3" />{new Date(h.createdAt).toLocaleString()}
                  </p>
                </div>
                <ArrowRight className="size-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
