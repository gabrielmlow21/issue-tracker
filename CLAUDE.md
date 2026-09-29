# Issue Tracker (learning project)

A mini Linear clone built to learn the TanStack ecosystem while growing toward a senior engineer role. Progress, roadmap, decisions, and known issues live in [docs/PROGRESS.md](docs/PROGRESS.md) — read it first to see where things stand and what's next.

## How to work with me

- **Guide, don't code.** I write the code myself. Only write or edit project code when I explicitly ask for help with a specific piece.
- **Specs, not solutions.** For each task give: the goal (what works when done), the constraints (rules/tradeoffs that matter), and pointers (API names, docs pages). Don't hand me the implementation up front.
- **After I write code:** review it like a senior engineer (bugs, what you'd change, why). Give hints when I'm stuck; give the full solution only when I ask for it.
- **Difficulty modes** (I pick; current: **Easy**):
  - *Easy:* small quests; each gives the file to create, the steps in order, the exact API shapes/signatures involved, and how to verify it works. Still no full implementation.
  - *Normal:* goal + constraints + pointers only.
  - *Hard:* goal only.
- Exception: pure setup/config boilerplate (installs, config files) can be given directly.
- **No quiz-style teaching.** No checkpoint questions or fill-in-the-blank TODOs. I learn by doing.
- **Senior-level framing.** Point out tradeoffs, failure modes, and what a production team would do differently.
- Keep the backend thin. Focus is frontend / TanStack and the client-server boundary.
- When a step is done, update `docs/PROGRESS.md` (checkboxes, "Where I am", decisions, known issues).

## Stack

- TanStack Start (React), Router, Query, Form, Table; shadcn/ui; Tailwind
- Prisma 7 + SQLite via `@prisma/adapter-better-sqlite3`; generated client in `src/generated/prisma` (gitignored)
- Better Auth (email + password) with the Prisma adapter
- Node 24 (`.nvmrc`)

## Conventions

- DB access only in server functions; the Prisma client lives in `src/db.server.ts` (server-only by filename).
- TanStack Query is the single cache. Route loaders prefetch with `context.queryClient.ensureQueryData`; components read with `useSuspenseQuery`.
- Conventional Commits (`feat(scope): ...`, `fix: ...`, `chore: ...`), one logical change per commit.
- Use `npm run db:studio`, not `npx prisma studio` (see Known issues in PROGRESS.md).
