export function HomeFooter() {
  return (
    <footer
      className="border-t py-8"
      style={{
        borderColor: "rgba(212,200,192,0.35)",
        background: "rgba(245,237,228,0.80)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="max-w-5xl mx-auto px-8 flex items-center justify-between">
        <span className="font-heading text-sm font-bold" style={{ color: "#c2652a" }}>Sahara</span>
        <p className="text-xs" style={{ color: "#9e8e84" }}>Premium career intelligence. Built for serious job seekers.</p>
      </div>
    </footer>
  );
}
