import "server-only";

import { randomBytes } from "node:crypto";
import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { matchesAnonymousSessionToken } from "@/lib/security/anonymous-session";
import { StripeAdapter } from "./adapters/stripe";
import { InfinitePayAdapter } from "./adapters/infinitepay";
import type {
  CreateOrderInput,
  OrderRecord,
  PaymentProvider,
  PaymentProviderName,
} from "./contracts";
import { assertTransition, orderTransitions } from "@/lib/domain/states";
import { recordFunnelEvent } from "@/features/analytics/analytics-service";

export function getPaymentProvider(name: PaymentProviderName): PaymentProvider {
  if (name === "infinitepay") {
    return new InfinitePayAdapter();
  }
  return new StripeAdapter();
}

function generateOrderNumber(market: string): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = randomBytes(3).toString("hex").toUpperCase();
  return `MQ-${market}-${dateStr}-${rand}`;
}

export async function createOrder(
  input: CreateOrderInput,
): Promise<{ order: OrderRecord; checkoutUrl: string }> {
  const supabase = createSupabaseSecretClient();

  // 1. Verify session
  const { data: session, error: sessionError } = await supabase
    .from("quiz_sessions")
    .select(`
      id,
      access_token_hash,
      status,
      quiz_versions(quiz_id, quizzes(id, slug, product_code))
    `)
    .eq("id", input.sessionId)
    .single();

  if (sessionError || !session) {
    throw new Error("Sessão não encontrada.");
  }

  if (!matchesAnonymousSessionToken(input.sessionToken, session.access_token_hash)) {
    throw new Error("Token de sessão inválido.");
  }

  type SessionVersions = {
    quiz_versions?: {
      quiz_id?: string;
      quizzes?: {
        id?: string;
        slug?: string;
        product_code?: string;
      };
    };
  };
  const sessionRecord = session as unknown as SessionVersions;
  const quizId = sessionRecord.quiz_versions?.quiz_id ?? sessionRecord.quiz_versions?.quizzes?.id;

  if (!quizId) {
    throw new Error("Quiz associado à sessão não encontrado.");
  }

  // 2. Resolve approved editorial price on server (reject client price injection)
  const { data: priceRecord, error: priceError } = await supabase
    .from("product_prices")
    .select("amount, currency")
    .eq("quiz_id", quizId)
    .eq("market", input.market)
    .eq("active", true)
    .single();

  if (priceError || !priceRecord) {
    throw new Error(`Preço não configurado para o mercado ${input.market}.`);
  }

  const amount = priceRecord.amount;
  const currency = priceRecord.currency;
  const providerName: PaymentProviderName =
    input.market === "BR" || currency === "BRL" ? "infinitepay" : "stripe";

  // 3. Find or link lead
  const normalizedEmail = input.customerEmail.trim().toLowerCase();
  const { data: lead } = await supabase
    .from("leads")
    .select("id")
    .eq("email_normalized", normalizedEmail)
    .single();

  const orderNumber = generateOrderNumber(input.market);

  // 4. Create Order with status CREATED
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      session_id: input.sessionId,
      lead_id: lead?.id ?? null,
      order_number: orderNumber,
      status: "CREATED",
      amount,
      currency,
      market: input.market,
      payment_provider: providerName,
      customer_email: normalizedEmail,
      referral_code: input.referralCode ?? null,
    })
    .select()
    .single();

  if (orderError || !order) {
    throw new Error(`Erro ao criar pedido: ${orderError?.message}`);
  }

  // 5. Create Order Item
  await supabase.from("order_items").insert({
    order_id: order.id,
    product_code: input.productCode,
    quiz_id: quizId,
    amount,
  });

  // 6. Invoke payment provider checkout creation
  const provider = getPaymentProvider(providerName);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const checkoutResult = await provider.createCheckout({
    orderId: order.id,
    orderNumber,
    amount,
    currency,
    customerEmail: normalizedEmail,
    productCode: input.productCode,
    locale: input.locale,
    successUrl: `${baseUrl}/${input.locale}/checkout/success?session=${input.sessionId}&order=${orderNumber}`,
    cancelUrl: `${baseUrl}/${input.locale}/checkout/failed?session=${input.sessionId}&order=${orderNumber}`,
  });

  // 7. Record payment attempt
  await supabase.from("payment_attempts").insert({
    order_id: order.id,
    provider: providerName,
    provider_attempt_id: checkoutResult.providerAttemptId,
    status: "REDIRECTED",
    checkout_url: checkoutResult.checkoutUrl,
    raw_response: checkoutResult.rawResponse ?? null,
  });

  // 8. Transition order status from CREATED to PENDING
  const nextStatus = assertTransition("order", "CREATED", "PENDING", orderTransitions);
  await supabase
    .from("orders")
    .update({ status: nextStatus, updated_at: new Date().toISOString() })
    .eq("id", order.id);

  await recordFunnelEvent({
    eventName: "checkout_initiated",
    sessionId: input.sessionId,
    market: input.market,
    properties: {
      amount,
      currency,
      payment_provider: providerName,
      referral_code: input.referralCode ?? undefined,
    },
  }).catch(() => {});

  const orderRecord: OrderRecord = {
    id: order.id,
    orderNumber,
    sessionId: input.sessionId,
    status: nextStatus,
    amount,
    currency,
    market: input.market,
    paymentProvider: providerName,
    customerEmail: normalizedEmail,
  };

  return {
    order: orderRecord,
    checkoutUrl: checkoutResult.checkoutUrl,
  };
}

export async function getOrderById(orderId: string): Promise<OrderRecord | null> {
  const supabase = createSupabaseSecretClient();
  const { data: order, error } = await supabase
    .from("orders")
    .select("id, order_number, session_id, status, amount, currency, market, payment_provider, customer_email")
    .eq("id", orderId)
    .single();

  if (error || !order) return null;

  return {
    id: order.id,
    orderNumber: order.order_number,
    sessionId: order.session_id,
    status: order.status,
    amount: order.amount,
    currency: order.currency,
    market: order.market,
    paymentProvider: order.payment_provider as PaymentProviderName,
    customerEmail: order.customer_email,
  };
}

export async function getOrderByNumber(orderNumber: string): Promise<OrderRecord | null> {
  const supabase = createSupabaseSecretClient();
  const { data: order, error } = await supabase
    .from("orders")
    .select("id, order_number, session_id, status, amount, currency, market, payment_provider, customer_email")
    .eq("order_number", orderNumber)
    .single();

  if (error || !order) return null;

  return {
    id: order.id,
    orderNumber: order.order_number,
    sessionId: order.session_id,
    status: order.status,
    amount: order.amount,
    currency: order.currency,
    market: order.market,
    paymentProvider: order.payment_provider as PaymentProviderName,
    customerEmail: order.customer_email,
  };
}
