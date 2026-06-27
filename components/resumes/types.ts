export type IndexStatus = "processing" | "ready" | "error";

export type Resume = {
  resumeId: string;
  fileName: string;
  uploadedAt: string | null;
  indexStatus: IndexStatus;
  skills: string[];
};
