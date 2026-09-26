import { NextResponse } from "next/server";
import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { validateAdminAuth } from "@/lib/security/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    // 1. Fail-closed authentication check
    const authResult = validateAdminAuth(request);
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: "Unauthorized access to administrative metrics endpoint." },
        { status: 401 },
      );
    }

    const supabase = createSupabaseSecretClient();

    // 2. Fetch quizzes with pagination/limit
    const { data: quizzes, error: quizzesError } = await supabase
      .from("quizzes")
      .select("id, slug, product_code, active, created_at")
      .order("created_at", { ascending: true })
      .limit(50);

    if (quizzesError) {
      return NextResponse.json({
        metrics: {
          totalSessions: 0,
          completedSessions: 0,
          totalLeads: 0,
          totalOrders: 0,
          paidOrdersCount: 0,
          conversionRatePercent: 0,
          revenueByCurrency: {},
        },
        quizzes: [],
        prices: [],
        recentOrders: [],
        databaseStatus: "UNAVAILABLE",
        timestamp: new Date().toISOString(),
      });
    }

    // 3. Active Product Prices
    const { data: prices } = await supabase
      .from("product_prices")
      .select("quiz_id, market, currency, amount, active")
      .eq("active", true)
      .limit(100);

    // 4. Session counts
    const { count: totalSessions } = await supabase
      .from("quiz_sessions")
      .select("id", { count: "exact", head: true });

    const { count: completedSessions } = await supabase
      .from("quiz_sessions")
      .select("id", { count: "exact", head: true })
      .eq("status", "COMPLETED");

    // 5. Leads count
    const { count: totalLeads } = await supabase
      .from("leads")
      .select("id", { count: "exact", head: true });

    // 6. Orders & Revenue (limited to 50 for performance and privacy)
    const { data: orders } = await supabase
      .from("orders")
      .select("id, order_number, status, amount, currency, market, payment_provider, created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    const totalOrders = orders?.length ?? 0;
    const paidOrders = orders?.filter((o) => o.status === "PAID" || o.status === "FULFILLED") ?? [];
    const paidCount = paidOrders.length;

    const conversionRate =
      totalSessions && totalSessions > 0
        ? Number(((paidCount / totalSessions) * 100).toFixed(2))
        : 0;

    const revenueByCurrency: Record<string, number> = {};
    for (const order of paidOrders) {
      revenueByCurrency[order.currency] = (revenueByCurrency[order.currency] ?? 0) + order.amount;
    }

    // Recent orders WITHOUT leaking customer emails
    const recentOrders = (orders ?? []).slice(0, 20).map((o) => ({
      id: o.id,
      orderNumber: o.order_number,
      status: o.status,
      amount: o.amount,
      currency: o.currency,
      market: o.market,
      paymentProvider: o.payment_provider,
      createdAt: o.created_at,
    }));

    return NextResponse.json({
      metrics: {
        totalSessions: totalSessions ?? 0,
        completedSessions: completedSessions ?? 0,
        totalLeads: totalLeads ?? 0,
        totalOrders,
        paidOrdersCount: paidCount,
        conversionRatePercent: conversionRate,
        revenueByCurrency,
      },
      quizzes: quizzes ?? [],
      prices: prices ?? [],
      recentOrders,
      databaseStatus: "CONNECTED",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
