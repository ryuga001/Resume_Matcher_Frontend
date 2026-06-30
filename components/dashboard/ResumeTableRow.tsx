import Link from "next/link";
import { FileText } from "lucide-react";
import { COLORS } from "@/components/dashboard/constants";
import { scoreStatusLabel, scoreBadgeBg } from "@/components/dashboard/utils";
import type { Resume } from "@/components/dashboard/types";

type ResumeTableRowProps = {
  loading?: boolean;
  resume?: Resume;
  matchedScore?: number | null;
};

export function ResumeTableRow({ loading, resume, matchedScore }: ResumeTableRowProps) {
  if (loading) {
    return (
      <div className="py-4 grid grid-cols-[1fr_80px_100px_120px] gap-2 items-center">
        <div className="h-4 rounded animate-pulse" style={{ background: COLORS.skeletonBg, width: "60%" }} />
        <div className="h-6 w-14 rounded animate-pulse" style={{ background: COLORS.skeletonBg }} />
        <div className="h-4 rounded animate-pulse" style={{ background: COLORS.skeletonBg, width: "70%" }} />
        <div className="h-4 rounded animate-pulse" style={{ background: COLORS.skeletonBg, width: "70%" }} />
      </div>
    );
  }

  if (!resume) return null;

  const displayScore = matchedScore ?? null;
  const indexReady = resume.indexStatus === "ready";
  const dateStr = resume.uploadedAt
    ? new Date(resume.uploadedAt).toLocaleDateString()
    : "—";

  return (
    <Link
      href="/resumes"
      className="py-4 grid grid-cols-[1fr_80px_100px_120px] gap-2 items-center hover:bg-stone-50 -mx-2 px-2 rounded transition-colors"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="size-8 rounded flex items-center justify-center shrink-0" style={{ background: COLORS.resumeIconBg }}>
          <FileText className="size-4" style={{ color: COLORS.accent }} strokeWidth={1.5} />
        </div>
        <span className="text-sm font-medium truncate" style={{ color: COLORS.textPrimary }}>{resume.fileName}</span>
      </div>
      {displayScore !== null ? (
        <span
          className="inline-flex items-center justify-center h-7 px-3 rounded text-xs font-bold text-white"
          style={{ background: scoreBadgeBg(displayScore) }}
        >
          {displayScore}/100
        </span>
      ) : (
        <span className="text-xs" style={{ color: COLORS.textMuted }}>—</span>
      )}
      <span className="text-xs" style={{ color: COLORS.textSecondary }}>{dateStr}</span>
      <div className="flex items-center gap-1.5">
        <span
          className="size-1.5 rounded-full shrink-0"
          style={{ background: !indexReady ? COLORS.textMuted : displayScore !== null ? (displayScore >= 70 ? COLORS.scoreGood : COLORS.scoreMid) : COLORS.textMuted }}
        />
        <span className="text-xs truncate" style={{ color: COLORS.textSecondary, fontStyle: "italic" }}>
          {!indexReady
            ? "Processing"
            : displayScore !== null
            ? scoreStatusLabel(displayScore)
            : "Not analyzed"}
        </span>
      </div>
    </Link>
  );
}
