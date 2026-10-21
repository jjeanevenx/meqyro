import { randomUUID } from "node:crypto";
import { expect } from "vitest";
import { createOrder } from "@/features/commerce/order-service";
import type { CreateOrderInput, OrderRecord } from "@/features/commerce/contracts";
import { isCommercialProduct } from "@/content/commercial-catalog";
import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { getBundlePrice } from "@/lib/market/prices";
import { resolveMarketContext } from "@/lib/market/market-context";
import {
  getSessionQuestions,
  saveAnswer,
  completeQuizSession,
  startQuizSession,
} from "@/features/quiz-engine/session-service";
import { acknowledgeMemory } from "./memory-helper";
import { isLocale } from "@/lib/i18n/config";

// Historical purchases remain testable without reopening retired products for sale.
export async function createOrderOrHistoricalFixture(
  input: CreateOrderInput,
): Promise<{ order: OrderRecord; checkoutUrl?: string | null }> {
  if (isCommercialProduct(input.productCode)) return createOrder(input);
  await expect(createOrder(input)).rejects.toThrow("Product unavailable");
  const db = createSupabaseSecretClient();
  const { data: quiz, error: quizError } = await db
    .from("quizzes")
    .select("id")
    .eq("product_code", input.productCode)
    .maybeSingle();
  if (quizError) throw quizError;
  const { data: price } = quiz
    ? await db
        .from("product_prices")
        .select("amount,currency")
        .eq("quiz_id", quiz.id)
        .eq("market", input.market)
        .eq("active", true)
        .single()
    : { data: null };
  const currency =
    price?.currency ?? resolveMarketContext({ locale: "en", market: input.market }).currency;
  const amount = price?.amount ?? getBundlePrice(input.productCode, input.market);
  if (!amount) throw new Error("Historical fixture price unavailable");
  const orderNumber = `HISTORICAL-${randomUUID()}`;
  const { data: order, error } = await db
    .from("orders")
    .insert({
      session_id: input.sessionId,
      order_number: orderNumber,
      product_code: input.productCode,
      amount,
      currency,
      market: input.market,
      payment_provider: "stripe",
      status: "PENDING",
      customer_email: input.customerEmail,
    })
    .select("id")
    .single();
  if (error || !order) throw error ?? new Error("Historical order fixture failed");
  const { error: itemError } = await db.from("order_items").insert({
    order_id: order.id,
    product_code: input.productCode,
    quiz_id: quiz?.id ?? null,
    amount,
  });
  if (itemError) throw itemError;
  return {
    order: {
      id: order.id,
      orderNumber,
      sessionId: input.sessionId,
      amount,
      currency,
      market: input.market,
      status: "PENDING",
      paymentProvider: "stripe",
      customerEmail: input.customerEmail,
    },
  };
}

export async function startCompletedCommerceSession(input: Parameters<typeof startQuizSession>[0]) {
  if (!isLocale(input.locale)) throw new Error("Invalid commerce fixture locale");
  const result = await startQuizSession(input);
  for (const [index, question] of (
    await getSessionQuestions(result.session.id, input.locale)
  ).entries()) {
    await acknowledgeMemory(question, result.session.id, result.token);
    await saveAnswer({
      sessionId: result.session.id,
      token: result.token,
      questionId: question.id,
      ...(question.kind === "LIKERT" ? { numericValue: 3 } : { optionId: question.options[0].id }),
      durationMs: 3000,
      nextPosition: index + 2,
    });
  }
  await completeQuizSession({ sessionId: result.session.id, token: result.token });
  return result;
}
