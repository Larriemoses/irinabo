# AI build log

## 16 September 2026 — Foundation and P0 vertical slice

- **Task:** Initialise the repository and implement the smallest demonstrable reporting loop.
- **AI contribution:** Scaffolded the Next.js app; translated the specification into typed rules; created the demo UI, APIs, migration, RLS policies, fixtures, and tests.
- **Human review:** Pending repository-owner review.
- **Result:** Local report intake, protected routing, source comparison, Journey Mode, accountability receipt and Judge Mode are implemented. Provider delivery is labelled simulated.
- **Verification:** `pnpm test` passed 10 tests across 3 files; `pnpm lint` passed; `pnpm build` completed a production build with 14 routes on 16 September 2026.
- **Commit:** `c4c4887` — `feat: build IrinAbo proof of concept`.

This log records completed work only. It is not a prompt transcript.

## 16 September 2026 — Hosted Supabase foundation

- **Task:** Create and connect the hosted persistence layer.
- **AI contribution:** Created the IrinAbo Supabase organisation and `irinabo-pilot` project in London, enabled automatic RLS, applied the initial migration and fictional seed, configured ignored local credentials, and added a server-only trip query.
- **Human review:** The repository owner explicitly authorised Supabase and GitHub access.
- **Result:** Journey `TW204` is stored in hosted Postgres and the dashboard reads it through the server client. Browser roles still have no broad table grants.
- **Verification:** Supabase SQL Editor reported a successful migration; an authenticated REST query returned the fictional `TW204` row; local tests, lint, and production build were rerun.
