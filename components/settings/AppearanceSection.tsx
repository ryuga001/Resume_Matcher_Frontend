"use client";

import { Sun, Moon, Palette } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { SECTION_CARD_STYLE } from "@/components/settings/constants";

export function AppearanceSection() {
  const { isDark, set } = useTheme();

  return (
    <section>
      <div className="flex items-center gap-3 mb-3">
        <Palette className="size-5" style={{ color: "#c2652a" }} strokeWidth={1.8} />
        <h3 className="font-heading text-2xl font-bold" style={{ color: "#3a302a" }}>Appearance</h3>
      </div>
      <div className="bg-white rounded-xl p-6 border" style={SECTION_CARD_STYLE}>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-4" style={{ color: "#9e8e84" }}>
          Theme
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => set("light")}
            className="flex items-center gap-2.5 h-10 px-5 rounded-lg border text-sm font-semibold transition-all"
            style={
              !isDark
                ? { background: "rgba(194,101,42,0.08)", borderColor: "#c2652a", color: "#c2652a" }
                : { borderColor: "#d8d0c8", color: "#6e6862" }
            }
          >
            <Sun className="size-4" strokeWidth={1.8} />
            Light
          </button>
          <button
            onClick={() => set("dark")}
            className="flex items-center gap-2.5 h-10 px-5 rounded-lg border text-sm font-semibold transition-all"
            style={
              isDark
                ? { background: "rgba(194,101,42,0.08)", borderColor: "#c2652a", color: "#c2652a" }
                : { borderColor: "#d8d0c8", color: "#6e6862" }
            }
          >
            <Moon className="size-4" strokeWidth={1.8} />
            Dark
          </button>
        </div>
      </div>
    </section>
  );
}
