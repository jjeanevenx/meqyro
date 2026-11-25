import { describe, it, expect } from "vitest";
import { createClient } from "@supabase/supabase-js";
import { getPublicSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { isSupabaseAvailable } from "./db-check";

const isOnline = await isSupabaseAvailable();

describe.skipIf(!isOnline)("Database RLS & Isolation Audit (DB)", () => {
  it("permits the server credential to read the quiz catalog", async () => {
    const supabase = createSupabaseSecretClient();

    const { data, error } = await supabase.from("quizzes").select("id, slug").limit(5);

    expect(error).toBeNull();
    expect(data?.length).toBeGreaterThan(0);
  });

  it.each(["quizzes", "questions", "options", "quiz_sessions", "answers", "orders", "results"])(
    "denies direct anonymous access to the private %s table",
    async (table) => {
      const env = getPublicSupabaseEnv();
      const anonymous = createClient(
        env.NEXT_PUBLIC_SUPABASE_URL,
        env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
        { auth: { autoRefreshToken: false, persistSession: false }, db: { schema: "meqyro" } },
      );
      const { data, error } = await anonymous.from(table).select("id").limit(1);
      expect(data).toBeNull();
      expect(error?.code).toBe("42501");
    },
  );
});
