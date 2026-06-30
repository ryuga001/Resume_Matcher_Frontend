"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResumes } from "@/components/resumes/hooks/useResumes";
import { UploadZone } from "@/components/resumes/UploadZone";
import { ResumeLibrary } from "@/components/resumes/ResumeLibrary";
import { ResumeViewerModal } from "@/components/resumes/ResumeViewerModal";

export function ResumesPage() {
  const {
    resumes,
    loading,
    uploading,
    dragging,
    setDragging,
    selectedFile,
    setSelectedFile,
    deleteId,
    expanded,
    viewingId,
    setViewingId,
    inputRef,
    handleFile,
    handleUpload,
    handleDelete,
    toggleExpanded,
  } = useResumes();

  const showUploadZone = resumes.length === 0 || !!selectedFile;
  const viewingResume = viewingId ? resumes.find((r) => r.resumeId === viewingId) : null;

  return (
    <div className="px-8 py-8">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold" style={{ color: "#2a2826" }}>Resume Library</h1>
          <p className="text-sm mt-1" style={{ color: "#6e6862" }}>
            Upload and manage your resumes. Select one to run an AI match analysis or build a tailored version.
          </p>
        </div>
        {!loading && resumes.length > 0 && (
          <Button size="sm" onClick={() => inputRef.current?.click()} disabled={uploading} className="mt-2 shrink-0">
            <Plus className="size-3.5 mr-1.5" /> Add
          </Button>
        )}
      </header>

      <div className="flex flex-col gap-6">
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            if (inputRef.current) inputRef.current.value = "";
          }}
        />

        {showUploadZone && (
          <UploadZone
            selectedFile={selectedFile}
            dragging={dragging}
            uploading={uploading}
            onTriggerClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const f = e.dataTransfer.files[0];
              if (f) handleFile(f);
            }}
            onClearFile={() => setSelectedFile(null)}
            onUpload={handleUpload}
            onCancel={() => setSelectedFile(null)}
            showLabel={resumes.length === 0}
          />
        )}

        <ResumeLibrary
          resumes={resumes}
          loading={loading}
          expanded={expanded}
          deleteId={deleteId}
          onToggle={toggleExpanded}
          onDelete={handleDelete}
          onView={(id) => setViewingId(id)}
        />
      </div>

      {viewingResume && (
        <ResumeViewerModal
          resumeId={viewingResume.resumeId}
          fileName={viewingResume.fileName}
          onClose={() => setViewingId(null)}
        />
      )}
    </div>
  );
}
