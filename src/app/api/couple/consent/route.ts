import { NextRequest } from "next/server";
import { anonymousSessionCookie } from "@/lib/security/anonymous-session";
import { setCoupleConsent } from "@/features/couple/couple-service";
import { z } from "zod";
import { createRequestId } from "@/lib/observability/request-id";
import { logEvent } from "@/lib/observability/logger";

const consentSchema = z.object({ sessionId: z.uuid(), granted: z.boolean() });

export async function POST(request: NextRequest) {
  const requestId = createRequestId();
  const headers = { "x-request-id": requestId, "Cache-Control": "private, no-store" };
  const token = request.cookies.get(anonymousSessionCookie)?.value;
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401, headers });
  try {
    const parsed = consentSchema.safeParse(await request.json());
    if (!parsed.success)
      return Response.json({ error: "Invalid request" }, { status: 400, headers });
    const success = await setCoupleConsent(parsed.data.sessionId, token, parsed.data.granted);
    return Response.json({ success }, { status: success ? 200 : 403, headers });
  } catch (error: unknown) {
    if (error instanceof SyntaxError)
      return Response.json({ error: "Invalid request" }, { status: 400, headers });
    logEvent("error", "couple_consent_request_failed", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown",
    });
    return Response.json({ error: "Unable to update consent" }, { status: 500, headers });
  }
}
