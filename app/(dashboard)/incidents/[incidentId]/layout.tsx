import { redirect } from "next/navigation";
import { incidents } from "@/lib/demo/data";
import { canViewOrdinary, canViewProtected, requireStaff } from "@/lib/auth/staff";

export default async function IncidentGuard({ children, params }: { children: React.ReactNode; params: Promise<{ incidentId: string }> }) {
  const staff = await requireStaff();
  const { incidentId } = await params;
  const incident = incidents.find((item) => item.id === incidentId);
  if (incident?.routingClass === "PROTECTED" && !canViewProtected(staff.role)) redirect("/dashboard?reason=not-authorised");
  if (incident?.routingClass === "ORDINARY" && !canViewOrdinary(staff.role)) redirect("/dashboard?reason=not-authorised");
  return children;
}
