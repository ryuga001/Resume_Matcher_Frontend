# Sahara — Design System

> "Premium Career Intelligence" — warm earth tones, editorial serif headings, clean white cards on a sand background.

---

## 1. Brand

| Token | Value |
|-------|-------|
| Product name | **Sahara** |
| Tagline | Premium Career Intelligence |
| Personality | Warm, confident, editorial — like a premium print magazine applied to SaaS |

---

## 2. Color Palette

All colors used in components must come from `constants.ts` (`COLORS`), never hardcoded inline.

### Core palette

| Name | Hex | Usage |
|------|-----|-------|
| `primary` | `#c2652a` | CTA buttons, active states, brand accent, links |
| `text` | `#2a2826` | All primary text, headings |
| `textMuted` | `#6e6862` | Body copy, descriptions |
| `textFaint` | `#9e8e84` | Labels, timestamps, captions, section headers |
| `border` | `#e4dcd6` | Card borders, dividers, input borders |
| `borderMuted` | `rgba(212,200,192,0.5)` | Softer card borders |
| `borderFaint` | `rgba(212,200,192,0.4)` | Interior dividers (e.g. between list items) |
| `bg` | `#fdfcfb` | Input background |
| `bgTrack` | `#ece6dc` | Progress bar track, gauge background ring |
| `bgSurface` | `#f2ece4` | Tinted surface panels (e.g. CTA banner inside a card) |
| `bgInput` | `#f0e8e2` | Resume card icon background, skeleton loading |
| `primaryLight` | `rgba(194,101,42,0.10)` | Active card background, icon fill on hover |
| `primaryGlow` | `rgba(194,101,42,0.12)` | Blur glow behind icons (loading screen) |
| `primaryShadow` | `rgba(194,101,42,0.25)` | Box shadow on primary CTA buttons |

### App-level background
The app shell background is `#f5ede4` (warm sand). Cards are `#ffffff` against it.

### Score colors

| State | Threshold | Color |
|-------|-----------|-------|
| Good match | score ≥ 70 | `#2d8a4e` (green) |
| Partial match | score ≥ 50 | `#c2652a` (orange/primary) |
| Weak match | score < 50 | `#b3261e` (red) |

Score badges (used in history cards):

| State | Background | Text |
|-------|-----------|------|
| Good | `#e8f5e9` | `#2e7d32` |
| Partial | `#fff3e0` | `#e65100` |
| Weak | `#fce4e0` | `#8c3c3c` |

### Skill badges

| Type | Background | Text |
|------|-----------|------|
| Matching | `#e8f5e9` | `#2e7d32` |
| Missing | `#fce4e0` | `#8c3c3c` |

### CSS variables (from `globals.css`)

The CSS layer uses OKLCH-based shadcn tokens. For component code, prefer the `COLORS` constants. Use CSS vars only in global CSS or Tailwind utility classes.

```css
--background    /* #f8f5f0 warm off-white page bg */
--foreground    /* #1c1a18 near-black text */
--card          /* #ffffff */
--border        /* warm gray */
--primary       /* dark brown — shadcn default, not the brand orange */
--muted-foreground /* medium warm gray */
```

> Note: The shadcn `--primary` CSS var (`#2a2826`) is NOT the brand orange. The brand accent (`#c2652a`) is used directly via `COLORS.primary` in component code.

---

## 3. Typography

| Role | Font | Variable |
|------|------|----------|
| Headings | Playfair Display | `--font-heading` / `font-heading` (Tailwind) |
| Body / UI | Noto Sans | `--font-sans` |
| Code / mono | Geist Mono | `--font-mono` |

### Canonical type scale — use EXACTLY these, no variations

| Class | Role | Usage |
|-------|------|-------|
| `font-heading text-4xl font-bold` | **Page title** | Every page's top-level heading |
| `font-heading text-2xl font-bold` | **Section heading** | Before a section card (with icon) |
| `font-heading text-xl font-semibold` | **Card heading** | Inside a card or panel |
| `text-sm font-bold` | **Emphasized body** | File names, stat sub-labels |
| `text-sm` | **Body** | All descriptive copy |
| `text-xs` | **Meta** | Dates, timestamps, secondary info |
| `text-[10px] font-bold uppercase tracking-[0.14em]` | **Eyebrow / label** | Section labels, form field labels, step indicators |

