# IrinAbo submission summary

## Challenge track

IrinAbo enters **Safety, Reporting & Protection** and **Stability & Social Cohesion**.

## The problem

Passengers often report road-journey concerns through phone calls or scattered messages. A report can lose its journey context, reach a person implicated in the complaint, or create competing accounts with no clear record of what happened next. People may also avoid reporting if ordinary transport staff can see their identity.

## The solution

IrinAbo connects a passenger report to a registered journey. The passenger can use a browser flow or a WhatsApp adapter, add an optional location update and choose a protected route when transport staff may be involved. The system preserves the original account, keeps conflicting sources visible and records whether a responsible person accepted the next action.

The proof of concept includes:

- a public passenger report flow backed by a demo API;
- a journey page with deliberate web location sharing and WhatsApp Sandbox handoff;
- deterministic ordinary and protected routing;
- organisation-scoped staff authentication and role checks;
- source-labelled accounts, location freshness and audit events;
- a resolution receipt that lets a passenger request another review;
- Judge Mode, which labels every capability as live, simulated, fictional or deferred.

## Intended users

The first users are passengers, drivers, garage coordinators, transport-company administrators and designated safety coordinators. The interface assumes mobile use and does not require a passenger account for the public reporting flow.

## Information sources

IrinAbo treats each input as a source rather than as verified truth. Sources can include:

- the passenger's original text or voice-derived report;
- a driver's separate account;
- a browser geolocation update deliberately shared for one journey;
- a WhatsApp current-location snapshot;
- the operator's trip record;
- staff acknowledgements and action notes.

The demonstration uses fictional journey and incident data. Copied messages do not count as independent sources.

## Trust and accuracy

The system preserves original accounts and shows disagreements instead of creating a universal truth score. Fixed application rules control routing, access, deadlines and escalation. AI cannot downgrade a protected route or decide that an incident is resolved. Location evidence includes its source and freshness. `Received`, `accepted`, `action underway` and `closed with outcome` remain separate states.

Protected reporting limits visibility but does not promise anonymity. IrinAbo and a configured messaging provider may still process a phone number. Reporter identity and precise location use separate permissions. Webhooks require signature validation, provider message IDs are deduplicated, and database row-level security restricts staff access.

## Low-bandwidth, accessibility and local relevance

The reporting flow uses short mobile pages and a WhatsApp adapter because many intended users already understand messaging. A browser form remains available when WhatsApp is unsuitable. The first configuration pack uses a Nigerian intercity journey and can be extended with other languages, support destinations and operating rules. The prototype does not claim that one Nigerian setup applies everywhere in Africa.

## AI software development tools

AI coding tools helped translate the project specification into typed domain rules, scaffold the Next.js application, create database migrations, write unit tests and review submission failures. The repository records completed AI contributions, human review points, decisions and corrections in `docs/AI_BUILD_LOG.md`, `docs/AI_DECISIONS.md` and `docs/AI_FAILURES.md`.

Runtime AI has a narrow role: transcription, translation, extraction and source-linked summaries. A deterministic fallback keeps the flow available without a model provider. AI does not control access, routing or outcome decisions.

## Current status and limitations

The deployed proof of concept has a public passenger flow, a seeded journey, a read-only sample case, capability evidence, staff authentication code, Supabase migrations and 12 passing unit tests. The public report simulator reaches a server API but intentionally does not add judge-generated reports to the shared dataset.

WhatsApp delivery, outbound voice calls and the independent safety contact are simulated until credentials and consenting test recipients are configured. Browser location cannot continue reliably after a page closes. IrinAbo does not contact public emergency agencies, guarantee rescue or replace local emergency channels.

## Scalability

The same journey, source, routing and acknowledgement model can be configured for another operator or country without changing the core trust rules. Country packs can add languages, support destinations and local guidance. Provider adapters separate WhatsApp, AI and call services from the core application, while role and organisation boundaries remain in the database and server code.

## Links

- Live prototype: <https://irinabo.vercel.app>
- Source repository: <https://github.com/Larriemoses/irinabo>
- Judge Mode: <https://irinabo.vercel.app/judge>
