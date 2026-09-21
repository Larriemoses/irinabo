# IrinAbo — Hackathon written summary

## Track

**Primary:** Safety, Reporting & Protection  
**Secondary:** Stability & Social Cohesion

## What IrinAbo does

IrinAbo is a WhatsApp-first journey reporting and accountability proof of concept for road passengers and transport operators. It connects a report to a specific journey, preserves the original source, protects a reporter when transport staff may be involved, and makes follow-up visible as a sequence of receipt, acknowledgement, accepted responsibility, action and resolution feedback.

The core problem is not only whether information was sent. During a journey incident, passengers may hear that a garage, driver or coordinator has been contacted without knowing whether anyone actually accepted responsibility for the next action. IrinAbo is designed around that accountability gap.

## Information sources

The prototype works with several distinct information classes:

- passenger and driver reports;
- operator-provided journey data;
- browser location supplied with explicit permission;
- timestamps and provider message identifiers;
- authenticated staff actions and audit events;
- AI-assisted structured suggestions derived from an original report.

The product does not collapse these into a universal “verified” badge. Source, time, channel and evidence state remain visible.

## Trust and accuracy

IrinAbo preserves original reports before any AI-derived summary is created. Conflicting accounts remain visible side by side rather than allowing AI to choose which person is telling the truth.

Location is treated as supporting context, not proof. Browser location is permission-based and is not described as continuous background tracking. Device location may be stale, inaccurate or spoofed.

Protected reports are restricted from ordinary garage roles when the report may involve transport staff. Deterministic application rules, not AI, control identity, access, protected routing, deadlines and acknowledgement.

The demonstration is deliberately explicit about what is live, simulated, fictional and deferred. It does not claim guaranteed rescue, crime detection, automatic emergency-agency dispatch or nationwide operator verification.

## AI inside the product

AI can assist with structured extraction and concise summaries of incident text while retaining links to the source report. A deterministic fallback keeps the reporting flow usable when the AI provider is unavailable.

AI does not decide:
- whether a report is true;
- whether a crime occurred;
- who may view a protected case;
- who should receive sensitive data;
- whether an incident is resolved.

## AI used to build the software

Codex was the primary coding agent used from repository scaffolding through implementation, Supabase migrations, authentication, protected routing, API integrations, unit tests, debugging, documentation and deployment fixes.

The original IrinAbo idea, product scope, safety constraints and submission claims were set and supervised by the repository owner. Human oversight included authorising external services, testing behaviour, requesting fixes, deciding which capabilities were safe to claim and freezing features for submission.

The public repository preserves this evidence in the commit history, AI build log, migrations, tests, implementation files and limitations documentation.

## Scalability approach

IrinAbo separates organisations, journeys, staff roles and incidents in the data model. Provider-specific messaging and AI code are isolated behind adapters, and Nigeria is represented as an initial localisation/configuration layer rather than as a claim that every jurisdiction works identically.

The concept can therefore be adapted by changing operator records, support pathways, terminology, languages and jurisdiction-specific configuration without rebuilding the core report → source → responsibility → outcome model.

## Current proof-of-concept boundary

The submitted build demonstrates the product architecture and core accountability workflow. WhatsApp text integration code is implemented, while voice-note transcription, WhatsApp current-location ingestion, external telephone escalation and public-agency dispatch are not presented as live unless separately verified.

The next validation step would be a controlled pilot with passengers, garage coordinators and transport operators, measuring the time between a report being received and a responsible person accepting the next action.
