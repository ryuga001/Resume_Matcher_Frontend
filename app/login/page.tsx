"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Zap } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

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
    <div className="min-h-screen flex auth-grid">
      {/* Left: brand panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 bg-primary text-primary-foreground p-10">
        <div className="flex items-center gap-2.5">
          <Zap className="size-5 fill-current" />
          <span className="font-heading text-lg font-semibold tracking-tight">MatchKit</span>
        </div>
        <div>
          <blockquote className="font-heading text-2xl leading-snug font-medium mb-4">
            "Know exactly which skills the recruiter is scanning for — before you hit send."
          </blockquote>
          <p className="text-sm opacity-60">ATS intelligence for serious job seekers.</p>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          {[["94%", "avg. score lift"], ["2 min", "to first result"], ["Zero", "guesswork"]].map(
            ([val, label]) => (
              <div key={label}>
                <div className="font-heading text-xl font-bold">{val}</div>
                <div className="opacity-50 text-xs mt-0.5">{label}</div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <Zap className="size-4 text-primary" />
            <span className="font-heading text-base font-semibold">MatchKit</span>
          </div>

          <h1 className="font-heading text-2xl font-bold tracking-tight mb-1">Welcome back</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Sign in to your account to continue.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                autoFocus
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/8 rounded-md px-3 py-2">{error}</p>
            )}

            <Button type="submit" disabled={loading} className="w-full mt-1">
              {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
              Sign in
            </Button>
          </form>

          <p className="text-sm text-muted-foreground mt-6 text-center">
            No account?{" "}
            <Link href="/register" className="text-foreground font-medium underline underline-offset-4">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
