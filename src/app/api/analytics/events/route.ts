import { NextResponse } from "next/server";
import { recordFunnelEvent } from "@/features/analytics/analytics-service";
import { FUNNEL_EVENTS } from "@/features/analytics/contracts";
import { z } from "zod";
import { checkTierRateLimit, getClientIp } from "@/lib/security/rate-limit";

const eventSchema = z.object({
  eventName: z.enum(FUNNEL_EVENTS),
  sessionId: z.string().uuid().nullish(),
  quizSlug: z
    .enum([
      "brainrank",
      "moneydna",
      "coupledna",
      "personality-map",
      "careerfit",
      "decisiondna",
      "focusstyle",
    ])
    .nullish(),
  locale: z.enum(["pt", "en", "es", "fr"]).nullish(),
  market: z.enum(["BR", "US", "EU", "GB"]).nullish(),
  properties: z.record(z.string(), z.unknown()).optional(),
});
// Financial events must originate from confirmed server operations.
const serverEvents = new Set([
  "payment_completed",
  "payment_failed",
  "checkout_completed",
  "checkout_failed",
  "result_unlocked",
]);

export async function POST(request: Request) {
  try {
    const rateLimit = checkTierRateLimit(getClientIp(request), "analytics");
    if (!rateLimit.allowed) return NextResponse.json({ error: "Too many events" }, { status: 429 });
    const parsed = eventSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid event" }, { status: 400 });
    }
    const body = parsed.data;
    if (serverEvents.has(body.eventName))
      return NextResponse.json({ error: "Server event required" }, { status: 403 });

    const recorded = await recordFunnelEvent({
      eventName: body.eventName,
      sessionId: body.sessionId,
      quizSlug: body.quizSlug,
      locale: body.locale,
      market: body.market,
      properties: body.properties,
    });

    if (!recorded) {
      return NextResponse.json({ error: "Failed to record event" }, { status: 422 });
    }

    return NextResponse.json({ success: true, eventId: recorded.id });
  } catch {
    return NextResponse.json({ error: "Invalid analytics event payload" }, { status: 400 });
  }
}
