import { COLORS, SCORE_THRESHOLDS } from "./constants";

export function scoreBadgeStyle(score: number) {
  if (score >= SCORE_THRESHOLDS.good)    return COLORS.scoreBadge.good;
  if (score >= SCORE_THRESHOLDS.partial) return COLORS.scoreBadge.ok;
  return COLORS.scoreBadge.bad;
}

export function scoreColor(score: number): string {
  if (score >= SCORE_THRESHOLDS.good)    return COLORS.scoreGood;
  if (score >= SCORE_THRESHOLDS.partial) return COLORS.scoreOk;
  return COLORS.scoreBad;
}

export function scoreLabel(score: number): string {
  if (score >= SCORE_THRESHOLDS.good)    return "Good match";
  if (score >= SCORE_THRESHOLDS.partial) return "Partial match";
  return "Weak match";
}
