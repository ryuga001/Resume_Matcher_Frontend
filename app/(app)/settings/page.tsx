"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/lib/toast";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, User, Lock, Zap } from "lucide-react";

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-lg p-5">
      {children}
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const { user, login } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState(user?.name ?? "");
  const [nameLoading, setNameLoading] = useState(false);

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  const [usesLeft, setUsesLeft] = useState<number | null>(null);
  const [usesLoading, setUsesLoading] = useState(true);

  useEffect(() => {
    api.auth.me()
      .then(d => setUsesLeft(d.usesLeft ?? 0))
      .catch(() => setUsesLeft(null))
      .finally(() => setUsesLoading(false));
  }, []);

  async function saveName(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || name === user?.name) return;
    setNameLoading(true);
    try {
      const res = await api.auth.updateProfile({ name });
      login(res.token, res.user);
      toast("Name updated.", "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to update name.", "error");
    } finally {
      setNameLoading(false);
    }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPw !== confirmPw) { toast("Passwords do not match.", "error"); return; }
    if (newPw.length < 8) { toast("New password must be at least 8 characters.", "error"); return; }
    setPwLoading(true);
    try {
      const res = await api.auth.updateProfile({ currentPassword: currentPw, newPassword: newPw });
      login(res.token, res.user);
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
      toast("Password changed.", "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to change password.", "error");
    } finally {
      setPwLoading(false);
    }
  }

  const tokenPct = usesLeft !== null ? (usesLeft / 10) * 100 : 100;
  const tokenColor = usesLeft === null ? "" : usesLeft > 5 ? "bg-[oklch(0.52_0.17_145)]" : usesLeft > 2 ? "bg-[oklch(0.62_0.17_65)]" : "bg-destructive";

  return (
    <div>
      <div className="page-header">
        <h1 className="font-heading text-xl font-semibold tracking-tight">Account settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your profile and security.</p>
      </div>

      <div className="page-body max-w-xl flex flex-col gap-6">
        {/* Profile */}
        <section>
          <p className="section-label">Profile</p>
          <Panel>
            <div className="flex items-center gap-3 mb-5 pb-5 border-b border-border">
              <div className="size-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-primary-foreground">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <form onSubmit={saveName} className="flex flex-col gap-4">
              <FieldRow label="Display name">
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" />
              </FieldRow>
              <Button type="submit" size="sm" disabled={nameLoading || !name.trim() || name === user?.name} className="self-start">
                {nameLoading && <Loader2 className="size-3.5 animate-spin mr-1.5" />}
                Save name
              </Button>
            </form>
          </Panel>
        </section>

        {/* Security */}
        <section>
          <p className="section-label">Security</p>
          <Panel>
            <div className="flex items-center gap-2 mb-4">
              <Lock className="size-4 text-muted-foreground" />
              <p className="text-sm font-semibold">Change password</p>
            </div>
            <form onSubmit={savePassword} className="flex flex-col gap-4">
              <FieldRow label="Current password">
                <Input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} placeholder="••••••••" required />
              </FieldRow>
              <FieldRow label="New password">
                <Input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Min. 8 characters" required minLength={8} />
              </FieldRow>
              <FieldRow label="Confirm new password">
                <Input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="••••••••" required />
              </FieldRow>
              <Button type="submit" size="sm" disabled={pwLoading || !currentPw || !newPw || !confirmPw} className="self-start">
                {pwLoading && <Loader2 className="size-3.5 animate-spin mr-1.5" />}
                Change password
              </Button>
            </form>
          </Panel>
        </section>

        {/* Plan */}
        <section>
          <p className="section-label">Plan</p>
          <Panel>
            <div className="flex items-start gap-4">
              <div className="size-9 rounded-md bg-muted flex items-center justify-center shrink-0">
                <Zap className="size-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold">Free plan</p>
                  {usesLoading ? (
                    <Skeleton className="h-4 w-20" />
                  ) : usesLeft !== null ? (
                    <span className="text-xs text-muted-foreground font-mono">
                      {usesLeft} / 10 uses left
                    </span>
                  ) : null}
                </div>
                {/* Token bar */}
                <div className="h-1.5 rounded-full bg-muted overflow-hidden mb-3">
                  {usesLoading ? (
                    <div className="h-full w-full bg-muted animate-pulse" />
                  ) : (
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${tokenColor}`}
                      style={{ width: `${tokenPct}%` }}
                    />
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {usesLeft === 0
                    ? "You've used all your free analyses. Upgrade to continue."
                    : usesLeft !== null && usesLeft <= 3
                    ? `Running low — ${usesLeft} analysis${usesLeft === 1 ? "" : "es"} remaining. Upgrade soon.`
                    : "Each analysis uses one credit. Upgrade for unlimited analyses."}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground">License tokens</p>
                <p className="text-xs text-muted-foreground/60 mt-0.5">Shareable 10-use tokens — coming soon</p>
              </div>
              <Button size="sm" variant="outline" disabled>Upgrade</Button>
            </div>
          </Panel>
        </section>
      </div>
    </div>
  );
}
