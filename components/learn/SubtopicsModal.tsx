"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle, ChevronDown, ChevronLeft, ChevronRight, ChevronUp,
  Layers, Loader2, Save, Sparkles, X,
} from "lucide-react";
import { useGenerateSubtopicsMutation, useSaveSubtopicsMutation } from "@/store/api/coursesApi";
import { COLORS } from "./constants";
import type { Course, Difficulty, SubTopic } from "./types";

const DIFFICULTIES: Difficulty[] = ["Beginner", "Intermediate", "Advanced"];
const DIFFICULTY_COLORS: Record<Difficulty, { bg: string; color: string }> = {
  Beginner:     { bg: "#e8f5e9", color: "#2e7d32" },
  Intermediate: { bg: "#fff3e0", color: "#e65100" },
  Advanced:     { bg: "#fce4e0", color: "#8c3c3c" },
};
const PAGE_SIZE = 10;

type Props = {
  open:    boolean;
  onClose: () => void;
  course:  Course | null;
};

type RowProps = {
  topic:    SubTopic;
  index:    number;
  total:    number;
  onChange: (updated: SubTopic) => void;
  onMove:   (dir: -1 | 1) => void;
};

function SubtopicRow({ topic, index, total, onChange, onMove }: RowProps) {
  return (
    <div
      className="flex items-center gap-3 py-2 px-3 rounded-xl border group"
      style={{ borderColor: COLORS.borderFaint, background: "#fdfcfb" }}
    >
      {/* Order badge */}
      <span
        className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
        style={{ background: COLORS.bgInput, color: COLORS.textFaint }}
      >
        {index + 1}
      </span>

      {/* Title */}
      <input
        value={topic.title}
        onChange={(e) => onChange({ ...topic, title: e.target.value })}
        className="flex-1 min-w-0 bg-transparent text-sm focus:outline-none"
        style={{ color: COLORS.text }}
      />

      {/* Difficulty picker */}
      <div className="flex gap-1 shrink-0">
        {DIFFICULTIES.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => onChange({ ...topic, difficulty: d })}
            className="px-2.5 py-1 rounded-full text-[10px] font-bold transition-all"
            style={
              topic.difficulty === d
                ? DIFFICULTY_COLORS[d]
                : { background: "transparent", color: COLORS.textFaint, border: `1px solid ${COLORS.border}` }
            }
          >
            {d[0]}
          </button>
        ))}
      </div>

      {/* Up / Down */}
      <div className="flex flex-col gap-0.5 shrink-0">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => onMove(-1)}
          className="size-5 flex items-center justify-center rounded transition-colors hover:bg-stone-100 disabled:opacity-20"
        >
          <ChevronUp className="size-3" strokeWidth={2.5} style={{ color: COLORS.textFaint }} />
        </button>
        <button
          type="button"
          disabled={index === total - 1}
          onClick={() => onMove(1)}
          className="size-5 flex items-center justify-center rounded transition-colors hover:bg-stone-100 disabled:opacity-20"
        >
          <ChevronDown className="size-3" strokeWidth={2.5} style={{ color: COLORS.textFaint }} />
        </button>
      </div>
    </div>
  );
}

