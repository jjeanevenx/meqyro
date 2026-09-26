import { createRequestId } from "@/lib/observability/request-id";

export function GET(request: Request) {
  const requestId = request.headers.get("x-request-id") ?? createRequestId();

  return Response.json(
    {
      status: "ok",
      service: "meqyro-web",
      version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) ?? "local",
      requestId,
    },
    {
      headers: {
        "cache-control": "no-store",
        "x-request-id": requestId,
      },
    },
  );
}
