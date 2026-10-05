let cachedAvailability: boolean | null = null;

/**
 * Fast pre-flight connection check to local Supabase instance.
 * Allows startup contention without silently skipping a required integration run.
 * preventing long 15s–65s test timeouts.
 */
export async function isSupabaseAvailable(timeoutMs = 5000): Promise<boolean> {
  if (cachedAvailability !== null) {
    return cachedAvailability;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://127.0.0.1:54321";
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${url}/auth/v1/health`, {
      method: "GET",
      signal: controller.signal,
    });
    cachedAvailability = res.ok;
  } catch {
    cachedAvailability = false;
  } finally {
    clearTimeout(timer);
  }
  if (!cachedAvailability && process.env.REQUIRE_INTEGRATION_DB === "true") {
    throw new Error("Local Supabase is required for this integration run");
  }
  return cachedAvailability;
}
