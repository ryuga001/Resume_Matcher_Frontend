"use client";

import { Upload, FileText, X, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  selectedFile: File | null;
  dragging: boolean;
  uploading: boolean;
  onTriggerClick: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onClearFile: () => void;
  onUpload: () => void;
  onCancel: () => void;
  showLabel: boolean;
};

export function UploadZone({
  selectedFile,
  dragging,
  uploading,
  onTriggerClick,
  onDragOver,
  onDragLeave,
  onDrop,
  onClearFile,
  onUpload,
  onCancel,
  showLabel,
}: Props) {
  return (
    <div className="flex flex-col gap-3">
      {showLabel && <p className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: "#9e8e84" }}>Upload your first resume</p>}
      <div
        role="button"
        tabIndex={0}
        onClick={() => !selectedFile && onTriggerClick()}
        onKeyDown={(e) => e.key === "Enter" && !selectedFile && onTriggerClick()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "flex flex-col items-center justify-center gap-2.5 rounded-lg border-2 border-dashed p-10 transition-colors",
          dragging
            ? "border-primary bg-muted cursor-copy"
            : selectedFile
            ? "border-primary/30 bg-muted/20 cursor-default"
            : "border-border hover:border-primary/30 hover:bg-muted/20 cursor-pointer"
        )}
      >
        <Upload
          className={cn(
            "size-6",
            selectedFile ? "text-primary/50" : "text-muted-foreground/40"
          )}
        />
        {selectedFile ? (
          <div className="flex items-center gap-2 text-sm">
            <FileText className="size-4 text-muted-foreground shrink-0" />
            <span className="font-medium max-w-xs truncate">{selectedFile.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClearFile();
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center">
            Drag & drop a PDF, or{" "}
            <span className="text-foreground font-medium">browse files</span>
          </p>
        )}
      </div>
      {selectedFile && (
        <div className="flex gap-2">
          <Button onClick={onUpload} disabled={uploading} size="sm">
            {uploading ? (
              <Loader2 className="size-3.5 animate-spin mr-1.5" />
            ) : (
              <Plus className="size-3.5 mr-1.5" />
            )}
            {uploading ? "Uploading…" : "Upload resume"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={uploading}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
