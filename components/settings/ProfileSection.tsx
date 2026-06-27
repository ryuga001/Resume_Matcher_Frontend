"use client";

import { User, Loader2 } from "lucide-react";
import { INPUT_CLASS, INPUT_STYLE, SECTION_CARD_STYLE } from "@/components/settings/constants";

interface ProfileSectionProps {
  user: { name: string; email: string } | null;
  name: string;
  setName: (v: string) => void;
  nameLoading: boolean;
  nameSaved: boolean;
  onSave: (e: React.FormEvent) => void;
}

function onFocus(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = "#c2652a";
  e.currentTarget.style.boxShadow = "0 0 0 2px rgba(194,101,42,0.12)";
}

function onBlur(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = "#d8d0c8";
  e.currentTarget.style.boxShadow = "none";
}

export function ProfileSection({ user, name, setName, nameLoading, nameSaved, onSave }: ProfileSectionProps) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-3">
        <User className="size-5" style={{ color: "#c2652a" }} strokeWidth={1.8} />
        <h3 className="font-heading text-2xl font-bold" style={{ color: "#2a2826" }}>Profile</h3>
      </div>
      <div className="bg-white rounded-xl p-6 border" style={SECTION_CARD_STYLE}>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center border-2 text-white text-3xl font-bold font-heading"
              style={{ borderColor: "#fbe8d8", background: "#c2652a" }}
            >
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <button className="text-xs font-semibold hover:underline" style={{ color: "#c2652a" }}>Change Photo</button>
          </div>
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
              <label className="block text-[10px] font-bold uppercase tracking-[0.14em] mb-2" style={{ color: "#605850" }}>Display Name</label>
              <form onSubmit={onSave} className="flex gap-3">
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className={INPUT_CLASS}
                  style={INPUT_STYLE}
                  onFocus={onFocus}
                  onBlur={onBlur}
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
  );
}
