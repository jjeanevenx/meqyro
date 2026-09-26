const redactedKeys = /authorization|cookie|email|password|secret|token/i;

function redact(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redact);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [
        key,
        redactedKeys.test(key) ? "[REDACTED]" : redact(entry),
      ]),
    );
  }
  return value;
}

export function logEvent(
  level: "info" | "warn" | "error",
  event: string,
  context: Record<string, unknown> = {},
) {
  const safeContext = redact(context) as Record<string, unknown>;
  const payload = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    event,
    ...safeContext,
  });
  console[level](payload);
}
