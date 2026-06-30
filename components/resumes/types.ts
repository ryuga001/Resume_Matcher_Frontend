export type IndexStatus = "processing" | "ready" | "error";

export type Resume = {
  resumeId: string;
  fileName: string;
  uploadedAt: string | null;
  indexStatus: IndexStatus;
  skills: string[];
  hasCustomized: boolean;
};

// ── Structured resume types ────────────────────────────────────────────────────

export type ResumeContact = {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
};

export type ExperienceEntry = {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  bullets: string[];
};

export type EducationEntry = {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
  gpa: string;
};

export type ProjectEntry = {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url: string;
};

export type StructuredResume = {
  contact: ResumeContact;
  summary: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: string[];
  projects: ProjectEntry[];
  certifications: string[];
};

export type BuildResumeRequest = {
  resumeId: string;
  recommendations: string[];
  missingSkills: string[];
  jobDescription: string;
};

export type ExportRequest = {
  resumeId: string;
  data: StructuredResume;
};

export type SaveCustomizedRequest = {
  resumeId: string;
  data: StructuredResume;
};
