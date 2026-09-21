"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { z } from "zod";
import { createAuthSupabase } from "@/lib/supabase/auth";

export type LoginState = { error?: string } | undefined;
const schema = z.object({ email: z.email(), password: z.string().min(8), next: z.string().optional() });

export async function login(_state: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Enter a valid email and a password of at least 8 characters." };
  const supabase = await createAuthSupabase();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: "The email or password is incorrect." };
  const cookieStore = await cookies();
  cookieStore.set("irinabo_last_seen", String(Date.now()), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/" });
  const destination = parsed.data.next?.startsWith("/") && !parsed.data.next.startsWith("//") ? parsed.data.next : "/dashboard";
  redirect(destination);
}

export async function logout() {
  const supabase = await createAuthSupabase();
  await supabase.auth.signOut();
  const cookieStore = await cookies();
  cookieStore.delete("irinabo_last_seen");
  redirect("/login");
}
