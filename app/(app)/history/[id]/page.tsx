"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, FileText, Clock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Detail = {
  id: string; resumeName: string; jobDescription: string;
  atsScore: number; matchingSkills: string[]; missingSkills: string[];
  recommendations: string[]; summary: string; createdAt: string;
};

function ScoreArc({ score }: { score: number }) {
  const r = 56;
  const circ = Math.PI * r;
  const offset = circ * (1 - score / 100);
  const color = score >= 70 ? "oklch(0.52 0.17 145)" : score >= 50 ? "oklch(0.62 0.17 65)" : "oklch(0.577 0.245 27.325)";
  const label = score >= 85 ? "Strong match" : score >= 70 ? "Good match" : score >= 50 ? "Partial match" : score >= 30 ? "Weak match" : "Poor match";
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
      <svg width="148" height="84" viewBox="0 0 148 84" className="shrink-0">
        <path d="M 10 74 A 64 64 0 0 1 138 74" fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="11" strokeLinecap="round" />
        <path d="M 10 74 A 64 64 0 0 1 138 74" fill="none" stroke={color} strokeWidth="11" strokeLinecap="round"
          strokeDasharray={`${circ} ${circ}`} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)" }} />
        <text x="74" y="66" textAnchor="middle" fontSize="24" fontWeight="700" fontFamily="var(--font-heading,serif)" fill="currentColor">{score}</text>
        <text x="74" y="79" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.4">/ 100</text>
      </svg>
      <div className="text-center sm:text-left">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">ATS Score</p>
        <h2 className="font-heading text-2xl font-bold tracking-tight">{label}</h2>
      </div>
    </div>
  );
}

export default function HistoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.analysis.detail(id).then(setDetail).catch(() => setError("Analysis not found.")).finally(() => setLoading(false));
  }, [id]);

  return (
    <div>
      <div className="page-header flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild className="size-8 shrink-0">
          <Link href="/history"><ArrowLeft className="size-4" /></Link>
        </Button>
        <div className="min-w-0">
          <h1 className="font-heading text-xl font-semibold tracking-tight truncate">
            {loading ? <Skeleton className="h-6 w-48 inline-block" /> : detail?.resumeName ?? "Analysis result"}
          </h1>
          {detail?.createdAt && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <Clock className="size-3" />{new Date(detail.createdAt).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      <div className="page-body">
        {loading && (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-32 w-full rounded-lg" />
            <div className="grid grid-cols-2 gap-3"><Skeleton className="h-40 rounded-lg" /><Skeleton className="h-40 rounded-lg" /></div>
          </div>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}

        {detail && (
          <div className="flex flex-col gap-4 fade-up">
            {/* Score */}
            <div className="bg-card border border-border rounded-lg p-6">
              <ScoreArc score={Math.round(detail.atsScore)} />
              {detail.summary && (
                <p className="text-sm text-muted-foreground leading-relaxed mt-4 sm:ml-[calc(148px+1.25rem)]">
                  {detail.summary}
                </p>
              )}
            </div>

            {/* Skills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: "Matching skills", skills: detail.matchingSkills ?? [], variant: "match" as const },
                { title: "Missing skills",  skills: detail.missingSkills  ?? [], variant: "miss"  as const },
              ].map(({ title, skills, variant }) => (
                <div key={title} className="bg-card border border-border rounded-lg p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={cn("size-2 rounded-full shrink-0", variant === "match" ? "bg-[oklch(0.52_0.17_145)]" : "bg-destructive")} />
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{title}</p>
                    <span className="text-xs text-muted-foreground ml-auto">{skills.length}</span>
                  </div>
                  {skills.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">None identified</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {skills.map(s => (
                        <span key={s} className={cn(
                          "text-xs font-mono px-2 py-0.5 rounded font-medium",
                          variant === "match"
                            ? "bg-[oklch(0.52_0.17_145/0.10)] text-[oklch(0.38_0.16_145)]"
                            : "bg-destructive/8 text-destructive"
                        )}>{s}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Recommendations */}
            {(detail.recommendations ?? []).length > 0 && (
              <div className="bg-card border border-border rounded-lg p-5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">Recommendations</p>
                <ol className="flex flex-col gap-3">
                  {detail.recommendations.map((r, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="font-mono text-[10px] font-bold text-muted-foreground/50 shrink-0 w-5 mt-0.5 text-right">{String(i+1).padStart(2,"0")}</span>
                      <span className="border-l-2 border-border pl-3 leading-relaxed">{r}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* JD preview */}
            {detail.jobDescription && (
              <div className="bg-card border border-border rounded-lg p-5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">Job description (preview)</p>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4 whitespace-pre-line">{detail.jobDescription}</p>
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <Button asChild variant="outline" size="sm">
                <Link href="/analyze" className="flex items-center gap-1.5"><Sparkles className="size-3.5" /> Analyze again</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/history" className="flex items-center gap-1.5"><ArrowLeft className="size-3.5" /> All history</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
