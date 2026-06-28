"use client";

import { useRef } from "react";
import { useHeroCanvas } from "@/components/home/hooks/useHeroCanvas";

export function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useHeroCanvas(ref);
  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "none" }}
    />
  );
}
