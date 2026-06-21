"use client";

import { useRef, useState, useEffect } from "react";
import { Upload, FileText, X, Loader2, CheckCircle2, Circle, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────────

type SavedResume = { resumeId: string; fileName: string };

type AnalysisResult = {
  atsScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  recommendations: string[];
  summary: string;
};

type State =
  | { status: "idle" }
  | { status: "uploading" }
  | { status: "analyzing" }
  | { status: "done"; result: AnalysisResult }
  | { status: "error"; message: string };

// ── Main component ─────────────────────────────────────────────────────────────

export function ResumeUploader() {
  const [mode, setMode] = useState<"upload" | "select">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [jd, setJd] = useState("");
  const [dragging, setDragging] = useState(false);
  const [state, setState] = useState<State>({ status: "idle" });
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch saved resumes on mount and when switching to select mode
  useEffect(() => {
    if (mode === "select") fetchSavedResumes();
  }, [mode]);

  async function fetchSavedResumes() {
    setLoadingResumes(true);
    try {
      const res = await fetch("/api/resumes/list");
      if (res.ok) {
        const data: SavedResume[] = await res.json();
        setSavedResumes(data);
        if (data.length > 0 && !selectedResumeId) setSelectedResumeId(data[0].resumeId);
      }
    } catch {
      setSavedResumes([]);
    } finally {
      setLoadingResumes(false);
    }
  }

  function handleFile(f: File) {
    if (f.type !== "application/pdf") {
      setState({ status: "error", message: "Only PDF files are supported." });
      return;
    }
    setFile(f);
    if (state.status === "error") setState({ status: "idle" });
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  async function analyze() {
    if (!jd.trim()) return;

    try {
      let resumeId: string;

      if (mode === "upload") {
        if (!file) return;
        setState({ status: "uploading" });
        const form = new FormData();
        form.append("file", file);
        const uploadRes = await fetch("/api/resumes/upload", { method: "POST", body: form });
        if (!uploadRes.ok) {
          const text = await uploadRes.text().catch(() => "");
          throw new Error(`Upload failed (${uploadRes.status})${text ? `: ${text.slice(0, 120)}` : ""}`);
        }
        const data = await uploadRes.json();
        resumeId = data.resumeId;
      } else {
        if (!selectedResumeId) return;
        resumeId = selectedResumeId;
      }

      setState({ status: "analyzing" });
      const analysisRes = await fetch("/api/analysis/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId, jobDescription: jd }),
      });
      if (!analysisRes.ok) throw new Error(`Analysis failed (${analysisRes.status})`);
      const result = await analysisRes.json();

      if (result.rawResponse) {
        throw new Error("The AI returned an unstructured response — check your Gemini API key.");
      }

      setState({ status: "done", result });
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "Something went wrong.",
      });
    }
  }

  function reset() {
    setFile(null);
    setJd("");
    setState({ status: "idle" });
    if (inputRef.current) inputRef.current.value = "";
  }

  const busy = state.status === "uploading" || state.status === "analyzing";
  const canAnalyze = !busy && jd.trim() !== "" && (mode === "upload" ? !!file : !!selectedResumeId);

  if (state.status === "done") {
    return <Results result={state.result} onReset={reset} />;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-heading text-2xl tracking-tight">Resume Matcher</CardTitle>
        <CardDescription>
          Score your resume against any job description and see exactly what to fix.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        {busy ? (
          <LoadingStages stage={state.status} />
        ) : (
          <>
            {/* Mode toggle */}
            <div className="flex rounded-md border border-border overflow-hidden self-start">
              <button
                onClick={() => setMode("upload")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors",
                  mode === "upload"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Upload className="size-3.5" />
                Upload new
              </button>
              <button
                onClick={() => setMode("select")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-l border-border",
                  mode === "select"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <History className="size-3.5" />
                Previous resumes
              </button>
            </div>

            {/* Resume input */}
            {mode === "upload" ? (
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2">
                  Resume (PDF)
                </p>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => inputRef.current?.click()}
                  onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  className={cn(
                    "flex flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed p-8 cursor-pointer transition-colors",
                    dragging
                      ? "border-primary bg-muted"
                      : file
                      ? "border-primary/40 bg-muted/30"
                      : "border-border hover:border-primary/40 hover:bg-muted/40"
                  )}
                >
                  <Upload className={cn("size-6", file ? "text-primary/60" : "text-muted-foreground")} />
                  {file ? (
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="size-4 shrink-0 text-muted-foreground" />
                      <span className="font-medium truncate max-w-xs">{file.name}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); setFile(null); }}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Remove file"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center">
                      Drag & drop a PDF here, or{" "}
                      <span className="text-foreground font-medium">click to browse</span>
                    </p>
                  )}
                  <input
                    ref={inputRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                  />
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2">
                  Select resume
                </p>
                {loadingResumes ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground py-3">
                    <Loader2 className="size-4 animate-spin" />
                    Loading saved resumes…
                  </div>
                ) : savedResumes.length === 0 ? (
                  <div className="rounded-md border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                    No saved resumes yet.{" "}
                    <button
                      className="text-foreground font-medium underline underline-offset-2"
                      onClick={() => setMode("upload")}
                    >
                      Upload one first.
                    </button>
                  </div>
                ) : (
                  <select
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {savedResumes.map((r) => (
                      <option key={r.resumeId} value={r.resumeId}>
                        {r.fileName}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* Job description */}
            <div>
              <label
                htmlFor="jd"
                className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2 block"
              >
                Job Description
              </label>
              <textarea
                id="jd"
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder="Paste the full job description here…"
                className="w-full min-h-36 rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
              />
            </div>
          </>
        )}

        {state.status === "error" && (
          <p className="text-sm text-destructive">{state.message}</p>
        )}

        {!busy && (
          <Button onClick={analyze} disabled={!canAnalyze} size="lg" className="w-full">
            Analyze Match
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// ── Loading stages ─────────────────────────────────────────────────────────────

function LoadingStages({ stage }: { stage: "uploading" | "analyzing" }) {
  const steps: { id: "uploading" | "analyzing"; label: string }[] = [
    { id: "uploading",  label: "Parsing and indexing your resume" },
    { id: "analyzing", label: "Scoring match against the job description" },
  ];
  const activeIdx = steps.findIndex((s) => s.id === stage);

  return (
    <div className="py-6 flex flex-col gap-3">
      {steps.map((step, idx) => {
        const done   = idx < activeIdx;
        const active = idx === activeIdx;
        return (
          <div
            key={step.id}
            className={cn(
              "flex items-center gap-3 rounded-md px-4 py-3 text-sm transition-colors",
              done   ? "bg-muted text-muted-foreground"
              : active ? "bg-muted"
              : "text-muted-foreground/40"
            )}
          >
            {done   ? <CheckCircle2 className="size-4 shrink-0 text-primary" />
            : active ? <Loader2 className="size-4 shrink-0 animate-spin text-primary" />
            :          <Circle className="size-4 shrink-0 text-muted-foreground/30" />}
            <span className={cn("font-medium", active && "text-foreground")}>{step.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Results ────────────────────────────────────────────────────────────────────

function Results({ result, onReset }: { result: AnalysisResult; onReset: () => void }) {
  const score = Math.max(0, Math.min(100, Math.round(Number(result.atsScore) || 0)));

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <ScoreGauge score={score} />
            <div className="flex flex-col gap-2 text-center sm:text-left">
              <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                ATS Compatibility Score
              </p>
              <h2 className="font-heading text-3xl font-bold tracking-tight">{scoreHeadline(score)}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                {result.summary}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SkillsPanel title="Matching Skills" skills={result.matchingSkills ?? []} variant="match" emptyText="No matching skills found" />
        <SkillsPanel title="Missing Skills"  skills={result.missingSkills  ?? []} variant="miss"  emptyText="No missing skills identified" />
      </div>

      {(result.recommendations ?? []).length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Recommendations</p>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {result.recommendations.map((rec, i) => (
              <div key={i} className="flex gap-3 items-start text-sm border-l-2 border-border pl-3 py-0.5">
                <span className="font-mono text-xs font-semibold text-muted-foreground shrink-0 mt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="leading-relaxed">{rec}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Button variant="outline" onClick={onReset} className="self-start">
        ← Analyze another resume
      </Button>
    </div>
  );
}

// ── Skills panel ───────────────────────────────────────────────────────────────

function SkillsPanel({ title, skills, variant, emptyText }: {
  title: string; skills: string[]; variant: "match" | "miss"; emptyText: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground flex items-center gap-2">
          <span className={cn("inline-block w-1.5 h-1.5 rounded-full", variant === "match" ? "bg-green-500" : "bg-destructive")} />
          {title}
        </p>
      </CardHeader>
      <CardContent>
        {skills.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">{emptyText}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill} className={cn(
                "rounded-sm px-2.5 py-1 text-xs font-medium font-mono",
                variant === "match"
                  ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400"
              )}>
                {skill}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Score gauge (canvas) ───────────────────────────────────────────────────────

function ScoreGauge({ score }: { score: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const c = ctx;

    const W = 220, H = 120;
    const cx = 110, cy = 112;
    const R = 86, ARC_W = 14;
    const START = Math.PI, SPAN = Math.PI;

    const scoreColor =
      score >= 75 ? "#16a34a"
      : score >= 50 ? "#ca8a04"
      : score >= 30 ? "#ea580c"
      : "#dc2626";

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const STEPS = prefersReduced ? 1 : 45;
    let step = 0;
    let rafId: number;

    function draw() {
      step++;
      const t = Math.min(step / STEPS, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = score * eased;

      c.clearRect(0, 0, W, H);

      c.beginPath();
      c.arc(cx, cy, R, START, START + SPAN, false);
      c.strokeStyle = "#E8E1DA";
      c.lineWidth = ARC_W;
      c.lineCap = "butt";
      c.stroke();

      if (current > 0.5) {
        c.beginPath();
        c.arc(cx, cy, R, START, START + (current / 100) * SPAN, false);
        c.strokeStyle = scoreColor;
        c.lineWidth = ARC_W;
        c.lineCap = "round";
        c.stroke();
      }

      for (let i = 0; i <= 10; i++) {
        const angle = START + (i / 10) * SPAN;
        const isMajor = i % 5 === 0;
        const r1 = R + ARC_W / 2 + 2;
        const r2 = r1 + (isMajor ? 8 : 4);
        c.beginPath();
        c.moveTo(cx + r1 * Math.cos(angle), cy + r1 * Math.sin(angle));
        c.lineTo(cx + r2 * Math.cos(angle), cy + r2 * Math.sin(angle));
        c.strokeStyle = isMajor ? "#B0967E" : "#E8E1DA";
        c.lineWidth = isMajor ? 2 : 1;
        c.lineCap = "square";
        c.stroke();
      }

      c.font = `bold 30px 'Geist Mono', ui-monospace, monospace`;
      c.fillStyle = "#1E1712";
      c.textAlign = "center";
      c.textBaseline = "alphabetic";
      c.fillText(String(Math.round(current)), cx, cy - 22);

      c.font = `11px system-ui, sans-serif`;
      c.fillStyle = "#8A7060";
      c.fillText("/ 100", cx, cy - 8);

      if (t < 1) rafId = requestAnimationFrame(draw);
    }

    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, [score]);

  return <canvas ref={canvasRef} width={220} height={120} className="block shrink-0" />;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function scoreHeadline(score: number): string {
  if (score >= 85) return "Strong match";
  if (score >= 70) return "Good match";
  if (score >= 50) return "Partial match";
  if (score >= 30) return "Weak match";
  return "Poor match";
}
