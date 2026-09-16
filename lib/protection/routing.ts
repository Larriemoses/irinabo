import type { ProtectionChoice, RoutingClass, StaffRole } from "@/lib/domain";

export function selectRouting(choice: ProtectionChoice | null, urgent: boolean): RoutingClass {
  if (choice === "NO") return "ORDINARY";
  if (choice === "YES" || choice === "PREFER_NOT_TO_SAY") return "PROTECTED";
  return urgent ? "PROTECTED" : "RESTRICTED_PENDING";
}

export function canReadIncident(role: StaffRole, route: RoutingClass): boolean {
  if (route === "PROTECTED" || route === "RESTRICTED_PENDING") {
    return role === "SAFETY_COORDINATOR";
  }
  return role === "COORDINATOR" || role === "BACKUP_COORDINATOR" || role === "ADMIN";
}

export function lockRouting(current: RoutingClass, requested: RoutingClass): RoutingClass {
  if (current === "PROTECTED") return "PROTECTED";
  if (current === "ORDINARY") return "ORDINARY";
  return requested;
}
