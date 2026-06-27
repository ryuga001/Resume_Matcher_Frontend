import { RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ResumeRow } from "@/components/resumes/ResumeRow";
import type { Resume } from "@/components/resumes/types";

type Props = {
  resumes: Resume[];
  loading: boolean;
  expanded: string | null;
  deleteId: string | null;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export function ResumeLibrary({
  resumes,
  loading,
  expanded,
  deleteId,
  onToggle,
  onDelete,
}: Props) {
  if (loading) {
    return (
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: "#9e8e84" }}>Your library</p>
        <div className="bg-white border rounded-xl divide-y overflow-hidden" style={{ borderColor: "rgba(212,200,192,0.5)", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3">
              <Skeleton className="size-8 rounded-lg" />
              <div className="flex-1">
                <Skeleton className="h-4 w-48 mb-1.5" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (resumes.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: "#9e8e84" }}>Your library ({resumes.length})</p>
        {resumes.some((r) => r.indexStatus === "processing") && (
          <span className="text-xs flex items-center gap-1" style={{ color: "#9e8e84" }}>
            <RefreshCw className="size-3 animate-spin" /> Indexing in progress…
          </span>
        )}
      </div>
      <div className="bg-white border rounded-xl divide-y overflow-hidden" style={{ borderColor: "rgba(212,200,192,0.5)", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        {resumes.map((r) => (
          <ResumeRow
            key={r.resumeId}
            resume={r}
            expanded={expanded}
            deleteId={deleteId}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
