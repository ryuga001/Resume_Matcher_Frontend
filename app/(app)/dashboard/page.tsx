"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { Search, Plus, FileText, BarChart2, RefreshCw, Lightbulb } from "lucide-react";

type Resume      = { resumeId: string; fileName: string; uploadedAt: string | null; indexStatus: string; skills: string[] };
type HistoryItem = { id: string; resumeName: string; atsScore: number; createdAt: string };

function scoreStatusLabel(s: number) {
  if (s >= 70) return "Good Match";
  if (s >= 50) return "Needs Optimization";
  if (s >= 30) return "Weak Match";
  return "Critical Needs";
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [resumes, setResumes]   = useState<Resume[]>([]);
  const [history, setHistory]   = useState<HistoryItem[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([api.resumes.list(), api.analysis.history()])
      .then(([r, h]) => { setResumes(r); setHistory(h); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const avg = history.length
    ? Math.round(history.reduce((s, h) => s + (h.atsScore ?? 0), 0) / history.length)
    : null;

  const recent = resumes.slice(0, 5);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f5ede4" }}>
      {/* ── Top bar ───────────────────────────────────────── */}
      <div className="px-8 pt-8 pb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-4xl font-bold leading-tight" style={{ color: "#2a2826" }}>
            Good to see you, {user?.name.split(" ")[0]}.
          </h1>
          <p className="text-sm mt-1" style={{ color: "#6e6862" }}>
            Your career intelligence is updating in real-time.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 mt-1">
          <button
            className="h-10 px-4 flex items-center gap-2 rounded-full border text-sm font-medium transition-colors hover:bg-white/60"
            style={{ borderColor: "#d4c4b8", color: "#6e6862", background: "rgba(255,255,255,0.5)" }}
          >
            <Search className="size-4" />
            Search Intelligence
          </button>
          <Link
            href="/resumes"
            className="h-10 px-5 flex items-center gap-2 rounded-full text-white text-sm font-bold transition-all hover:opacity-90 active:scale-[0.97]"
            style={{ background: "#c2652a" }}
          >
            <Plus className="size-4" strokeWidth={2.5} />
            New Resume
          </Link>
        </div>
      </div>

      <div className="flex-1 px-8 pb-10 flex flex-col gap-6">
        {/* ── Stat cards ──────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Active Docs */}
          <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div className="flex items-start justify-between mb-4">
              <div className="size-11 rounded-xl flex items-center justify-center" style={{ background: "rgba(194,101,42,0.10)" }}>
                <FileText className="size-5" style={{ color: "#c2652a" }} strokeWidth={1.5} />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-[0.14em]" style={{ color: "#9e8e84" }}>Active Docs</span>
            </div>
            {loading ? (
              <div className="h-10 w-10 rounded-lg animate-pulse" style={{ background: "#f0e8e2" }} />
            ) : (
              <p className="font-heading text-5xl font-bold" style={{ color: "#2a2826" }}>
                {resumes.length}
              </p>
            )}
            <p className="text-xs mt-2" style={{ color: "#9e8e84" }}>Resumes stored and analyzed</p>
          </div>

          {/* Deep Scans */}
          <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div className="flex items-start justify-between mb-4">
              <div className="size-11 rounded-xl flex items-center justify-center" style={{ background: "rgba(194,101,42,0.10)" }}>
                <BarChart2 className="size-5" style={{ color: "#c2652a" }} strokeWidth={1.5} />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-[0.14em]" style={{ color: "#9e8e84" }}>Deep Scans</span>
            </div>
            {loading ? (
              <div className="h-10 w-10 rounded-lg animate-pulse" style={{ background: "#f0e8e2" }} />
            ) : (
              <p className="font-heading text-5xl font-bold" style={{ color: "#2a2826" }}>
                {history.length}
              </p>
            )}
            <p className="text-xs mt-2" style={{ color: "#9e8e84" }}>Analyses run this month</p>
          </div>

          {/* Strength Index */}
          <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div className="flex items-start justify-between mb-4">
              <div className="size-11 rounded-xl flex items-center justify-center" style={{ background: "rgba(194,101,42,0.10)" }}>
                <RefreshCw className="size-5" style={{ color: "#c2652a" }} strokeWidth={1.5} />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-[0.14em]" style={{ color: "#9e8e84" }}>Strength Index</span>
            </div>
            {loading ? (
              <div className="h-10 w-20 rounded-lg animate-pulse" style={{ background: "#f0e8e2" }} />
            ) : (
              <div className="flex items-baseline gap-1">
                <p className="font-heading text-5xl font-bold" style={{ color: "#2a2826" }}>
                  {avg ?? "—"}
                </p>
                {avg !== null && <span className="text-base font-medium" style={{ color: "#9e8e84" }}>/100</span>}
              </div>
            )}
            <p className="text-xs mt-1" style={{ color: "#9e8e84" }}>
              Avg ATS Score{avg !== null ? ` (${scoreStatusLabel(avg)})` : ""}
            </p>
            {avg !== null && (
              <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: "#f0e8e2" }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${avg}%`, background: avg >= 70 ? "#2d8a4e" : avg >= 50 ? "#c2652a" : "#b3261e" }}
                />
              </div>
            )}
          </div>
        </div>

        {/* ── Bottom grid ─────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
          {/* Recent Resumes table */}
          <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading text-lg font-bold" style={{ color: "#2a2826" }}>Recent Resumes</h2>
              <Link href="/resumes" className="text-sm font-semibold hover:underline" style={{ color: "#c2652a" }}>
                View All Library
              </Link>
            </div>

            {/* Table header */}
            <div className="grid grid-cols-[1fr_160px_80px_120px] gap-2 px-1 mb-3">
              {["Document Name", "Target Role", "Score", "Status"].map(col => (
                <span key={col} className="text-[9px] font-bold uppercase tracking-[0.12em]" style={{ color: "#9e8e84" }}>
                  {col}
                </span>
              ))}
            </div>

            <div className="flex flex-col divide-y" style={{ divideColor: "#f5ede4" }}>
              {loading ? (
                [1, 2, 3].map(i => (
                  <div key={i} className="py-4 grid grid-cols-[1fr_160px_80px_120px] gap-2 items-center">
                    <div className="h-4 rounded animate-pulse" style={{ background: "#f0e8e2", width: "60%" }} />
                    <div className="h-4 rounded animate-pulse" style={{ background: "#f0e8e2", width: "80%" }} />
                    <div className="h-6 w-14 rounded-full animate-pulse" style={{ background: "#f0e8e2" }} />
                    <div className="h-4 rounded animate-pulse" style={{ background: "#f0e8e2", width: "70%" }} />
                  </div>
                ))
              ) : recent.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm font-medium" style={{ color: "#6e6862" }}>No resumes yet</p>
                  <Link href="/resumes" className="text-sm font-semibold mt-1 inline-block hover:underline" style={{ color: "#c2652a" }}>
                    Upload your first resume
                  </Link>
                </div>
              ) : (
                recent.map(r => {
                  const matchedHistory = history.find(h => h.resumeName === r.fileName);
                  const displayScore = matchedHistory?.atsScore ?? null;
                  const indexReady = r.indexStatus === "ready";
                  return (
                    <Link
                      key={r.resumeId}
                      href="/resumes"
                      className="py-4 grid grid-cols-[1fr_160px_80px_120px] gap-2 items-center hover:bg-stone-50 -mx-2 px-2 rounded-lg transition-colors"
                    >
                      {/* Name */}
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="size-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#fef2ea" }}>
                          <FileText className="size-4" style={{ color: "#c2652a" }} strokeWidth={1.5} />
                        </div>
                        <span className="text-sm font-medium truncate" style={{ color: "#2a2826" }}>{r.fileName}</span>
                      </div>
                      {/* Role — not in API, show top skill as hint */}
                      <span className="text-sm truncate" style={{ color: "#6e6862" }}>
                        {r.skills[0] ?? "—"}
                      </span>
                      {/* Score badge */}
                      {displayScore !== null ? (
                        <span
                          className="inline-flex items-center justify-center h-7 px-3 rounded-full text-xs font-bold text-white"
                          style={{ background: displayScore >= 70 ? "#2d8a4e" : displayScore >= 50 ? "#c2652a" : "#b3261e" }}
                        >
                          {displayScore}/100
                        </span>
                      ) : (
                        <span className="text-xs" style={{ color: "#9e8e84" }}>—</span>
                      )}
                      {/* Status */}
                      <div className="flex items-center gap-1.5">
                        <span
                          className="size-1.5 rounded-full shrink-0"
                          style={{ background: !indexReady ? "#9e8e84" : displayScore !== null ? (displayScore >= 70 ? "#2d8a4e" : "#c2652a") : "#9e8e84" }}
                        />
                        <span className="text-xs truncate" style={{ color: "#6e6862", fontStyle: "italic" }}>
                          {!indexReady
                            ? "Processing"
                            : displayScore !== null
                            ? scoreStatusLabel(displayScore)
                            : "Not analyzed"}
                        </span>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-4">
            {/* Intelligence Insight */}
            <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <div className="size-12 rounded-full flex items-center justify-center mb-4 mx-auto" style={{ background: "rgba(194,101,42,0.10)" }}>
                <Lightbulb className="size-5" style={{ color: "#c2652a" }} strokeWidth={1.5} />
              </div>
              <h3 className="font-heading text-base font-bold text-center mb-3" style={{ color: "#2a2826" }}>
                Intelligence Insight
              </h3>
              <p className="text-sm text-center leading-relaxed italic" style={{ color: "#6e6862" }}>
                {avg !== null && avg < 60
                  ? `"Your resume score of ${avg}/100 indicates skill gaps. Run a deep scan to see exact missing keywords."`
                  : avg !== null
                  ? `"Your average score of ${avg}/100 is strong. Targeting specific roles can push it higher."`
                  : `"Upload a resume and run your first analysis to unlock personalized career insights."`
                }
              </p>
              <div className="text-center mt-4">
                <Link href="/analyze" className="text-sm font-bold hover:underline" style={{ color: "#c2652a" }}>
                  Fix Now
                </Link>
              </div>
            </div>

            {/* Market Sentiment */}
            <div className="rounded-2xl p-6" style={{ background: "#2a2826", boxShadow: "0 1px 4px rgba(0,0,0,0.12)" }}>
              <h3 className="font-heading text-base font-bold mb-5" style={{ color: "#f0ebe6" }}>
                Market Sentiment
              </h3>
              <div className="flex flex-col gap-5">
                {[
                  { label: "Frontend Engineering", value: "High Demand", pct: 82 },
                  { label: "Salary Benchmark",     value: "+12% Trend",  pct: 55 },
                ].map(({ label, value, pct }) => (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-bold uppercase tracking-[0.12em]" style={{ color: "#9e8e84" }}>{label}</span>
                      <span className="text-[9px] font-bold uppercase tracking-[0.12em]" style={{ color: "#9e8e84" }}>{value}</span>
                    </div>
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.10)" }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "#c2652a" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-8 py-6 border-t flex items-center justify-between text-xs" style={{ borderColor: "#e8ddd6", color: "#9e8e84" }}>
        <div>
          <span className="font-heading font-semibold text-sm" style={{ color: "#2a2826" }}>Sahara</span>
          <span className="ml-3">© 2024 Sahara Career Intelligence. All rights reserved.</span>
        </div>
        <nav className="flex items-center gap-5">
          {["Privacy Policy", "Terms of Service", "Contact", "Careers"].map(l => (
            <Link key={l} href="#" className="hover:text-foreground transition-colors">{l}</Link>
          ))}
        </nav>
      </footer>
    </div>
  );
}
