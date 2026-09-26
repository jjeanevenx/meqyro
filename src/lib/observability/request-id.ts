export function createRequestId(): string {
  return crypto.randomUUID();
}

export function withRequestId(headers: Headers): Headers {
  const next = new Headers(headers);
  next.set("x-request-id", headers.get("x-request-id") ?? createRequestId());
  return next;
}
