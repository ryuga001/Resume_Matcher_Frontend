export type Resume = {
  resumeId: string;
  fileName: string;
  uploadedAt: string | null;
  indexStatus: string;
  skills: string[];
};

export type HistoryItem = {
  id: string;
  resumeId: string;
  resumeName: string;
  jobDescription: string;
  atsScore: number;
  createdAt: string;
};

export type Result = {
  atsScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  recommendations: string[];
  summary: string;
};

export type View = "form" | "loading" | "result";
