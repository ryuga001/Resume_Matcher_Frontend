# MatchKit — Frontend

Next.js app for uploading resumes and getting AI-powered ATS scores against job descriptions.

## Tech Stack

- **Next.js 16** + **React 19** — framework
- **TypeScript** — type safety
- **Tailwind CSS v4** — styling
- **shadcn/ui** (Radix UI primitives) — component library
- **React Hook Form** + **Zod** — form validation
- **Axios** / native `fetch` — API client

## Project Structure

```
frontend/
├── app/
│   ├── (app)/           # Authenticated shell (layout with sidebar/nav)
│   │   ├── dashboard/   # Overview page
│   │   ├── resumes/     # Upload & manage resumes
│   │   ├── analyze/     # Run ATS analysis
│   │   ├── history/     # Past analyses
│   │   └── settings/    # Profile & password update
│   ├── login/
│   └── register/
├── components/
│   ├── ui/              # shadcn button, card, badge, input, skeleton
│   └── ResumeUploader   # Drag-and-drop PDF uploader
├── lib/
│   ├── api.ts           # Typed API client (auth, resumes, analysis)
│   ├── auth.tsx         # Auth context + localStorage helpers
│   ├── toast.tsx        # Toast notification context
│   └── utils.ts         # cn() and misc helpers
└── middleware.ts         # Route protection (redirect to /login if no token)
```

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
npm run dev
```

App runs at `http://localhost:3000`. The Next.js config proxies `/api/*` requests to the Django backend.

## Key Flows

### Authentication
Token is stored in `localStorage` (`rm_token`). The `middleware.ts` file protects all `/(app)/*` routes — unauthenticated users are redirected to `/login`. A 401 response from any API call clears the token and redirects to `/login`.

### Resume Upload
PDFs are uploaded via `POST /api/resumes/upload`. The backend processes them asynchronously; the frontend polls `indexStatus` and shows an "Indexing…" badge until the status is `ready`.

### ATS Analysis
On the Analyze page, the user selects a ready resume and pastes a job description (min 50 chars). The result includes an ATS score (0–100), matching skills, missing skills, and AI recommendations. Results are saved to history automatically.

## Scripts

```bash
npm run dev      # Development server with HMR
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # ESLint
```
