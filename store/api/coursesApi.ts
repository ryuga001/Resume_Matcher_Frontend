import { baseApi } from "./baseApi";
import type { Course, CourseStatus, SubTopic, SubtopicContent, ContentStatus } from "@/components/learn/types";

type PresignRequest  = { filename: string; contentType: string; uploadType: "source" | "thumbnail" };
type PresignResponse = { url: string; key: string; fileUrl: string };
type CreateCourseBody = { topic: string; categories: string[]; status: CourseStatus; thumbnailKey: string; sourceFileKey: string };
type UpdateCourseBody = Partial<CreateCourseBody>;
type CourseQuery = { search?: string; category?: string; status?: CourseStatus } | void;

export type ContentStatusItem = { order: number; status: ContentStatus };

export const coursesApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getCourses: build.query<Course[], CourseQuery>({
      query: (params) => {
        const q = new URLSearchParams();
        if (params?.search)   q.set("search",   params.search);
        if (params?.category) q.set("category", params.category);
        if (params?.status)   q.set("status",   params.status);
        const qs = q.toString();
        return qs ? `/courses?${qs}` : `/courses`;
      },
      providesTags: ["Course"],
    }),
    getCourse: build.query<Course, string>({
      query: (id) => `/courses/${id}`,
      providesTags: (_, __, id) => [{ type: "Course" as const, id }],
    }),
    presignUpload: build.mutation<PresignResponse, PresignRequest>({
      query: (body) => ({ url: "/courses/presign", method: "POST", body }),
    }),
    createCourse: build.mutation<Course, CreateCourseBody>({
      query: (body) => ({ url: "/courses", method: "POST", body }),
      invalidatesTags: ["Course"],
    }),
    updateCourse: build.mutation<Course, { id: string } & UpdateCourseBody>({
      query: ({ id, ...body }) => ({ url: `/courses/${id}`, method: "PATCH", body }),
      invalidatesTags: ["Course"],
    }),
    deleteCourse: build.mutation<{ ok: boolean }, string>({
      query: (id) => ({ url: `/courses/${id}`, method: "DELETE" }),
      invalidatesTags: ["Course"],
    }),
    generateSubtopics: build.mutation<{ taskId: string }, string>({
      query: (id) => ({ url: `/courses/${id}/subtopics/generate`, method: "POST" }),
    }),
    getSubtopicsTaskStatus: build.query<
      { status: "running" | "done" | "error"; subtopics?: SubTopic[]; error?: string },
      { courseId: string; taskId: string }
    >({
      query: ({ courseId, taskId }) => `/courses/${courseId}/subtopics/status/${taskId}`,
    }),
    saveSubtopics: build.mutation<{ subtopics: SubTopic[] }, { id: string; subtopics: SubTopic[] }>({
      query: ({ id, subtopics }) => ({ url: `/courses/${id}/subtopics`, method: "PUT", body: { subtopics } }),
      invalidatesTags: ["Course"],
    }),
    generateContent: build.mutation<{ taskId: string; queued: boolean }, string>({
      query: (id) => ({ url: `/courses/${id}/content/generate`, method: "POST" }),
      invalidatesTags: ["Course"],
    }),
    generateSingleContent: build.mutation<{ queued: boolean }, { courseId: string; order: number }>({
      query: ({ courseId, order }) => ({ url: `/courses/${courseId}/content/${order}`, method: "POST" }),
    }),
    getContentStatus: build.query<{ statuses: ContentStatusItem[] }, string>({
      query: (id) => `/courses/${id}/content/status`,
      providesTags: (_, __, id) => [{ type: "Course" as const, id }],
    }),
    getSubtopicContent: build.query<{ content: SubtopicContent; subtopic: SubTopic }, { courseId: string; order: number }>({
      query: ({ courseId, order }) => `/courses/${courseId}/content/${order}`,
    }),
    updateSubtopicContent: build.mutation<{ ok: boolean }, { courseId: string; order: number; content: SubtopicContent }>({
      query: ({ courseId, order, content }) => ({
        url: `/courses/${courseId}/content/${order}`,
        method: "PUT",
        body: { content },
      }),
    }),
    chatSubtopic: build.mutation<
      { reply: string },
      { courseId: string; order: number; message: string; history: { role: "user" | "model"; content: string }[] }
    >({
      query: ({ courseId, order, message, history }) => ({
        url: `/courses/${courseId}/content/${order}/chat`,
        method: "POST",
        body: { message, history },
      }),
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseQuery,
  usePresignUploadMutation,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGenerateSubtopicsMutation,
  useGetSubtopicsTaskStatusQuery,
  useSaveSubtopicsMutation,
  useGenerateContentMutation,
  useGenerateSingleContentMutation,
  useGetContentStatusQuery,
  useGetSubtopicContentQuery,
  useUpdateSubtopicContentMutation,
  useChatSubtopicMutation,
} = coursesApi;
