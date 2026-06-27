@AGENTS.md
@DESIGN.md

# Frontend Rules

---

## 1. Routing vs Components — hard split

`app/` is **routing only**. A page file must do nothing except import and re-export a component:

```tsx
// app/(app)/some-feature/page.tsx
'use client'
import { SomeFeaturePage } from "@/components/some-feature/SomeFeaturePage";
export default SomeFeaturePage;
```

All logic, layout, and UI live under `components/`.

---

## 2. Component directory structure

Every feature gets its own directory under `components/<feature>/`.

```
components/<feature>/
  types.ts                  ← TS types shared across the feature
  constants.ts              ← design tokens, thresholds, static config
  utils.ts                  ← pure helper functions (no React, no hooks)
  hooks/
    use<Feature>.ts         ← all state + RTK Query hooks + actions
  <SubComponent>.tsx        ← one component per file
  <FeaturePage>.tsx         ← orchestrator: uses hook, composes sub-components
```

### File rules
- **types.ts** — any type used in more than one file in the feature.
- **constants.ts** — no magic hex colors or strings inline in JSX. Import from here.
- **utils.ts** — pure functions only. No React, no hooks, no side effects.
- **hooks/use\<Feature\>.ts** — all data fetching via RTK Query hooks + local UI state. Components stay display-only.
- **One component per file.** Private sub-components used only within the same file are the only exception.
- **`<FeaturePage>.tsx`** — imports the hook, picks the active view, composes sub-components. No `useState` of its own unless it is purely local UI state (e.g. dropdown open/close).

---

## 3. State management — Redux + RTK Query

All global and server state goes through Redux. **Never use `useState + useEffect + fetch` for data that comes from the API.**

### Store layout

```
store/
  index.ts              configureStore
  hooks.ts              useAppDispatch / useAppSelector (typed)
  slices/
    authSlice.ts        user, token, isLoading
    themeSlice.ts       mode: "light" | "dark"
  api/
    baseApi.ts          createApi — auth header injection, 401 handling
    authApi.ts          login, register, getMe, updateProfile
    resumesApi.ts       getResumes, uploadResume, deleteResume
    analysisApi.ts      runAnalysis, getHistory, getAnalysisDetail
```

### RTK Query in feature hooks

Replace all manual `useState + useEffect + api.*` with RTK Query hooks:

```ts
// ✗ old pattern
const [resumes, setResumes] = useState([])
useEffect(() => { api.resumes.list().then(setResumes) }, [])

// ✓ new pattern
const { data: resumes = [], isLoading } = useGetResumesQuery()
```

Mutation pattern:
```ts
const [runAnalysis] = useRunAnalysisMutation()
const data = await runAnalysis({ resumeId, jobDescription }).unwrap()
```

Error shape from RTK Query is `{ data?: { error?: string } }`, not a plain `Error`:
```ts
type RtkError = { data?: { error?: string } }
setError((err as RtkError)?.data?.error ?? "Fallback message.")
```

### Cache invalidation

Tags are declared in `baseApi.ts`: `Resume`, `Analysis`, `Me`.

| API file | providesTags | invalidatesTags |
|----------|-------------|-----------------|
| `resumesApi` | `getResumes` → `['Resume']` | `uploadResume`, `deleteResume` → `['Resume']` |
| `analysisApi` | `getHistory` → `['Analysis']` | `runAnalysis` → `['Analysis']` |
| `authApi` | `getMe` → `['Me']` | `updateProfile` → `['Me']` |

Adding a new endpoint? Add it via `baseApi.injectEndpoints()` in the relevant api file. Never create a second `createApi` call.

### Polling

Use RTK Query's built-in `pollingInterval` option, driven by local state:

```ts
const [pollingInterval, setPollingInterval] = useState(0)
const { data } = useGetResumesQuery(undefined, { pollingInterval })
useEffect(() => {
  setPollingInterval(data?.some(r => r.indexStatus === "processing") ? 3000 : 0)
}, [data])
```

### When to use local `useState`

Only for UI-only state that has no server representation:
- Form field values before submission
- Open/closed toggles, expanded rows
- Progress bar animation state
- `dragging`, `selectedFile`, `deleteId`, `expanded`

---

## 4. Auth — `useAuth()`

Import from `@/lib/auth`. Interface is unchanged from the original context version — all components work without modification.

```ts
const { user, token, isLoading, login, logout } = useAuth()
```

Internally backed by `authSlice`. On mount, `AuthInitializer` (inside `Providers`) hydrates auth from `localStorage`. The 401 redirect is centralised in `baseApi` — do not handle it in individual hooks.

---

## 5. Theme — `useTheme()`

Import from `@/lib/theme`.

```ts
const { mode, isDark, toggle, set } = useTheme()
```

- `mode` — `"light"` | `"dark"`
- `isDark` — boolean shorthand
- `toggle()` — flips between light and dark
- `set("dark")` — sets explicitly

