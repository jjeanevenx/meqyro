import { NextResponse } from "next/server";
import { recordFunnelEvent } from "@/features/analytics/analytics-service";
import type { AnalyticsEventInput } from "@/features/analytics/contracts";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AnalyticsEventInput;
    if (!body || !body.eventName) {
      return NextResponse.json({ error: "Event name is required" }, { status: 400 });
    }

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
