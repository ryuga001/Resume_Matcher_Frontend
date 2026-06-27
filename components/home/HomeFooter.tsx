import { Zap } from "lucide-react";

export function HomeFooter() {
  return (
    <footer className="border-t border-border py-6">
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="size-3.5 text-primary" />
          <span className="font-heading text-xs font-semibold text-muted-foreground">MatchKit</span>
        </div>
        <p className="text-xs text-muted-foreground">ATS intelligence for serious job seekers.</p>
      </div>
    </footer>
  );
}
