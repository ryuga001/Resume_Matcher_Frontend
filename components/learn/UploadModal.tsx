"use client";

import { useEffect, useRef, useState } from "react";
import { X, Upload, Image, FileVideo, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useCreateCourseMutation, useUpdateCourseMutation } from "@/store/api/coursesApi";
import { useCourseUpload } from "./hooks/useCourseUpload";
import { COLORS, COURSE_CATEGORIES, COURSE_STATUS_OPTIONS } from "./constants";
import { formatFileSize } from "./utils";
import type { Course, CourseStatus, UploadProgress } from "./types";

type Props = {
  open: boolean;
  onClose: () => void;
  editCourse?: Course | null;
};

const EMPTY_PROGRESS: UploadProgress = { pct: 0, status: "idle" };

function ProgressBar({ progress }: { progress: UploadProgress }) {
  if (progress.status === "idle") return null;

  const color =
    progress.status === "error" ? "#b3261e" :
    progress.status === "done"  ? COLORS.scoreGood :
    COLORS.primary;

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color }}>
          {progress.status === "error"  ? "Upload failed" :
           progress.status === "done"   ? "Complete" :
           `Uploading… ${progress.pct}%`}
        </span>
        {progress.status === "done"  && <CheckCircle2 className="size-3.5" style={{ color }} />}
        {progress.status === "error" && <AlertCircle  className="size-3.5" style={{ color }} />}
        {progress.status === "uploading" && <Loader2 className="size-3.5 animate-spin" style={{ color }} />}
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: COLORS.bgTrack }}>
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${progress.pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

function FileDropZone({
  label,
  accept,
  icon: Icon,
  file,
  existingUrl,
  progress,
  onChange,
}: {
  label: string;
  accept: string;
  icon: React.ElementType;
  file: File | null;
  existingUrl?: string;
  progress: UploadProgress;
  onChange: (f: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  return (
    <div>
      <span
        className="block text-[10px] font-bold uppercase tracking-[0.14em] mb-2"
        style={{ color: COLORS.textFaint }}
      >
        {label}
      </span>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const f = e.dataTransfer.files[0];
          if (f) onChange(f);
        }}
        className="flex flex-col items-center justify-center gap-2 p-5 rounded-lg border-2 border-dashed cursor-pointer transition-all"
        style={{
          borderColor: dragging ? COLORS.primary : COLORS.border,
          background:  dragging ? COLORS.primaryLight : "transparent",
        }}
      >
        <Icon
          className="size-6"
          style={{ color: file ? COLORS.primary : COLORS.textFaint }}
          strokeWidth={1.5}
        />
        {file ? (
          <>
            <span className="text-xs font-semibold text-center truncate max-w-full px-2" style={{ color: COLORS.text }}>
              {file.name}
            </span>
            <span className="text-[10px]" style={{ color: COLORS.textFaint }}>{formatFileSize(file.size)}</span>
          </>
        ) : existingUrl ? (
          <span className="text-xs text-center" style={{ color: COLORS.textMuted }}>
            Existing file — click or drop to replace
          </span>
        ) : (
          <span className="text-xs text-center" style={{ color: COLORS.textFaint }}>
            Click to choose or drag & drop
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onChange(f); }}
      />

      <ProgressBar progress={progress} />
    </div>
  );
}

export function UploadModal({ open, onClose, editCourse }: Props) {
  const isEdit = !!editCourse;

  const [topic,       setTopic]       = useState("");
  const [categories,  setCategories]  = useState<string[]>([]);
  const [status,      setStatus]      = useState<CourseStatus>("Not Available");
  const [thumbFile,   setThumbFile]   = useState<File | null>(null);
  const [sourceFile,  setSourceFile]  = useState<File | null>(null);
  const [thumbProg,   setThumbProg]   = useState<UploadProgress>(EMPTY_PROGRESS);
  const [sourceProg,  setSourceProg]  = useState<UploadProgress>(EMPTY_PROGRESS);
  const [error,       setError]       = useState("");
  const [submitting,  setSubmitting]  = useState(false);

  const { uploadFile } = useCourseUpload();
  const [createCourse] = useCreateCourseMutation();
  const [updateCourse] = useUpdateCourseMutation();

  // Hydrate form when editing
  useEffect(() => {
    if (open && editCourse) {
      setTopic(editCourse.topic);
      setCategories(editCourse.categories);
      setStatus(editCourse.status);
      setThumbFile(null);
      setSourceFile(null);
      setThumbProg(EMPTY_PROGRESS);
      setSourceProg(EMPTY_PROGRESS);
      setError("");
    } else if (open && !editCourse) {
      setTopic("");
      setCategories([]);
      setStatus("Not Available");
      setThumbFile(null);
      setSourceFile(null);
      setThumbProg(EMPTY_PROGRESS);
      setSourceProg(EMPTY_PROGRESS);
      setError("");
    }
  }, [open, editCourse]);

  function toggleCategory(cat: string) {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  }

  const isBusy = submitting || thumbProg.status === "uploading" || sourceProg.status === "uploading";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!topic.trim()) { setError("Topic is required."); return; }

    // For create: at least thumbnail required
    if (!isEdit && !thumbFile)   { setError("Thumbnail is required."); return; }
    if (!isEdit && !sourceFile)  { setError("Source file is required."); return; }

    setSubmitting(true);
    try {
      let thumbnailKey   = "";
      let sourceFileKey  = "";

      // Upload in parallel if new files provided
      await Promise.all([
        thumbFile  ? uploadFile(thumbFile,  "thumbnail", setThumbProg).then((k) => { thumbnailKey = k; }) : Promise.resolve(),
        sourceFile ? uploadFile(sourceFile, "source",    setSourceProg).then((k) => { sourceFileKey = k; }) : Promise.resolve(),
      ]);

      if (isEdit && editCourse) {
        await updateCourse({
          id: editCourse.id,
          topic,
          categories,
          status,
          ...(thumbFile  && { thumbnailKey }),
          ...(sourceFile && { sourceFileKey }),
        }).unwrap();
      } else {
        await createCourse({ topic, categories, status, thumbnailKey, sourceFileKey }).unwrap();
      }

      onClose();
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message;
      setError(msg ?? "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={!isBusy ? onClose : undefined}
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        style={{ boxShadow: "0 4px 32px rgba(58,48,42,0.14)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0" style={{ borderColor: COLORS.border }}>
          <h2 className="font-heading text-xl font-semibold" style={{ color: COLORS.text }}>
            {isEdit ? "Edit Course" : "Add New Course"}
          </h2>
          {!isBusy && (
            <button
              onClick={onClose}
              className="size-8 flex items-center justify-center rounded-lg transition-colors hover:bg-stone-100"
              style={{ color: COLORS.textFaint }}
            >
              <X className="size-4" strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Body — scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Topic */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.14em] mb-2" style={{ color: COLORS.textFaint }}>
              Topic *
            </label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Advanced System Design"
              className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none transition-all"
              style={{ borderColor: COLORS.border, color: COLORS.text }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = COLORS.primary;
                e.currentTarget.style.boxShadow   = `0 0 0 3px ${COLORS.primaryGlow}`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = COLORS.border;
                e.currentTarget.style.boxShadow   = "none";
              }}
            />
          </div>

          {/* Categories */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.14em] mb-2" style={{ color: COLORS.textFaint }}>
              Categories
            </label>
            <div className="flex flex-wrap gap-2">
              {COURSE_CATEGORIES.map((cat) => {
                const selected = categories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.1em] border transition-all"
                    style={selected
                      ? { background: COLORS.primary, color: "#fff", borderColor: COLORS.primary }
                      : { background: "transparent", color: COLORS.textMuted, borderColor: COLORS.border }
                    }
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.14em] mb-2" style={{ color: COLORS.textFaint }}>
              Status
            </label>
            <div className="flex gap-3">
              {COURSE_STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className="flex-1 py-2.5 rounded-lg border text-xs font-bold transition-all"
                  style={status === s
                    ? { background: COLORS.primary, color: "#fff", borderColor: COLORS.primary }
                    : { background: "transparent", color: COLORS.textMuted, borderColor: COLORS.border }
                  }
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Thumbnail */}
          <FileDropZone
            label={`Thumbnail${!isEdit ? " *" : ""}`}
            accept="image/*"
            icon={Image}
            file={thumbFile}
            existingUrl={editCourse?.thumbnailUrl}
            progress={thumbProg}
            onChange={setThumbFile}
          />

          {/* Source file */}
          <FileDropZone
            label={`Source File${!isEdit ? " *" : ""}`}
            accept="video/*,application/pdf,.mp4,.mov,.avi,.mkv,.webm"
            icon={FileVideo}
            file={sourceFile}
            existingUrl={editCourse?.sourceFileUrl}
            progress={sourceProg}
            onChange={setSourceFile}
          />

          {/* Error */}
          {error && (
            <p className="flex items-center gap-2 text-xs" style={{ color: "#b3261e" }}>
              <AlertCircle className="size-3.5 shrink-0" />
              {error}
            </p>
          )}
        </form>

        {/* Footer */}
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
            onClick={handleSubmit}
            disabled={isBusy}
            className="flex-1 h-10 rounded-lg text-sm font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: COLORS.primary, boxShadow: `0 4px 20px ${COLORS.primaryShadow}` }}
          >
            {isBusy ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {thumbProg.status === "uploading" || sourceProg.status === "uploading"
                  ? "Uploading…"
                  : "Saving…"}
              </>
            ) : (
              <>
                <Upload className="size-4" strokeWidth={2} />
                {isEdit ? "Save Changes" : "Publish Course"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
