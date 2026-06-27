"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/lib/toast";
import { api } from "@/lib/api";
import { Loader2, User, ShieldCheck, Sparkles } from "lucide-react";

const INPUT = "w-full h-10 px-4 rounded-lg border text-sm outline-none transition-all bg-white";
const inputStyle = { borderColor: "#d8d0c8", color: "#3a302a" };

function inputEvents(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = "#c2652a";
  e.currentTarget.style.boxShadow = "0 0 0 2px rgba(194,101,42,0.12)";
}
function inputBlur(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = "#d8d0c8";
  e.currentTarget.style.boxShadow = "none";
}

export default function SettingsPage() {
  const { user, login } = useAuth();
  const { toast } = useToast();

  const [name, setName]           = useState(user?.name ?? "");
  const [nameLoading, setNameLoading] = useState(false);
  const [nameSaved, setNameSaved] = useState(false);

  const [currentPw, setCurrentPw]   = useState("");
  const [newPw, setNewPw]           = useState("");
  const [confirmPw, setConfirmPw]   = useState("");
  const [pwLoading, setPwLoading]   = useState(false);

  const [usesLeft, setUsesLeft]     = useState<number | null>(null);

  useEffect(() => {
    api.auth.me()
      .then(d => setUsesLeft(d.usesLeft ?? 0))
      .catch(() => setUsesLeft(null));
  }, []);

  async function saveName(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || name === user?.name) return;
    setNameLoading(true);
    try {
      const res = await api.auth.updateProfile({ name });
      login(res.token, res.user);
      setNameSaved(true);
      setTimeout(() => setNameSaved(false), 2000);
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

  const MAX_USES   = 10;
  const usedPct    = usesLeft !== null ? ((MAX_USES - usesLeft) / MAX_USES) * 100 : 0;
  const barColor   = usesLeft === null ? "#c2652a" : usesLeft > 5 ? "#c2652a" : usesLeft > 2 ? "#e65100" : "#b3261e";

  return (
    <div className="px-10 py-10 min-h-screen" style={{ background: "#f9f7f2" }}>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="font-heading text-4xl font-bold" style={{ color: "#3a302a" }}>Settings</h2>
        </div>

        <div className="space-y-10">
          {/* ── Profile ───────────────────────────────────── */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <User className="size-5" style={{ color: "#c2652a" }} strokeWidth={1.8} />
              <h3 className="font-heading text-2xl font-bold" style={{ color: "#3a302a" }}>Profile</h3>
            </div>

            <div
              className="bg-white rounded-xl p-8 border"
              style={{ borderColor: "rgba(216,208,200,0.6)", boxShadow: "0 2px 16px rgba(58,48,42,0.04)" }}
            >
              <div className="flex flex-col md:flex-row gap-8">
                {/* Avatar */}
                <div className="flex flex-col items-center gap-3 shrink-0">
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center border-2 text-white text-3xl font-bold font-heading"
                    style={{ borderColor: "#fbe8d8", background: "#c2652a" }}
                  >
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <button className="text-xs font-semibold hover:underline" style={{ color: "#c2652a" }}>
                    Change Photo
                  </button>
                </div>

                {/* Fields */}
                <div className="flex-1 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-[0.14em] mb-1.5" style={{ color: "#605850" }}>Full Name</label>
                      <p className="text-sm font-medium" style={{ color: "#3a302a" }}>{user?.name}</p>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-[0.14em] mb-1.5" style={{ color: "#605850" }}>Email Address</label>
                      <p className="text-sm font-medium" style={{ color: "#3a302a" }}>{user?.email}</p>
                    </div>
                  </div>

                  <div className="pt-5 border-t" style={{ borderColor: "rgba(216,208,200,0.5)" }}>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.14em] mb-2" style={{ color: "#605850" }}>
                      Display Name
                    </label>
                    <form onSubmit={saveName} className="flex gap-3">
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className={INPUT}
                        style={inputStyle}
                        onFocus={inputEvents}
                        onBlur={inputBlur}
                        placeholder="Your display name"
                      />
                      <button
                        type="submit"
                        disabled={nameLoading || !name.trim() || name === user?.name}
                        className="shrink-0 h-10 px-5 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                        style={{ background: nameSaved ? "#2d8a4e" : "#c2652a", boxShadow: "0 2px 8px rgba(194,101,42,0.20)" }}
                      >
                        {nameLoading && <Loader2 className="size-3.5 animate-spin" />}
                        {nameSaved ? "Saved!" : "Save Name"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Security ──────────────────────────────────── */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <ShieldCheck className="size-5" style={{ color: "#c2652a" }} strokeWidth={1.8} />
              <h3 className="font-heading text-2xl font-bold" style={{ color: "#3a302a" }}>Security</h3>
            </div>

            <div
              className="bg-white rounded-xl p-8 border"
              style={{ borderColor: "rgba(216,208,200,0.6)", boxShadow: "0 2px 16px rgba(58,48,42,0.04)" }}
            >
              <form onSubmit={savePassword} className="max-w-xl space-y-5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.14em] mb-2" style={{ color: "#605850" }}>Current Password</label>
                  <input
                    type="password"
                    value={currentPw}
                    onChange={e => setCurrentPw(e.target.value)}
                    placeholder="Enter current password"
                    required
                    className={INPUT}
                    style={inputStyle}
                    onFocus={inputEvents}
                    onBlur={inputBlur}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.14em] mb-2" style={{ color: "#605850" }}>New Password</label>
                    <input
                      type="password"
                      value={newPw}
                      onChange={e => setNewPw(e.target.value)}
                      placeholder="Min. 8 characters"
                      required
                      minLength={8}
                      className={INPUT}
                      style={inputStyle}
                      onFocus={inputEvents}
                      onBlur={inputBlur}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.14em] mb-2" style={{ color: "#605850" }}>Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPw}
                      onChange={e => setConfirmPw(e.target.value)}
                      placeholder="Re-enter new password"
                      required
                      className={INPUT}
                      style={inputStyle}
                      onFocus={inputEvents}
                      onBlur={inputBlur}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={pwLoading || !currentPw || !newPw || !confirmPw}
                  className="h-10 px-6 rounded-lg text-sm font-semibold border hover:bg-stone-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                  style={{ borderColor: "#c2652a", color: "#c2652a" }}
                >
                  {pwLoading && <Loader2 className="size-3.5 animate-spin" />}
                  Change Password
                </button>
              </form>
            </div>
          </section>

          {/* ── Plan & Billing ────────────────────────────── */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <Sparkles className="size-5" style={{ color: "#c2652a" }} strokeWidth={1.8} />
              <h3 className="font-heading text-2xl font-bold" style={{ color: "#3a302a" }}>Plan &amp; Billing</h3>
            </div>

            <div
              className="bg-white rounded-xl p-8 border"
              style={{ borderColor: "rgba(216,208,200,0.6)", boxShadow: "0 2px 16px rgba(58,48,42,0.04)" }}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                {/* Usage */}
                <div className="flex-1 max-w-md space-y-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-[0.12em]"
                      style={{ background: "#ece6dc", color: "#605850" }}
                    >
                      Current Plan
                    </span>
                    <span className="text-sm font-bold" style={{ color: "#3a302a" }}>Free Plan</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold" style={{ color: "#605850" }}>
                      <span>Usage</span>
                      <span>
                        {usesLeft !== null ? `${usesLeft} / ${MAX_USES} uses left` : "Loading…"}
                      </span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: "#ece6dc" }}>
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${usedPct}%`, background: barColor }}
                      />
                    </div>
                    <p className="text-[11px] italic" style={{ color: "#9a9088" }}>
                      {usesLeft === 0
                        ? "You've used all your free analyses. Upgrade to continue."
                        : usesLeft !== null && usesLeft <= 3
                        ? `Running low — ${usesLeft} analysis${usesLeft === 1 ? "" : "es"} remaining.`
                        : "Your monthly limit resets in 12 days."}
                    </p>
                  </div>
                </div>

                {/* Upgrade card */}
                <div
                  className="shrink-0 text-center p-6 rounded-xl border flex flex-col items-center gap-3 min-w-[200px]"
                  style={{ background: "#f6f0e8", borderColor: "rgba(216,208,200,0.4)" }}
                >
                  <div
                    className="size-12 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(194,101,42,0.12)" }}
                  >
                    <Sparkles className="size-6" style={{ color: "#c2652a" }} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: "#3a302a" }}>Get Sahara Pro</p>
                    <p className="text-xs" style={{ color: "#605850" }}>Unlimited intelligence &amp; history</p>
                  </div>
                  <button
                    className="w-full h-10 rounded-lg text-white text-sm font-bold hover:opacity-90 transition-all mt-1"
                    style={{ background: "#c2652a", boxShadow: "0 2px 8px rgba(194,101,42,0.20)" }}
                  >
                    Upgrade Now
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t flex items-center justify-between" style={{ borderColor: "rgba(216,208,200,0.5)" }}>
          <p className="text-xs" style={{ color: "rgba(96,88,80,0.6)" }}>© 2024 Sahara Intelligent Systems. All rights reserved.</p>
          <nav className="flex items-center gap-5">
            {["Privacy Policy", "Terms of Service", "Support"].map(l => (
              <Link key={l} href="#" className="text-xs hover:underline transition-colors" style={{ color: "rgba(96,88,80,0.6)" }}>
                {l}
              </Link>
            ))}
          </nav>
        </footer>
      </div>
    </div>
  );
}
