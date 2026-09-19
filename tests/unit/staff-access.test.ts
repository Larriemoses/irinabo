import { describe, expect, it } from "vitest";
import {
  canReadIncidentForAssignments,
  canReadTripsForOrganisation,
  resolveDashboardAccess,
  type StaffAssignmentRecord,
} from "@/lib/staff/access";

const ORG_A = "org-a";
const ORG_B = "org-b";

function assignments(...value: StaffAssignmentRecord[]) {
  return value;
}

describe("dashboard boundary", () => {
  it("redirects unauthenticated users in connected mode", () => {
    expect(resolveDashboardAccess({ isSupabaseConfigured: true, isAuthenticated: false })).toBe("REDIRECT_TO_SIGN_IN");
  });

  it("keeps demo mode functional without Supabase credentials", () => {
    expect(resolveDashboardAccess({ isSupabaseConfigured: false, isAuthenticated: false })).toBe("DEMO");
  });
});

describe("organisation and role isolation", () => {
  it("isolates ordinary trip access to assigned organisations", () => {
    const userAssignments = assignments({ organisationId: ORG_A, role: "COORDINATOR" });

    expect(canReadTripsForOrganisation(userAssignments, ORG_A)).toBe(true);
    expect(canReadTripsForOrganisation(userAssignments, ORG_B)).toBe(false);
  });

  it("denies ordinary roles access to protected incidents", () => {
    const userAssignments = assignments({ organisationId: ORG_A, role: "COORDINATOR" });

    expect(
      canReadIncidentForAssignments(userAssignments, {
        organisationId: ORG_A,
        routingClass: "PROTECTED",
      }),
    ).toBe(false);
  });

  it("allows protected incidents with explicit SAFETY_COORDINATOR assignment", () => {
    const userAssignments = assignments({ organisationId: ORG_A, role: "SAFETY_COORDINATOR" });

    expect(
      canReadIncidentForAssignments(userAssignments, {
        organisationId: ORG_A,
        routingClass: "PROTECTED",
      }),
    ).toBe(true);
  });

  it("does not give ADMIN implicit access to protected incidents", () => {
    const userAssignments = assignments({ organisationId: ORG_A, role: "ADMIN" });

    expect(
      canReadIncidentForAssignments(userAssignments, {
        organisationId: ORG_A,
        routingClass: "PROTECTED",
      }),
    ).toBe(false);
  });
});
