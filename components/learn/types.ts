export type CourseStatus = "Not Available" | "Available";
export type Difficulty   = "Beginner" | "Intermediate" | "Advanced";

export type SubTopic = {
  title:      string;
  difficulty: Difficulty;
  order:      number;
};

export type Course = {
  id:           string;
  topic:        string;
  categories:   string[];
  status:       CourseStatus;
  thumbnailUrl: string;
  sourceFileUrl:string;
  subtopics:    SubTopic[];
  createdAt:    string;
  updatedAt:    string;
};

export type UploadProgress = {
  pct: number;
  status: "idle" | "uploading" | "done" | "error";
};

export type CourseFormState = {
  topic: string;
  categories: string[];
  status: CourseStatus;
  thumbnailFile: File | null;
  sourceFile: File | null;
  thumbnailKey: string;
  sourceFileKey: string;
};
