"use client";

import { BookOpen, Edit2, Trash2 } from "lucide-react";
import { COLORS, CARD_STYLE } from "./constants";
import { truncateCategories } from "./utils";
import type { Course } from "./types";

type Props = {
  course: Course;
  isAdmin: boolean;
  onEdit: (course: Course) => void;
  onDelete: (id: string) => void;
};

export function CourseCard({ course, isAdmin, onEdit, onDelete }: Props) {
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

        {/* Admin controls */}
        {isAdmin && (
          <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(course); }}
              className="size-7 flex items-center justify-center rounded-lg bg-white/90 backdrop-blur-sm transition-colors hover:bg-white"
              title="Edit course"
            >
              <Edit2 className="size-3.5" style={{ color: COLORS.primary }} strokeWidth={2} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(course.id); }}
              className="size-7 flex items-center justify-center rounded-lg bg-white/90 backdrop-blur-sm transition-colors hover:bg-white"
              title="Delete course"
            >
              <Trash2 className="size-3.5" style={{ color: "#b3261e" }} strokeWidth={2} />
            </button>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-6">
        <h3
          className="font-heading text-xl font-semibold mb-3 leading-snug line-clamp-2 group-hover:text-primary transition-colors"
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
