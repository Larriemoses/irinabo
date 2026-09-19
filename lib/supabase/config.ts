export interface SupabaseAuthConfig {
  url: string;
  anonKey: string;
}

export interface SupabaseServiceConfig extends SupabaseAuthConfig {
  serviceRoleKey: string;
}

export function getSupabaseAuthConfig(): SupabaseAuthConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;
  return { url, anonKey };
}

export function getSupabaseServiceConfig(): SupabaseServiceConfig | null {
  const authConfig = getSupabaseAuthConfig();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!authConfig || !serviceRoleKey) return null;
  return { ...authConfig, serviceRoleKey };
}

export function isSupabaseAuthConfigured() {
  return getSupabaseAuthConfig() !== null;
}
