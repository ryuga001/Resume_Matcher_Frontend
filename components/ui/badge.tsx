import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "error" | "muted" | "brand";

const styles: Record<BadgeVariant, string> = {
  default: "bg-secondary text-secondary-foreground",
  success: "bg-[oklch(0.55_0.16_145/0.12)] text-[oklch(0.45_0.16_145)] dark:text-[oklch(0.65_0.18_145)]",
  warning: "bg-[oklch(0.7_0.16_55/0.12)] text-[oklch(0.55_0.16_55)] dark:text-[oklch(0.72_0.16_55)]",
  error:   "bg-destructive/10 text-destructive",
  muted:   "bg-muted text-muted-foreground",
  brand:   "bg-[oklch(0.52_0.18_262/0.12)] text-[oklch(0.42_0.18_262)] dark:text-[oklch(0.65_0.2_262)]",
};

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-semibold leading-none tracking-wide",
      styles[variant],
      className
    )}>
      {children}
    </span>
  );
}
