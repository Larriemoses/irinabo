import Link from "next/link";
import { redirect } from "next/navigation";
import { Brand } from "@/components/Brand";
import { resolveDashboardAccess } from "@/lib/staff/access";
import { getStaffSessionContext } from "@/lib/staff/server";
import { signOutStaffAction } from "@/app/(public)/staff/sign-in/actions";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const context = await getStaffSessionContext();
  const access = resolveDashboardAccess({
    isSupabaseConfigured: context.mode === "connected",
    isAuthenticated: context.isAuthenticated,
  });

  if (access === "REDIRECT_TO_SIGN_IN") {
    redirect("/staff/sign-in?next=/dashboard");
  }

  const organisation = context.identity.organisations[0]?.name ?? "No organisation assignment";
  const assignment = context.identity.assignments[0]?.role.replaceAll("_", " ") ?? "Unassigned";

  return (
    <div className="min-h-screen bg-[#edf0ea] lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="hidden min-h-screen bg-[var(--forest)] p-6 text-white lg:flex lg:flex-col">
        <Brand inverse />
        <nav className="mt-12 space-y-2 text-sm">
          {[
            ["/dashboard", "⌂", "Overview"],
            ["/protected", "⌾", "Protected inbox"],
            ["/judge", "◇", "Judge mode"],
          ].map(([href, icon, label], i) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 ${i === 0 ? "bg-white/10 font-bold" : "text-white/65 hover:bg-white/5"}`}
            >
              <span>{icon}</span>
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto rounded-2xl bg-white/[.07] p-4">
          <p className="text-xs uppercase tracking-widest text-white/40">Signed in as</p>
          <p className="mt-2 font-bold">{context.identity.displayName}</p>
          <p className="text-xs text-white/50">{assignment}</p>
        </div>
      </aside>
      <div>
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 bg-white/70 px-5 py-4 backdrop-blur lg:px-8">
          <div className="lg:hidden">
            <Brand />
          </div>
          <div className="hidden lg:block">
            <p className="text-xs uppercase tracking-widest text-[var(--muted)]">{organisation}</p>
            <p className="text-sm font-bold">
              {context.mode === "demo" ? "Demo workspace — authentication disabled" : "Authenticated staff workspace"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm font-bold">
              Public view ↗
            </Link>
            {context.mode === "connected" ? (
              <form action={signOutStaffAction}>
                <button className="rounded-full bg-[var(--forest)] px-4 py-2 text-sm font-bold text-white">Sign out</button>
              </form>
            ) : (
              <span className="rounded-full border border-[var(--line)] bg-[var(--paper)] px-4 py-2 text-xs font-bold uppercase text-[var(--muted)]">
                Demo identity
              </span>
            )}
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
