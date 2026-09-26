import { NextResponse } from "next/server";
import { isLocale } from "@/lib/i18n/config";
import { createReferralLink } from "@/features/referrals/referral-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, sessionToken, quizSlug, locale } = body ?? {};

    if (!sessionId || !sessionToken || !quizSlug || !isLocale(locale)) {
      return NextResponse.json({ error: "Invalid referral creation parameters" }, { status: 400 });
    }

    const shareData = await createReferralLink({
      sessionId,
      sessionToken,
      quizSlug,
      locale,
    });

    if (!shareData) {
      return NextResponse.json(
        { error: "Failed to generate referral link or unauthorized session" },
        { status: 401 },
      );
    }

    return NextResponse.json(shareData);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
