"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  useGetResumeStructuredQuery,
  useBuildResumeMutation,
  useExportResumePdfMutation,
  useSaveCustomizedResumeMutation,
} from "@/store/api/resumesApi";
import type { StructuredResume, ExperienceEntry, EducationEntry, ProjectEntry } from "@/components/resumes/types";

type BuildContext = {
  recommendations?: string[];
  missingSkills?: string[];
  jobDescription?: string;
};

export function useResumeBuilder(resumeId: string, buildContext?: BuildContext) {
  const router = useRouter();

  // Fetch structured resume
  const { data: original, isLoading: loadingOriginal } = useGetResumeStructuredQuery(resumeId);

  // Local editable copy
  const [draft, setDraft] = useState<StructuredResume | null>(null);
  const current: StructuredResume | null = draft ?? original ?? null;

  // Mutations
  const [buildResume,   { isLoading: building }]  = useBuildResumeMutation();
  const [exportPdf,     { isLoading: exporting }]  = useExportResumePdfMutation();
  const [saveCustomized,{ isLoading: saving }]     = useSaveCustomizedResumeMutation();

  // Status
  const [exportUrl,  setExportUrl]  = useState<string | null>(null);
  const [savedUrl,   setSavedUrl]   = useState<string | null>(null);
  const [error,      setError]      = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // ── Apply AI recommendations ────────────────────────────────────────────────

  const applyRecommendations = useCallback(async () => {
    if (!buildContext) return;
    setError(null);
    try {
      const enhanced = await buildResume({
        resumeId,
        recommendations: buildContext.recommendations ?? [],
        missingSkills:   buildContext.missingSkills   ?? [],
        jobDescription:  buildContext.jobDescription  ?? "",
      }).unwrap();
      setDraft(enhanced);
      setSuccessMsg("Recommendations applied. Review and edit before saving.");
    } catch {
      setError("Failed to apply recommendations. Try again.");
    }
  }, [resumeId, buildContext, buildResume]);

  // ── Export PDF (download link) ──────────────────────────────────────────────

  const handleExport = useCallback(async () => {
    if (!current) return;
    setError(null);
    try {
      const { url } = await exportPdf({ resumeId, data: current }).unwrap();
      setExportUrl(url);
      window.open(url, "_blank");
    } catch {
      setError("Export failed. Try again.");
    }
  }, [resumeId, current, exportPdf]);

  // ── Save to S3 ──────────────────────────────────────────────────────────────

  const handleSave = useCallback(async () => {
    if (!current) return;
    setError(null);
    try {
      const { url } = await saveCustomized({ resumeId, data: current }).unwrap();
      setSavedUrl(url);
      setSuccessMsg("Resume saved! It will appear as 'Updated' in your library.");
    } catch {
      setError("Save failed. Try again.");
    }
  }, [resumeId, current, saveCustomized]);

  // ── Section editors ────────────────────────────────────────────────────────

  const updateContact = useCallback((field: string, value: string) => {
    setDraft((prev) => {
      const base = prev ?? (original as StructuredResume);
      return { ...base, contact: { ...base.contact, [field]: value } };
    });
  }, [original]);

  const updateSummary = useCallback((value: string) => {
    setDraft((prev) => {
      const base = prev ?? (original as StructuredResume);
      return { ...base, summary: value };
    });
  }, [original]);

  const updateExperience = useCallback((entries: ExperienceEntry[]) => {
    setDraft((prev) => {
      const base = prev ?? (original as StructuredResume);
      return { ...base, experience: entries };
    });
  }, [original]);

  const updateEducation = useCallback((entries: EducationEntry[]) => {
    setDraft((prev) => {
      const base = prev ?? (original as StructuredResume);
      return { ...base, education: entries };
    });
  }, [original]);

  const updateSkills = useCallback((skills: string[]) => {
    setDraft((prev) => {
      const base = prev ?? (original as StructuredResume);
      return { ...base, skills };
    });
  }, [original]);

  const updateProjects = useCallback((entries: ProjectEntry[]) => {
    setDraft((prev) => {
      const base = prev ?? (original as StructuredResume);
      return { ...base, projects: entries };
    });
  }, [original]);

  const updateCertifications = useCallback((certs: string[]) => {
    setDraft((prev) => {
      const base = prev ?? (original as StructuredResume);
      return { ...base, certifications: certs };
    });
  }, [original]);

  const resetDraft = useCallback(() => {
    setDraft(null);
    setError(null);
    setSuccessMsg(null);
  }, []);

  return {
    current,
    loadingOriginal,
    building,
    exporting,
    saving,
    exportUrl,
    savedUrl,
    error,
    successMsg,
    applyRecommendations,
    handleExport,
    handleSave,
    updateContact,
    updateSummary,
    updateExperience,
    updateEducation,
    updateSkills,
    updateProjects,
    updateCertifications,
    resetDraft,
    hasChanges: draft !== null,
    back: () => router.push("/resumes"),
  };
}
