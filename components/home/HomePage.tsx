"use client";

import { useHome } from "@/components/home/hooks/useHome";
import { HomeNav } from "@/components/home/HomeNav";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { CtaSection } from "@/components/home/CtaSection";
import { HomeFooter } from "@/components/home/HomeFooter";

export function HomePage() {
  const { isReady } = useHome();

  if (!isReady) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HomeNav />
      <main className="flex-1">
        <HeroSection />
        <div className="max-w-5xl mx-auto px-6">
          <div className="border-t border-border" />
        </div>
        <FeaturesSection />
        <HowItWorksSection />
        <CtaSection />
      </main>
      <HomeFooter />
    </div>
  );
}
