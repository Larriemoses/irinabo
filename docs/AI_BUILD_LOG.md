# AI build log

This log records completed, repository-verifiable work. It is not a prompt transcript and does not invent failures, tests or integrations.

## Development model

- **Original concept and product direction:** repository owner.
- **Primary coding agent:** Codex.
- **Human role:** define scope and safety constraints, authorise external services, supervise behaviour, test the product, reject or request changes, and decide what the submission is allowed to claim.
- **Product AI boundary:** AI may assist with report extraction/summarisation; deterministic application logic controls identity, permissions, routing, deadlines and acknowledgement.

## 16 September 2026 — Foundation and P0 vertical slice

- **Task:** Initialise the repository and implement the smallest demonstrable reporting loop.
- **AI contribution:** Scaffolded the Next.js app; translated the specification into typed rules; created the demonstration UI, APIs, initial migration, RLS policies, fixtures and unit tests.
- **Human oversight:** The repository owner supplied the product specification, safety boundary and vertical-slice acceptance criteria, then continued reviewing the implementation through subsequent fixes.
- **Result:** Protected routing, source comparison, Journey Mode UI, accountability receipt, Judge Mode and the initial provider boundaries were created.
- **Historical verification:** Commit `c4c4887` records the initial proof-of-concept build. The build log at that time recorded passing tests, lint and a production build.

## 16 September 2026 — Hosted Supabase foundation

- **Task:** Connect hosted persistence.
- **AI contribution:** Added the hosted Supabase schema/seed integration, server-side data access and RLS-oriented access model.
- **Human oversight:** The repository owner explicitly authorised Supabase and GitHub access and reviewed the resulting hosted workflow.
- **Result:** Fictional journey `TW204` and later incident/workspace data could be read from hosted Postgres instead of only local fixtures.

## 16–21 September 2026 — Authenticated incident workflow and deployment

Repository history shows iterative AI-assisted implementation and debugging across the submission period.

### Authentication and company workspace

- Added company registration, staff login and authenticated dashboard flows.
- Added tenant-scoped staff roles and protected-case access boundaries.
- Fixed session/login and dashboard-rendering issues during review.
- Relevant commits include `d5f27a6`, `fbc1dff`, `7231567`, `c6c1185`, `f26303d`.

### Company staff and journey operations

- Added company staff directory and staff assignment.
- Added journey creation and passenger QR/share links.
- Fixed journey-creation authorisation and dashboard loading of newly created journeys.
- Relevant commits include `486a972`, `7e38386`, `935f797`, `33c6196`, `a57e061`, `386e236`.

### Passenger sessions and location

- Added private passenger sessions and access codes.
- Added permission-based browser current-location persistence.
- Preserved the product limitation that browser location is not guaranteed background tracking.
- Relevant commits include `3cee11e` and `8e6e1fd`.

### WhatsApp text reporting

- Added Twilio WhatsApp message/session persistence.
- Added signed webhook validation and provider-message deduplication.
- Added `JOIN <trip-code>` conversation state and text-report ingestion.
- Added live-capable outbound Twilio adapter while retaining a simulated adapter when credentials are absent.
- Added passenger guidance for Twilio Sandbox enrolment.
- Relevant commits include `6c8eefc`, `d0b344a`, `614d8cf`, `9302541`, `797ca42`.

### Incident accountability

- Added persisted incident ownership, responsibility acceptance and staff action audit events.
- Added a server-side deadline/escalation worker.
- External telephone escalation remains explicitly simulated in the submitted proof of concept.
- Resolution feedback is append-only and supports “This is not resolved.”

### AI inside the product

- Implemented a provider adapter for structured report extraction.
- Added a deterministic fallback when no AI key is configured or the provider fails.
- Kept AI out of truth decisions, permissions, protected routing, acknowledgement and resolution.
- The unit suite includes a prompt-injection-shaped input for the deterministic fallback and source-link preservation.

### Presentation and honesty

- Added Judge Mode with explicit capability states.
- Added a limitations document and fictional-data labels.
- Iteratively fixed visual contrast, navigation and deployment-facing UX.
- The latest pre-freeze commit `797ca42` had a successful Vercel deployment status.

## 21 September 2026 — Submission freeze audit

- Added a safe `.env.example` and changed `.gitignore` so only the example environment file may be committed.
- Corrected README database setup to require all migrations in order rather than only the initial migration.
- Corrected README scope claims so the browser report flow is not confused with the persisted Twilio ingestion path.
- Audited current code for what remains unsafe to claim live: voice-note transcription, WhatsApp current-location ingestion, external voice escalation and public-agency dispatch.

## Evidence

Useful repository evidence includes:

- Git commit history from `c4c4887` through the submission-freeze commits.
- `supabase/migrations/` for schema and access-control evolution.
- `tests/unit/` for routing, role, state/freshness and AI-fallback tests.
- `app/api/webhooks/twilio/whatsapp/route.ts` for signed WhatsApp text ingestion.
- `app/api/internal/run-escalations/route.ts` for server-side deadline handling.
- `docs/LIMITATIONS.md` and Judge Mode for explicit capability boundaries.

The submission should describe AI coding usage using this evidence rather than claiming that AI autonomously designed the product idea.
