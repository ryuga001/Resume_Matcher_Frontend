"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import {
  FileText, Zap, CheckCircle2, XCircle, Lock, Plus, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Resume      = { resumeId: string; fileName: string; uploadedAt: string | null; indexStatus: string; skills: string[] };
type HistoryItem = { id: string; resumeId: string; resumeName: string; jobDescription: string; atsScore: number; createdAt: string };
type Result      = { atsScore: number; matchingSkills: string[]; missingSkills: string[]; recommendations: string[]; summary: string };
type View        = "form" | "loading" | "result";

function ScoreGauge({ score }: { score: number }) {
  const r            = 80;
  const circumference = 2 * Math.PI * r;
  const dashOffset   = circumference * (1 - score / 100);
  const color        = score >= 70 ? "#2d8a4e" : score >= 50 ? "#c2652a" : "#b3261e";
  const label        = score >= 70 ? "Good match" : score >= 50 ? "Partial match" : "Weak match";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-[200px] h-[200px]">
        <svg width="200" height="200" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r={r} fill="none" stroke="#ece6dc" strokeWidth="12" />
          <circle
            cx="100" cy="100" r={r} fill="none"
            stroke={color} strokeWidth="12"
            strokeDasharray={circumference} strokeDashoffset={dashOffset}
            strokeLinecap="round" transform="rotate(-90 100 100)"
            style={{ transition: "stroke-dashoffset 1s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-heading text-5xl font-bold" style={{ color }}>{score}</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: "#9e8e84" }}>Score</span>
        </div>
      </div>
      <h3 className="font-heading text-3xl font-bold" style={{ color: "#2a2826" }}>{label}</h3>
    </div>
  );
}

