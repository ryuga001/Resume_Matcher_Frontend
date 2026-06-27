import { AUTH_STATS } from "@/components/auth/constants";

export function AuthStatStrip() {
  return (
    <div className="flex items-center gap-10">
      {AUTH_STATS.map(([val, label]) => (
        <div key={label}>
          <div className="font-heading text-2xl font-bold" style={{ color: "#c2652a" }}>{val}</div>
          <div className="text-[10px] font-bold uppercase tracking-[0.12em] mt-1" style={{ color: "#9e8e84" }}>{label}</div>
        </div>
      ))}
    </div>
  );
}
