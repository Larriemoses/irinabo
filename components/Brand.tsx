import Link from "next/link";

export function Brand({ inverse = false }: { inverse?: boolean }) {
  return <Link href="/" className={`inline-flex items-center gap-3 ${inverse ? "text-white" : "text-[var(--forest)]"}`}>
    <span className={`grid size-10 place-items-center rounded-full border ${inverse ? "border-white/30" : "border-[var(--forest)]/20"}`} aria-hidden="true">
      <span className="h-5 w-3 rounded-full border-2 border-current rotate-45" />
    </span>
    <span><strong className="display block text-2xl leading-5">IrinAbo</strong><small className="text-[10px] uppercase tracking-[.21em] opacity-70">Journey safety</small></span>
  </Link>;
}
