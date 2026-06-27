import { baseApi } from "./baseApi";

export type AnalysisResult = {
  atsScore:        number;
  matchingSkills:  string[];
  missingSkills:   string[];
  recommendations: string[];
  summary:         string;
};

export type HistoryItem = {
  id:             string;
  resumeId:       string;
  resumeName:     string;
  jobDescription: string;
  atsScore:       number;
  createdAt:      string;
};

export type AnalysisDetail = {
  id:              string;
  resumeName:      string;
  jobDescription:  string;
  atsScore:        number;
  matchingSkills:  string[];
  missingSkills:   string[];
  recommendations: string[];
  summary:         string;
  createdAt:       string;
};

export const analysisApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    runAnalysis: build.mutation<AnalysisResult, { resumeId: string; jobDescription: string }>({
      query: (body) => ({ url: "/analysis", method: "POST", body }),
      invalidatesTags: ["Analysis"],
    }),
    getHistory: build.query<HistoryItem[], void>({
      query: () => "/analysis/history",
      providesTags: ["Analysis"],
    }),
    getAnalysisDetail: build.query<AnalysisDetail, string>({
      query: (id) => `/analysis/${id}`,
    }),
  }),
});

export const {
  useRunAnalysisMutation,
  useGetHistoryQuery,
  useGetAnalysisDetailQuery,
} = analysisApi;
