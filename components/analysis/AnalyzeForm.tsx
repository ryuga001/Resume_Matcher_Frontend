"use client";

import { Zap, Lock } from "lucide-react";
import { ResumeSelector } from "./ResumeSelector";
import { JobDescriptionInput } from "./JobDescriptionInput";
import { RecentComparisons } from "./RecentComparisons";
import type { Resume, HistoryItem } from "./types";
import { COLORS } from "./constants";

interface AnalyzeFormProps {
  resumes:      Resume[];
  history:      HistoryItem[];
  selectedId:   string | null;
  jd:           string;
  error:        string;
  loadingData:  boolean;
  onSelectId:   (id: string) => void;
  onJdChange:   (jd: string) => void;
  onSubmit:     () => void;
}

export function AnalyzeForm({
  resumes, history, selectedId, jd, error, loadingData,
  onSelectId, onJdChange, onSubmit,
}: AnalyzeFormProps) {
  const canSubmit = Boolean(selectedId) && jd.trim().length > 0;

  return (
    <div className="px-8 py-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6">
          <h1 className="font-heading text-4xl font-bold" style={{ color: COLORS.text }}>Analyze a Match</h1>
          <p className="text-sm mt-1 max-w-xl" style={{ color: COLORS.textMuted }}>
            Compare your profile with any job description to discover gaps and receive tailored recommendations.
          </p>
        </header>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-md text-sm" style={{ background: "#fce4e0", color: "#8c3c3c" }}>{error}</div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <ResumeSelector
            resumes={resumes}
            selectedId={selectedId}
            onSelect={onSelectId}
            loadingData={loadingData}
          />
          <JobDescriptionInput value={jd} onChange={onJdChange} />
        </div>

        <div className="mt-6 flex flex-col items-center gap-3">
          <button
            onClick={onSubmit}
            disabled={!canSubmit}
            className="h-14 px-12 rounded text-white font-bold flex items-center gap-3 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: COLORS.primary, boxShadow: `0 4px 20px ${COLORS.primaryShadow}` }}
          >
            <Zap className="size-5" strokeWidth={2} />
            Generate Intelligence Report
          </button>
          <p className="text-xs flex items-center gap-1.5" style={{ color: COLORS.textFaint }}>
            <Lock className="size-3" /> Your data is processed securely and privately.
          </p>
        </div>

        <RecentComparisons history={history} />
      </div>
    </div>
  );
}
