"use client";

import { ShieldCheck, Loader2 } from "lucide-react";
import { SECTION_CARD_STYLE } from "@/components/settings/constants";
import { SettingsInput } from "@/components/settings/SettingsInput";

interface SecuritySectionProps {
  currentPw: string;
  newPw: string;
  confirmPw: string;
  setCurrentPw: (v: string) => void;
  setNewPw: (v: string) => void;
  setConfirmPw: (v: string) => void;
  pwLoading: boolean;
  onSave: (e: React.FormEvent) => void;
}

export function SecuritySection({
  currentPw, newPw, confirmPw,
  setCurrentPw, setNewPw, setConfirmPw,
  pwLoading, onSave,
}: SecuritySectionProps) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-3">
        <ShieldCheck className="size-5" style={{ color: "#c2652a" }} strokeWidth={1.8} />
        <h3 className="font-heading text-2xl font-bold" style={{ color: "#2a2826" }}>Security</h3>
      </div>
      <div className="bg-white rounded-xl p-6 border" style={SECTION_CARD_STYLE}>
        <form onSubmit={onSave} className="max-w-xl space-y-4">
          <SettingsInput
            label="Current Password"
            type="password"
            value={currentPw}
            onChange={e => setCurrentPw(e.target.value)}
            placeholder="Enter current password"
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SettingsInput
              label="New Password"
              type="password"
              value={newPw}
              onChange={e => setNewPw(e.target.value)}
              placeholder="Min. 8 characters"
              required
              minLength={8}
            />
            <SettingsInput
              label="Confirm New Password"
              type="password"
              value={confirmPw}
              onChange={e => setConfirmPw(e.target.value)}
              placeholder="Re-enter new password"
              required
            />
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
  );
}
