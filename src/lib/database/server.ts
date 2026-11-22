import { PostgrestClient } from "@supabase/postgrest-js";
import { databaseAccessToken } from "@/lib/auth/backend";

export function isBackendConfigured() {
  return Boolean(process.env.FORMATION_API_INTERNAL_URL);
}

export async function createDatabaseClient() {
  const apiUrl = process.env.FORMATION_API_INTERNAL_URL;
  if (!apiUrl) throw new Error("Formation Pro API is not configured");

  const accessToken = await databaseAccessToken();
  if (!accessToken) throw new Error("The backend did not issue a database access token");

  return new PostgrestClient(`${apiUrl.replace(/\/+$/, "")}/rest/v1`, {
    headers: {
      apikey: "backend-proxy",
      Authorization: `Bearer ${accessToken}`
    },
    schema: "public",
    fetch: (input, init) => fetch(input, { ...init, cache: "no-store" })
  });
}
