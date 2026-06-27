import { cn } from "@/lib/utils";

type SkillVariant = "match" | "miss";

type SkillsGridProps = {
  matchingSkills: string[];
  missingSkills: string[];
};

const SKILL_CONFIG: { title: string; variant: SkillVariant; key: keyof SkillsGridProps }[] = [
  { title: "Matching skills", variant: "match", key: "matchingSkills" },
  { title: "Missing skills",  variant: "miss",  key: "missingSkills"  },
];

function SkillCard({ title, skills, variant }: { title: string; skills: string[]; variant: SkillVariant }) {
  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className={cn(
          "size-2 rounded-full shrink-0",
          variant === "match" ? "bg-[oklch(0.52_0.17_145)]" : "bg-destructive"
        )} />
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{title}</p>
        <span className="text-xs text-muted-foreground ml-auto">{skills.length}</span>
      </div>
      {skills.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">None identified</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {skills.map((s) => (
            <span
              key={s}
              className={cn(
                "text-xs font-mono px-2 py-0.5 rounded font-medium",
                variant === "match"
                  ? "bg-[oklch(0.52_0.17_145/0.10)] text-[oklch(0.38_0.16_145)]"
                  : "bg-destructive/8 text-destructive"
              )}
            >
              {s}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function SkillsGrid({ matchingSkills, missingSkills }: SkillsGridProps) {
  const skillsMap = { matchingSkills, missingSkills };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {SKILL_CONFIG.map(({ title, variant, key }) => (
        <SkillCard key={title} title={title} skills={skillsMap[key] ?? []} variant={variant} />
      ))}
    </div>
  );
}
