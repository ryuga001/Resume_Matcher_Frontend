"use client";

import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import {
  FileText,
  GraduationCap,
  History,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Settings,
  Sparkles,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { gsap } from "gsap";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const NAV = [
  { href: "/dashboard", label: "Dashboard",   icon: LayoutDashboard },
  { href: "/resumes",   label: "Resumes",      icon: FileText },
  { href: "/analyze",   label: "Intelligence", icon: Sparkles },
  { href: "/learn",     label: "Academy",      icon: GraduationCap },
  { href: "/history",   label: "History",      icon: History },
  { href: "/settings",  label: "Settings",     icon: Settings },
];

/* ── Top navigation bar ────────────────────────────────────────── */
function TopNav({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header
      className="h-12 shrink-0 flex items-center justify-between px-4 border-b bg-white z-30"
      style={{ borderColor: "#ede8e3" }}
    >
      {/* Left — hamburger (mobile) + logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden shrink-0 transition-colors"
          style={{ color: "#6e6862" }}
        >
          <Menu className="size-5" />
        </button>
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="font-heading text-lg font-bold" style={{ color: "#c2652a" }}>Sahara</span>
          <span
            className="hidden sm:block text-[9px] font-bold uppercase tracking-[0.14em]"
            style={{ color: "#b89e94" }}
          >
            Career Intelligence
          </span>
        </Link>
      </div>

      {/* Right — user avatar + hover dropdown */}
      <div
        className="relative"
        onMouseEnter={() => setDropdownOpen(true)}
        onMouseLeave={() => setDropdownOpen(false)}
      >
        <button
          className="size-8 rounded-full flex items-center justify-center text-white text-sm font-bold select-none"
          style={{ background: "#c2652a" }}
        >
          {user?.name?.charAt(0).toUpperCase() ?? "?"}
        </button>

        {dropdownOpen && (
          <div
            className="absolute right-0 top-full mt-1 w-44 rounded-lg bg-white border shadow-lg py-1"
            style={{ borderColor: "#e4dcd6", boxShadow: "0 4px 16px rgba(58,48,42,0.10)" }}
          >
            <div className="px-4 py-2 border-b" style={{ borderColor: "#f0e8e2" }}>
              <p className="text-sm font-semibold truncate" style={{ color: "#2a2826" }}>{user?.name}</p>
              <p className="text-[10px] truncate" style={{ color: "#9e8e84" }}>{user?.email}</p>
            </div>
            <Link
              href="/settings"
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-stone-50"
              style={{ color: "#2a2826" }}
            >
              <User className="size-3.5" style={{ color: "#9e8e84" }} />
              Profile
            </Link>
            <button
              onClick={logout}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-red-50"
              style={{ color: "#dc2626" }}
            >
              <LogOut className="size-3.5" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

/* ── Sidebar ───────────────────────────────────────────────────── */
function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const links = Array.from(nav.querySelectorAll("a"));

    const handlers = links.map((el) => {
      const enter = () => gsap.to(el, { scale: 1.02, duration: 0.15, ease: "power1.out" });
      const leave = () => gsap.to(el, { scale: 1,    duration: 0.15, ease: "power1.out" });
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
      return { el, enter, leave };
    });

    return () => {
      handlers.forEach(({ el, enter, leave }) => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Nav links */}
      <nav ref={navRef} className="flex-1 px-3 pt-4 pb-2 flex flex-col gap-0.5 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all",
                active ? "font-semibold" : "hover:bg-stone-50"
              )}
              style={
                active
                  ? { color: "#c2652a", background: "rgba(194,101,42,0.06)", borderLeft: "3px solid #c2652a", paddingLeft: "calc(0.75rem - 1px)" }
                  : { color: "#6e6862" }
              }
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Pro upgrade */}
      <div className="mx-3 mb-4 rounded-md p-4 shrink-0" style={{ background: "#f7f5f3" }}>
        <p className="text-[9px] font-bold uppercase tracking-[0.14em] mb-1.5" style={{ color: "#c2652a" }}>
          Unlock Pro
        </p>
        <p className="text-xs leading-relaxed mb-3" style={{ color: "#6e6862" }}>
          Deep-scan every role. Unlimited analyses, priority AI.
        </p>
        <button
          className="w-full h-8 rounded text-xs font-bold text-white transition-all hover:opacity-90 active:scale-[0.97]"
          style={{ background: "#c2652a" }}
        >
          Upgrade to Pro
        </button>
      </div>
    </div>
  );
}

/* ── App layout ────────────────────────────────────────────────── */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setMobileOpen(false); }, [pathname]);
  useEffect(() => { if (!isLoading && !user) router.replace("/login"); }, [user, isLoading, router]);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#f7f5f3" }}>
        <Loader2 className="size-5 animate-spin" style={{ color: "#c2652a" }} />
      </div>
    );
  }
  if (!user) return null;

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: "#f7f5f3" }}>
      {/* Top navbar — full width */}
      <TopNav onMenuClick={() => setMobileOpen((v) => !v)} />

      {/* Body row */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <aside
          className="hidden md:flex w-[220px] shrink-0 flex-col border-r"
          style={{ borderColor: "#ede8e3", background: "#ffffff" }}
        >
          <Sidebar />
        </aside>

        {/* Mobile overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/30 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Mobile sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-[220px] flex flex-col border-r transition-transform duration-200 md:hidden",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
          style={{ borderColor: "#ede8e3", top: "48px" }}
        >
          <div
            className="flex items-center justify-between px-4 h-10 border-b shrink-0"
            style={{ borderColor: "#ede8e3" }}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: "#9e8e84" }}>
              Navigation
            </span>
            <button onClick={() => setMobileOpen(false)} style={{ color: "#6e6862" }}>
              <X className="size-4" />
            </button>
          </div>
          <Sidebar onClose={() => setMobileOpen(false)} />
        </aside>

        {/* Main content — only this scrolls */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
