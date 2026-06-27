export const COLORS = {
  primary:      "#c2652a",
  primaryLight: "rgba(194,101,42,0.10)",
  primaryGlow:  "rgba(194,101,42,0.12)",
  primaryShadow:"rgba(194,101,42,0.25)",
  text:         "#2a2826",
  textMuted:    "#6e6862",
  textFaint:    "#9e8e84",
  border:       "#e4dcd6",
  borderMuted:  "rgba(212,200,192,0.5)",
  borderFaint:  "rgba(212,200,192,0.4)",
  bg:           "#fdfcfb",
  bgTrack:      "#ece6dc",
  bgSurface:    "#f2ece4",
  bgInput:      "#f0e8e2",
  scoreGood:    "#2d8a4e",
  scoreOk:      "#c2652a",
  scoreBad:     "#b3261e",
  skillMatch:   { bg: "#e8f5e9", color: "#2e7d32" },
  skillMissing: { bg: "#fce4e0", color: "#8c3c3c" },
  scoreBadge: {
    good:    { bg: "#e8f5e9", color: "#2e7d32" },
    ok:      { bg: "#fff3e0", color: "#e65100" },
    bad:     { bg: "#fce4e0", color: "#8c3c3c" },
  },
} as const;

export const SCORE_THRESHOLDS = {
  good:    70,
  partial: 50,
} as const;
