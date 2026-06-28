"use client";

import { useDeferredValue, useState } from "react";
import {
  ArrowLeft, BookOpen, ChevronLeft, ChevronRight,
  Edit2, GraduationCap, Layers, Search, Zap,
} from "lucide-react";
import { COLORS, CARD_STYLE } from "./constants";
import { SubtopicsModal } from "./SubtopicsModal";
import type { Course, Difficulty, SubTopic } from "./types";

const PAGE_SIZE = 8;

const DIFFICULTY_CONFIG: Record<Difficulty, { color: string; bg: string; icon: React.ElementType }> = {
  Beginner:     { color: "#2d8a4e", bg: "#e8f5e9", icon: BookOpen  },
  Intermediate: { color: COLORS.primary, bg: COLORS.primaryLight, icon: Layers },
  Advanced:     { color: "#b3261e", bg: "#fce4e0", icon: Zap       },
};

function SubtopicCard({ topic, index }: { topic: SubTopic; index: number }) {
  const cfg   = DIFFICULTY_CONFIG[topic.difficulty] ?? DIFFICULTY_CONFIG.Intermediate;
  const Icon  = cfg.icon;
  const isAlt = index % 2 === 1;

  return (
    <div
      className="group flex items-center gap-5 p-5 rounded-xl border transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background:   isAlt ? "#fdfcfb" : "#ffffff",
        borderColor:  COLORS.borderFaint,
        boxShadow:    "0 1px 4px rgba(0,0,0,0.04)",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = COLORS.primary + "66"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = COLORS.borderFaint; }}
    >
      {/* Difficulty icon box */}
      <div
        className="size-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: cfg.bg }}
      >
        <Icon className="size-5" style={{ color: cfg.color }} strokeWidth={1.8} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3
          className="font-heading text-xl font-semibold leading-snug group-hover:text-primary transition-colors"
          style={{ color: COLORS.text }}
        >
          {topic.title}
        </h3>
        <span
          className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-[0.12em]"
          style={{ background: cfg.bg, color: cfg.color }}
        >
          {topic.difficulty}
        </span>
      </div>

      {/* Order badge */}
      <span
        className="shrink-0 text-[10px] font-bold uppercase tracking-[0.14em]"
        style={{ color: COLORS.textFaint }}
      >
        {String(topic.order).padStart(2, "0")}
      </span>
    </div>
  );
}

type Props = {
  course:         Course;
  isAdmin:        boolean;
  onBack:         () => void;
  onEdit:         (course: Course) => void;
};

