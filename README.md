# Sahara — Frontend

Next.js app for AI-powered resume analysis and the Sahara Academy course platform with per-subtopic AI tutoring.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15+ (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + inline `style={{}}` for design tokens |
| State / data | Redux Toolkit + RTK Query |
| UI primitives | shadcn/ui (Radix) |
| Design system | Sahara — warm earth tones, Playfair Display headings, Noto Sans body |
| Icons | Lucide React |
| Markdown | react-markdown + remark-gfm |
| Diagrams | Mermaid.js (lazy-loaded) |

---

## Project Structure

```
frontend/
├── app/
│   ├── (app)/                  # Authenticated shell (sidebar layout)
│   │   ├── layout.tsx          # Sidebar + main column
│   │   ├── dashboard/          # Overview page
│   │   ├── resumes/            # Upload & manage resumes
│   │   ├── analyze/            # ATS analysis
│   │   ├── history/[id]/       # Analysis history + detail
│   │   ├── learn/              # Sahara Academy
│   │   └── settings/           # Profile & password
│   ├── login/
│   ├── register/
│   └── layout.tsx              # Root layout (fonts, providers)
│
├── components/
│   ├── analysis/               # ATS analysis feature
│   ├── auth/                   # Login / register forms
│   ├── dashboard/              # Dashboard widgets
│   ├── history/                # Analysis history list + detail view
│   ├── learn/                  # Sahara Academy
│   │   ├── LearnPage.tsx       # Course grid + filters
│   │   ├── CourseDetailView.tsx # Subtopic list with per-card Generate button
│   │   ├── SubtopicContentView.tsx # Two-column: content + AI chat sidebar
│   │   ├── ChatPanel.tsx       # AI Tutor sidebar (RAG-powered)
│   │   ├── SubtopicsModal.tsx  # AI subtopic generation + edit modal
│   │   ├── CourseCard.tsx
│   │   ├── UploadModal.tsx     # Create course (direct S3 upload)
│   │   ├── FilterBar.tsx
│   │   ├── hooks/              # useLearn.ts
│   │   ├── types.ts
│   │   ├── constants.ts        # COLORS, CARD_STYLE design tokens
│   │   └── utils.ts
│   ├── resumes/                # Resume upload + list
│   ├── settings/               # Profile form
│   └── ui/                     # shadcn primitives
│
├── store/
│   ├── index.ts                # configureStore
│   ├── hooks.ts                # useAppDispatch / useAppSelector
│   ├── slices/
│   │   ├── authSlice.ts
│   │   └── themeSlice.ts
│   └── api/
│       ├── baseApi.ts          # RTK Query base — auth headers, 401 redirect
│       ├── authApi.ts
│       ├── resumesApi.ts
│       ├── analysisApi.ts
│       └── coursesApi.ts       # All Academy endpoints
│
├── lib/
│   ├── auth.tsx                # useAuth() hook — backed by authSlice
│   └── theme.tsx               # useTheme() hook — light/dark, persisted
│
└── middleware.ts               # Route protection → /login if no token
```

---

## Setup

**Prerequisites:** Node.js 20+, backend running at `http://localhost:8000`

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

```bash
npm run dev   # http://localhost:3000
```

Next.js proxies `/api/*` requests to the Django backend.

---

## Key Features

### ATS Resume Analysis
- Upload PDF resumes (direct S3 presigned PUT)
- Paste a job description → Gemini returns ATS score (0–100), matching skills, missing skills, and recommendations
- Full analysis history with detail view

### Sahara Academy (Learn)
- **Course grid** with search and category filters
- **Admin: Create course** — upload source PDF + thumbnail directly to S3
- **Subtopic generation** — AI analyses the source PDF and generates a structured subtopic list; async (Celery + polling)
- **Per-subtopic content generation** — each subtopic card has its own Generate button; content includes theory, Mermaid diagrams, code examples, key points, and a 5-question quiz
- **Content viewer** — two-column layout: scrollable content on the left, AI Tutor sidebar on the right
- **AI Tutor (RAG chat)** — powered by Gemini with the subtopic content as context; supports multi-turn conversation and quick-suggestion chips
- **Admin: Edit content** — raw JSON editor with save + re-embed

### State Management
All server state goes through RTK Query. Local `useState` is used only for pure UI state (open/close toggles, form fields before submission, optimistic loading indicators).

Polling pattern used for async operations:
- Subtopic generation: `pollingInterval: 2000` while `taskId` is set
- Content status: `pollingInterval: 2000` while any subtopic shows `"generating"`

---

## Design System — Sahara

Colors, spacing, and typography follow the Sahara design system defined in `DESIGN.md` and `components/learn/constants.ts`.

| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#c2652a` | Buttons, active states, brand accent |
| `text` | `#2a2826` | Headings and body |
| `textMuted` | `#6e6862` | Secondary copy |
| `border` | `#e4dcd6` | Card and input borders |
| App background | `#f5ede4` | Warm sand page bg |
| Card background | `#ffffff` | Cards on sand bg |

Heading font: **Playfair Display** (`font-heading`)  
Body font: **Noto Sans** (`font-sans`)

---

## Scripts

```bash
npm run dev      # Development server with HMR
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # ESLint
```