> **Rule**: Never use `text-5xl`, `text-3xl`, `text-[9px]`, or `tracking-[0.12em]` anywhere. There are no exceptions to the eyebrow format.

---

## 4. Spacing & Formatting System

This section is the authoritative standard. Every component MUST follow these rules.

### Page structure

Every page wrapper — no exceptions:
```tsx
<div className="px-10 py-10 min-h-screen">
  <div className="max-w-5xl mx-auto">  {/* only on content-focused pages */}
```

Page header block (title + subtitle):
```tsx
<header className="mb-8">
  <h1 className="font-heading text-4xl font-bold" style={{ color: COLORS.text }}>Page Title</h1>
  <p className="text-sm mt-1" style={{ color: COLORS.textMuted }}>Subtitle copy.</p>
</header>
```

### Page layout

The app shell uses `h-screen overflow-hidden` on the root wrapper and `overflow-y-auto` on the main column. The sidebar is always fixed-height. Page components must **not** use `min-h-screen` — the parent already handles it.

### Spacing rules

| Slot | Value | Tailwind |
|------|-------|---------|
| Page wrapper padding | 32px all sides | `px-8 py-8` |
| Page title → first section | 24px | `mb-6` |
| Section title → card below it | **12px** | `mb-3` |
| Between major page sections | 24px | `space-y-6` |
| Within a card, between groups | 20px | `space-y-5` or `gap-5` |
| Between form fields | 16px | `space-y-4` |
| Item row content (top+bottom) | **8px** | `py-2` |
| Inline gap (icon → text, etc.) | 12px | `gap-3` |
| Grid column gap | 24px | `gap-6` |
| Small list items | 12px | `gap-3` |

### Card padding

| Context | Padding | Tailwind |
|---------|---------|---------|
| Standard section card | 24px | `p-6` |
| Compact / stat card | 20px | `p-5` |
| Tight embedded panel | 16px | `p-4` |
| Hero card (score/result) | 32px | `p-8` |
| Nav / list item rows | 8px v, 20px h | `py-2 px-5` |

### Section title pattern

Always exactly this structure before a card:
```tsx
<section>
  <div className="flex items-center gap-3 mb-3">
    <IconName className="size-5" style={{ color: COLORS.primary }} strokeWidth={1.8} />
    <h2 className="font-heading text-2xl font-bold" style={{ color: COLORS.text }}>Title</h2>
  </div>
  <div className="bg-white rounded-xl p-8 border" style={CARD_STYLE}>
    {/* content */}
  </div>
</section>
```

---

## 5. Border Radius

One radius per element type — no mixing:

| Element | Token | Value |
|---------|-------|-------|
| **Card** | `rounded-xl` | 14px |
| **Button** | `rounded-lg` | 8px |
| **Input** | `rounded-lg` | 8px |
| **Badge / tag / chip** | `rounded-full` | 9999px |
| **Icon box** | `rounded-xl` | 14px |
| **Loading modal** | `rounded-[32px]` | 32px (only exception) |

> **Rule**: Cards are always `rounded-xl`. Never `rounded-2xl`, `rounded-3xl`, or `rounded-md` for cards.

---

## 6. Shadow System

| Level | Value | Usage |
|-------|-------|-------|
| Subtle | `0 1px 4px rgba(0,0,0,0.05)` | Standard cards |
| Medium | `0 2px 16px rgba(58,48,42,0.04)` | Result view cards |
| Strong | `0 4px 32px rgba(58,48,42,0.07)` | Loading modal |
| CTA | `0 4px 20px rgba(194,101,42,0.25)` | Primary action button |
| Input focus | `0 0 0 3px rgba(194,101,42,0.10)` | Textarea / input focus ring |

