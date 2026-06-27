import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { CTA_PERKS } from "@/components/home/constants";

export function CtaSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 pb-20">
      <div className="bg-primary rounded-xl p-8 sm:p-12 text-center text-primary-foreground">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight mb-3">
          Ready to stop guessing?
        </h2>
        <p className="text-sm opacity-70 mb-8 max-w-sm mx-auto">
          Free to start — 10 analyses included. No credit card required.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild size="lg" variant="secondary">
            <Link href="/register" className="flex items-center gap-2">
              Create free account <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="flex items-center justify-center gap-6 mt-8 opacity-60 text-xs">
          {CTA_PERKS.map(t => (
            <span key={t} className="flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5" /> {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
