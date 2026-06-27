"use client";

import { useState, useEffect, useRef } from "react";
import { useToast } from "@/lib/toast";
import {
  useGetResumesQuery,
  useUploadResumeMutation,
  useDeleteResumeMutation,
} from "@/store/api/resumesApi";

export function useResumes() {
  const { toast } = useToast();

  // RTK Query — auto-invalidates cache on upload/delete
  const [pollingInterval, setPollingInterval] = useState(0);
  const { data: resumes = [], isLoading: loading } = useGetResumesQuery(
    undefined,
    { pollingInterval },
  );
  const [uploadResume, { isLoading: uploading }] = useUploadResumeMutation();
  const [deleteResumeMutation]                   = useDeleteResumeMutation();

  // Start polling while any resume is still indexing, stop when all done
  useEffect(() => {
    const hasProcessing = resumes.some((r) => r.indexStatus === "processing");
    setPollingInterval(hasProcessing ? 3000 : 0);
  }, [resumes]);

  // UI-only state
  const [dragging,      setDragging]      = useState(false);
  const [selectedFile,  setSelectedFile]  = useState<File | null>(null);
  const [deleteId,      setDeleteId]      = useState<string | null>(null);
  const [expanded,      setExpanded]      = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    if (!f.name.toLowerCase().endsWith(".pdf")) {
      toast("Only PDF files are supported.", "error");
      return;
    }
    setSelectedFile(f);
  }

  async function handleUpload() {
    if (!selectedFile) return;
    const form = new FormData();
    form.append("file", selectedFile);
    try {
      await uploadResume(form).unwrap();
      setSelectedFile(null);
      if (inputRef.current) inputRef.current.value = "";
      toast("Resume uploaded — indexing in background.", "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Upload failed.", "error");
    }
  }

  async function handleDelete(id: string) {
    setDeleteId(id);
    try {
      await deleteResumeMutation(id).unwrap();
      toast("Resume deleted.", "info");
    } catch {
      toast("Failed to delete resume.", "error");
    } finally {
      setDeleteId(null);
    }
  }

  function toggleExpanded(id: string) {
    setExpanded((prev) => (prev === id ? null : id));
  }

  return {
    resumes,
    loading,
    uploading,
    dragging,
    setDragging,
    selectedFile,
    setSelectedFile,
    deleteId,
    expanded,
    inputRef,
    handleFile,
    handleUpload,
    handleDelete,
    toggleExpanded,
  };
}