---

## 7. Component Patterns

### Card
```tsx
<div
  className="bg-white rounded-xl p-8 border"
  style={{ borderColor: COLORS.borderMuted, boxShadow: "0 2px 16px rgba(58,48,42,0.04)" }}
>
```

### Section eyebrow label
```tsx
<span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: COLORS.textFaint }}>
  Step 1: Select Resume
</span>
```

### Primary button
```tsx
<button
  className="h-14 px-12 rounded-xl text-white font-bold flex items-center gap-3 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
  style={{ background: COLORS.primary, boxShadow: `0 4px 20px ${COLORS.primaryShadow}` }}
>
```

### Secondary button
```tsx
<button
  className="h-10 px-6 rounded-lg text-sm font-bold border hover:bg-stone-50 transition-colors"
  style={{ borderColor: COLORS.border, color: COLORS.text }}
>
```

### Skill / score badge
```tsx
<span className="px-4 py-1.5 rounded-full text-xs font-bold" style={COLORS.skillMatch}>
  {skill}
</span>
```

### Input focus behaviour
```tsx
onFocus={e => {
  e.currentTarget.style.borderColor = COLORS.primary;
  e.currentTarget.style.boxShadow   = `0 0 0 3px ${COLORS.primaryGlow}`;
}}
onBlur={e => {
  e.currentTarget.style.borderColor = COLORS.border;
  e.currentTarget.style.boxShadow   = "none";
}}
```

### Active nav item (sidebar)
```tsx
style={{
  color: COLORS.primary,
  background: "rgba(194,101,42,0.06)",
  borderLeft: "3px solid #c2652a",
  paddingLeft: "calc(0.75rem - 1px)",  // compensates for the border width
}}
```

### Accent divider under page title
```tsx
<div className="h-1 w-16 mt-2 rounded-full" style={{ background: "rgba(194,101,42,0.3)" }} />
```

---

## 8. Animations

Defined as global keyframes in `globals.css`. Use via className — never re-define inline.

| Class | Keyframe | Usage |
|-------|----------|-------|
| `.fade-up` | opacity 0→1, translateY 8px→0, 0.35s | Page section entry |
| `.fade-up-delay-1/2/3` | same + 50/100/150ms delay | Staggered lists |
| `.score-arc-fill` | stroke-dashoffset animation, 1s cubic | Score arc in history detail |

Inline-only animations (defined in `<style>` inside `LoadingView`):

| Name | Usage |
|------|-------|
| `shimmer` | Gradient sweep on progress bar fill |
| `pulse-glow` | Scale + opacity pulse on loading icon glow |
| `icon-pulse` | Opacity pulse on Zap icon |

---

## 9. Layout Shell

### App layout (`(app)/layout.tsx`)
- White sidebar `w-[220px]`, fixed, `border-r` `#ede8e3`
- Page background: `#f5ede4`
- Main content: `flex-1 min-w-0 overflow-auto`
- Mobile: slide-in sidebar + black/30 overlay

### Auth pages
Use the `.auth-grid` CSS class for the dot/line grid background with radial fade.

### Do not use `.page-header` / `.page-body` / `.section-label` CSS classes

These global CSS classes are deprecated. Use inline Tailwind following the spacing rules in section 4 instead.

---

## 10. Icons

Library: **Lucide React** (`lucide-react`).  
Stroke width default: `1.5` for decorative icons, `2` for action icons (buttons).  
Size: `size-4` (nav), `size-5` (card icons), `size-8`+ (empty states), `size-12` (hero loading icon).

---

## 11. Source of Truth

| What | Where |
|------|-------|
| Color tokens | `components/analysis/constants.ts` → `COLORS` |
| Score thresholds | `components/analysis/constants.ts` → `SCORE_THRESHOLDS` |
| Score helpers | `components/analysis/utils.ts` |
| CSS variables + keyframes | `app/globals.css` |
| Fonts | `app/layout.tsx` (Google Fonts via `next/font`) |
