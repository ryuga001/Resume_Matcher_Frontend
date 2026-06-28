import { baseApi } from "./baseApi";
import type { Course, CourseStatus } from "@/components/learn/types";

type PresignRequest  = { filename: string; contentType: string; uploadType: "source" | "thumbnail" };
type PresignResponse = { url: string; key: string; fileUrl: string };
type CreateCourseBody = { topic: string; categories: string[]; status: CourseStatus; thumbnailKey: string; sourceFileKey: string };
type UpdateCourseBody = Partial<CreateCourseBody>;
type CourseQuery = { search?: string; category?: string; status?: CourseStatus } | void;

export const coursesApi = baseApi.injectEndpoints({
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
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseQuery,
  usePresignUploadMutation,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = coursesApi;
