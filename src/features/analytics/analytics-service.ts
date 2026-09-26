import "server-only";

import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { logEvent } from "@/lib/observability/logger";
import { type AnalyticsEventInput, sanitizeAnalyticsProperties, FUNNEL_EVENTS } from "./contracts";

export async function recordFunnelEvent(
  input: AnalyticsEventInput,
): Promise<{ id: string } | null> {
  if (!FUNNEL_EVENTS.includes(input.eventName)) {
    logEvent("warn", "funnel_event_rejected_invalid_name", {
      eventName: input.eventName,
    });
    return null;
  }

  const supabase = createSupabaseSecretClient();
  const sanitizedProperties = sanitizeAnalyticsProperties(input.properties);

  const { data, error } = await supabase
    .schema("meqyro")
    .from("analytics_events")
    .insert({
      session_id: input.sessionId ?? null,
      event_name: input.eventName,
      quiz_slug: input.quizSlug ?? null,
      locale: input.locale ?? null,
      market: input.market ?? null,
      properties: sanitizedProperties,
    })
    .select("id")
    .single();

  if (error) {
    logEvent("error", "funnel_event_insert_failed", {
      eventName: input.eventName,
      errorMessage: error.message,
    });
    return null;
  }

  logEvent("info", "funnel_event_recorded", {
    id: data.id,
    eventName: input.eventName,
    quizSlug: input.quizSlug,
    locale: input.locale,
  });

  return { id: data.id };
}
