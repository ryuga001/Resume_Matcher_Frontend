"use client";

import { useRef } from "react";
import { useScrollScene } from "@/components/home/hooks/useScrollScene";

export function SceneCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useScrollScene(ref);

  return (
    <canvas
      ref={ref}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}
