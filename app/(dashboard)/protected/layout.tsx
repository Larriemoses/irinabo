import { requireStaff } from "@/lib/auth/staff";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireStaff(["SAFETY_COORDINATOR"]);
  return children;
}
