let cachedAvailability: boolean | null = null;

/**
 * Fast pre-flight connection check to local Supabase instance.
 * Returns false quickly (< 250ms) if the Docker container or local instance is offline,
 * preventing long 15s–65s test timeouts.
 */
export async function isSupabaseAvailable(timeoutMs = 250): Promise<boolean> {
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
    return cachedAvailability;
  } catch {
    cachedAvailability = false;
    return false;
  } finally {
    clearTimeout(timer);
  }
}
