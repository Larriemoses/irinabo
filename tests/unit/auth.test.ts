import { describe, expect, it } from "vitest";
import { canViewOrdinary, canViewProtected, staffRoles } from "@/lib/auth/staff";

describe("staff authorisation", () => {
  it("reserves protected cases for safety coordinators", () => {
    for (const role of staffRoles) expect(canViewProtected(role)).toBe(role === "SAFETY_COORDINATOR");
  });

  it("limits ordinary cases to operational coordinators and admins", () => {
    expect(staffRoles.filter(canViewOrdinary)).toEqual(["COORDINATOR", "BACKUP_COORDINATOR", "ADMIN"]);
  });
});
