"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { FileText, Sparkles, TrendingUp, ArrowRight, Clock, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type HistoryItem = { id: string; resumeName: string; atsScore: number; createdAt: string };

function scoreVariant(s: number): "success" | "warning" | "error" {
  return s >= 70 ? "success" : s >= 50 ? "warning" : "error";
}
function scoreLabel(s: number) {
  if (s >= 85) return "Strong"; if (s >= 70) return "Good";
  if (s >= 50) return "Partial"; if (s >= 30) return "Weak"; return "Poor";
}

function StatCard({ label, value, unit, icon: Icon, href, cta, loading }: {
  label: string; value: string; unit?: string; icon: React.ElementType;
  href: string; cta: string; loading: boolean;
}) {
  return (
    <Link href={href} className="block group">
      <div className="bg-card border border-border rounded-lg p-5 h-full hover:border-primary/30 transition-colors">
        <div className="flex items-start justify-between mb-4">
          <p className="section-label">{label}</p>
          <Icon className="size-4 text-muted-foreground/40" />
        </div>
        {loading ? (
          <Skeleton className="h-8 w-16 mb-3" />
        ) : (
          <div className="flex items-baseline gap-1.5 mb-3">
            <span className="font-heading text-3xl font-bold tracking-tight">{value}</span>
            {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
          </div>
        )}
        <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors inline-flex items-center gap-1">
          {cta} <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [resumeCount, setResumeCount] = useState<number | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.resumes.list(), api.analysis.history()])
      .then(([r, h]) => { setResumeCount(r.length); setHistory(h); })
      .catch(() => { setResumeCount(0); })
      .finally(() => setLoading(false));
  }, []);

  const recent = history.slice(0, 5);
  const avg = history.length ? Math.round(history.reduce((s, h) => s + (h.atsScore ?? 0), 0) / history.length) : null;

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <h1 className="font-heading text-xl font-semibold tracking-tight">
          Good to see you, {user?.name.split(" ")[0]}.
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">Your resume intelligence at a glance.</p>
      </div>

      <div className="page-body">
        {/* Stat strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatCard label="Resumes" value={loading ? "—" : String(resumeCount ?? 0)} icon={FileText} href="/resumes" cta="Manage library" loading={loading} />
          <StatCard label="Analyses run" value={loading ? "—" : String(history.length)} icon={Sparkles} href="/history" cta="View history" loading={loading} />
          <StatCard label="Avg. ATS score" value={loading ? "—" : avg !== null ? String(avg) : "—"} unit={avg !== null ? "/ 100" : undefined} icon={TrendingUp} href="/analyze" cta="Run analysis" loading={loading} />
        </div>

        {/* Quick actions */}
        <div>
          <p className="section-label">Get started</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { href: "/resumes", icon: Plus, title: "Upload a resume", desc: "Add a PDF to your library" },
              { href: "/analyze", icon: Sparkles, title: "Score a match", desc: "Paste a job description and get your ATS score in 30 seconds" },
            ].map(({ href, icon: Icon, title, desc }) => (
              <Link key={href} href={href} className="group flex items-center gap-4 bg-card border border-border rounded-lg p-4 hover:border-primary/30 transition-colors">
                <div className="size-9 rounded-md bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/8 transition-colors">
                  <Icon className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{desc}</p>
                </div>
                <ArrowRight className="size-4 text-muted-foreground ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent analyses */}
        {loading ? (
          <div>
            <p className="section-label">Recent analyses</p>
            <div className="bg-card border border-border rounded-lg divide-y divide-border">
              {[1,2,3].map(i => (
                <div key={i} className="flex items-center gap-4 px-5 py-4">
                  <Skeleton className="h-10 w-14 rounded-md shrink-0" />
                  <div className="flex-1"><Skeleton className="h-4 w-40 mb-2" /><Skeleton className="h-3 w-24" /></div>
                </div>
              ))}
            </div>
          </div>
        ) : recent.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="section-label">Recent analyses</p>
              <Link href="/history" className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1">
                All history <ArrowRight className="size-3" />
              </Link>
            </div>
            <div className="bg-card border border-border rounded-lg divide-y divide-border overflow-hidden">
              {recent.map((h, i) => (
                <Link
                  key={h.id}
                  href={`/history/${h.id}`}
                  className={cn("flex items-center gap-4 px-5 py-3.5 hover:bg-muted/30 transition-colors group fade-up", i > 0 && `fade-up-delay-${Math.min(i, 3)}`)}
                >
                  <div className={cn(
                    "flex flex-col items-center justify-center rounded-md px-2.5 py-1.5 min-w-[52px] text-center shrink-0",
                    h.atsScore >= 70 ? "bg-[oklch(0.52_0.17_145/0.1)]" : h.atsScore >= 50 ? "bg-[oklch(0.62_0.17_65/0.1)]" : "bg-destructive/10"
                  )}>
                    <span className={cn("font-heading text-lg font-bold leading-none", h.atsScore >= 70 ? "text-[oklch(0.42_0.17_145)]" : h.atsScore >= 50 ? "text-[oklch(0.52_0.17_65)]" : "text-destructive")}>
                      {h.atsScore}
                    </span>
                    <span className="text-[9px] font-semibold uppercase tracking-wide opacity-70 mt-0.5">{scoreLabel(h.atsScore)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{h.resumeName}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Clock className="size-3" />{new Date(h.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <div className="size-14 rounded-full bg-muted flex items-center justify-center">
              <Sparkles className="size-6 text-muted-foreground/50" />
            </div>
            <div>
              <p className="font-semibold text-sm mb-1">No analyses yet</p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Upload a resume, paste a job description, and get your ATS score in under a minute.
              </p>
            </div>
            <Button asChild size="sm">
              <Link href={resumeCount ? "/analyze" : "/resumes"}>
                {resumeCount ? "Run your first analysis" : "Upload your first resume"}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
