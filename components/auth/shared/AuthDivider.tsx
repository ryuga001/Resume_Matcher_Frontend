export function AuthDivider() {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px" style={{ background: "#e9e4df" }} />
      <span className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: "#9e8e84" }}>
        or continue with
      </span>
      <div className="flex-1 h-px" style={{ background: "#e9e4df" }} />
    </div>
  );
}
