"use client";

import { FileText, Clock, Trash2, Loader2, Eye, Wand2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { IndexBadge } from "@/components/resumes/IndexBadge";
import type { Resume } from "@/components/resumes/types";

const COLORS = {
  primary: "#c2652a",
  text: "#2a2826",
  textMuted: "#6e6862",
  border: "#e4dcd6",
};

type Props = {
  resume: Resume;
  expanded: string | null;
  deleteId: string | null;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
};

export function ResumeRow({ resume, expanded, deleteId, onToggle, onDelete, onView }: Props) {
  const router = useRouter();
  const isExpanded = expanded === resume.resumeId;
  const isDeleting = deleteId === resume.resumeId;
  const isReady = resume.indexStatus === "ready";

  return (
    <div>
      <div
        className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/20 transition-colors group cursor-pointer"
        onClick={() => onToggle(resume.resumeId)}
      >
        {/* Icon */}
        <div className="size-8 rounded bg-muted flex items-center justify-center shrink-0">
          <FileText className="size-4 text-muted-foreground" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium truncate">{resume.fileName}</p>
            {resume.hasCustomized && (
              <span
                className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.12em] px-1.5 py-0.5 rounded"
                style={{ background: "#e8f5e9", color: "#2e7d32" }}
              >
                <CheckCircle2 className="size-2.5" />
                Updated
              </span>
            )}
          </div>
          {resume.uploadedAt && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <Clock className="size-3" />
              {new Date(resume.uploadedAt).toLocaleDateString()}
            </p>
          )}
        </div>

        <IndexBadge status={resume.indexStatus} />

        {/* Actions — visible on hover */}
        <div className="flex items-center gap-1">
          {/* View original */}
          <button
            onClick={(e) => { e.stopPropagation(); onView(resume.resumeId); }}
            title="View original PDF"
            className="size-7 flex items-center justify-center rounded hover:bg-stone-100 transition-colors"
            style={{ color: COLORS.textMuted }}
          >
            <Eye className="size-3.5" />
          </button>

          {/* Build / customize */}
          {isReady && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/resumes/${resume.resumeId}/build`);
              }}
              title="Build customized resume"
              className="size-7 flex items-center justify-center rounded hover:bg-stone-100 transition-colors"
              style={{ color: COLORS.primary }}
            >
              <Wand2 className="size-3.5" />
            </button>
          )}

          {/* Delete */}
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(resume.resumeId); }}
            disabled={isDeleting}
            title="Delete"
            className="size-7 flex items-center justify-center rounded hover:bg-stone-100 transition-colors text-muted-foreground/50 hover:text-destructive"
          >
            {isDeleting ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded skills */}
      {isExpanded && resume.skills.length > 0 && (
        <div className="px-5 py-3 bg-muted/20 border-t border-border">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Detected skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {resume.skills.map((s) => (
              <span
                key={s}
                className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