export function CourseDetailView({ course, isAdmin, onBack, onEdit }: Props) {
  const [rawSearch,   setRawSearch]   = useState("");
  const [page,        setPage]        = useState(0);
  const [editOpen,    setEditOpen]    = useState(false);

  const search   = useDeferredValue(rawSearch.toLowerCase().trim());
  const filtered = (course.subtopics ?? []).filter((s) =>
    !search || s.title.toLowerCase().includes(search),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems  = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  function handleSearch(v: string) {
    setRawSearch(v);
    setPage(0);
  }

  const primaryCategory = course.categories[0] ?? "Course";

  return (
    <div className="px-8 py-8">
      {/* Breadcrumb */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 mb-8 text-sm font-medium transition-colors hover:opacity-80"
        style={{ color: COLORS.textMuted }}
      >
        <ArrowLeft className="size-4" strokeWidth={2} />
        <span>Academy</span>
        <span style={{ color: COLORS.textFaint }}>/</span>
        <span style={{ color: COLORS.text }}>{course.topic}</span>
      </button>

      {/* Hero */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
          <div>
            {/* Category badge */}
            <span
              className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.14em] mb-4"
              style={{ background: COLORS.primaryLight, color: COLORS.primary }}
            >
              {primaryCategory}
            </span>

            <h1
              className="font-heading text-4xl font-bold leading-tight mb-3"
              style={{ color: COLORS.text }}
            >
              {course.topic}
            </h1>

            {/* Category chips */}
            <div className="flex flex-wrap gap-2">
              {course.categories.map((cat) => (
                <span
                  key={cat}
                  className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.1em]"
                  style={{ background: "#f0e8e2", color: COLORS.textMuted }}
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {isAdmin && (
              <button
                onClick={() => setEditOpen(true)}
                className="flex items-center gap-2 h-10 px-5 rounded-lg text-sm font-bold border transition-colors hover:bg-stone-50"
                style={{ borderColor: COLORS.border, color: COLORS.primary }}
              >
                <Edit2 className="size-4" strokeWidth={2} />
                Edit Subtopics
              </button>
            )}
            {course.sourceFileUrl && (
              <a
                href={course.sourceFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 h-10 px-6 rounded-lg text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ background: COLORS.primary, boxShadow: `0 4px 20px ${COLORS.primaryShadow}` }}
              >
                <GraduationCap className="size-4" strokeWidth={2} />
                Start Learning
              </a>
            )}
          </div>
        </div>

        {/* Subtopic search */}
        <div className="relative max-w-md">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 size-4"
            style={{ color: COLORS.textFaint }}
            strokeWidth={1.8}
          />
          <input
            value={rawSearch}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Filter subtopics…"
            className="w-full pl-11 pr-4 py-3 rounded-xl border text-sm focus:outline-none transition-all"
            style={{ borderColor: COLORS.border, color: COLORS.text, background: "#ffffff" }}
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
      </div>

      {/* Subtopics section */}
      <section>
        <div className="flex items-center gap-3 mb-3">
          <Layers className="size-5" style={{ color: COLORS.primary }} strokeWidth={1.8} />
          <h2 className="font-heading text-2xl font-bold" style={{ color: COLORS.text }}>
            Subtopics
          </h2>
          <span
            className="ml-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold"
            style={{ background: COLORS.bgInput, color: COLORS.textFaint }}
          >
            {filtered.length}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div
            className="bg-white rounded-xl p-10 border flex flex-col items-center gap-3 text-center"
            style={CARD_STYLE}
          >
            <Layers className="size-8" style={{ color: COLORS.textFaint }} strokeWidth={1.2} />
            <p className="text-sm" style={{ color: COLORS.textMuted }}>
              {rawSearch ? "No subtopics match your search." : "No subtopics yet."}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {pageItems.map((topic, i) => (
                <SubtopicCard key={topic.order} topic={topic} index={page * PAGE_SIZE + i} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 0}
                  className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border transition-colors hover:bg-stone-50 disabled:opacity-30"
                  style={{ borderColor: COLORS.border, color: COLORS.textMuted }}
                >
                  <ChevronLeft className="size-4" strokeWidth={2} />
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className="size-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all"
                      style={
                        page === i
                          ? { background: COLORS.primary, color: "#fff" }
                          : { color: COLORS.textMuted }
                      }
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page === totalPages - 1}
                  className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border transition-colors hover:bg-stone-50 disabled:opacity-30"
                  style={{ borderColor: COLORS.border, color: COLORS.textMuted }}
                >
                  Next
                  <ChevronRight className="size-4" strokeWidth={2} />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Bottom CTA card — always shown */}
      <div
        className="mt-12 rounded-2xl p-10 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden"
        style={{ background: COLORS.primary }}
      >
        {/* Grid decoration */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="detail-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#detail-grid)" />
          </svg>
        </div>

        <div className="relative z-10 flex-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3 block text-white/70">
            Certified Path
          </span>
          <h2 className="font-heading text-2xl font-bold text-white mb-3">
            {course.topic} Mastery
          </h2>
          <p className="text-sm text-white/80 mb-6 max-w-md leading-relaxed">
            Complete all {course.subtopics?.length ?? 0} subtopics in this module to earn your Sahara Verified certificate and stand out in your professional profile.
          </p>
          <button
            className="h-10 px-6 rounded-lg bg-white text-sm font-bold transition-all hover:scale-105 active:scale-95"
            style={{ color: COLORS.primary }}
          >
            View Progress
          </button>
        </div>

        <div className="relative z-10 shrink-0">
          <div className="w-36 h-36 rounded-2xl flex flex-col items-center justify-center text-center border border-white/20 bg-white/10 backdrop-blur-sm">
            <GraduationCap className="size-8 text-white mb-2" strokeWidth={1.5} />
            <span className="font-heading text-3xl text-white">{course.subtopics?.length ?? 0}</span>
            <span className="text-[10px] text-white/70 uppercase tracking-widest">
              {(course.subtopics?.length ?? 0) === 1 ? "Topic" : "Topics"}
            </span>
          </div>
        </div>
      </div>

      {/* SUPER_ADMIN: SubtopicsModal */}
      {isAdmin && (
        <SubtopicsModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          course={course}
        />
      )}
    </div>
  );
}
