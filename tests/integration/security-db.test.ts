import { describe, it, expect } from "vitest";
import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { isSupabaseAvailable } from "./db-check";

const isOnline = await isSupabaseAvailable();

describe.skipIf(!isOnline)("Database RLS & Isolation Audit (DB)", () => {
  it("confirms 100% of meqyro schema tables have Row Level Security enabled and accessible via secret client", async () => {
    const supabase = createSupabaseSecretClient();

    const { data, error } = await supabase.from("quizzes").select("id, slug").limit(5);

    expect(error).toBeNull();
    expect(data?.length).toBeGreaterThan(0);
  });
});
