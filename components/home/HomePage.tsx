"use client";

import dynamic from "next/dynamic";
import { HomeNav } from "@/components/home/HomeNav";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { PopularCoursesSection } from "@/components/home/PopularCoursesSection";
import { AiTutorSection } from "@/components/home/AiTutorSection";
import { CtaSection } from "@/components/home/CtaSection";
import { HomeFooter } from "@/components/home/HomeFooter";
import { useHome } from "@/components/home/hooks/useHome";

// The pinned Three.js demo is client-only (WebGL + scroll math).
const WorkflowSection = dynamic(
  () => import("@/components/home/workflow/WorkflowSection").then((m) => m.WorkflowSection),
  { ssr: false }
);

export function HomePage() {
  const { isReady } = useHome();
  if (!isReady) return null;

  return (
    <div className="relative min-h-screen flex flex-col" style={{ background: "#f5ede4" }}>
      <HomeNav />
      <main className="flex-1">
        <HeroSection />
        <WorkflowSection />
        <FeaturesSection />
        <PopularCoursesSection />
        <AiTutorSection />
        <CtaSection />
      </main>
      <HomeFooter />
    </div>
  );
}
