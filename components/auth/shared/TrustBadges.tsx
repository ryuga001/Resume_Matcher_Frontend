import { Shield, Lock } from "lucide-react";

export function TrustBadges() {
  return (
    <div className="flex items-center justify-center gap-7 mt-6">
      <span
        className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em]"
        style={{ color: "#9e8e84" }}
      >
        <Shield className="size-3.5" /> Secure Auth
      </span>
      <span
        className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em]"
        style={{ color: "#9e8e84" }}
      >
        <Lock className="size-3.5" /> End-to-End
      </span>
    </div>
  );
}
