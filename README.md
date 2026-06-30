# Sahara — Frontend

Next.js 15 App Router application for AI-powered ATS resume analysis, a live resume builder, and the Sahara Academy course platform with per-subtopic AI tutoring.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| State | Redux Toolkit + RTK Query |
| Animations | GSAP (score counter, card stagger, nav hover) |
| 3D | Three.js (dashboard wireframe globe) |
| Markdown | react-markdown + remark-gfm |
| Diagrams | Mermaid.js |
| Fonts | Playfair Display (headings) + Noto Sans (body) |

---

## Route Map

```
app/
├── page.tsx                       Landing page (/)
├── login/page.tsx                 Login
├── register/page.tsx              Register
└── (app)/                         Authenticated shell (sidebar layout)
    ├── dashboard/page.tsx         Dashboard — stats, score trend, top skills
    ├── resumes/
    │   ├── page.tsx               Resume library + upload
    │   └── [id]/build/page.tsx    Resume builder — edit + live preview + export
    ├── analyze/page.tsx           ATS analysis — run + result
    ├── history/
    │   ├── page.tsx               Analysis history list
    │   └── [id]/page.tsx          Single analysis detail
    ├── learn/
    │   ├── page.tsx               Course catalogue
    │   ├── [courseId]/page.tsx    Course detail + subtopics
    │   └── [courseId]/[order]/page.tsx  Subtopic content + AI chat
    └── settings/page.tsx          Profile, appearance, security, plan
```

All `page.tsx` files are 2-line shells that import and re-export from `components/`. All logic lives under `components/`.

---

## Component Structure

```
components/
├── analysis/          ATS analysis feature
│   ├── hooks/useAnalysis.ts
│   ├── AnalyzePage.tsx         orchestrator
│   ├── AnalyzeForm.tsx
│   ├── ResultView.tsx          GSAP score counter, "Build Updated Resume" button
│   ├── LoadingView.tsx
│   ├── ScoreGauge.tsx
│   ├── SkillsCard.tsx          type="matching"|"missing"
│   ├── RecommendationsList.tsx
│   ├── ResumeSelector.tsx
│   ├── JobDescriptionInput.tsx
│   └── RecentComparisons.tsx
│
├── resumes/           Resume library + builder
│   ├── hooks/
│   │   ├── useResumes.ts        upload, delete, polling, viewer state
│   │   └── useResumeBuilder.ts  structured data, apply recs, export, save
│   ├── builder/
│   │   ├── ResumeEditorPanel.tsx    accordion section editor
│   │   └── ResumeLivePreview.tsx    HTML preview mirroring the PDF layout
│   ├── ResumesPage.tsx
│   ├── ResumeBuilderPage.tsx        split-pane: editor + live preview
│   ├── ResumeLibrary.tsx
│   ├── ResumeRow.tsx                view / build / delete action buttons
│   ├── ResumeViewerModal.tsx        iframe modal for original PDF
│   ├── UploadZone.tsx
│   └── IndexBadge.tsx
│
├── dashboard/         Dashboard
│   ├── hooks/useDashboard.ts    scoreTrend, topSkills, stats
│   ├── DashboardPage.tsx        GSAP card stagger on load
│   ├── DashboardGlobe.tsx       Three.js rotating wireframe icosahedron
│   ├── ScoreTrendWidget.tsx     SVG bar chart — last 5 ATS scores
│   ├── TopSkillsWidget.tsx      Top 5 skills by frequency
│   ├── StatCard.tsx
│   ├── ResumeTable.tsx
│   └── InsightCard.tsx
│
├── history/           Analysis history
├── learn/             Sahara Academy courses + RAG chat
├── auth/              Login / Register pages
├── settings/          Profile, appearance, security, plan
└── home/              Landing page (Three.js hero, GSAP sections)
```

---

## State Management

All server state goes through **RTK Query**. No `useState + useEffect + fetch` for API data.

```
store/
├── index.ts              configureStore
├── hooks.ts              useAppDispatch / useAppSelector (typed)
├── slices/
│   ├── authSlice.ts      user, token, isLoading
│   └── themeSlice.ts     mode: "light" | "dark"
└── api/
    ├── baseApi.ts        createApi — auth header, 401 redirect
    ├── authApi.ts        login, register, getMe, updateProfile
    ├── resumesApi.ts     getResumes, upload, delete, view URL, structured,
    │                     build, export PDF, save customized, customized URL
    ├── analysisApi.ts    runAnalysis, getHistory, getAnalysisDetail
    └── coursesApi.ts     courses, subtopics, content, chat
```

### Cache tags

| Tag | Provided by | Invalidated by |
|-----|-------------|----------------|
| `Resume` | `getResumes` | `uploadResume`, `deleteResume`, `saveCustomizedResume` |
| `Analysis` | `getHistory` | `runAnalysis` |
| `Me` | `getMe` | `updateProfile` |

---

## Resume Builder Flow

```
/resumes/[id]/build
  │
  ├─ useGetResumeStructuredQuery(id)       GET structured JSON (Gemini parses on first load)
  ├─ useBuildResumeMutation()              POST recommendations → enhanced JSON
  ├─ ResumeEditorPanel                    accordion: contact / summary / experience /
  │                                        education / skills / projects / certifications
  ├─ ResumeLivePreview                    live HTML preview (updates on every keystroke)
  ├─ useExportResumePdfMutation()          POST → backend renders PDF → presigned URL → new tab
  └─ useSaveCustomizedResumeMutation()     POST → backend saves PDF to S3 → "Updated" badge
```

Coming **from the analysis result**: clicking **Build Updated Resume** navigates to
`/resumes/[id]/build?recs=[...]&missing=[...]&jd=...` — the builder reads those query params
and pre-populates the "Apply Recommendations" context.

---

## Design System (Sahara)

Design tokens, typography, spacing, and component patterns are documented in [DESIGN.md](DESIGN.md).

| Token | Value |
|-------|-------|
| Brand accent | `#c2652a` |
| Page background | `#f7f5f3` |
| Card background | `#ffffff` |
| Primary text | `#2a2826` |
| Muted text | `#6e6862` |
| Card border | `#e4dcd6` |

Heading font: **Playfair Display** (`font-heading` Tailwind class).
Card style: flat, border-only (`boxShadow: "none"`), `rounded-md`.

---

## Auth

- `useAuth()` from `@/lib/auth` — `{ user, token, isLoading, login, logout }`
- Backed by `authSlice` (Redux)
- `AuthInitializer` inside `Providers` hydrates from `localStorage` on mount
- 401 responses are caught centrally in `baseApi` and redirect to `/login`
- Route protection: `middleware.ts` checks `rm_access_token` / `rm_refresh_token` cookies

---

## Theme

- `useTheme()` from `@/lib/theme` — `{ mode, isDark, toggle, set }`
- Persisted to `localStorage` (`rm_theme`), applied as `.dark` on `<html>`
- Falls back to `prefers-color-scheme` on first load

---

## Local Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Run dev server
npm run dev
```

App runs at http://localhost:3000. Requires the Django backend running at port 8000.
