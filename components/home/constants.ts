import { FileText, Sparkles, History, type LucideIcon } from "lucide-react";

export const FEATURES: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: FileText, title: "Upload once, analyze forever", desc: "Keep your PDF library in one place. Reuse any resume across multiple job applications." },
  { icon: Sparkles, title: "Instant ATS score", desc: "Get a 0–100 match score in seconds. Know exactly where you stand before hitting send." },
  { icon: History, title: "Full analysis history", desc: "Every scored match is saved. Review past analyses and track improvement over time." },
];

export const STATS: { value: string; label: string }[] = [
  { value: "2 min", label: "to your first score" },
  { value: "60+", label: "skills detected" },
  { value: "100%", label: "private & tenant-isolated" },
];

export const HOW_IT_WORKS: { step: string; title: string; desc: string }[] = [
  { step: "01", title: "Upload your resume", desc: "Drag and drop any PDF. MatchKit indexes your skills in the background." },
  { step: "02", title: "Paste the job description", desc: "Copy the full JD — responsibilities, requirements, preferred qualifications." },
  { step: "03", title: "Get your score", desc: "See your ATS match score, skill gaps, and concrete recommendations instantly." },
];

export const CTA_PERKS: string[] = ["No credit card", "10 free analyses", "Cancel anytime"];
