import Link from "next/link";
import { RIGHT_PANEL_STYLE } from "@/components/auth/constants";
import { TrustBadges } from "@/components/auth/shared/TrustBadges";

interface AuthRightPanelProps {
  children: React.ReactNode;
}

export function AuthRightPanel({ children }: AuthRightPanelProps) {
  return (
    <div
      className="flex-1 flex items-center justify-center px-6 py-10"
      style={RIGHT_PANEL_STYLE}
    >
      <div className="w-full max-w-[400px]">
        <Link
          href="/"
          className="block lg:hidden font-heading text-lg font-bold mb-8"
          style={{ color: "#c2652a" }}
        >
          Sahara
        </Link>
        <div
          className="bg-white rounded-2xl px-8 py-9"
          style={{ boxShadow: "0 4px 32px -4px rgba(194,101,42,0.12), 0 1px 4px rgba(0,0,0,0.06)" }}
        >
          {children}
        </div>
        <TrustBadges />
      </div>
    </div>
  );
}
