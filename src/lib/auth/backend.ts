import { cookies } from "next/headers";

const api = process.env.FORMATION_API_INTERNAL_URL || "http://10.0.0.42:3000";
const sessionCookie = "fp360_session";

export async function backendRequest(path: string, init: RequestInit = {}) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");
  const headers = new Headers(init.headers);
  if (cookieHeader) headers.set("cookie", cookieHeader);
  if (init.body && !headers.has("content-type")) headers.set("content-type", "application/json");
  return fetch(`${api}${path}`, { ...init, headers, cache: "no-store" });
}

export async function currentUser() {
  const response = await backendRequest("/v1/auth/me");
  if (!response.ok) return null;
  const payload = await response.json() as { user?: { id: string; email: string; role: string } };
  return payload.user ?? null;
}

export async function databaseAccessToken() {
  const response = await backendRequest("/v1/auth/token");
  if (!response.ok) return null;
  const payload = await response.json() as { accessToken?: string };
  return payload.accessToken ?? null;
}

export async function setBackendSession(response: Response) {
  const setCookie = response.headers.get("set-cookie");
  const pair = setCookie?.split(";")[0];
  if (!pair) return;
  const separator = pair.indexOf("=");
  if (separator < 1) return;
  const name = pair.slice(0, separator);
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
