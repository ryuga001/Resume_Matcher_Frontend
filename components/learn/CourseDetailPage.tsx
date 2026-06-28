"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useGetCourseQuery } from "@/store/api/coursesApi";
import { CourseDetailView } from "./CourseDetailView";
import { UploadModal } from "./UploadModal";
import { COLORS } from "./constants";
import type { Course } from "./types";

export function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = user?.role === "SUPER_ADMIN";

  const [editCourse, setEditCourse] = useState<Course | null>(null);

  const { data: course, isLoading, isError } = useGetCourseQuery(courseId ?? "");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="size-6 animate-spin" style={{ color: COLORS.primary }} />
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <AlertTriangle className="size-8" style={{ color: COLORS.textFaint }} strokeWidth={1.5} />
        <p className="text-sm" style={{ color: COLORS.textMuted }}>Course not found.</p>
        <button
          onClick={() => router.push("/learn")}
          className="text-sm font-bold"
          style={{ color: COLORS.primary }}
        >
          Back to Academy
        </button>
      </div>
    );
  }

  return (
    <>
      <CourseDetailView
        course={course}
        isAdmin={isAdmin}
        onBack={() => router.push("/learn")}
        onEdit={(c) => setEditCourse(c)}
      />
      <UploadModal
        open={!!editCourse}
        onClose={() => setEditCourse(null)}
        editCourse={editCourse}
      />
    </>
  );
}
