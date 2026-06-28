"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, Edit2, Layers, MoreVertical, Trash2 } from "lucide-react";
import { COLORS, CARD_STYLE } from "./constants";
import { truncateCategories } from "./utils";
import type { Course } from "./types";

type Props = {
  course:       Course;
  isAdmin:      boolean;
  onEdit:       (course: Course) => void;
  onSubtopics:  (course: Course) => void;
  onDelete:     (id: string) => void;
};

function AdminMenu({ course, onEdit, onSubtopics, onDelete }: Pick<Props, "course" | "onEdit" | "onSubtopics" | "onDelete">) {
  const [open, setOpen] = useState(false);
  const ref  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="size-7 flex items-center justify-center rounded-lg bg-white/90 backdrop-blur-sm transition-colors hover:bg-white"
        title="Course actions"
      >
        <MoreVertical className="size-3.5" style={{ color: COLORS.text }} strokeWidth={2} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-8 w-44 bg-white rounded-xl border shadow-lg z-20 overflow-hidden"
          style={{ borderColor: COLORS.border, boxShadow: "0 4px 20px rgba(58,48,42,0.12)" }}
        >
          {[
            {
              icon: Edit2,
              label: "Edit Course",
              color: COLORS.text,
              action: () => { setOpen(false); onEdit(course); },
            },
            {
              icon: Layers,
              label: "Subtopics",
              color: COLORS.primary,
              action: () => { setOpen(false); onSubtopics(course); },
            },
            {
              icon: Trash2,
              label: "Delete",
              color: "#b3261e",
              action: () => { setOpen(false); onDelete(course.id); },
            },
          ].map(({ icon: Icon, label, color, action }) => (
            <button
              key={label}
              onClick={(e) => { e.stopPropagation(); action(); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-stone-50 transition-colors text-left"
              style={{ color }}
            >
              <Icon className="size-3.5 shrink-0" strokeWidth={2} />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function CourseCard({ course, isAdmin, onEdit, onSubtopics, onDelete }: Props) {
  const { visible, rest } = truncateCategories(course.categories, 2);

  return (
    <div
      className="bg-white rounded-xl overflow-hidden border group transition-transform hover:-translate-y-1 cursor-pointer"
      style={CARD_STYLE}
    >
      {/* Thumbnail */}
      <div className="h-48 overflow-hidden relative bg-stone-100">
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.topic}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: "#f0e8e2" }}>
            <BookOpen className="size-10" style={{ color: COLORS.textFaint }} strokeWidth={1.2} />
          </div>
        )}

        {/* Status badge */}
        <div
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.12em] bg-white/90 backdrop-blur-sm"
          style={{ color: course.status === "Available" ? COLORS.scoreGood : COLORS.textFaint }}
        >
          {course.status}
        </div>

        {/* Subtopics count badge */}
        {course.subtopics?.length > 0 && (
          <div
            className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-sm"
            style={{ color: COLORS.primary }}
          >
            <Layers className="size-3" strokeWidth={2} />
            {course.subtopics.length} topics
          </div>
        )}

        {/* Admin 3-dot menu */}
        {isAdmin && (
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <AdminMenu course={course} onEdit={onEdit} onSubtopics={onSubtopics} onDelete={onDelete} />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-6">
        <h3
          className="font-heading text-xl font-semibold mb-3 leading-snug line-clamp-2"
          style={{ color: COLORS.text }}
        >
          {course.topic}
        </h3>

        <div className="flex flex-wrap gap-2">
          {visible.map((cat) => (
            <span
              key={cat}
              className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.1em]"
              style={{ background: COLORS.bgInput, color: COLORS.textMuted }}
            >
              {cat}
            </span>
          ))}
          {rest > 0 && (
            <span
              className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.1em]"
              style={{ background: COLORS.primaryLight, color: COLORS.primary }}
            >
              +{rest} More
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
