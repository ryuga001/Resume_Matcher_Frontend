"use client";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useLogin } from "@/components/auth/hooks/useLogin";
import { AuthLeftPanel } from "@/components/auth/shared/AuthLeftPanel";
import { AuthRightPanel } from "@/components/auth/shared/AuthRightPanel";
import { AuthInput } from "@/components/auth/shared/AuthInput";
import { AuthDivider } from "@/components/auth/shared/AuthDivider";
import { SocialButtons } from "@/components/auth/shared/SocialButtons";

export function LoginPage() {
  const { email, setEmail, password, setPassword, showPw, setShowPw, error, loading, handleSubmit } = useLogin();

  return (
    <div className="min-h-screen flex">
      <AuthLeftPanel>
        <div className="max-w-[480px]">
          <h1 className="font-heading text-5xl font-bold leading-[1.12]" style={{ color: "#2a2826" }}>
            Master the first{" "}
            <span className="italic" style={{ color: "#c2652a" }}>6</span>{" "}
            <span className="italic" style={{ color: "#c2652a" }}>seconds</span>{" "}
            of their{" "}attention.
          </h1>
          <p className="mt-5 text-base leading-relaxed" style={{ color: "#6e6862" }}>
            Sahara Career Intelligence helps you optimize every touchpoint of your professional journey with data-driven insights.
          </p>
        </div>
      </AuthLeftPanel>

      <AuthRightPanel>
        <div className="text-center mb-7">
          <h2 className="font-heading text-[2.2rem] font-bold leading-tight" style={{ color: "#2a2826" }}>Welcome back.</h2>
          <p className="text-sm mt-1.5" style={{ color: "#6e6862" }}>Please enter your details to access your dashboard.</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <AuthInput
            label="Email Address"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="name@company.com"
            required
            autoFocus
          />
          <AuthInput
            label="Password"
            labelSuffix={
              <Link href="#" className="text-xs font-semibold hover:underline" style={{ color: "#c2652a" }}>Forgot?</Link>
            }
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            showToggle
            showPw={showPw}
            onToggleShow={() => setShowPw(v => !v)}
          />
          {error && (
            <p className="text-sm rounded px-3 py-2" style={{ color: "#b3261e", background: "rgba(179,38,30,0.07)" }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-md text-white text-sm font-bold tracking-wide transition-all hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 mt-1"
            style={{ background: "#c2652a" }}
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            Sign In
          </button>
        </form>
        <AuthDivider />
        <SocialButtons />
        <p className="text-center text-sm mt-6" style={{ color: "#6e6862" }}>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold hover:underline" style={{ color: "#c2652a" }}>
            Sign up for free
          </Link>
        </p>
      </AuthRightPanel>
    </div>
  );
}
