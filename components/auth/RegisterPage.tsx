"use client";
import Link from "next/link";
import { Check, Loader2 } from "lucide-react";
import { useRegister } from "@/components/auth/hooks/useRegister";
import { REGISTER_PERKS } from "@/components/auth/constants";
import { AuthLeftPanel } from "@/components/auth/shared/AuthLeftPanel";
import { AuthRightPanel } from "@/components/auth/shared/AuthRightPanel";
import { AuthInput } from "@/components/auth/shared/AuthInput";
import { AuthDivider } from "@/components/auth/shared/AuthDivider";
import { SocialButtons } from "@/components/auth/shared/SocialButtons";

export function RegisterPage() {
  const { name, setName, email, setEmail, password, setPassword, showPw, setShowPw, error, loading, handleSubmit } = useRegister();

  return (
    <div className="min-h-screen flex">
      <AuthLeftPanel>
        <div className="max-w-[480px]">
          <h1 className="font-heading text-5xl font-bold leading-[1.12]" style={{ color: "#2a2826" }}>
            Land the role{" "}
            <span className="italic" style={{ color: "#c2652a" }}>you</span>{" "}
            actually{" "}
            <span className="italic" style={{ color: "#c2652a" }}>deserve.</span>
          </h1>
          <p className="mt-5 text-base leading-relaxed" style={{ color: "#6e6862" }}>
            Sahara shows you exactly what recruiters scan for — so you can close the gap before you hit send.
          </p>
          <ul className="mt-8 flex flex-col gap-3">
            {REGISTER_PERKS.map(p => (
              <li key={p} className="flex items-center gap-3 text-sm" style={{ color: "#4a3728" }}>
                <span
                  className="size-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "rgba(194,101,42,0.12)" }}
                >
                  <Check className="size-3" style={{ color: "#c2652a" }} strokeWidth={2.5} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </AuthLeftPanel>

      <AuthRightPanel>
        <div className="text-center mb-7">
          <h2 className="font-heading text-[2.2rem] font-bold leading-tight" style={{ color: "#2a2826" }}>Create account.</h2>
          <p className="text-sm mt-1.5" style={{ color: "#6e6862" }}>Free to start — no credit card required.</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <AuthInput
            label="Full Name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Alex Johnson"
            required
            autoFocus
          />
          <AuthInput
            label="Email Address"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="name@company.com"
            required
          />
          <AuthInput
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Min. 8 characters"
            required
            minLength={8}
            showToggle
            showPw={showPw}
            onToggleShow={() => setShowPw(v => !v)}
          />
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
            Create Account
          </button>
        </form>
        <AuthDivider />
        <SocialButtons />
        <p className="text-center text-sm mt-6" style={{ color: "#6e6862" }}>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold hover:underline" style={{ color: "#c2652a" }}>
            Sign in
          </Link>
        </p>
      </AuthRightPanel>
    </div>
  );
}
