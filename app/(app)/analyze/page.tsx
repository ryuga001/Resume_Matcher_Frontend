"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sparkles, Loader2, FileText, CheckCircle2, ArrowRight, RefreshCw, AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Resume = { resumeId: string; fileName: string; indexStatus: "processing" | "ready" | "error"; skills: string[] };

type Result = {
  atsScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  recommendations: string[];
  summary: string;
};

// ── Score gauge ───────────────────────────────────────────────────────────────

function ScoreGauge({ score }: { score: number }) {
  const r = 56, stroke = 11;
  const circ = Math.PI * r;
  const offset = circ * (1 - score / 100);
  const color = score >= 70 ? "oklch(0.52 0.17 145)" : score >= 50 ? "oklch(0.62 0.17 65)" : "oklch(0.577 0.245 27.325)";
  const label = score >= 85 ? "Strong match" : score >= 70 ? "Good match" : score >= 50 ? "Partial match" : score >= 30 ? "Weak match" : "Poor match";

  return (
    <div className="flex flex-col items-center sm:items-start sm:flex-row gap-5">
      <svg width="148" height="84" viewBox="0 0 148 84" className="shrink-0">
        <path d="M 10 74 A 64 64 0 0 1 138 74" fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth={stroke} strokeLinecap="round" />
        <path
          d="M 10 74 A 64 64 0 0 1 138 74" fill="none"
          stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={`${circ} ${circ}`}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }}
        />
        <text x="74" y="66" textAnchor="middle" fontSize="24" fontWeight="700" fontFamily="var(--font-heading,serif)" fill="currentColor">{score}</text>
        <text x="74" y="79" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.4">/ 100</text>
      </svg>
      <div className="text-center sm:text-left pt-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">ATS Score</p>
        <h2 className="font-heading text-2xl font-bold tracking-tight">{label}</h2>
      </div>
    </div>
  );
}

// ── Result view ───────────────────────────────────────────────────────────────

