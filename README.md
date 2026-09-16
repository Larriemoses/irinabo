# IrinAbo

> Report once. Keep the journey informed. Make follow-up accountable.

IrinAbo is a WhatsApp-first journey reporting and coordination proof of concept. Passengers can attach a report to a departure, choose an identity-protected route when staff are involved, share optional location context, and see whether someone accepted the next action.

This repository contains a runnable fictional demonstration. It does not guarantee rescue, detect crime, provide continuous background tracking, dispatch an agency, or represent a verified transport operator.

## Working vertical slice

- Browser report simulator with fixed staff-involvement choice
- Locked ordinary/protected routing and access denial tests
- Original and conflicting source accounts side by side
- AI adapter with deterministic non-AI fallback
- Journey Mode and honest location lifecycle copy
- Distinct web and WhatsApp location source labels
- Acknowledgement states and authenticated server escalation worker
- Resolution receipt with append-only feedback
- Read-only Judge Mode with honest capability labels
- Supabase schema, RLS policies, fictional seed, and provider adapters

## Run locally

Requires Node.js 20+ and pnpm.

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open `http://localhost:3000`. The proof of concept works in labelled demo mode without external credentials.

```bash
pnpm test
pnpm lint
pnpm build
```

## Demo route

1. Open `/report`, submit the seeded report, and select that staff are involved.
2. Open `/protected`, then case `IRN-204-031`.
3. Compare the original accounts and both location sources.
4. Open `/receipt/demo-receipt` and submit “This is not resolved.”
5. Open `/judge` to inspect live and simulated capability labels.

The fictional scenario uses Unity Transit Demo, vehicle UTD-07, and journey TW204 from Ikorodu Central Garage to Ibadan Main Garage.

## Architecture

```mermaid
flowchart LR
  P[Passenger] --> W[WhatsApp adapter]
  P --> J[Journey Mode]
  W --> A[Next.js API]
  J --> A
  A --> R{Locked route}
  R -->|Ordinary| G[Garage queue]
  R -->|Protected| S[Safety queue]
  A --> D[(Supabase + RLS)]
  A --> I[AI adapter + fallback]
  S --> E[Independent fallback]
  G --> C[Resolution receipt]
  E --> C
```

Application rules choose access, routing, deadlines and recipients; AI cannot change them. Incoming text is untrusted data, Twilio webhooks require signature validation, provider IDs are unique, and protected access requires an explicit safety assignment.

Apply `supabase/migrations/202609160001_initial.sql`, then `supabase/seed.sql`. Deploy over HTTPS for browser geolocation. Keep provider secrets server-side and use fictional data for judging.

See [project specification](docs/PROJECT_SPEC.md), [trust model](docs/TRUST_MODEL.md), [limitations](docs/LIMITATIONS.md), and [AI build log](docs/AI_BUILD_LOG.md). No licence has been added.
