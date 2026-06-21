"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Upload, FileText, Trash2, Loader2, Plus, X, Clock, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

type Resume = {
  resumeId: string;
  fileName: string;
  uploadedAt: string | null;
  indexStatus: "processing" | "ready" | "error";
  skills: string[];
};

function IndexBadge({ status }: { status: Resume["indexStatus"] }) {
  if (status === "ready")
    return <Badge variant="success">Ready</Badge>;
  if (status === "processing")
    return <Badge variant="warning" className="gap-1"><Loader2 className="size-2.5 animate-spin" />Indexing…</Badge>;
  return <Badge variant="error">Error</Badge>;
}

export default function ResumesPage() {
  const { toast } = useToast();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadResumes = useCallback(async () => {
    try {
      const data = await api.resumes.list();
      setResumes(data);
      // If any still processing, keep polling
      if (data.some(r => r.indexStatus === "processing")) {
        if (!pollRef.current) {
          pollRef.current = setInterval(async () => {
            const fresh = await api.resumes.list().catch(() => null);
            if (fresh) {
              setResumes(fresh);
              if (!fresh.some(r => r.indexStatus === "processing")) {
                clearInterval(pollRef.current!);
                pollRef.current = null;
              }
            }
          }, 3000);
        }
      }
    } catch {
      toast("Failed to load resumes.", "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { loadResumes(); return () => { if (pollRef.current) clearInterval(pollRef.current); }; }, [loadResumes]);

  function handleFile(f: File) {
    if (!f.name.toLowerCase().endsWith(".pdf")) {
      toast("Only PDF files are supported.", "error");
      return;
    }
    setSelectedFile(f);
  }

  async function handleUpload() {
    if (!selectedFile) return;
    setUploading(true);
    try {
      await api.resumes.upload(selectedFile);
      setSelectedFile(null);
      if (inputRef.current) inputRef.current.value = "";
      toast("Resume uploaded — indexing in background.", "success");
      await loadResumes();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Upload failed.", "error");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    setDeleteId(id);
    try {
      await api.resumes.delete(id);
      setResumes(p => p.filter(r => r.resumeId !== id));
      toast("Resume deleted.", "info");
    } catch {
      toast("Failed to delete resume.", "error");
    } finally {
      setDeleteId(null);
    }
  }

  return (
    <div>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-semibold tracking-tight">Resumes</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Your PDF library. Select a resume when running an analysis.
          </p>
        </div>
        {!loading && resumes.length > 0 && (
          <Button size="sm" onClick={() => inputRef.current?.click()} disabled={uploading}>
            <Plus className="size-3.5 mr-1.5" /> Upload PDF
          </Button>
        )}
      </div>

      <div className="page-body">
        {/* Upload zone — always shown when library empty or file selected */}
        {(resumes.length === 0 || selectedFile) && (
          <div className="flex flex-col gap-3">
            {resumes.length === 0 && <p className="section-label">Upload your first resume</p>}
            <div
              role="button" tabIndex={0}
              onClick={() => !selectedFile && inputRef.current?.click()}
              onKeyDown={e => e.key === "Enter" && !selectedFile && inputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
              className={cn(
                "flex flex-col items-center justify-center gap-2.5 rounded-lg border-2 border-dashed p-10 transition-colors",
                dragging ? "border-primary bg-muted cursor-copy"
                : selectedFile ? "border-primary/30 bg-muted/20 cursor-default"
                : "border-border hover:border-primary/30 hover:bg-muted/20 cursor-pointer"
              )}
            >
              <Upload className={cn("size-6", selectedFile ? "text-primary/50" : "text-muted-foreground/40")} />
              {selectedFile ? (
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="size-4 text-muted-foreground shrink-0" />
                  <span className="font-medium max-w-xs truncate">{selectedFile.name}</span>
                  <button onClick={e => { e.stopPropagation(); setSelectedFile(null); }} className="text-muted-foreground hover:text-foreground">
                    <X className="size-3.5" />
                  </button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center">
                  Drag & drop a PDF, or <span className="text-foreground font-medium">browse files</span>
                </p>
              )}
            </div>
            <input ref={inputRef} type="file" accept="application/pdf" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            {selectedFile && (
              <div className="flex gap-2">
                <Button onClick={handleUpload} disabled={uploading} size="sm">
                  {uploading ? <Loader2 className="size-3.5 animate-spin mr-1.5" /> : <Plus className="size-3.5 mr-1.5" />}
                  {uploading ? "Uploading…" : "Upload resume"}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSelectedFile(null)} disabled={uploading}>Cancel</Button>
              </div>
            )}
          </div>
        )}

        {/* Library */}
        {loading ? (
          <div>
            <p className="section-label">Your library</p>
            <div className="bg-card border border-border rounded-lg divide-y divide-border">
              {[1,2].map(i => (
                <div key={i} className="flex items-center gap-4 px-5 py-4">
                  <Skeleton className="size-8 rounded" />
                  <div className="flex-1"><Skeleton className="h-4 w-48 mb-1.5" /><Skeleton className="h-3 w-24" /></div>
                  <Skeleton className="h-5 w-14 rounded" />
                </div>
              ))}
            </div>
          </div>
        ) : resumes.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="section-label">Your library ({resumes.length})</p>
              {resumes.some(r => r.indexStatus === "processing") && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <RefreshCw className="size-3 animate-spin" /> Indexing in progress…
                </span>
              )}
            </div>
            <div className="bg-card border border-border rounded-lg divide-y divide-border overflow-hidden">
              {resumes.map(r => (
                <div key={r.resumeId}>
                  <div
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/20 transition-colors group cursor-pointer"
                    onClick={() => setExpanded(expanded === r.resumeId ? null : r.resumeId)}
                  >
                    <div className="size-8 rounded bg-muted flex items-center justify-center shrink-0">
                      <FileText className="size-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{r.fileName}</p>
                      {r.uploadedAt && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Clock className="size-3" />{new Date(r.uploadedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <IndexBadge status={r.indexStatus} />
                    <button
                      onClick={e => { e.stopPropagation(); handleDelete(r.resumeId); }}
                      disabled={deleteId === r.resumeId}
                      className="text-muted-foreground/30 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 ml-1"
                    >
                      {deleteId === r.resumeId ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                    </button>
                  </div>
                  {/* Expanded skills */}
                  {expanded === r.resumeId && r.skills.length > 0 && (
                    <div className="px-5 py-3 bg-muted/20 border-t border-border">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Detected skills</p>
                      <div className="flex flex-wrap gap-1.5">
                        {r.skills.map(s => (
                          <span key={s} className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
