"use client";

import { Search, ChevronDown } from "lucide-react";
import { useRef, useState } from "react";
import { COLORS, COURSE_CATEGORIES, COURSE_STATUS_OPTIONS } from "./constants";
import type { CourseStatus } from "./types";

type Props = {
  search: string;
  onSearch: (v: string) => void;
  category: string;
  onCategory: (v: string) => void;
  statusFilter: CourseStatus | "";
  onStatus: (v: CourseStatus | "") => void;
};

export function FilterBar({ search, onSearch, category, onCategory, statusFilter, onStatus }: Props) {
  const [catOpen, setCatOpen] = useState(false);
  const [catSearch, setCatSearch] = useState("");
  const catRef = useRef<HTMLDivElement>(null);

  const filteredCats = COURSE_CATEGORIES.filter((c) =>
    c.toLowerCase().includes(catSearch.toLowerCase()),
  );

  function selectCategory(cat: string) {
    onCategory(cat === category ? "" : cat);
    setCatOpen(false);
    setCatSearch("");
  }

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
      {/* Search */}
      <div className="relative flex-1">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none"
          style={{ color: COLORS.textFaint }}
          strokeWidth={1.8}
        />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search modules…"
          className="w-full pl-9 pr-4 py-2.5 rounded border text-sm bg-white focus:outline-none transition-all"
          style={{ borderColor: COLORS.border, color: COLORS.text }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = COLORS.primary;
            e.currentTarget.style.boxShadow   = `0 0 0 3px ${COLORS.primaryGlow}`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = COLORS.border;
            e.currentTarget.style.boxShadow   = "none";
          }}
        />
      </div>

      {/* Category dropdown */}
      <div className="relative" ref={catRef}>
        <button
          onClick={() => setCatOpen((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5 rounded border bg-white text-sm font-medium transition-colors hover:bg-stone-50 w-full sm:w-52"
          style={{ borderColor: COLORS.border, color: category ? COLORS.primary : COLORS.textMuted }}
        >
          <span className="flex-1 text-left truncate">{category || "All Categories"}</span>
          <ChevronDown className="size-4 shrink-0" strokeWidth={1.8} />
        </button>

        {catOpen && (
          <div
            className="absolute top-full mt-1.5 left-0 w-56 bg-white rounded-md border shadow-md z-20 overflow-hidden"
            style={{ borderColor: COLORS.border }}
          >
            {/* Internal search */}
            <div className="p-2 border-b" style={{ borderColor: COLORS.border }}>
              <input
                autoFocus
                value={catSearch}
                onChange={(e) => setCatSearch(e.target.value)}
                placeholder="Search…"
                className="w-full px-3 py-1.5 text-xs rounded border focus:outline-none"
                style={{ borderColor: COLORS.border }}
              />
            </div>

            {/* Options */}
            <div className="max-h-52 overflow-y-auto py-1">
              <button
                onClick={() => selectCategory("")}
                className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors ${!category ? "font-bold" : "hover:bg-stone-50"}`}
                style={{ color: !category ? COLORS.primary : COLORS.textMuted }}
              >
                All Categories
              </button>
              {filteredCats.map((cat) => (
                <button
                  key={cat}
                  onClick={() => selectCategory(cat)}
                  className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors ${category === cat ? "font-bold" : "hover:bg-stone-50"}`}
                  style={{ color: category === cat ? COLORS.primary : COLORS.textMuted }}
                >
                  {cat}
                </button>
              ))}
              {filteredCats.length === 0 && (
                <p className="px-4 py-3 text-xs" style={{ color: COLORS.textFaint }}>No categories found.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Status filter */}
      <select
        value={statusFilter}
        onChange={(e) => onStatus(e.target.value as CourseStatus | "")}
        className="px-4 py-2.5 rounded border bg-white text-sm focus:outline-none transition-all"
        style={{ borderColor: COLORS.border, color: statusFilter ? COLORS.primary : COLORS.textMuted }}
      >
        <option value="">All Status</option>
        {COURSE_STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </div>
  );
}
