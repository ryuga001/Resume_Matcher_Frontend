"use client";

import { BookOpen, GraduationCap, Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { COLORS } from "./constants";
import { CourseCard } from "./CourseCard";
import { FilterBar } from "./FilterBar";
import { UploadModal } from "./UploadModal";
import { SubtopicsModal } from "./SubtopicsModal";
import { useLearn } from "./hooks/useLearn";

export function LearnPage() {
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = user?.role === "SUPER_ADMIN";

  const {
    courses, isLoading,
    search, setSearch,
    category, setCategory,
    statusFilter, setStatusFilter,
    modalOpen, openCreate, openEdit, closeModal,
    editCourse,
    subtopicsOpen, subtopicsCourse, openSubtopics, closeSubtopics,
    handleDelete,
  } = useLearn();

  return (
    <div className="px-8 py-8">
      {/* Page header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-heading text-4xl font-bold" style={{ color: COLORS.text }}>
            Career Intelligence Academy
          </h1>
          <p className="text-sm mt-1.5 max-w-xl" style={{ color: COLORS.textMuted }}>
            Curated strategic insights for the modern professional. Deepen your expertise with our library of advanced modules.
          </p>
        </div>

        {/* SUPER_ADMIN: Add Course button */}
        {isAdmin && (
          <button
            onClick={openCreate}
            className="flex items-center gap-2 h-10 px-5 rounded text-sm font-bold text-white shrink-0 transition-all hover:opacity-90 active:scale-[0.98] ml-6 mt-1"
            style={{ background: COLORS.primary, boxShadow: `0 4px 20px ${COLORS.primaryShadow}` }}
          >
            <Plus className="size-4" strokeWidth={2.5} />
            Add Course
          </button>
        )}
      </div>

      {/* Filters */}
      <FilterBar
        search={search}
        onSearch={setSearch}
        category={category}
        onCategory={setCategory}
        statusFilter={statusFilter}
        onStatus={setStatusFilter}
      />

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="size-6 animate-spin" style={{ color: COLORS.primary }} />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && courses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <BookOpen className="size-12" style={{ color: COLORS.textFaint }} strokeWidth={1.2} />
          <p className="text-sm font-medium" style={{ color: COLORS.textMuted }}>
            {search || category || statusFilter ? "No courses match your filters." : "No courses yet."}
          </p>
          {isAdmin && !search && !category && !statusFilter && (
            <button
              onClick={openCreate}
              className="mt-2 h-9 px-5 rounded text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ background: COLORS.primary }}
            >
              Add the first course
            </button>
          )}
        </div>
      )}

      {/* Grid */}
      {!isLoading && courses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isAdmin={isAdmin}
              onEdit={openEdit}
              onSubtopics={openSubtopics}
              onDelete={handleDelete}
              onOpen={(course) => router.push(`/learn/${course.id}`)}
            />
          ))}
        </div>
      )}

      {/* Featured path banner */}
      {!isLoading && courses.length > 0 && (
        <div
          className="mt-12 rounded-md p-10 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden"
          style={{ background: COLORS.primary }}
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="learn-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#learn-grid)" />
            </svg>
          </div>

          <div className="relative z-10 flex-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3 block text-white/70">
              Recommended Path
            </span>
            <h2 className="font-heading text-2xl font-bold text-white mb-3">
              The Strategic Leader Path
            </h2>
            <p className="text-sm text-white/80 mb-6 max-w-md leading-relaxed">
              A curated sequence of modules designed to transform senior professionals into strategic leaders.
            </p>
            <button className="h-10 px-6 rounded bg-white text-sm font-bold transition-all hover:scale-105 active:scale-95" style={{ color: COLORS.primary }}>
              Explore Path
            </button>
          </div>

          <div className="relative z-10 shrink-0">
            <div className="w-36 h-36 rounded-md flex flex-col items-center justify-center text-center border border-white/20 bg-white/10 backdrop-blur-sm">
              <GraduationCap className="size-8 text-white mb-2" strokeWidth={1.5} />
              <span className="font-heading text-3xl text-white">{courses.length}</span>
              <span className="text-[10px] text-white/70 uppercase tracking-widest">
                {courses.length === 1 ? "Module" : "Modules"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Upload / Edit modal */}
      <UploadModal open={modalOpen} onClose={closeModal} editCourse={editCourse} />

      {/* Subtopics modal */}
      <SubtopicsModal open={subtopicsOpen} onClose={closeSubtopics} course={subtopicsCourse} />
    </div>
  );
}
