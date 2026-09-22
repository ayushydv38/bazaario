import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Used inside server components, server actions, and route handlers.
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Called from a Server Component with no writable cookies —
            // safe to ignore because middleware.js refreshes the session.
          }
        },
        remove(name, options) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // Same as above — safe to ignore here.
          }
        },
      },
    }
  );
}
