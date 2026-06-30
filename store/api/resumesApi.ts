import { baseApi } from "./baseApi";
import type {
  StructuredResume,
  BuildResumeRequest,
  ExportRequest,
  SaveCustomizedRequest,
} from "@/components/resumes/types";

export type Resume = {
  resumeId:      string;
  fileName:      string;
  uploadedAt:    string | null;
  indexStatus:   "processing" | "ready" | "error";
  skills:        string[];
  hasCustomized: boolean;
};

export const resumesApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getResumes: build.query<Resume[], void>({
      query: () => "/resumes/list",
      providesTags: ["Resume"],
    }),

    uploadResume: build.mutation<{ resumeId: string; fileName: string }, FormData>({
      query: (body) => ({ url: "/resumes/upload", method: "POST", body }),
      invalidatesTags: ["Resume"],
    }),

    deleteResume: build.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/resumes/${id}`, method: "DELETE" }),
      invalidatesTags: ["Resume"],
    }),

    // ── Builder endpoints ──────────────────────────────────────────────────────

    getResumeViewUrl: build.query<{ url: string }, string>({
      query: (id) => `/resumes/${id}/view`,
    }),

    getResumeStructured: build.query<StructuredResume, string>({
      query: (id) => `/resumes/${id}/structured`,
    }),

    buildResume: build.mutation<StructuredResume, BuildResumeRequest>({
      query: ({ resumeId, ...body }) => ({
        url: `/resumes/${resumeId}/build`,
        method: "POST",
        body,
      }),
    }),

    exportResumePdf: build.mutation<{ url: string; key: string }, ExportRequest>({
      query: ({ resumeId, data }) => ({
        url: `/resumes/${resumeId}/export`,
        method: "POST",
        body: { data },
      }),
    }),

    saveCustomizedResume: build.mutation<{ url: string; key: string }, SaveCustomizedRequest>({
      query: ({ resumeId, data }) => ({
        url: `/resumes/${resumeId}/customized`,
        method: "POST",
        body: { data },
      }),
      invalidatesTags: ["Resume"],
    }),

    getCustomizedResumeUrl: build.query<{ url: string }, string>({
      query: (id) => `/resumes/${id}/customized`,
    }),
  }),
});

export const {
  useGetResumesQuery,
  useUploadResumeMutation,
  useDeleteResumeMutation,
  useGetResumeViewUrlQuery,
  useGetResumeStructuredQuery,
  useBuildResumeMutation,
  useExportResumePdfMutation,
  useSaveCustomizedResumeMutation,
  useGetCustomizedResumeUrlQuery,
} = resumesApi;
