# Issue Tracker (learning project)

A mini Linear clone built to learn the TanStack ecosystem while growing toward a senior engineer role. Progress, roadmap, decisions, and known issues live in [docs/PROGRESS.md](docs/PROGRESS.md) — read it first to see where things stand and what's next.

## How to work with me

- **Guide, don't code.** I write the code myself. Explain steps, give the real code with short inline explanations of *why*, and review my work. Only write or edit project code when I explicitly ask for help with a specific piece.
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
