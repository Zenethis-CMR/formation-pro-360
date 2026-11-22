import { cache } from "react";
import { cookies } from "next/headers";

const api = process.env.FORMATION_API_INTERNAL_URL || "http://10.0.0.42:3000";
const sessionCookie = "fp360_session";

type BackendUser = { id: string; email: string; role: string; emailVerified?: boolean };
type SessionContext = { user: BackendUser; accessToken: string };

/** Forward only our session cookie to CT420, not unrelated browser cookies. */
export async function backendRequest(path: string, init: RequestInit = {}) {
  const session = (await cookies()).get(sessionCookie)?.value;
  const headers = new Headers(init.headers);
  if (session) headers.set("cookie", `${sessionCookie}=${session}`);
  if (init.body && !headers.has("content-type")) headers.set("content-type", "application/json");
  return fetch(`${api}${path}`, { ...init, headers, cache: "no-store" });
}

/**
 * React.cache is request-scoped. Nested layouts, pages and PostgREST clients
 * share one verified session lookup, never a cross-user global cache.
 * During a rolling deployment, older APIs can still serve /me and /token.
 */
const sessionContext = cache(async (): Promise<SessionContext | null> => {
  const response = await backendRequest("/v1/auth/session-context").catch(() => null);
  if (response?.ok) {
    const body = await response.json() as Partial<SessionContext>;
    return body.user?.id && body.accessToken ? body as SessionContext : null;
  }
  if (response?.status !== 404) return null;

  // Compatibility during deployment: the previous two endpoints remain active.
  const [me, token] = await Promise.all([
    backendRequest("/v1/auth/me").catch(() => null),
    backendRequest("/v1/auth/token").catch(() => null)
  ]);
  if (!me?.ok || !token?.ok) return null;
  const [identity, credential] = await Promise.all([
    me.json() as Promise<{ user?: BackendUser }>,
    token.json() as Promise<{ accessToken?: string }>
  ]);
  return identity.user?.id && credential.accessToken
    ? { user: identity.user, accessToken: credential.accessToken }
    : null;
});

export async function currentUser() {
  return (await sessionContext())?.user ?? null;
}

export async function databaseAccessToken() {
  return (await sessionContext())?.accessToken ?? null;
}

export async function setBackendSession(response: Response) {
  const setCookie = response.headers.get("set-cookie");
  const pair = setCookie?.split(";")[0];
  if (!pair) return;
  const separator = pair.indexOf("=");
  if (separator < 1) return;
  const name = pair.slice(0, separator);
  // Only the expected cookie can be set by an internal auth response.
  if (name !== sessionCookie) return;
  const value = pair.slice(separator + 1);
  const cookieStore = await cookies();
  cookieStore.set(name, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60
  });
}

export const authApi = "/v1/auth";
export const authCookieName = sessionCookie;
