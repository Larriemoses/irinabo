# Prototype limitations

- The submitted Twilio path implements signed WhatsApp **text** ingestion and a live-capable outbound adapter. A deployment should be described as LIVE only after a successful Sandbox message has been exercised end to end.
- WhatsApp voice-note download/transcription is not implemented end to end in the submitted build.
- WhatsApp current-location webhook ingestion is not implemented in the submitted build; the passenger web flow can persist a permission-based current-location snapshot instead.
- External telephone escalation is simulated. The server-side deadline/escalation worker is implemented, but it does not place a real emergency or coordinator call in the submitted proof of concept.
- The browser `/report` flow is a demonstration of the reporting/protected-routing UX. It must not be described as a persisted server report.
- Browsers cannot guarantee location collection after a page is hidden, frozen, locked or closed.
- Device location can be inaccurate or spoofed.
- AI provides suggestions; it does not decide truth, access, protection, urgency, acknowledgement or resolution.
- No public emergency agency, hospital, police service or road-safety body is integrated.
- Unity Transit Demo, all seeded incidents and the independent safety desk are fictional.
- Nigeria is the first configuration pack, not a claim of legal or operational uniformity.
- The current WhatsApp conversation treats the submitted text-report path conservatively; the final demo should not claim a complete production triage protocol.
