import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({request});
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    return response;
  }
  const client = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(items, headers) {
          items.forEach(({name, value}) => request.cookies.set(name, value));
          response = NextResponse.next({request});
          items.forEach(({name, value, options}) => response.cookies.set(name, value, options));
          if (headers) {
            for (const [header, value] of Object.entries(headers)) {
              if (value) response.headers.set(header, value);
            }
          }
        }
      }
    }
  );
  await client.auth.getClaims();
  return response;
}
