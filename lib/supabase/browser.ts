"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAuthConfig } from "@/lib/supabase/config";

let browserClient: SupabaseClient | null = null;

export function createBrowserSupabase() {
  if (browserClient) return browserClient;

  const config = getSupabaseAuthConfig();
  if (!config) return null;

  browserClient = createBrowserClient(config.url, config.anonKey);
  return browserClient;
}
