import Link from "next/link";
import { Brand } from "@/components/Brand";
import { isSupabaseAuthConfigured } from "@/lib/supabase/config";
import { signInWithMagicLinkAction, signInWithPasswordAction } from "./actions";

export default async function StaffSignInPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : "/dashboard";
  const error = typeof params.error === "string" ? params.error : null;
  const message = typeof params.message === "string" ? params.message : null;
  const demo = params.demo === "1";
  const connected = isSupabaseAuthConfigured();

  return (
    <main className="grid-noise min-h-screen bg-[var(--paper)] px-5 py-8">
      <div className="mx-auto max-w-3xl">
        <nav className="flex items-center justify-between">
          <Brand />
          <Link href="/" className="text-sm font-bold">
            Back to public view
          </Link>
        </nav>

        <section className="paper-shadow mt-10 rounded-[28px] bg-white p-7 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--leaf)]">Staff sign-in</p>
          <h1 className="display mt-2 text-4xl text-[var(--forest)]">IrinAbo Desk access</h1>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            Use your organisation staff account. Protected incidents require an explicit SAFETY_COORDINATOR assignment.
          </p>

          {!connected && (
            <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm leading-6">
              <strong>Demo mode:</strong> Supabase Auth credentials are not configured. Dashboard access stays fictional for local judging.
            </div>
          )}

          {demo && (
            <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-4 text-sm">
              Sign-in is unavailable until Supabase credentials are configured.
            </div>
          )}

          {error && <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
          {message && <p className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">{message}</p>}

          {connected && (
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <form action={signInWithPasswordAction} className="space-y-4 rounded-2xl border border-[var(--line)] p-5">
                <h2 className="font-bold">Email and password</h2>
                <input type="hidden" name="next" value={next} />
                <label className="block text-sm font-medium" htmlFor="email-password">
                  Email
                </label>
                <input
                  id="email-password"
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-xl border border-[var(--line)] px-3 py-2"
                />
                <label className="block text-sm font-medium" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full rounded-xl border border-[var(--line)] px-3 py-2"
                />
                <button className="w-full rounded-full bg-[var(--forest)] px-5 py-3 text-sm font-bold text-white">
                  Sign in
                </button>
              </form>

              <form action={signInWithMagicLinkAction} className="space-y-4 rounded-2xl border border-[var(--line)] p-5">
                <h2 className="font-bold">Magic link</h2>
                <input type="hidden" name="next" value={next} />
                <label className="block text-sm font-medium" htmlFor="email-magic">
                  Email
                </label>
                <input
                  id="email-magic"
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-xl border border-[var(--line)] px-3 py-2"
                />
                <button
                  disabled={!process.env.NEXT_PUBLIC_APP_URL}
                  className="w-full rounded-full bg-[var(--orange)] px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
                >
                  Send magic link
                </button>
                {!process.env.NEXT_PUBLIC_APP_URL && (
                  <p className="text-xs text-[var(--muted)]">Set NEXT_PUBLIC_APP_URL to enable magic links.</p>
                )}
              </form>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