export function SubtopicsModal({ open, onClose, course }: Props) {
  const [subtopics, setSubtopics] = useState<SubTopic[]>([]);
  const [page,      setPage]      = useState(0);
  const [error,     setError]     = useState("");
  const [saved,     setSaved]     = useState(false);

  const [generate, { isLoading: isGenerating }] = useGenerateSubtopicsMutation();
  const [save,     { isLoading: isSaving }]     = useSaveSubtopicsMutation();

  useEffect(() => {
    if (open && course) {
      setSubtopics(course.subtopics ?? []);
      setPage(0);
      setError("");
      setSaved(false);
    }
  }, [open, course]);

  if (!open || !course) return null;

  const totalPages  = Math.max(1, Math.ceil(subtopics.length / PAGE_SIZE));
  const pageItems   = subtopics.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const globalIndex = (localIdx: number) => page * PAGE_SIZE + localIdx;

  function updateAt(globalIdx: number, updated: SubTopic) {
    setSubtopics((prev) => {
      const next = [...prev];
      next[globalIdx] = updated;
      return next;
    });
  }

  function moveAt(globalIdx: number, dir: -1 | 1) {
    const target = globalIdx + dir;
    if (target < 0 || target >= subtopics.length) return;
    setSubtopics((prev) => {
      const next = [...prev];
      [next[globalIdx], next[target]] = [next[target], next[globalIdx]];
      // Jump page if item moved across boundary
      const newPage = Math.floor(target / PAGE_SIZE);
      if (newPage !== page) setPage(newPage);
      return next.map((s, i) => ({ ...s, order: i + 1 }));
    });
  }

  async function handleGenerate() {
    setError("");
    try {
      const res = await generate(course.id).unwrap();
      setSubtopics(res.subtopics);
      setPage(0);
    } catch (err: unknown) {
      const msg = (err as { data?: { error?: string } })?.data?.error;
      setError(msg ?? "Failed to generate subtopics. Please try again.");
    }
  }

  async function handleSave() {
    setError("");
    const ordered = subtopics.map((s, i) => ({ ...s, order: i + 1 }));
    try {
      const res = await save({ id: course.id, subtopics: ordered }).unwrap();
      setSubtopics(res.subtopics);
      setSaved(true);
      setTimeout(onClose, 900);
    } catch {
      setError("Failed to save. Please try again.");
    }
  }

  const isBusy = isGenerating || isSaving;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={!isBusy ? onClose : undefined} />

      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[88vh]"
        style={{ boxShadow: "0 4px 32px rgba(58,48,42,0.14)" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b shrink-0" style={{ borderColor: COLORS.border }}>
          <Layers className="size-5" style={{ color: COLORS.primary }} strokeWidth={1.8} />
          <div className="flex-1 min-w-0">
            <h2 className="font-heading text-xl font-semibold truncate" style={{ color: COLORS.text }}>
              Subtopics
            </h2>
            <p className="text-xs truncate" style={{ color: COLORS.textFaint }}>{course.topic}</p>
          </div>
          <button
            onClick={onClose}
            disabled={isBusy}
            className="size-8 flex items-center justify-center rounded-lg transition-colors hover:bg-stone-100 disabled:opacity-40"
            style={{ color: COLORS.textFaint }}
          >
            <X className="size-4" strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Generate CTA — shown when empty */}
          {subtopics.length === 0 && !isGenerating && (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
              <div
                className="size-14 rounded-xl flex items-center justify-center"
                style={{ background: COLORS.primaryLight }}
              >
                <Sparkles className="size-7" style={{ color: COLORS.primary }} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-semibold mb-1" style={{ color: COLORS.text }}>No subtopics yet</p>
                <p className="text-xs max-w-xs" style={{ color: COLORS.textMuted }}>
                  Let AI analyse the course document and generate a structured subtopic list.
                </p>
              </div>
              <button
                onClick={handleGenerate}
                className="flex items-center gap-2 h-10 px-6 rounded-lg text-sm font-bold text-white transition-all hover:opacity-90"
                style={{ background: COLORS.primary, boxShadow: `0 4px 20px ${COLORS.primaryShadow}` }}
              >
                <Sparkles className="size-4" strokeWidth={2} />
                Generate with AI
              </button>
            </div>
          )}

          {/* Loading spinner */}
          {isGenerating && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="size-8 animate-spin" style={{ color: COLORS.primary }} />
              <p className="text-sm" style={{ color: COLORS.textMuted }}>
                Analysing document with Gemini Flash…
              </p>
            </div>
          )}

          {/* Subtopics list */}
          {!isGenerating && subtopics.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: COLORS.textFaint }}>
                  {subtopics.length} subtopics — edit name, difficulty and order
                </span>
                <button
                  onClick={handleGenerate}
                  className="flex items-center gap-1.5 h-7 px-3 rounded-lg text-[10px] font-bold border transition-colors hover:bg-stone-50"
                  style={{ borderColor: COLORS.border, color: COLORS.primary }}
                >
                  <Sparkles className="size-3" strokeWidth={2} />
                  Regenerate
                </button>
              </div>

              <div className="space-y-2">
                {pageItems.map((topic, localIdx) => {
                  const gi = globalIndex(localIdx);
                  return (
                    <SubtopicRow
                      key={gi}
                      topic={topic}
                      index={gi}
                      total={subtopics.length}
                      onChange={(updated) => updateAt(gi, updated)}
                      onMove={(dir) => moveAt(gi, dir)}
                    />
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-4">
                  <button
                    onClick={() => setPage((p) => p - 1)}
                    disabled={page === 0}
                    className="size-8 flex items-center justify-center rounded-lg border transition-colors hover:bg-stone-50 disabled:opacity-30"
                    style={{ borderColor: COLORS.border }}
                  >
                    <ChevronLeft className="size-4" style={{ color: COLORS.text }} strokeWidth={2} />
                  </button>
                  <span className="text-xs" style={{ color: COLORS.textMuted }}>
                    Page {page + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page === totalPages - 1}
                    className="size-8 flex items-center justify-center rounded-lg border transition-colors hover:bg-stone-50 disabled:opacity-30"
                    style={{ borderColor: COLORS.border }}
                  >
                    <ChevronRight className="size-4" style={{ color: COLORS.text }} strokeWidth={2} />
                  </button>
                </div>
              )}
            </>
          )}

          {/* Error */}
          {error && (
            <p className="flex items-center gap-2 text-xs mt-3" style={{ color: "#b3261e" }}>
              <AlertCircle className="size-3.5 shrink-0" />
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        {subtopics.length > 0 && !isGenerating && (
          <div className="flex items-center gap-3 px-6 py-4 border-t shrink-0" style={{ borderColor: COLORS.border }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isBusy}
              className="h-10 px-5 rounded-lg text-sm font-bold border transition-colors hover:bg-stone-50 disabled:opacity-40"
              style={{ borderColor: COLORS.border, color: COLORS.text }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isBusy || saved}
              className="flex-1 h-10 rounded-lg text-sm font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
              style={{ background: saved ? COLORS.scoreGood : COLORS.primary, boxShadow: `0 4px 20px ${COLORS.primaryShadow}` }}
            >
              {isSaving ? (
                <><Loader2 className="size-4 animate-spin" /> Saving…</>
              ) : saved ? (
                "Saved!"
              ) : (
                <><Save className="size-4" strokeWidth={2} /> Save Subtopics</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
