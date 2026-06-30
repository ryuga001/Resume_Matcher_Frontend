"use client";

import { useSearchParams } from "next/navigation";
import { ArrowLeft, Wand2, Download, Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useResumeBuilder } from "@/components/resumes/hooks/useResumeBuilder";
import { ResumeEditorPanel } from "@/components/resumes/builder/ResumeEditorPanel";
import { ResumeLivePreview } from "@/components/resumes/builder/ResumeLivePreview";

const COLORS = {
  primary:      "#c2652a",
  primaryShadow:"rgba(194,101,42,0.25)",
  text:         "#2a2826",
  textMuted:    "#6e6862",
  border:       "#e4dcd6",
  bg:           "#f7f5f3",
};

type Props = {
  resumeId: string;
};

export function ResumeBuilderPage({ resumeId }: Props) {
  const params = useSearchParams();

  const buildContext = {
    recommendations: JSON.parse(params.get("recs")    ?? "[]") as string[],
    missingSkills:   JSON.parse(params.get("missing") ?? "[]") as string[],
    jobDescription:  params.get("jd") ?? "",
  };

  const hasContext =
    buildContext.recommendations.length > 0 || buildContext.missingSkills.length > 0;

  const {
    current,
    loadingOriginal,
    building,
    exporting,
    saving,
    error,
    successMsg,
    hasChanges,
    applyRecommendations,
    handleExport,
    handleSave,
    updateContact,
    updateSummary,
    updateExperience,
    updateEducation,
    updateSkills,
    updateProjects,
    updateCertifications,
    back,
  } = useResumeBuilder(resumeId, hasContext ? buildContext : undefined);

  return (
    <div className="flex flex-col h-full" style={{ background: COLORS.bg }}>
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-5 py-3 shrink-0 bg-white border-b"
        style={{ borderColor: COLORS.border }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={back}
            className="flex items-center gap-1.5 text-sm font-semibold hover:opacity-70 transition-opacity"
            style={{ color: COLORS.textMuted }}
          >
            <ArrowLeft className="size-4" /> Resumes
          </button>
          <span style={{ color: COLORS.border }}>·</span>
          <p className="text-sm font-bold" style={{ color: COLORS.text }}>Resume Builder</p>
          {hasChanges && (
            <span
              className="text-[10px] font-bold uppercase tracking-[0.12em] px-2 py-0.5 rounded"
              style={{ background: "rgba(194,101,42,0.10)", color: COLORS.primary }}
            >
              Unsaved
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Apply AI */}
          {hasContext && (
            <button
              onClick={applyRecommendations}
              disabled={building || loadingOriginal}
              className="flex items-center gap-2 h-8 px-4 rounded text-white text-xs font-bold transition-all hover:opacity-90 active:scale-[0.97] disabled:opacity-40"
              style={{ background: "#2a2826" }}
            >
              {building ? <Loader2 className="size-3.5 animate-spin" /> : <Wand2 className="size-3.5" />}
              Apply Recommendations
            </button>
          )}

          {/* Export */}
          <button
            onClick={handleExport}
            disabled={exporting || !current}
            className="flex items-center gap-1.5 h-8 px-3 rounded text-xs font-bold border transition-all hover:bg-stone-50 active:scale-[0.97] disabled:opacity-40"
            style={{ borderColor: COLORS.border, color: COLORS.text }}
          >
            {exporting ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
            Export PDF
          </button>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={saving || !current}
            className="flex items-center gap-1.5 h-8 px-4 rounded text-white text-xs font-bold transition-all hover:opacity-90 active:scale-[0.97] disabled:opacity-40"
            style={{ background: COLORS.primary, boxShadow: `0 2px 12px ${COLORS.primaryShadow}` }}
          >
            {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
            Save
          </button>
        </div>
      </div>

      {/* Status banners */}
      {(error || successMsg) && (
        <div
          className="px-5 py-2 flex items-center gap-2 text-xs font-medium shrink-0"
          style={{
            background: error ? "#fce4e0" : "#e8f5e9",
            color: error ? "#8c3c3c" : "#2e7d32",
          }}
        >
          {error ? <AlertCircle className="size-3.5 shrink-0" /> : <CheckCircle2 className="size-3.5 shrink-0" />}
          {error ?? successMsg}
        </div>
      )}

      {/* Main: editor + preview */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Editor */}
        <div className="w-[340px] shrink-0 overflow-hidden flex flex-col" style={{ borderRight: `1px solid ${COLORS.border}` }}>
          {loadingOriginal || !current ? (
            <div className="flex-1 flex items-center justify-center gap-2">
              <Loader2 className="size-5 animate-spin" style={{ color: COLORS.primary }} />
              <span className="text-sm" style={{ color: COLORS.textMuted }}>Parsing resume…</span>
            </div>
          ) : (
            <ResumeEditorPanel
              data={current}
              onUpdateContact={updateContact}
              onUpdateSummary={updateSummary}
              onUpdateExperience={updateExperience}
              onUpdateEducation={updateEducation}
              onUpdateSkills={updateSkills}
              onUpdateProjects={updateProjects}
              onUpdateCertifications={updateCertifications}
            />
          )}
        </div>

        {/* Right: Live Preview */}
        <div className="flex-1 overflow-hidden">
          {current ? (
            <ResumeLivePreview data={current} />
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-sm" style={{ color: COLORS.textMuted }}>
                {loadingOriginal ? "Loading…" : "No resume data."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
