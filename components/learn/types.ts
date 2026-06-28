export type CourseStatus = "Not Available" | "Available";

export type Course = {
  id: string;
  topic: string;
  categories: string[];
  status: CourseStatus;
  thumbnailUrl: string;
  sourceFileUrl: string;
  createdAt: string;
  updatedAt: string;
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
