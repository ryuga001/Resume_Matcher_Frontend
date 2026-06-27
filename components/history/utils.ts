export function scoreBlockClasses(score: number): { color: string; bg: string; label: string } {
  const [color, bg] =
    score >= 70
      ? ["text-[oklch(0.38_0.16_145)]", "bg-[oklch(0.52_0.17_145/0.10)]"]
      : score >= 50
      ? ["text-[oklch(0.50_0.16_65)]", "bg-[oklch(0.62_0.17_65/0.10)]"]
      : ["text-destructive", "bg-destructive/10"];

  const label =
    score >= 85 ? "Strong" :
    score >= 70 ? "Good" :
    score >= 50 ? "Partial" :
    score >= 30 ? "Weak" : "Poor";

  return { color, bg, label };
}
