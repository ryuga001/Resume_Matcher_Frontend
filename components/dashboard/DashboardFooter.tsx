import Link from "next/link";
import { COLORS, FOOTER_LINKS } from "@/components/dashboard/constants";

export function DashboardFooter() {
  return (
    <footer className="px-8 py-6 border-t flex items-center justify-between text-xs" style={{ borderColor: COLORS.borderColor, color: COLORS.textMuted }}>
      <div>
        <span className="font-heading font-semibold text-sm" style={{ color: COLORS.textPrimary }}>Sahara</span>
        <span className="ml-3">© 2024 Sahara Career Intelligence. All rights reserved.</span>
      </div>
      <nav className="flex items-center gap-5">
        {FOOTER_LINKS.map(l => (
          <Link key={l} href="#" className="hover:text-foreground transition-colors">{l}</Link>
        ))}
      </nav>
    </footer>
  );
}
