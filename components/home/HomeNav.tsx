import Link from "next/link";

export function HomeNav() {
  return (
    <header
      className="sticky top-0 z-30 border-b backdrop-blur-md"
      style={{ borderColor: "rgba(212,200,192,0.40)", background: "rgba(245,237,228,0.82)" }}
    >
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <div>
          <span className="font-heading text-lg font-bold" style={{ color: "#c2652a" }}>Sahara</span>
          <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-[0.14em] ml-2" style={{ color: "#9e8e84" }}>
            Career Intelligence
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium transition-colors hover:opacity-70"
            style={{ color: "#6e6862" }}
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="h-9 px-5 rounded-lg text-white text-sm font-bold flex items-center transition-all hover:opacity-90 active:scale-[0.97]"
            style={{ background: "#c2652a", boxShadow: "0 2px 10px rgba(194,101,42,0.25)" }}
          >
            Get started free
          </Link>
        </div>
      </div>
    </header>
  );
}
