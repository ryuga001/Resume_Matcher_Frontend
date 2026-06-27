"use client";

import Link from "next/link";
import { FileText, CheckCircle2, Plus } from "lucide-react";
import type { Resume } from "./types";
import { COLORS } from "./constants";

interface ResumeSelectorProps {
  resumes:     Resume[];
  selectedId:  string | null;
  onSelect:    (id: string) => void;
  loadingData: boolean;
}

export function ResumeSelector({ resumes, selectedId, onSelect, loadingData }: ResumeSelectorProps) {
  return (
    <div className="flex flex-col bg-white border p-8 rounded-xl" style={{ borderColor: COLORS.border, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      <div className="flex items-center justify-between mb-6">
        <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: COLORS.textFaint }}>Step 1: Select Resume</span>
        <Link href="/resumes" className="text-xs font-bold hover:underline flex items-center gap-1" style={{ color: COLORS.primary }}>
          <Plus className="size-3" strokeWidth={2.5} /> Upload New
        </Link>
      </div>

      <div className="flex-1 flex flex-col gap-3">
        {loadingData ? (
          [1, 2].map(i => <div key={i} className="h-20 rounded-xl animate-pulse" style={{ background: COLORS.bgInput }} />)
        ) : resumes.length === 0 ? (
          <EmptyResumes />
        ) : (
          resumes.map(r => (
            <ResumeCard
              key={r.resumeId}
              resume={r}
              active={selectedId === r.resumeId}
              onSelect={onSelect}
            />
          ))
        )}
      </div>
    </div>
  );
}

function EmptyResumes() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-10 gap-3 text-center">
      <FileText className="size-8" style={{ color: COLORS.primary, opacity: 0.4 }} strokeWidth={1} />
      <p className="text-sm font-medium" style={{ color: COLORS.textMuted }}>No resumes yet</p>
      <Link href="/resumes" className="text-xs font-bold hover:underline" style={{ color: COLORS.primary }}>
        Upload your first resume
      </Link>
    </div>
  );
}

interface ResumeCardProps {
  resume:   Resume;
  active:   boolean;
  onSelect: (id: string) => void;
}

function ResumeCard({ resume, active, onSelect }: ResumeCardProps) {
  return (
    <button
      onClick={() => onSelect(resume.resumeId)}
      className="text-left p-5 rounded-xl border-2 cursor-pointer relative transition-all"
      style={{ borderColor: active ? COLORS.primary : COLORS.border, background: active ? COLORS.primaryLight : "#fff" }}
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-12 rounded-lg flex items-center justify-center shrink-0" style={{ background: active ? COLORS.primaryLight : COLORS.bgInput }}>
          <FileText className="size-5" style={{ color: active ? COLORS.primary : COLORS.textFaint }} strokeWidth={1.5} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold truncate" style={{ color: COLORS.text }}>{resume.fileName}</p>
          <p className="text-xs mt-0.5" style={{ color: COLORS.textFaint }}>
            {resume.uploadedAt ? new Date(resume.uploadedAt).toLocaleDateString() : "Recently uploaded"}
          </p>
        </div>
      </div>
      {active && <CheckCircle2 className="absolute top-4 right-4 size-5" style={{ color: COLORS.primary }} />}
    </button>
  );
}
