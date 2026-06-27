import { FEATURES } from "@/components/home/constants";

export function FeaturesSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-10 text-center">
        Everything you need
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-card border border-border rounded-lg p-6">
            <div className="size-9 rounded-md bg-primary/8 flex items-center justify-center mb-4">
              <Icon className="size-4 text-primary" />
            </div>
            <h3 className="font-heading font-semibold text-sm mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
