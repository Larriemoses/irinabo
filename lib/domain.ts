export type RoutingClass = "RESTRICTED_PENDING" | "ORDINARY" | "PROTECTED";
export type ProtectionChoice = "YES" | "NO" | "PREFER_NOT_TO_SAY";
export type ResponseState =
  | "RECEIVED"
  | "AWAITING_ACKNOWLEDGEMENT"
  | "ACCEPTED"
  | "ACTION_UNDERWAY"
  | "CLOSED_WITH_OUTCOME"
  | "REVIEW_REQUESTED"
  | "UNASSIGNED";
export type StaffRole = "DRIVER" | "BOOKING_CLERK" | "COORDINATOR" | "BACKUP_COORDINATOR" | "SAFETY_COORDINATOR" | "ADMIN";
export type CapabilityState = "LIVE" | "SIMULATED" | "FICTIONAL" | "DEFERRED";

export interface AuditEvent {
  id: string;
  action: string;
  actor: string;
  at: string;
  detail: string;
}

export interface Report {
  id: string;
  tripId: string;
  channel: "WHATSAPP" | "WEB";
  reporterRole: "PASSENGER" | "DRIVER" | "WITNESS";
  originalText: string;
  receivedAt: string;
  urgent: boolean;
  protectionChoice: ProtectionChoice | null;
  routingClass: RoutingClass;
}

export interface Incident {
  id: string;
  reference: string;
  tripId: string;
  title: string;
  routingClass: Exclude<RoutingClass, "RESTRICTED_PENDING">;
  responseState: ResponseState;
  evidenceState: "SINGLE_SOURCE" | "CONFLICTING_ACCOUNTS" | "REVIEWED";
  owner: string | null;
  createdAt: string;
  deadlineAt: string;
  reports: Report[];
  audit: AuditEvent[];
}
