"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useHistoryDetail } from "@/components/history/detail/hooks/useHistoryDetail";
import { ScoreArc } from "@/components/history/detail/ScoreArc";
import { SkillsGrid } from "@/components/history/detail/SkillsGrid";
import { RecommendationsPanel } from "@/components/history/detail/RecommendationsPanel";
import { JobDescriptionPreview } from "@/components/history/detail/JobDescriptionPreview";

export function HistoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { detail, loading, error } = useHistoryDetail(id);

  return (
    <div className="px-8 py-8">
      <header className="mb-6 flex items-start gap-3">
        <Button variant="ghost" size="icon" asChild className="size-8 shrink-0 mt-1">
          <Link href="/history"><ArrowLeft className="size-4" /></Link>
        </Button>
        <div className="min-w-0">
          <h1 className="font-heading text-2xl font-bold truncate" style={{ color: "#2a2826" }}>
            {loading ? <Skeleton className="h-9 w-64 inline-block" /> : detail?.resumeName ?? "Analysis Result"}
          </h1>
          {detail?.createdAt && (
            <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "#9e8e84" }}>
              <Clock className="size-3" />{new Date(detail.createdAt).toLocaleString()}
            </p>
          )}
        </div>
      </header>

      {loading && (
        <div className="flex flex-col gap-6">
          <Skeleton className="h-32 w-full rounded-md" />
          <div className="grid grid-cols-2 gap-6">
            <Skeleton className="h-40 rounded-md" />
            <Skeleton className="h-40 rounded-md" />
          </div>
        </div>
      )}
      {error && <p className="text-sm" style={{ color: "#b3261e" }}>{error}</p>}
      {detail && (
        <div className="flex flex-col gap-6 fade-up">
          <div className="bg-white border rounded-md p-8" style={{ borderColor: "rgba(212,200,192,0.5)", boxShadow: "none" }}>
            <ScoreArc score={Math.round(detail.atsScore)} />
            {detail.summary && (
              <p className="text-sm leading-relaxed mt-4 sm:ml-[calc(148px+1.25rem)]" style={{ color: "#6e6862" }}>
                {detail.summary}
              </p>
            )}
          </div>
          <SkillsGrid matchingSkills={detail.matchingSkills ?? []} missingSkills={detail.missingSkills ?? []} />
          <RecommendationsPanel recommendations={detail.recommendations ?? []} />
          <JobDescriptionPreview jobDescription={detail.jobDescription} />
          <div className="flex gap-3">
            <Button asChild variant="outline" size="sm">
              <Link href="/analyze" className="flex items-center gap-1.5">
                <Sparkles className="size-3.5" /> Analyze again
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/history" className="flex items-center gap-1.5">
                <ArrowLeft className="size-3.5" /> All history
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
