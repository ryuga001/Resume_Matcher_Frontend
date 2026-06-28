"use client";

import { useParams, useRouter } from "next/navigation";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useGetCourseQuery } from "@/store/api/coursesApi";
import { SubtopicContentView } from "./SubtopicContentView";
import { COLORS } from "./constants";

export function SubtopicDetailPage() {
  const { courseId, order } = useParams<{ courseId: string; order: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = user?.role === "SUPER_ADMIN";

  const orderNum = parseInt(order ?? "0", 10);
  const { data: course, isLoading, isError } = useGetCourseQuery(courseId ?? "");

  const subtopic = course?.subtopics?.find((s) => s.order === orderNum);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="size-6 animate-spin" style={{ color: COLORS.primary }} />
      </div>
    );
  }

  if (isError || !course || !subtopic) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <AlertTriangle className="size-8" style={{ color: COLORS.textFaint }} strokeWidth={1.5} />
        <p className="text-sm" style={{ color: COLORS.textMuted }}>Subtopic not found.</p>
        <button
          onClick={() => router.push(courseId ? `/learn/${courseId}` : "/learn")}
          className="text-sm font-bold"
          style={{ color: COLORS.primary }}
        >
          Back to Course
        </button>
      </div>
    );
  }

  return (
    <SubtopicContentView
      course={course}
      subtopic={subtopic}
      isAdmin={isAdmin}
      onBack={() => router.push(`/learn/${courseId}`)}
    />
  );
}
