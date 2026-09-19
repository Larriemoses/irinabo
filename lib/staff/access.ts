import type { RoutingClass, StaffRole } from "@/lib/domain";

export interface StaffAssignmentRecord {
  organisationId: string;
  role: StaffRole;
  activeFrom?: string | null;
  activeUntil?: string | null;
}

export interface IncidentAccessRecord {
  organisationId: string;
  routingClass: RoutingClass;
}

export function isActiveStaffAssignment(assignment: StaffAssignmentRecord, now = new Date()) {
  const startsAt = assignment.activeFrom ? new Date(assignment.activeFrom) : null;
  const endsAt = assignment.activeUntil ? new Date(assignment.activeUntil) : null;

  if (startsAt && startsAt > now) return false;
  if (endsAt && endsAt <= now) return false;
  return true;
}

export function filterActiveAssignments(assignments: StaffAssignmentRecord[], now = new Date()) {
  return assignments.filter((assignment) => isActiveStaffAssignment(assignment, now));
}

function hasRole(assignments: StaffAssignmentRecord[], organisationId: string, roles: StaffRole[], now = new Date()) {
  const roleSet = new Set(roles);

  return filterActiveAssignments(assignments, now).some(
    (assignment) => assignment.organisationId === organisationId && roleSet.has(assignment.role),
  );
}

export function canReadIncidentForAssignments(
  assignments: StaffAssignmentRecord[],
  incident: IncidentAccessRecord,
  now = new Date(),
) {
  if (incident.routingClass === "ORDINARY") {
    return hasRole(assignments, incident.organisationId, ["COORDINATOR", "BACKUP_COORDINATOR", "ADMIN"], now);
  }

  return hasRole(assignments, incident.organisationId, ["SAFETY_COORDINATOR"], now);
}

export function canReadTripsForOrganisation(
  assignments: StaffAssignmentRecord[],
  organisationId: string,
  now = new Date(),
) {
  return hasRole(
    assignments,
    organisationId,
    ["DRIVER", "BOOKING_CLERK", "COORDINATOR", "BACKUP_COORDINATOR", "SAFETY_COORDINATOR", "ADMIN"],
    now,
  );
}

export function resolveDashboardAccess(params: {
  isSupabaseConfigured: boolean;
  isAuthenticated: boolean;
}) {
  if (!params.isSupabaseConfigured) return "DEMO" as const;
  return params.isAuthenticated ? ("AUTHENTICATED" as const) : ("REDIRECT_TO_SIGN_IN" as const);
}
