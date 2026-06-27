"use client";

import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import {
  FileText,
  History,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Settings,
  Sparkles,
  X
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/dashboard",  label: "Dashboard",     icon: LayoutDashboard },
  { href: "/resumes",    label: "Resumes",        icon: FileText },
  { href: "/analyze",    label: "Intelligence",   icon: Sparkles },
  { href: "/history",    label: "History",     icon: History },
  { href: "/settings",   label: "Settings",       icon: Settings },
];

function Sidebar({ onClose }: { onClose?: () => void }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full" style={{ background: "#ffffff" }}>
      {/* Logo */}
      <div className="px-6 pt-7 pb-5 shrink-0">
        <Link href="/dashboard" onClick={onClose}>
          <span className="font-heading text-xl font-bold" style={{ color: "#c2652a" }}>Sahara</span>
        </Link>
        <p className="text-[9px] font-bold uppercase tracking-[0.14em] mt-0.5" style={{ color: "#b89e94" }}>
          Premium Career Intelligence
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 flex flex-col gap-0.5 overflow-y-auto">
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
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all relative",
                active
                  ? "font-semibold"
                  : "hover:bg-stone-50"
              )}
              style={active
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
      <div className="mx-3 mb-3 rounded-xl p-4 shrink-0" style={{ background: "#f5ede4" }}>
        <p className="text-[9px] font-bold uppercase tracking-[0.14em] mb-1.5" style={{ color: "#c2652a" }}>
          Pro Access
        </p>
        <p className="text-xs leading-relaxed mb-3" style={{ color: "#6e6862" }}>
          Unlock advanced ATS deep-scans.
        </p>
        <button
          className="w-full h-8 rounded-lg text-xs font-bold text-white transition-all hover:opacity-90 active:scale-[0.97]"
          style={{ background: "#c2652a" }}
        >
          Upgrade to Pro
        </button>
      </div>

      {/* User + Sign out */}
      <div className="px-4 py-3 border-t shrink-0" style={{ borderColor: "#f0e8e2" }}>
        <div className="flex items-center gap-3">
          <div
            className="size-9 rounded-full flex items-center justify-center shrink-0 text-white text-sm font-bold"
            style={{ background: "#c2652a" }}
          >
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate" style={{ color: "#2a2826" }}>{user?.name}</p>
            <p className="text-[10px]" style={{ color: "#9e8e84" }}>Free Tier</p>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            className="shrink-0 size-8 flex items-center justify-center rounded-lg transition-colors hover:bg-stone-100"
            style={{ color: "#9e8e84" }}
          >
            <LogOut className="size-4" strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </div>
  );
}

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
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#f5ede4" }}>
        <Loader2 className="size-5 animate-spin" style={{ color: "#c2652a" }} />
      </div>
    );
  }
  if (!user) return null;

  return (
    <div className="h-screen flex overflow-hidden" style={{ background: "#f5ede4" }}>
      {/* Desktop sidebar — fixed height, never scrolls */}
      <aside className="hidden md:flex w-[220px] shrink-0 flex-col border-r h-screen" style={{ borderColor: "#ede8e3", background: "#ffffff" }}>
        <Sidebar />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[220px] flex flex-col border-r transition-transform duration-200 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ borderColor: "#ede8e3" }}
      >
        <Sidebar onClose={() => setMobileOpen(false)} />
      </aside>

      {/* Main — only this column scrolls */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 h-12 border-b bg-white shrink-0 sticky top-0 z-30" style={{ borderColor: "#ede8e3" }}>
          <button
            onClick={() => setMobileOpen(v => !v)}
            className="transition-colors"
            style={{ color: "#6e6862" }}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <span className="font-heading text-base font-bold" style={{ color: "#c2652a" }}>Sahara</span>
        </div>

        {children}
      </main>
    </div>
  );
}
