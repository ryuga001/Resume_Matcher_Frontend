import Link from "next/link";
import { FOOTER_LINKS } from "@/components/settings/constants";

export function SettingsFooter() {
  return (
    <footer className="mt-16 pt-8 border-t flex items-center justify-between" style={{ borderColor: "rgba(216,208,200,0.5)" }}>
      <p className="text-xs" style={{ color: "rgba(96,88,80,0.6)" }}>© 2024 Sahara Intelligent Systems. All rights reserved.</p>
      <nav className="flex items-center gap-5">
        {FOOTER_LINKS.map(l => (
          <Link key={l} href="#" className="text-xs hover:underline transition-colors" style={{ color: "rgba(96,88,80,0.6)" }}>{l}</Link>
        ))}
      </nav>
    </footer>
  );
}
