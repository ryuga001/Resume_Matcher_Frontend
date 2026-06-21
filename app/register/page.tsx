"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Zap, Check } from "lucide-react";

const FEATURES = [
  "Upload unlimited resumes",
  "AI-powered ATS scoring",
  "Full match history",
  "Skill gap analysis",
];

export default function RegisterPage() {
  const [name, setName] = useState("");
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
      const data = await api.auth.register(name, email, password);
      login(data.token, data.user);
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex auth-grid">
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 bg-primary text-primary-foreground p-10">
        <div className="flex items-center gap-2.5">
          <Zap className="size-5 fill-current" />
          <span className="font-heading text-lg font-semibold tracking-tight">MatchKit</span>
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-sm opacity-60 uppercase tracking-widest font-semibold">What you get</p>
          <ul className="flex flex-col gap-3">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm">
                <Check className="size-4 opacity-70 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs opacity-40">Free to start · No credit card required</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <Zap className="size-4 text-primary" />
            <span className="font-heading text-base font-semibold">MatchKit</span>
          </div>

          <h1 className="font-heading text-2xl font-bold tracking-tight mb-1">Create your account</h1>
          <p className="text-sm text-muted-foreground mb-8">Free to start. No credit card needed.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Full name
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Johnson"
                required
                autoFocus
              />
            </div>

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
                placeholder="Min. 8 characters"
                required
                minLength={8}
              />
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/8 rounded-md px-3 py-2">{error}</p>
            )}

            <Button type="submit" disabled={loading} className="w-full mt-1">
              {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
              Create account
            </Button>
          </form>

          <p className="text-sm text-muted-foreground mt-6 text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-foreground font-medium underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
