import Link from "next/link";
import { Brand } from "@/components/Brand";
import { canViewProtected, requireStaff } from "@/lib/auth/staff";
import { logout } from "@/app/(auth)/login/actions";

const labels = { DRIVER: "Driver", BOOKING_CLERK: "Booking clerk", COORDINATOR: "Garage coordinator", BACKUP_COORDINATOR: "Backup coordinator", SAFETY_COORDINATOR: "Safety coordinator", ADMIN: "Administrator" };

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const staff = await requireStaff();
  const links = [["/dashboard", "⌂", "Overview"], ...(canViewProtected(staff.role) ? [["/protected", "⌾", "Protected inbox"]] : []), ...(staff.role === "ADMIN" ? [["/staff", "♙", "Staff"]] : []), ["/judge", "◇", "Judge mode"], ["/settings", "⚙", "Settings"]];
  return <div className="min-h-screen bg-[var(--background)] lg:grid lg:grid-cols-[260px_1fr]"><aside className="hidden min-h-screen bg-[var(--forest)] p-6 text-white lg:flex lg:flex-col"><Brand inverse /><nav className="mt-12 space-y-2 text-sm">{links.map(([href, icon, label], i) => <Link key={href} href={href} className={`flex items-center gap-3 rounded-xl px-4 py-3 ${i === 0 ? "bg-white/10 font-bold" : "text-white/65 hover:bg-white/5"}`}><span>{icon}</span>{label}</Link>)}</nav><div className="mt-auto rounded-2xl bg-white/[.07] p-4"><p className="text-xs uppercase tracking-widest text-white/40">Signed in as</p><p className="mt-2 font-bold">{staff.displayName}</p><p className="text-xs text-white/50">{labels[staff.role]} · {staff.organisationName}</p><form action={logout}><button className="mt-4 text-xs font-bold text-white/70 hover:text-white">Sign out →</button></form></div></aside><div><header className="flex items-center justify-between border-b border-white/10 bg-[var(--paper)] px-5 py-4 text-white backdrop-blur lg:px-8"><div className="lg:hidden"><Brand inverse /></div><div className="hidden lg:block"><p className="text-xs uppercase tracking-widest text-[var(--muted)]">{staff.organisationName}</p><p className="text-sm font-bold">Staff workspace · {labels[staff.role]}</p></div><Link href="/" className="rounded-full border border-[var(--line)] bg-[var(--lime)] px-4 py-2 text-sm font-bold text-[var(--forest)]">Public view ↗</Link></header>{children}</div></div>;
}
