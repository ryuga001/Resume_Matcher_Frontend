import Link from "next/link";
import { AuthStatStrip } from "@/components/auth/shared/AuthStatStrip";

interface AuthLeftPanelProps {
  children: React.ReactNode;
}

export function AuthLeftPanel({ children }: AuthLeftPanelProps) {
  return (
    <div
      className="hidden lg:flex flex-col justify-between w-[55%] shrink-0 px-14 py-10"
      style={{ backgroundColor: "#f5ede4" }}
    >
      <Link href="/" className="font-heading text-xl font-bold" style={{ color: "#c2652a" }}>
        Sahara
      </Link>
      {children}
      <AuthStatStrip />
    </div>
  );
}