Theme is persisted to `localStorage` (`rm_theme`) and applied as `.dark` on `<html>`. On first load, falls back to `prefers-color-scheme`. `ThemeInitializer` (inside `Providers`) handles hydration.

**To add a theme toggle to any component:**
```tsx
import { useTheme } from "@/lib/theme"

function ThemeButton() {
  const { isDark, toggle } = useTheme()
  return <button onClick={toggle}>{isDark ? "Light" : "Dark"}</button>
}
```

---

## 6. SOLID in components

| Principle | How it applies |
|-----------|---------------|
| **S** — Single responsibility | Each file has one job: types, config, logic, or display. |
| **O** — Open/closed | Extend via props (`type="matching"\|"missing"`) not by editing internals. |
| **L** — Liskov | Sub-components are interchangeable; `ResultView` renders any valid `Result`. |
| **I** — Interface segregation | Props interfaces are narrow — only what the component actually uses. |
| **D** — Dependency inversion | Page components depend on the hook abstraction, not RTK Query hooks directly. |

---

## 7. Reference implementation — Analysis feature

```
components/analysis/
  types.ts                  Resume, HistoryItem, Result, View
  constants.ts              COLORS, SCORE_THRESHOLDS
  utils.ts                  scoreLabel(), scoreColor(), scoreBadgeStyle()
  hooks/
    useAnalysis.ts          useGetResumesQuery + useGetHistoryQuery + useRunAnalysisMutation
                            + local UI state (selectedId, jd, view, progress, result, error)
  ScoreGauge.tsx
  LoadingView.tsx
  SkillsCard.tsx            type="matching"|"missing"
  RecommendationsList.tsx
  ResumeSelector.tsx
  JobDescriptionInput.tsx
  RecentComparisons.tsx
  ResultView.tsx
  AnalyzeForm.tsx
  AnalyzePage.tsx           orchestrator

app/(app)/analyze/page.tsx  ← 2-line shell
```

Follow this pattern for every new feature page.

---

## 8. Formatting & Spacing Rules

These are hard rules. Follow them in every component — no exceptions.

### Page wrapper
Every page: `px-8 py-8`. Never `min-h-screen` on page components — the layout shell (`h-screen overflow-hidden`) handles viewport height. Only the `<main>` column scrolls (`overflow-y-auto`).

### Typography — canonical classes only

| Role | Class |
|------|-------|
| Page title | `font-heading text-4xl font-bold` |
| Section heading (before card) | `font-heading text-2xl font-bold` |
| Card heading | `font-heading text-xl font-semibold` |
| Eyebrow / label | `text-[10px] font-bold uppercase tracking-[0.14em]` |
| Body | `text-sm` |
| Meta | `text-xs` |

Never use `text-5xl`, `text-3xl`, `text-[9px]`, `tracking-[0.12em]`, `font-semibold` on page titles, or `text-xl font-semibold` as a page title.

### Spacing — exact values

| Slot | Tailwind |
|------|---------|
| Page title → content | `mb-6` |
| Section title → card below | `mb-3` ← **12px** |
| Between page sections | `space-y-6` |
| Within card, between groups | `space-y-5` |
| Form field gap | `space-y-4` |
| Item row content padding | `py-2` ← **8px top+bottom** |
| Inline icon/text gap | `gap-3` |
| Grid column gap | `gap-6` |

### Border radius — one per element type

| Element | Class |
|---------|-------|
| Card | `rounded-xl` — `p-6` standard, `p-8` hero only |
| Button | `rounded-lg` |
| Input | `rounded-lg` |
| Badge / chip | `rounded-full` |
| Icon box | `rounded-xl` |

### Section card pattern

```tsx
<section>
  <div className="flex items-center gap-3 mb-3">
    <Icon className="size-5" style={{ color: COLORS.primary }} strokeWidth={1.8} />
    <h2 className="font-heading text-2xl font-bold" style={{ color: COLORS.text }}>Title</h2>
  </div>
  <div className="bg-white rounded-xl p-8 border" style={CARD_STYLE}>
    ...
  </div>
</section>
```

### Deprecated: do not use
- `.page-header`, `.page-body`, `.section-label` CSS classes — use inline Tailwind instead
- Inline hex color values — import from `constants.ts`

---

## 9. Styling conventions

- Colors and spacing come from `constants.ts`, never hardcoded in JSX. See `DESIGN.md` for the full palette.
- Tailwind utility classes for layout/spacing; `style={{}}` only for dynamic or design-token values.
- Dark mode: use the `.dark` variant in Tailwind or read `isDark` from `useTheme()` for inline styles.
- No new global CSS unless absolutely unavoidable.

---

## 10. File naming

- Components: `PascalCase.tsx`
- Hooks: `camelCase.ts` prefixed with `use`
- Utilities / types / constants: `camelCase.ts`
- Store slices: `camelCase.ts` (e.g. `authSlice.ts`)
- Store API files: `camelCase.ts` (e.g. `resumesApi.ts`)
