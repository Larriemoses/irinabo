export function StatusPill({ children, tone = "green" }: { children: React.ReactNode; tone?: "green" | "orange" | "red" | "grey" | "lime" }) {
  const colours = { green: "bg-emerald-100 text-emerald-800", orange: "bg-orange-100 text-orange-800", red: "bg-red-100 text-red-800", grey: "bg-stone-200 text-stone-700", lime: "bg-[var(--lime)] text-[var(--forest)]" };
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide ${colours[tone]}`}><span className="size-1.5 rounded-full bg-current" />{children}</span>;
}
