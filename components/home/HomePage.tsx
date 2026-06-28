"use client";

import dynamic from "next/dynamic";
import { HomeNav } from "@/components/home/HomeNav";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { CtaSection } from "@/components/home/CtaSection";
import { HomeFooter } from "@/components/home/HomeFooter";
import { useHome } from "@/components/home/hooks/useHome";

const SceneCanvas = dynamic(
  () => import("@/components/home/SceneCanvas").then(m => m.SceneCanvas),
  { ssr: false }
);

export function HomePage() {
  const { isReady } = useHome();
  if (!isReady) return null;

  return (
    <div className="relative min-h-screen flex flex-col" style={{ background: "#f5ede4" }}>
      {/* Fixed 3D scene behind everything */}
      <SceneCanvas />

      {/* Page content sits above the canvas */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <HomeNav />
        <main className="flex-1">
          <HeroSection />
          <FeaturesSection />
          <HowItWorksSection />
          <CtaSection />
        </main>
        <HomeFooter />
      </div>
    </div>
  );
}
