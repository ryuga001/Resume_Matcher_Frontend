type JobDescriptionPreviewProps = { jobDescription: string };

export function JobDescriptionPreview({ jobDescription }: JobDescriptionPreviewProps) {
  if (!jobDescription) return null;
  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">Job description (preview)</p>
      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4 whitespace-pre-line">{jobDescription}</p>
    </div>
  );
}
