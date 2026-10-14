## Development

This project is maintained as a learning project to practice Git workflows,
including branches, commits, pull requests, and code reviews.

# Schoters Student Dashboard

A pixel-close, fully interactive clone of the Schoters dashboard, built with **Next.js 15 (App Router)**, **TypeScript**, and **Tailwind CSS** — ready to deploy on **Vercel**.

## What's interactive right now

- Progress bars (Overall / IELTS / SAA / SAT readiness)
- Next Actions — click a card to mark it done
- Calendar — navigate months, click any date, dates with events get a dot, "Today's Schedule" panel updates live
- **+ Add Schedule** — opens a modal, adds a new event to the calendar instantly
- Notification bell — dropdown with dummy notifications
- Sidebar navigation — active state switches on click
- User card (bottom-left) — expandable menu
- Target Programs — filter tabs (All / University / Scholarship)

All of it currently runs on **dummy data** in `lib/data.ts`.

## Connecting your own backend

Everything the UI needs comes from one function:

```ts
// lib/data.ts
export async function getDashboardData(): Promise<DashboardData> {
  return dummyData; // <- replace this
}
```

Swap the body for a real fetch, e.g.:

```ts
export async function getDashboardData(): Promise<DashboardData> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load dashboard data");
  return res.json();
}
```

The required response shape is defined in `lib/types.ts` (`DashboardData`) — keep it as your API contract, or edit it and the components together.

Places that currently mutate local state only (marked `TODO(backend)` in code, ready to be wired to real API calls):
- `components/NextActions.tsx` — marking an action as done
- `components/ScheduleSection.tsx` + `components/AddScheduleModal.tsx` — adding a new schedule event

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy to Vercel

**Option A — via GitHub (recommended)**
1. Push this project to a new GitHub repo.
2. Go to https://vercel.com/new, import the repo.
3. Framework preset is auto-detected as Next.js — click **Deploy**.
4. If/when you connect a real backend, add your env vars (e.g. `NEXT_PUBLIC_API_URL`) in Project Settings → Environment Variables, then redeploy.

**Option B — via Vercel CLI**
```bash
npm install -g vercel
vercel login
vercel        # first deploy, follow the prompts
vercel --prod # subsequent production deploys
```

## Project structure

```
app/
  layout.tsx        Root layout, page metadata
  page.tsx           Assembles the dashboard from all components
  globals.css        Tailwind base styles
components/
  Sidebar.tsx         Left nav + embeds UserCard
  UserCard.tsx         Bottom-left profile card w/ dropdown
  Header.tsx           Greeting + notification bell
  ProgressOverview.tsx  4 readiness stat cards
  NextActions.tsx       Clickable task list
  ScheduleSection.tsx    Calendar + today's schedule
  AddScheduleModal.tsx    "Add Schedule" form modal
  DeadlinesList.tsx       Upcoming deadlines
  TargetPrograms.tsx      Program cards with tab filter
lib/
  types.ts    Shared TypeScript types / API contract
  data.ts     Dummy data + the getDashboardData() function to swap for a real API
```
