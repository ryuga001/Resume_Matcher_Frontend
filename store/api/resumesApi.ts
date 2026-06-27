import { baseApi } from "./baseApi";

export type Resume = {
  resumeId:    string;
  fileName:    string;
  uploadedAt:  string | null;
  indexStatus: "processing" | "ready" | "error";
  skills:      string[];
};

export const resumesApi = baseApi.injectEndpoints({
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
  }),
});

export const {
  useGetResumesQuery,
  useUploadResumeMutation,
  useDeleteResumeMutation,
} = resumesApi;
