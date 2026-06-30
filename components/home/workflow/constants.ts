// ── Workflow demo — single source of truth for copy, data, palette, timing ──
//
// The pinned canvas walks through the four real product steps. Everything the
// canvas and the DOM captions need lives here so the choreography stays tunable
// in one place.

export const WF_COLORS = {
  sand:       "#f5ede4",
  primary:    "#c2652a",
  primaryDk:  "#a4521f",
  text:       "#2a2826",
  textMuted:  "#6e6862",
  textFaint:  "#9e8e84",
  border:     "#e4dcd6",
  white:      "#ffffff",
  track:      "#ece6dc",
  // score / skill states
  green:      "#2d8a4e",
  greenBg:    "#e8f5e9",
  greenText:  "#2e7d32",
  red:        "#b3261e",
  redBg:      "#fce4e0",
  redText:    "#8c3c3c",
  // line work
  ink:        "#c9bdb2",
} as const;

// rgba helpers kept as strings so the canvas can use them directly
export const WF_RGBA = {
  primary:   (a: number) => `rgba(194,101,42,${a})`,
  text:      (a: number) => `rgba(42,40,38,${a})`,
  green:     (a: number) => `rgba(45,138,78,${a})`,
  red:       (a: number) => `rgba(179,38,30,${a})`,
  white:     (a: number) => `rgba(255,255,255,${a})`,
  ink:       (a: number) => `rgba(201,189,178,${a})`,
} as const;

export type StageKey = "upload" | "jd" | "analyze" | "result" | "tailor";

export interface WorkflowStage {
  key:     StageKey;
  step:    string;   // "01"
  eyebrow: string;   // small label
  title:   string;
  desc:    string;
  /** scroll window for this stage, normalized 0..1 across the pinned scroll */
  start:   number;
  end:     number;
}

// Five equal windows. Cross-fades happen inside WF_TRANSITION of each boundary.
const W5 = 1 / 5;
export const WORKFLOW_STAGES: WorkflowStage[] = [
  {
    key: "upload",
    step: "01",
    eyebrow: "Step one",
    title: "Upload your resume",
    desc: "Drop in any PDF. Sahara reads it and indexes every skill in the background — no formatting required.",
    start: 0 * W5,
    end: 1 * W5,
  },
  {
    key: "jd",
    step: "02",
    eyebrow: "Step two",
    title: "Paste the job description",
    desc: "Drop in the full posting. We parse the must-have skills, responsibilities, and the language recruiters screen for.",
    start: 1 * W5,
    end: 2 * W5,
  },
  {
    key: "analyze",
    step: "03",
    eyebrow: "Step three",
    title: "Watch the match run",
    desc: "Your resume and the role are compared line by line — skills aligned, gaps surfaced, ATS keywords scored.",
    start: 2 * W5,
    end: 3 * W5,
  },
  {
    key: "result",
    step: "04",
    eyebrow: "Step four",
    title: "Get your score & gaps",
    desc: "An instant ATS compatibility score, the skills you already match, and the exact gaps standing between you and the role.",
    start: 3 * W5,
    end: 4 * W5,
  },
  {
    key: "tailor",
    step: "05",
    eyebrow: "Step five",
    title: "Tailor your resume",
    desc: "One click rewrites your resume for this role — closing the gaps, weaving in the missing keywords, and pushing your score higher.",
    start: 4 * W5,
    end: 5 * W5,
  },
];

// width of the cross-fade ramp on each side of a stage boundary (in p units)
export const WF_TRANSITION = 0.075;

// ── Demo data shown inside the illustrations ────────────────────────────────
export const RESUME_SKILLS = ["React", "TypeScript", "Node.js", "Python", "AWS", "Figma"];
export const MATCHED_SKILLS = ["React", "TypeScript", "AWS", "REST APIs"];
export const MISSING_SKILLS = ["Kubernetes", "GraphQL"];
export const FINAL_SCORE = 87;
export const TAILORED_SCORE = 96;

export const RECOMMENDATIONS = [
  "Add Kubernetes to your skills section",
  "Mention GraphQL API experience",
  "Lead with quantified impact metrics",
];

// height of the tall scroll container that drives the pinned demo (in vh)
export const WF_SCROLL_VH = 560;
