import { redirect } from "next/navigation";
import { createAuthSupabase } from "@/lib/supabase/auth";

export const staffRoles = ["DRIVER", "BOOKING_CLERK", "COORDINATOR", "BACKUP_COORDINATOR", "SAFETY_COORDINATOR", "ADMIN"] as const;
export type StaffRole = (typeof staffRoles)[number];

export type CurrentStaff = {
  id: string;
  email: string;
  displayName: string;
  organisationId: string;
  organisationName: string;
  role: StaffRole;
};

export async function getCurrentStaff(): Promise<CurrentStaff | null> {
  const supabase = await createAuthSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("staff_assignments")
    .select("role, profiles!inner(display_name), organisations!inner(id,name)")
    .eq("profile_id", user.id)
    .is("active_until", null)
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  const profile = data.profiles as unknown as { display_name: string };
  const organisation = data.organisations as unknown as { id: string; name: string };
  return {
    id: user.id,
    email: user.email ?? "",
    displayName: profile.display_name,
    organisationId: organisation.id,
    organisationName: organisation.name,
    role: data.role as StaffRole,
  };
}

export async function requireStaff(allowed?: readonly StaffRole[]) {
  const staff = await getCurrentStaff();
  if (!staff) redirect("/login?reason=staff-access-required");
  if (allowed && !allowed.includes(staff.role)) redirect("/dashboard?reason=not-authorised");
  return staff;
}

export function canViewProtected(role: StaffRole) {
  return role === "SAFETY_COORDINATOR";
}

export function canViewOrdinary(role: StaffRole) {
  return ["COORDINATOR", "BACKUP_COORDINATOR", "ADMIN"].includes(role);
}
