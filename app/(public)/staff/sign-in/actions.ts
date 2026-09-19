"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseSessionClient } from "@/lib/supabase/server";

function safeNextPath(nextPath: string | null) {
  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) return "/dashboard";
  return nextPath;
}

export async function signInWithPasswordAction(formData: FormData) {
  const nextPath = safeNextPath(formData.get("next")?.toString() ?? null);
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    redirect(`/staff/sign-in?error=${encodeURIComponent("Email and password are required")}`);
  }

  const client = await createServerSupabaseSessionClient();
  if (!client) {
    redirect("/staff/sign-in?demo=1");
  }

  const { error } = await client.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/staff/sign-in?error=${encodeURIComponent(error.message)}`);
  }

  redirect(nextPath);
}

export async function signInWithMagicLinkAction(formData: FormData) {
  const nextPath = safeNextPath(formData.get("next")?.toString() ?? null);
  const email = formData.get("email")?.toString().trim();

  if (!email) {
    redirect(`/staff/sign-in?error=${encodeURIComponent("Email is required")}`);
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    redirect(`/staff/sign-in?error=${encodeURIComponent("NEXT_PUBLIC_APP_URL is required for magic links")}`);
  }

  const client = await createServerSupabaseSessionClient();
  if (!client) {
    redirect("/staff/sign-in?demo=1");
  }

  const { error } = await client.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${appUrl}/auth/callback?next=${encodeURIComponent(nextPath)}`,
    },
  });

  if (error) {
    redirect(`/staff/sign-in?error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/staff/sign-in?message=${encodeURIComponent("Check your email for the sign-in link")}`);
}

export async function signOutStaffAction() {
  const client = await createServerSupabaseSessionClient();
  await client?.auth.signOut();
  redirect("/staff/sign-in?message=Signed%20out");
}
