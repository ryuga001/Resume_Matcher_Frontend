export { COLORS } from "@/components/analysis/constants";

export const COURSE_CATEGORIES = [
  "Engineering",
  "Architecture",
  "Leadership",
  "Management",
  "Communication",
  "Sales",
  "Product",
  "Technology",
  "Psychology",
  "Strategy",
  "Finance",
  "Marketing",
  "Operations",
  "Design",
  "Data Science",
  "Legal",
] as const;

export const COURSE_STATUS_OPTIONS = ["Not Available", "Available"] as const;

export const CARD_STYLE = {
  borderColor: "rgba(212,200,192,0.5)",
  boxShadow: "0 2px 16px rgba(58,48,42,0.04)",
} as const;