function LoadingView({ progress }: { progress: number }) {
  return (
    <div className="flex-1 flex items-center justify-center px-8 py-20 min-h-[80vh]">
      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes pulse-glow { 0%,100%{opacity:.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.06)} }
        @keyframes icon-pulse { 0%,100%{opacity:.8} 50%{opacity:1} }
      `}</style>
      <div
        className="w-full max-w-xl rounded-[32px] p-16 flex flex-col items-center text-center"
        style={{ background: "#ffffff", boxShadow: "0 4px 32px rgba(58,48,42,0.07)" }}
      >
        <div className="relative mb-12">
          <div className="absolute inset-0 rounded-full" style={{
            background: "rgba(194,101,42,0.12)", filter: "blur(24px)",
            animation: "pulse-glow 3s ease-in-out infinite",
          }} />
          <div className="relative w-28 h-28 rounded-full border-2 flex items-center justify-center bg-white"
            style={{ borderColor: "rgba(194,101,42,0.2)", boxShadow: "0 4px 24px rgba(194,101,42,0.08)" }}>
            <Zap className="size-12" style={{ color: "#c2652a", animation: "icon-pulse 2s ease-in-out infinite" }} strokeWidth={1.5} />
          </div>
        </div>

        <h2 className="font-heading text-4xl font-bold mb-3" style={{ color: "#2a2826" }}>
          Scoring your resume...
        </h2>
        <p className="text-base mb-12" style={{ color: "#6e6862" }}>
          The AI is comparing your experience against the job description.
        </p>

        <div className="w-full max-w-sm">
          <div className="flex justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: "#c2652a" }}>Analysis Progress</span>
            <span className="text-[10px] font-bold" style={{ color: "#9e8e84" }}>{progress}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#ece6dc" }}>
            <div style={{
              height: "100%", width: `${progress}%`, borderRadius: "9999px",
              background: "linear-gradient(90deg,#c2652a 0%,#e08850 50%,#c2652a 100%)",
              backgroundSize: "200% 100%", animation: "shimmer 2s linear infinite",
              transition: "width 0.5s ease-out",
            }} />
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-8 w-full max-w-sm pt-8 border-t" style={{ borderColor: "rgba(212,200,192,0.4)" }}>
          <div className="text-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] mb-1" style={{ color: "#9e8e84" }}>Processing</p>
            <p className="text-sm font-medium" style={{ color: "#2a2826" }}>Semantic Mapping</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] mb-1" style={{ color: "#9e8e84" }}>Match Index</p>
            <p className="text-sm font-medium" style={{ color: "#2a2826" }}>Calculating Weights</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultView({ result, onReset }: { result: Result; onReset: () => void }) {
  return (
    <div className="px-10 py-10">
      <div className="max-w-5xl mx-auto">
        <button onClick={onReset} className="flex items-center gap-1.5 text-sm font-semibold mb-8 hover:underline" style={{ color: "#c2652a" }}>
          ← New Analysis
        </button>

        <div className="mb-8">
          <h2 className="font-heading text-5xl font-bold" style={{ color: "#2a2826" }}>Analysis result</h2>
          <div className="h-1 w-16 mt-2 rounded-full" style={{ background: "rgba(194,101,42,0.3)" }} />
        </div>

        {/* Score hero */}
        <div className="bg-white rounded-xl p-10 mb-6 flex flex-col md:flex-row items-center gap-10 border"
          style={{ borderColor: "rgba(212,200,192,0.5)", boxShadow: "0 2px 16px rgba(58,48,42,0.04)" }}>
          <ScoreGauge score={result.atsScore} />
          <div className="flex-1">
            <p className="text-base leading-relaxed mb-6" style={{ color: "#6e6862", maxWidth: "560px" }}>
              {result.summary || "Your profile has been compared against the job description. Review the skill breakdown and recommendations below to improve your match score."}
            </p>
            <div className="flex gap-3 flex-wrap">
              <button className="h-10 px-6 rounded-lg text-white text-sm font-bold hover:opacity-90 transition-all active:scale-[0.97]" style={{ background: "#c2652a" }}>
                Full Report
              </button>
              <button className="h-10 px-6 rounded-lg text-sm font-bold border hover:bg-stone-50 transition-colors" style={{ borderColor: "#e4dcd6", color: "#2a2826" }}>
                Share Result
              </button>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl p-8 border" style={{ borderColor: "rgba(212,200,192,0.5)", boxShadow: "0 2px 16px rgba(58,48,42,0.04)" }}>
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 className="size-5" style={{ color: "#2e7d32" }} />
              <h4 className="font-heading text-2xl font-bold" style={{ color: "#2a2826" }}>Matching Skills</h4>
            </div>
            {result.matchingSkills.length === 0
              ? <p className="text-sm" style={{ color: "#9e8e84" }}>No matching skills found.</p>
              : <div className="flex flex-wrap gap-2">
                  {result.matchingSkills.map(s => (
                    <span key={s} className="px-4 py-1.5 rounded-full text-xs font-bold" style={{ background: "#e8f5e9", color: "#2e7d32" }}>{s}</span>
                  ))}
                </div>
            }
          </div>
          <div className="bg-white rounded-xl p-8 border" style={{ borderColor: "rgba(212,200,192,0.5)", boxShadow: "0 2px 16px rgba(58,48,42,0.04)" }}>
            <div className="flex items-center gap-3 mb-6">
              <XCircle className="size-5" style={{ color: "#8c3c3c" }} />
              <h4 className="font-heading text-2xl font-bold" style={{ color: "#2a2826" }}>Missing Skills</h4>
            </div>
            {result.missingSkills.length === 0
              ? <p className="text-sm" style={{ color: "#9e8e84" }}>No missing skills — great match!</p>
              : <div className="flex flex-wrap gap-2">
                  {result.missingSkills.map(s => (
                    <span key={s} className="px-4 py-1.5 rounded-full text-xs font-bold" style={{ background: "#fce4e0", color: "#8c3c3c" }}>{s}</span>
                  ))}
                </div>
            }
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-xl p-10 border" style={{ borderColor: "rgba(212,200,192,0.5)", boxShadow: "0 2px 16px rgba(58,48,42,0.04)" }}>
          <h4 className="font-heading text-3xl font-bold mb-8" style={{ color: "#2a2826" }}>Recommendations</h4>
          <div className="space-y-6">
            {result.recommendations.map((rec, i) => (
              <div key={i} className="flex gap-5">
                <span className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: "#fbe8d8", color: "#c2652a" }}>
                  {i + 1}
                </span>
                <div className={cn("flex-1 pb-6", i < result.recommendations.length - 1 && "border-b")} style={{ borderColor: "rgba(212,200,192,0.4)" }}>
                  <p className="text-sm leading-relaxed" style={{ color: "#4a3728" }}>{rec}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-5 rounded-xl flex items-center justify-between gap-4" style={{ background: "#f2ece4" }}>
            <div className="flex items-center gap-4">
              <div className="size-11 rounded-xl flex items-center justify-center bg-white border shrink-0" style={{ borderColor: "#e4dcd6" }}>
                <Zap className="size-5" style={{ color: "#c2652a" }} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: "#2a2826" }}>Ready to optimize?</p>
                <p className="text-xs" style={{ color: "#6e6862" }}>Our AI can automatically rewrite these sections for you.</p>
              </div>
            </div>
            <button className="shrink-0 h-10 px-5 rounded-lg text-sm font-bold text-white hover:opacity-90 transition-all" style={{ background: "#2a2826" }}>
              Auto-Optimize Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ────────────────────────────────────────────── */
export default function AnalyzePage() {
  const [resumes, setResumes]         = useState<Resume[]>([]);
  const [history, setHistory]         = useState<HistoryItem[]>([]);
  const [selectedId, setSelectedId]   = useState<string | null>(null);
  const [jd, setJd]                   = useState("");
  const [view, setView]               = useState<View>("form");
  const [progress, setProgress]       = useState(0);
  const [result, setResult]           = useState<Result | null>(null);
  const [error, setError]             = useState("");
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    Promise.all([api.resumes.list(), api.analysis.history()])
      .then(([r, h]) => {
        setResumes(r);
        if (r.length > 0) setSelectedId(r[0].resumeId);
        setHistory(h);
      })
      .catch(() => {})
      .finally(() => setLoadingData(false));
  }, []);

  async function handleSubmit() {
    if (!selectedId || !jd.trim()) return;
    setError("");
    setView("loading");
    setProgress(18);
    const ticker = setInterval(() => {
      setProgress(p => p < 88 ? p + Math.floor(Math.random() * 8) + 3 : p);
    }, 650);
    try {
      const data = await api.analysis.run(selectedId, jd);
      clearInterval(ticker);
      setProgress(100);
      setTimeout(() => { setResult(data); setView("result"); }, 400);
    } catch (err) {
      clearInterval(ticker);
      setError(err instanceof Error ? err.message : "Analysis failed.");
      setView("form");
    }
  }

  function scoreLabel(s: number) {
    if (s >= 70) return { bg: "#e8f5e9", color: "#2e7d32" };
    if (s >= 50) return { bg: "#fff3e0", color: "#e65100" };
    return { bg: "#fce4e0", color: "#8c3c3c" };
  }

  if (view === "loading") return <LoadingView progress={progress} />;
  if (view === "result" && result) return <ResultView result={result} onReset={() => { setView("form"); setResult(null); setJd(""); }} />;

  return (
    <div className="px-10 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-10">
          <h2 className="font-heading text-4xl font-bold mb-2" style={{ color: "#2a2826" }}>Analyze a match</h2>
          <p className="text-sm max-w-xl" style={{ color: "#6e6862" }}>
            Compare your profile with any job description to discover gaps and receive tailored recommendations.
          </p>
        </header>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl text-sm" style={{ background: "#fce4e0", color: "#8c3c3c" }}>{error}</div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Step 1 */}
          <div className="flex flex-col bg-white border p-8 rounded-xl" style={{ borderColor: "#e4dcd6", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: "#9e8e84" }}>Step 1: Select Resume</span>
              <Link href="/resumes" className="text-xs font-bold hover:underline flex items-center gap-1" style={{ color: "#c2652a" }}>
                <Plus className="size-3" strokeWidth={2.5} /> Upload New
              </Link>
            </div>
            <div className="flex-1 flex flex-col gap-3">
              {loadingData ? (
                [1, 2].map(i => <div key={i} className="h-20 rounded-xl animate-pulse" style={{ background: "#f0e8e2" }} />)
              ) : resumes.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-10 gap-3 text-center">
                  <FileText className="size-8" style={{ color: "#c2652a", opacity: 0.4 }} strokeWidth={1} />
                  <p className="text-sm font-medium" style={{ color: "#6e6862" }}>No resumes yet</p>
                  <Link href="/resumes" className="text-xs font-bold hover:underline" style={{ color: "#c2652a" }}>Upload your first resume</Link>
                </div>
              ) : (
                resumes.map(r => {
                  const active = selectedId === r.resumeId;
                  return (
                    <button
                      key={r.resumeId}
                      onClick={() => setSelectedId(r.resumeId)}
                      className="text-left p-5 rounded-xl border-2 cursor-pointer relative transition-all"
                      style={{ borderColor: active ? "#c2652a" : "#e4dcd6", background: active ? "rgba(194,101,42,0.04)" : "#fff" }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-12 rounded-lg flex items-center justify-center shrink-0" style={{ background: active ? "rgba(194,101,42,0.10)" : "#f0e8e2" }}>
                          <FileText className="size-5" style={{ color: active ? "#c2652a" : "#9e8e84" }} strokeWidth={1.5} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold truncate" style={{ color: "#2a2826" }}>{r.fileName}</p>
                          <p className="text-xs mt-0.5" style={{ color: "#9e8e84" }}>
                            {r.uploadedAt ? new Date(r.uploadedAt).toLocaleDateString() : "Recently uploaded"}
                          </p>
                        </div>
                      </div>
                      {active && <CheckCircle2 className="absolute top-4 right-4 size-5" style={{ color: "#c2652a" }} />}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col bg-white border p-8 rounded-xl" style={{ borderColor: "#e4dcd6", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: "#9e8e84" }}>Step 2: Paste Job Description</span>
            </div>
            <textarea
              value={jd}
              onChange={e => setJd(e.target.value)}
              placeholder="Paste the job requirements or company role description here to begin the intelligence scan..."
              className="flex-1 w-full p-4 text-sm rounded-xl border resize-none outline-none transition-all"
              style={{ minHeight: "260px", borderColor: "#e4dcd6", background: "#fdfcfb", color: "#2a2826" }}
              onFocus={e => { e.currentTarget.style.borderColor = "#c2652a"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(194,101,42,0.10)"; }}
              onBlur={e => { e.currentTarget.style.borderColor = "#e4dcd6"; e.currentTarget.style.boxShadow = "none"; }}
            />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-col items-center gap-3">
          <button
            onClick={handleSubmit}
            disabled={!selectedId || !jd.trim()}
            className="h-14 px-12 rounded-xl text-white font-bold flex items-center gap-3 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "#c2652a", boxShadow: "0 4px 20px rgba(194,101,42,0.25)" }}
          >
            <Zap className="size-5" strokeWidth={2} />
            Generate Intelligence Report
          </button>
          <p className="text-xs flex items-center gap-1.5" style={{ color: "#9e8e84" }}>
            <Lock className="size-3" /> Your data is processed securely and privately.
          </p>
        </div>

        {/* Recent Comparisons */}
        {history.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between border-b pb-4 mb-6" style={{ borderColor: "#e4dcd6" }}>
              <h3 className="font-heading text-xl font-semibold" style={{ color: "#2a2826" }}>Recent Comparisons</h3>
              <Link href="/history" className="text-[10px] font-bold uppercase tracking-[0.12em] hover:underline flex items-center gap-1" style={{ color: "#9e8e84" }}>
                View All <ChevronRight className="size-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {history.slice(0, 3).map(h => {
                const sl = scoreLabel(h.atsScore);
                return (
                  <Link
                    key={h.id}
                    href={`/history/${h.id}`}
                    className="p-5 rounded-xl border transition-colors hover:bg-white"
                    style={{ background: "rgba(255,255,255,0.6)", borderColor: "#e4dcd6" }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase" style={{ background: sl.bg, color: sl.color }}>
                        {h.atsScore}% Match
                      </span>
                      <span className="text-[10px]" style={{ color: "#9e8e84" }}>{new Date(h.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm font-bold truncate" style={{ color: "#2a2826" }}>{h.resumeName}</p>
                    <p className="text-xs mt-1 truncate" style={{ color: "#9e8e84" }}>
                      {h.jobDescription?.substring(0, 60)}…
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
