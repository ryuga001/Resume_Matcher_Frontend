"use client";

import { FileText, Clock, Trash2, Loader2 } from "lucide-react";
import { IndexBadge } from "@/components/resumes/IndexBadge";
import type { Resume } from "@/components/resumes/types";

type Props = {
  resume: Resume;
  expanded: string | null;
  deleteId: string | null;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export function ResumeRow({ resume, expanded, deleteId, onToggle, onDelete }: Props) {
  const isExpanded = expanded === resume.resumeId;
  const isDeleting = deleteId === resume.resumeId;

  return (
    <div>
      <div
        className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/20 transition-colors group cursor-pointer"
        onClick={() => onToggle(resume.resumeId)}
      >
        <div className="size-8 rounded bg-muted flex items-center justify-center shrink-0">
          <FileText className="size-4 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{resume.fileName}</p>
          {resume.uploadedAt && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <Clock className="size-3" />
              {new Date(resume.uploadedAt).toLocaleDateString()}
            </p>
          )}
        </div>
        <IndexBadge status={resume.indexStatus} />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(resume.resumeId);
          }}
          disabled={isDeleting}
          className="text-muted-foreground/30 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 ml-1"
        >
          {isDeleting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Trash2 className="size-4" />
          )}
        </button>
      </div>
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
