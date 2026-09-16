import Link from "next/link";
import { Brand } from "@/components/Brand";
import { ReportFlow } from "@/components/ReportFlow";
export default function ReportPage(){return <main className="grid-noise min-h-screen bg-[var(--paper)] px-5 py-6"><nav className="mx-auto flex max-w-5xl items-center justify-between"><Brand/><Link href="/" className="text-sm font-bold">Close ×</Link></nav><div className="py-10"><ReportFlow/></div></main>}
