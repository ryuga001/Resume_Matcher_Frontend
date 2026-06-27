export function scoreStatusLabel(s: number): string {
  if (s >= 70) return "Good Match";
  if (s >= 50) return "Needs Optimization";
  if (s >= 30) return "Weak Match";
  return "Critical Needs";
}

export function scoreBarColor(s: number): string {
  if (s >= 70) return "#2d8a4e";
  if (s >= 50) return "#c2652a";
  return "#b3261e";
}

export function scoreBadgeBg(s: number): string {
  if (s >= 70) return "#2d8a4e";
  if (s >= 50) return "#c2652a";
  return "#b3261e";
}
