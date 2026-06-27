import { HOW_IT_WORKS } from "@/components/home/constants";

export function HowItWorksSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <div className="bg-card border border-border rounded-xl p-8 sm:p-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-8 text-center">
          How it works
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {HOW_IT_WORKS.map(({ step, title, desc }) => (
            <div key={step} className="flex flex-col gap-3">
              <span className="font-mono text-xs font-bold text-primary/60">{step}</span>
              <h4 className="font-heading font-semibold text-sm">{title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
