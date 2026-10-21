"use client";

import { useEffect } from "react";
import type { Locale } from "@/lib/i18n/config";

export function FunnelView({ locale, quizSlug }: { locale: Locale; quizSlug?: string }) {
  useEffect(() => {
    void fetch("/api/analytics/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName: quizSlug ? "quiz_viewed" : "page_view",
        locale,
        quizSlug,
      }),
      keepalive: true,
    }).catch(() => {});
  }, [locale, quizSlug]);
  return null;
}
