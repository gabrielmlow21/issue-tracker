# Progress

A mini Linear-style issue tracker, built to learn the TanStack ecosystem (Start, Router, Query, Form, Table, Virtual) with a senior-engineer mindset: caching strategy, optimistic UI, concurrency, performance, and production readiness.

Backend is intentionally thin (Prisma + SQLite + server functions). Focus is the frontend and the client/server boundary.

**Last updated:** 2026-09-29

---

## Where I am

**Current:** Milestone 1, step 4 — first vertical slice (not started)

**Next action:** Build sign up → create workspace → empty issue list (details below).

---

## Roadmap

### Milestone 1 — Foundation
- [x] Scaffold TanStack Start (Query, Better Auth, Form, Table, shadcn add-ons)
- [x] Wire TanStack Query into the router (`src/router.tsx`, `src/routes/__root.tsx`)
- [x] Switch Drizzle → Prisma 7 with SQLite (`@prisma/adapter-better-sqlite3`)
- [x] Connect Better Auth to Prisma (`src/lib/auth.ts`)
- [x] Schema + first migration (`prisma/schema.prisma`, `prisma/migrations/`)
- [ ] **Step 4: First vertical slice**
  - [ ] Sign-up / sign-in pages using `authClient` (`src/lib/auth-client.ts`)
  - [ ] Server function: create workspace (+ owner membership + default statuses, in one transaction)
  - [ ] Protected route layout: redirect to sign-in when there is no session
  - [ ] Route `/w/$slug` with a loader that prefetches via `context.queryClient.ensureQueryData`
  - [ ] Empty issue list rendered with `useSuspenseQuery`
- [ ] Commit, then update this file

### Milestone 2 — Core CRUD
- [ ] Create / edit / delete issues (TanStack Form + Zod)
- [ ] Issue detail page, comments
- [ ] Query key factory (e.g. `issueKeys.list(workspaceId)`, `issueKeys.detail(id)`)
- [ ] Mutations with cache invalidation

### Milestone 3 — Board view
- [ ] Kanban board grouped by status
- [ ] Drag and drop between columns
- [ ] Fractional indexing for `position` (`fractional-indexing` package)
- [ ] Optimistic updates with rollback on failure

### Milestone 4 — Power table
- [ ] TanStack Table list view
- [ ] Server-side sort, filter, pagination
- [ ] All table state in typed URL search params (shareable, survives refresh)

### Milestone 5 — Scale
- [ ] Seed script: 50k issues (`@faker-js/faker`)
- [ ] Measure before optimizing (record numbers here)
- [ ] Virtualize long lists (TanStack Virtual)
- [ ] Verify indexes are used (`EXPLAIN QUERY PLAN`)

### Milestone 6 — Multiplayer
- [ ] Real-time updates (SSE or polling)
- [ ] Conflict detection using `issues.version`

### Milestone 7 — Production-grade
- [ ] Tests: Vitest, Playwright, MSW
- [ ] Error boundaries + a single `reportError()` helper → Sentry
- [ ] Env validation (Zod / t3env)
- [ ] Postgres, CI, deploy (`prisma migrate deploy` in CI)
- [ ] README written like a design doc

---

## Key decisions

| Decision | Why |
|---|---|
| TanStack Query is the only cache; router `defaultPreloadStaleTime: 0` | Two caches with different freshness rules cause stale-data bugs. Loaders only prefetch into Query. |
| `QueryClient` created inside `getRouter()` | On the server, `getRouter()` runs per request. A module-level client would share cached data across users. |
| Default `staleTime: 30s` | Avoids an immediate refetch after SSR hydration. Tune per query later. |
| Prisma over Drizzle | Personal preference. Schema design is identical either way. |
| SQLite (`dev.db`) | No DB server to run; keeps the backend thin. Move to Postgres in milestone 7. |
| `src/db.server.ts` naming | Start's import protection blocks `*.server.*` files from the client bundle. Components reach the DB only through server functions. |
| UUID ids | Better Auth uses string ids; client can generate ids for optimistic creates. |
| `issues.number` separate from `id` | Human-readable refs (ISS-42), unique per workspace. |
| `statuses` table instead of an enum on issues | Per-workspace custom columns later. `category` keeps a fixed meaning (done is done). |
| `position` as text | Fractional indexing: moving a card updates one row. |
| `issues.version` | Optimistic concurrency / conflict detection (milestone 6). |
| Index `(workspaceId, statusId, position)` | Matches the board query exactly. |
| Migrations (`migrate dev`), not `db push` | Versioned schema history in git. |

---

## Known issues and workarounds

- **Prisma Studio 7.10.0 is broken for SQLite** ("not supported for the file: protocol"). 7.9.1 works. Use `npm run db:studio` (pins Studio to 7.9.1), **not** `npx prisma studio`. Remove the pin once a fixed release is out.
- **Leftover Drizzle scripts** in `package.json` (`db:generate`, `db:migrate`, `db:push`, `db:pull`) are broken since Drizzle was removed. Replace them, e.g. `"db:migrate": "prisma migrate dev"`.
- **ESLint peer warning** (`@tanstack/eslint-config` wants ESLint 10) — harmless.
- **`npm audit` highs** are inside the Prisma CLI (dev-only: bundled `mysql2`, `deepmerge-ts`). Not reachable from the app. Do **not** run `npm audit fix --force` (downgrades to Prisma 6).
- **First commit message is malformed** (the `-m` body ended up in the subject). Fix with `git commit --amend` if it hasn't been pushed.

---

## Setting up on a new machine

1. Node 24 (TanStack Start needs ≥ 22.12):
   ```bash
   nvm install 24 && nvm use
   ```
2. Install. Approve native install scripts when npm asks (`better-sqlite3`, `esbuild`, `prisma`, `@prisma/engines`, `unrs-resolver`, `fsevents`):
   ```bash
   npm install
   npm install-scripts approve better-sqlite3 esbuild unrs-resolver prisma @prisma/engines fsevents
   npm rebuild
   ```
3. Create `.env.local` (gitignored, so it is not in the repo):
   ```
   DATABASE_URL="file:./dev.db"
   BETTER_AUTH_URL="http://localhost:3000"
   BETTER_AUTH_SECRET="<generate with: openssl rand -base64 32>"
   ```
4. Create the database and generate the client:
   ```bash
   npx prisma migrate dev
   ```
5. Run:
   ```bash
   npm run dev
   ```

---

## Useful commands

| Command | What |
|---|---|
| `npm run dev` | Dev server on :3000 |
| `npx tsc --noEmit` | Type check |
| `npx prisma migrate dev --name <name>` | Create + apply a migration, regenerate client |
| `npx prisma generate` | Regenerate client only |
| `npm run db:studio` | Browse data (Studio pinned to 7.9.1) |
| `npx @better-auth/cli@latest generate --config src/lib/auth.ts` | Regenerate auth models after adding auth plugins |
