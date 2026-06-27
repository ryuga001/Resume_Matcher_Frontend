export function usageBarColor(usesLeft: number | null): string {
  if (usesLeft === null) return "#c2652a";
  if (usesLeft > 5) return "#c2652a";
  if (usesLeft > 2) return "#e65100";
  return "#b3261e";
}

export function usageHint(usesLeft: number | null, maxUses: number): string {
  if (usesLeft === 0) return "You've used all your free analyses. Upgrade to continue.";
  if (usesLeft !== null && usesLeft <= 3)
    return `Running low — ${usesLeft} analysis${usesLeft === 1 ? "" : "es"} remaining.`;
  return "Your monthly limit resets in 12 days.";
}

export function usedPercent(usesLeft: number | null, maxUses: number): number {
  if (usesLeft === null) return 0;
  return ((maxUses - usesLeft) / maxUses) * 100;
}
