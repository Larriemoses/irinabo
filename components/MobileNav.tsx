import Link from "next/link";

export function MobileNav({ links }: { links: string[][] }) {
  return <nav aria-label="Workspace navigation" className="mobile-scroll flex gap-2 overflow-x-auto border-b border-white/10 bg-[var(--paper)] px-4 py-3 lg:hidden">
    {links.map(([href, icon, label], index) => <Link key={href} href={href} className={`shrink-0 rounded-full px-3 py-2 text-xs font-semibold ${index === 0 ? "bg-[var(--leaf)] text-[var(--forest)]" : "bg-white/5 text-white/75"}`}><span className="mr-1.5" aria-hidden="true">{icon}</span>{label}</Link>)}
  </nav>;
}
