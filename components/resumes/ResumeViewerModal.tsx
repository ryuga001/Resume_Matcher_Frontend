"use client";

import { X, Loader2 } from "lucide-react";
import { useGetResumeViewUrlQuery } from "@/store/api/resumesApi";

const COLORS = {
  primary: "#c2652a",
  text: "#2a2826",
  border: "#e4dcd6",
  textMuted: "#6e6862",
};

type Props = {
  resumeId: string;
  fileName: string;
  onClose: () => void;
};

export function ResumeViewerModal({ resumeId, fileName, onClose }: Props) {
  const { data, isLoading, isError } = useGetResumeViewUrlQuery(resumeId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(26,25,23,0.6)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white rounded-md flex flex-col w-full max-w-4xl"
        style={{
          height: "90vh",
          border: `1px solid ${COLORS.border}`,
          boxShadow: "0 8px 48px rgba(26,25,23,0.18)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3 border-b shrink-0"
          style={{ borderColor: COLORS.border }}
        >
          <p className="text-sm font-bold truncate" style={{ color: COLORS.text }}>
            {fileName}
          </p>
          <button
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded hover:bg-stone-100 transition-colors"
            style={{ color: COLORS.textMuted }}
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden">
          {isLoading && (
            <div className="h-full flex items-center justify-center gap-2">
              <Loader2 className="size-5 animate-spin" style={{ color: COLORS.primary }} />
              <span className="text-sm" style={{ color: COLORS.textMuted }}>Loading…</span>
            </div>
          )}
          {isError && (
            <div className="h-full flex items-center justify-center">
              <p className="text-sm" style={{ color: "#b3261e" }}>Could not load the file.</p>
            </div>
          )}
          {data?.url && (
            <iframe
              src={data.url}
              className="w-full h-full"
              title={fileName}
              style={{ border: "none" }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