function ResultView({ result, onReset }: { result: Result; onReset: () => void }) {
  const score = Math.max(0, Math.min(100, Math.round(result.atsScore)));

  return (
    <div className="flex flex-col gap-4 fade-up">
      {/* Hero score card */}
      <div className="bg-card border border-border rounded-lg p-6">
        <ScoreGauge score={score} />
        {result.summary && (
          <p className="text-sm text-muted-foreground leading-relaxed mt-4 sm:ml-[calc(148px+1.25rem)]">
            {result.summary}
          </p>
        )}
      </div>

      {/* Skills grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { title: "Matching skills", skills: result.matchingSkills, variant: "match" as const },
          { title: "Missing skills",  skills: result.missingSkills,  variant: "miss"  as const },
        ].map(({ title, skills, variant }) => (
          <div key={title} className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className={cn("size-2 rounded-full shrink-0", variant === "match" ? "bg-[oklch(0.52_0.17_145)]" : "bg-destructive")} />
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{title}</p>
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
      {result.recommendations.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Recommendations</p>
          <ol className="flex flex-col gap-3">
            {result.recommendations.map((r, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="font-mono text-[10px] font-bold text-muted-foreground/60 shrink-0 w-5 mt-0.5 text-right">{String(i+1).padStart(2,"0")}</span>
                <span className="border-l-2 border-border pl-3 leading-relaxed">{r}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="flex items-center gap-3 pt-1">
        <Button variant="outline" size="sm" onClick={onReset} className="flex items-center gap-1.5">
          <RefreshCw className="size-3.5" /> Analyze another
        </Button>
        <Link href="/history" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
          View history <ArrowRight className="size-3" />
        </Link>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AnalyzePage() {
  const { toast } = useToast();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [selectedId, setSelectedId] = useState("");
  const [jd, setJd] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.resumes.list()
      .then(d => { setResumes(d); if (d.length) setSelectedId(d[0].resumeId); })
      .catch(() => {})
      .finally(() => setLoadingResumes(false));
  }, []);

  const selected = resumes.find(r => r.resumeId === selectedId);
  const canAnalyze = !analyzing && selectedId && jd.trim().length >= 50 && selected?.indexStatus === "ready";

  async function run() {
    if (!canAnalyze) return;
    setError(""); setAnalyzing(true);
    try {
      const data = await api.analysis.run(selectedId, jd);
      if ("rawResponse" in data) throw new Error("AI returned an unstructured response. Check your API key.");
      setResult(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Analysis failed.";
      setError(msg); toast(msg, "error");
    } finally {
      setAnalyzing(false);
    }
  }

  function reset() { setResult(null); setError(""); setJd(""); }

  if (result) return (
    <div>
      <div className="page-header"><h1 className="font-heading text-xl font-semibold tracking-tight">Analysis result</h1></div>
      <div className="page-body"><ResultView result={result} onReset={reset} /></div>
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="font-heading text-xl font-semibold tracking-tight">Analyze a match</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Select a resume, paste a job description, and get your ATS score.
        </p>
      </div>

      <div className="page-body max-w-2xl">
        {analyzing && (
          <div className="bg-card border border-border rounded-lg py-14 flex flex-col items-center gap-4 text-center fade-up">
            <div className="relative">
              <div className="size-14 rounded-full border-2 border-muted flex items-center justify-center">
                <Sparkles className="size-6 text-muted-foreground/50" />
              </div>
              <Loader2 className="size-14 absolute inset-0 animate-spin text-primary/20" />
            </div>
            <div>
              <p className="font-semibold text-sm">Scoring your resume…</p>
              <p className="text-xs text-muted-foreground mt-1">The AI is comparing your experience against the job description.</p>
            </div>
          </div>
        )}

        {!analyzing && (
          <>
            {/* Resume selector */}
            <div>
              <p className="section-label">Select resume</p>
              {loadingResumes ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full rounded-lg" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                </div>
              ) : resumes.length === 0 ? (
                <div className="flex items-start gap-3 bg-muted/30 border border-border rounded-lg p-4 text-sm">
                  <AlertCircle className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    No resumes yet.{" "}
                    <Link href="/resumes" className="text-foreground font-semibold underline underline-offset-2">Upload one first.</Link>
                  </span>
                </div>
              ) : (
                <div className="bg-card border border-border rounded-lg divide-y divide-border overflow-hidden">
                  {resumes.map(r => {
                    const isSelected = selectedId === r.resumeId;
                    const isReady = r.indexStatus === "ready";
                    return (
                      <label
                        key={r.resumeId}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 transition-colors",
                          isReady ? "cursor-pointer" : "cursor-not-allowed opacity-60",
                          isSelected && isReady ? "bg-muted/40" : isReady ? "hover:bg-muted/20" : ""
                        )}
                      >
                        <input
                          type="radio" name="resume" value={r.resumeId}
                          checked={isSelected}
                          disabled={!isReady}
                          onChange={() => setSelectedId(r.resumeId)}
                          className="accent-primary shrink-0"
                        />
                        <FileText className="size-4 text-muted-foreground shrink-0" />
                        <span className="text-sm font-medium flex-1 truncate">{r.fileName}</span>
                        {r.indexStatus === "processing" && (
                          <Badge variant="warning" className="gap-1 shrink-0">
                            <Loader2 className="size-2.5 animate-spin" />Indexing…
                          </Badge>
                        )}
                        {r.indexStatus === "ready" && isSelected && (
                          <CheckCircle2 className="size-4 text-[oklch(0.52_0.17_145)] shrink-0" />
                        )}
                        {r.indexStatus === "error" && (
                          <Badge variant="error" className="shrink-0">Error</Badge>
                        )}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Job description */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="section-label">Job description</p>
                <span className="text-xs text-muted-foreground">{jd.length} chars{jd.length < 50 ? ` (min 50)` : ""}</span>
              </div>
              <textarea
                value={jd}
                onChange={e => setJd(e.target.value)}
                placeholder="Paste the full job description here — responsibilities, requirements, preferred qualifications. The more detail, the better the analysis."
                rows={10}
                className="w-full rounded-lg border border-input bg-transparent px-4 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y leading-relaxed"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/8 rounded-lg px-3 py-2.5">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />{error}
              </div>
            )}

            <div className="flex items-center gap-3">
              <Button onClick={run} disabled={!canAnalyze} className="flex items-center gap-2">
                <Sparkles className="size-4" /> Score this match
              </Button>
              {jd.length > 0 && jd.length < 50 && (
                <p className="text-xs text-muted-foreground">Add {50 - jd.length} more characters</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
