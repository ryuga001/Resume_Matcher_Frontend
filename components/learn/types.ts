export type CourseStatus = "Not Available" | "Available";
export type Difficulty   = "Beginner" | "Intermediate" | "Advanced";

export type ContentStatus = "pending" | "generating" | "done" | "error";

export type SubTopic = {
  title:      string;
  difficulty: Difficulty;
  order:      number;
  status:     ContentStatus;
  contentKey: string;
};

// Structured content returned by the API
export type TheorySection = { heading: string; body: string };
export type DiagramSection = { title: string; description: string; mermaid: string };
export type CodeExample    = { title: string; language: string; code: string; explanation: string };
export type QuizQuestion   = { question: string; options: string[]; correct: number; explanation: string };

export type SubtopicContent = {
  overview:      string;
  theory:        TheorySection[];
  diagrams:      DiagramSection[];
  code_examples: CodeExample[];
  key_points:    string[];
  quiz:          QuizQuestion[];
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
