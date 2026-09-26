import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getPublicSupabaseEnv } from "./env";
import { getServerSupabaseEnv } from "./server-env";

export async function createSupabaseServerClient() {
  const env = getPublicSupabaseEnv();
  const cookieStore = await cookies();
  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (entries) => {
          try {
            entries.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            /* Server Components cannot persist refreshed cookies; proxy handles request refreshes. */
          }
        },
      },
    },
  );
}

export function createSupabaseSecretClient() {
  const env = getServerSupabaseEnv();
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
    db: { schema: "meqyro" },
  });
}
