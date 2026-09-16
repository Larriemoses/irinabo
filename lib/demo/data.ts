import type { Incident } from "@/lib/domain";

export const trip = {
  id: "trip-tw204",
  code: "TW204",
  organisation: "Unity Transit Demo",
  organisationLabel: "Demo organisation — fictional",
  origin: "Ikorodu Central Garage",
  destination: "Ibadan Main Garage",
  vehicle: "UTD-07",
  driver: "Tunde A.",
  departure: "16 Sep · 10:30",
  status: "IN PROGRESS",
};

const protectedReport = {
  id: "rpt-1048",
  tripId: trip.id,
  channel: "WHATSAPP" as const,
  reporterRole: "PASSENGER" as const,
  originalText: "Our bus has stopped near the interchange. The driver says the engine is overheating, but he is threatening passengers who try to call the garage. I need help.",
  receivedAt: "2026-09-16T11:42:00+01:00",
  urgent: true,
  protectionChoice: "YES" as const,
  routingClass: "PROTECTED" as const,
};

export const incidents: Incident[] = [{
  id: "inc-protected-001",
  reference: "IRN-204-031",
  tripId: trip.id,
  title: "Passenger requests immediate help",
  routingClass: "PROTECTED",
  responseState: "AWAITING_ACKNOWLEDGEMENT",
  evidenceState: "CONFLICTING_ACCOUNTS",
  owner: null,
  createdAt: "2026-09-16T11:42:00+01:00",
  deadlineAt: "2026-09-16T11:44:00+01:00",
  reports: [protectedReport, {
    id: "rpt-1051", tripId: trip.id, channel: "WHATSAPP", reporterRole: "DRIVER",
    originalText: "Engine temperature is high. We stopped as a precaution and are checking the vehicle.",
    receivedAt: "2026-09-16T11:45:00+01:00", urgent: false, protectionChoice: "NO", routingClass: "ORDINARY",
  }],
  audit: [
    { id: "aud-1", action: "REPORT_RECEIVED", actor: "Passenger · identity protected", at: "11:42", detail: "Original WhatsApp report stored" },
    { id: "aud-2", action: "ROUTE_LOCKED", actor: "IrinAbo rules", at: "11:42", detail: "Protected route selected by reporter" },
    { id: "aud-3", action: "SAFETY_NOTIFIED", actor: "IrinAbo Call", at: "11:42", detail: "Safety coordinator notification simulated" },
    { id: "aud-4", action: "CONFLICT_NOTED", actor: "IrinAbo rules", at: "11:45", detail: "Driver and passenger accounts retained for review" },
  ],
}, {
  id: "inc-ordinary-002",
  reference: "IRN-204-028",
  tripId: trip.id,
  title: "Engine temperature reported",
  routingClass: "ORDINARY",
  responseState: "ACTION_UNDERWAY",
  evidenceState: "REVIEWED",
  owner: "Bisi O. · Garage coordinator",
  createdAt: "2026-09-16T11:18:00+01:00",
  deadlineAt: "2026-09-16T11:20:00+01:00",
  reports: [{ id: "rpt-1032", tripId: trip.id, channel: "WHATSAPP", reporterRole: "DRIVER", originalText: "Bus stopped for an engine temperature check.", receivedAt: "2026-09-16T11:18:00+01:00", urgent: false, protectionChoice: "NO", routingClass: "ORDINARY" }],
  audit: [
    { id: "aud-5", action: "REPORT_RECEIVED", actor: "Driver", at: "11:18", detail: "WhatsApp report stored" },
    { id: "aud-6", action: "RESPONSIBILITY_ACCEPTED", actor: "Bisi O.", at: "11:19", detail: "Next update due at 11:49" },
    { id: "aud-7", action: "ACTION_RECORDED", actor: "Bisi O.", at: "11:26", detail: "Replacement vehicle placed on standby" },
  ],
}];

export const locations = [
  { id: "loc-web", source: "Web Journey Mode", latitude: 6.6722, longitude: 3.6295, capturedAt: "11:41", receivedAt: "11:41", accuracy: "± 24 m", freshness: "STALE", tone: "orange" },
  { id: "loc-wa", source: "WhatsApp current-location snapshot", latitude: 6.6761, longitude: 3.6258, capturedAt: "11:46", receivedAt: "11:46", accuracy: "Unknown", freshness: "ACTIVE", tone: "green" },
];

export const capabilities = [
  { name: "Browser report simulator", state: "LIVE", note: "Creates source-labelled demo reports through local API contracts." },
  { name: "Protected routing and role checks", state: "LIVE", note: "Deterministic server rules with automated denial tests." },
  { name: "WhatsApp Sandbox", state: "SIMULATED", note: "Adapter and signed webhook endpoint included; credentials are not configured." },
  { name: "IrinAbo Call", state: "SIMULATED", note: "Server escalation worker and bounded route simulation." },
  { name: "Unity Transit Demo", state: "FICTIONAL", note: "All people, journeys and incidents are demonstration data." },
  { name: "Automatic agency dispatch", state: "DEFERRED", note: "No police, hospital or public agency is contacted." },
] as const;
