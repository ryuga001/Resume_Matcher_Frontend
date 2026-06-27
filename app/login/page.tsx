"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { Loader2, Eye, EyeOff, Shield, Lock } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const { login } = useAuth();
  const router    = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.auth.login(email, password);
      login(data.token, data.user);
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel ─────────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[55%] shrink-0 px-14 py-10"
        style={{ backgroundColor: "#f5ede4" }}
      >
        {/* Logo */}
        <Link href="/" className="font-heading text-xl font-bold" style={{ color: "#c2652a" }}>
          Sahara
        </Link>

        {/* Headline */}
        <div className="max-w-[480px]">
          <h1 className="font-heading text-5xl font-bold leading-[1.12]" style={{ color: "#2a2826" }}>
            Master the first{" "}
            <span className="italic" style={{ color: "#c2652a" }}>6</span>
            {" "}
            <span className="italic" style={{ color: "#c2652a" }}>seconds</span>
            {" "}of their{" "}
            attention.
          </h1>
          <p className="mt-5 text-base leading-relaxed" style={{ color: "#6e6862" }}>
            Sahara Career Intelligence helps you optimize every touchpoint of your
            professional journey with data-driven insights.
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-10">
          {[["24k+", "Professionals"], ["98%", "Success Rate"]].map(([val, label]) => (
            <div key={label}>
              <div className="font-heading text-2xl font-bold" style={{ color: "#c2652a" }}>{val}</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.12em] mt-1" style={{ color: "#9e8e84" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel ────────────────────────────────── */}
      <div
        className="flex-1 flex items-center justify-center px-6 py-10"
        style={{ backgroundColor: "#fdfcfb", backgroundImage: "radial-gradient(#e8d5c4 1px, transparent 1px)", backgroundSize: "24px 24px" }}
      >
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <Link href="/" className="block lg:hidden font-heading text-lg font-bold mb-8" style={{ color: "#c2652a" }}>
            Sahara
          </Link>

          {/* Card */}
          <div className="bg-white rounded-2xl px-8 py-9" style={{ boxShadow: "0 4px 32px -4px rgba(194,101,42,0.12), 0 1px 4px rgba(0,0,0,0.06)" }}>
            <div className="text-center mb-7">
              <h2 className="font-heading text-[2.2rem] font-bold leading-tight" style={{ color: "#2a2826" }}>
                Welcome back.
              </h2>
              <p className="text-sm mt-1.5" style={{ color: "#6e6862" }}>
                Please enter your details to access your dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: "#6e6862" }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  autoFocus
                  className="w-full h-12 px-4 rounded-xl border text-sm outline-none transition-all"
                  style={{ borderColor: "#e4dcd6", background: "#fff", color: "#2a2826" }}
                  onFocus={e => { e.currentTarget.style.borderColor = "#c2652a"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(194,101,42,0.12)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "#e4dcd6"; e.currentTarget.style.boxShadow = "none"; }}
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: "#6e6862" }}>
                    Password
                  </label>
                  <Link href="#" className="text-xs font-semibold hover:underline" style={{ color: "#c2652a" }}>
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full h-12 px-4 pr-11 rounded-xl border text-sm outline-none transition-all"
                    style={{ borderColor: "#e4dcd6", background: "#fff", color: "#2a2826" }}
                    onFocus={e => { e.currentTarget.style.borderColor = "#c2652a"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(194,101,42,0.12)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = "#e4dcd6"; e.currentTarget.style.boxShadow = "none"; }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: "#9e8e84" }}
                    tabIndex={-1}
                  >
                    {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm rounded-lg px-3 py-2" style={{ color: "#b3261e", background: "rgba(179,38,30,0.07)" }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl text-white text-sm font-bold tracking-wide transition-all hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 mt-1"
                style={{ background: "#c2652a" }}
              >
                {loading && <Loader2 className="size-4 animate-spin" />}
                Sign In
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px" style={{ background: "#e9e4df" }} />
              <span className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: "#9e8e84" }}>
                or continue with
              </span>
              <div className="flex-1 h-px" style={{ background: "#e9e4df" }} />
            </div>

            {/* Social */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="h-11 flex items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition-colors hover:bg-stone-50 active:scale-[0.97]"
                style={{ borderColor: "#e4dcd6", color: "#2a2826" }}
              >
                <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                className="h-11 flex items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition-colors hover:bg-stone-50 active:scale-[0.97]"
                style={{ borderColor: "#e4dcd6", color: "#2a2826" }}
              >
                <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                GitHub
              </button>
            </div>

            <p className="text-center text-sm mt-6" style={{ color: "#6e6862" }}>
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-semibold hover:underline" style={{ color: "#c2652a" }}>
                Sign up for free
              </Link>
            </p>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-7 mt-6">
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: "#9e8e84" }}>
              <Shield className="size-3.5" /> Secure Auth
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: "#9e8e84" }}>
              <Lock className="size-3.5" /> End-to-End
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
