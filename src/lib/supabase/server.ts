import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { databaseAccessToken } from "@/lib/auth/backend";

export function isSupabaseConfigured() {
  return Boolean(process.env.FORMATION_API_INTERNAL_URL || process.env.SUPABASE_URL);
}

export async function createClient() {
  if (!isSupabaseConfigured()) throw new Error("Supabase is not configured");
  const cookieStore = await cookies();
  const accessToken = await databaseAccessToken();
  const apiUrl = process.env.FORMATION_API_INTERNAL_URL || process.env.SUPABASE_URL!;
  return createServerClient(
    apiUrl,
    "backend-proxy",
    {
      global: {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
      },
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(items) {
          try {
            items.forEach(({name, value, options}) => cookieStore.set(name, value, options));
          } catch {
            // Server Components cannot write cookies; middleware refreshes sessions.
          }
        }
      }
    }
  );
}
