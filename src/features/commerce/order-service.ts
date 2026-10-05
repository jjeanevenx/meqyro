import "server-only";

import { randomBytes, timingSafeEqual } from "node:crypto";
import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { matchesAnonymousSessionToken } from "@/lib/security/anonymous-session";
import { generateSecureToken, hashToken } from "@/features/privacy/consent-service";
import { getSiteUrl } from "@/lib/config/env";
import { StripeAdapter } from "./adapters/stripe";
import type {
  CreateOrderInput,
  CheckoutResult,
  OrderRecord,
  PaymentProvider,
  PaymentProviderName,
} from "./contracts";
import { assertTransition, orderTransitions } from "@/lib/domain/states";
import { recordFunnelEvent } from "@/features/analytics/analytics-service";
import { isBundleProduct, getBundlePrice } from "@/lib/market/prices";
import { isMarket, resolveMarketContext, type Market } from "@/lib/market/market-context";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { fulfillOrder } from "./fulfillment-service";

function createDefaultPaymentProvider(name: PaymentProviderName): PaymentProvider {
  void name;
  return new StripeAdapter();
}

let paymentProviderFactory = createDefaultPaymentProvider;

export function getPaymentProvider(name: PaymentProviderName): PaymentProvider {
  return paymentProviderFactory(name);
}

export function setPaymentProviderFactoryForTests(
  factory: ((name: PaymentProviderName) => PaymentProvider) | null,
): void {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("Payment provider overrides are test-only.");
  }
  paymentProviderFactory = factory ?? createDefaultPaymentProvider;
}

export function resolvePaymentProvider(market: Market, currency: string): PaymentProviderName {
  void market;
  void currency;
  return "stripe";
}

function generateOrderNumber(market: string): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = randomBytes(3).toString("hex").toUpperCase();
  return `MQ-${market}-${dateStr}-${rand}`;
}

export async function createOrder(input: CreateOrderInput): Promise<{
  order: OrderRecord;
  checkoutUrl: string | null;
  lookupToken: string;
  alreadyPaid?: boolean;
}> {
  const supabase = createSupabaseSecretClient();

  // 1. Verify session
  const { data: session, error: sessionError } = await supabase
    .from("quiz_sessions")
    .select(
      `
      id,
      access_token_hash,
      status,
      market,
      locale,
      quiz_versions(quiz_id, quizzes(id, slug, product_code))
    `,
    )
    .eq("id", input.sessionId)
    .single();

  if (sessionError || !session) {
    throw new Error("Sessão não encontrada.");
  }

  if (!matchesAnonymousSessionToken(input.sessionToken, session.access_token_hash)) {
    throw new Error("Token de sessão inválido.");
  }

  type SessionVersions = {
    market?: string;
    locale?: string;
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

  if (!isMarket(sessionRecord.market)) {
    throw new Error("Mercado da sessão é inválido ou não foi persistido.");
  }
  const persistedLocale = sessionRecord.locale;
  const orderLocale: Locale =
    typeof persistedLocale === "string" && isLocale(persistedLocale)
      ? persistedLocale
      : isLocale(input.locale)
        ? input.locale
        : "en";
  const orderMarket = resolveMarketContext({
    locale: isLocale(input.locale) ? input.locale : orderLocale,
    market: sessionRecord.market,
  }).market;

  const expectedProductCode = sessionRecord.quiz_versions?.quizzes?.product_code;
  const normalizedInputCode = input.productCode.toUpperCase().replace(/^PROD_/, "");
  if (
    expectedProductCode &&
    normalizedInputCode !== expectedProductCode &&
    !normalizedInputCode.startsWith("BUNDLE")
  ) {
    throw new Error(
      `Produto não encontrado para o mercado ou incompatível com o quiz: ${input.productCode}`,
    );
  }

  // 2. Resolve approved editorial price on server (reject client price injection)
  let amount: number;
  let currency: string;

  if (isBundleProduct(input.productCode)) {
    const bundlePrice = getBundlePrice(input.productCode, orderMarket);
    if (!bundlePrice) {
      throw new Error(`Preço de bundle não configurado para o mercado ${orderMarket}.`);
    }
    const marketCtx = resolveMarketContext({ locale: orderLocale, market: orderMarket });
    amount = bundlePrice;
    currency = marketCtx.currency;
  } else {
    const { data: priceRecord, error: priceError } = await supabase
      .from("product_prices")
      .select("amount, currency")
      .eq("quiz_id", quizId)
      .eq("market", orderMarket)
      .eq("active", true)
      .single();

    if (priceError || !priceRecord) {
      throw new Error(`Preço não configurado para o mercado ${orderMarket}.`);
    }

    amount = priceRecord.amount;
    currency = priceRecord.currency;
  }

  const providerName = resolvePaymentProvider(orderMarket, currency);

  // 3. Find or link lead
  const normalizedEmail = input.customerEmail.trim().toLowerCase();
  const { data: lead } = await supabase
    .from("leads")
    .select("id")
    .eq("email_normalized", normalizedEmail)
    .single();

  // Reuse an active checkout and stop a second purchase after fulfillment.
  const { data: existingOrder } = await supabase
    .from("orders")
    .select(
      "id, order_number, session_id, status, amount, currency, market, payment_provider, provider_payment_id, customer_email, payment_attempts(checkout_url, created_at)",
    )
    .eq("session_id", input.sessionId)
    .eq("product_code", input.productCode)
    .eq("payment_provider", providerName)
    .in("status", ["CREATED", "PROCESSING", "PENDING", "PAID", "FULFILLED"])
    .order("created_at", { referencedTable: "payment_attempts", ascending: false })
    .maybeSingle();

  if (existingOrder) {
    if (
      existingOrder.status !== "PAID" &&
      existingOrder.status !== "FULFILLED" &&
      (existingOrder.market !== orderMarket || existingOrder.currency !== currency)
    ) {
      throw new Error(
        "Este checkout antigo usa outra moeda. Inicie um novo teste para comprar em reais.",
      );
    }
    const lookupToken = generateSecureToken();
    await supabase
      .from("orders")
      .update({ lookup_token_hash: hashToken(lookupToken), updated_at: new Date().toISOString() })
      .eq("id", existingOrder.id);

    const attempts = existingOrder.payment_attempts as Array<{
      checkout_url?: string | null;
      created_at?: string;
    }>;
    const checkoutUrl = attempts?.[0]?.checkout_url ?? null;
    const orderRecord: OrderRecord = {
      id: existingOrder.id,
      orderNumber: existingOrder.order_number,
      sessionId: existingOrder.session_id,
      status: existingOrder.status,
      amount: existingOrder.amount,
      currency: existingOrder.currency,
      market: existingOrder.market,
      paymentProvider: existingOrder.payment_provider,
      customerEmail: existingOrder.customer_email,
    };

    if (existingOrder.status === "PAID") {
      await fulfillOrder(existingOrder.id, "checkout_repair", existingOrder.provider_payment_id);
      orderRecord.status = "FULFILLED";
      return { order: orderRecord, checkoutUrl: null, lookupToken, alreadyPaid: true };
    }
    if (existingOrder.status === "FULFILLED") {
      return { order: orderRecord, checkoutUrl: null, lookupToken, alreadyPaid: true };
    }
    if (checkoutUrl) return { order: orderRecord, checkoutUrl, lookupToken };
    throw new Error("Um checkout para este relatório já está sendo preparado. Tente novamente.");
  }

  const orderNumber = generateOrderNumber(orderMarket);
  const lookupToken = generateSecureToken();
  const lookupTokenHash = hashToken(lookupToken);

  // 4. Create Order with status CREATED and lookup_token_hash
  const baseOrderPayload = {
    session_id: input.sessionId,
    lead_id: lead?.id ?? null,
    order_number: orderNumber,
    status: "CREATED",
    product_code: input.productCode,
    amount,
    currency,
    market: orderMarket,
    payment_provider: providerName,
    customer_email: normalizedEmail,
    referral_code: input.referralCode ?? null,
  };

  const orderResult = await supabase
    .from("orders")
    .insert({
      ...baseOrderPayload,
      lookup_token_hash: lookupTokenHash,
    })
    .select()
    .single();

  const order = orderResult.data;
  if (orderResult.error || !order) {
    throw new Error(`Erro ao criar pedido: ${orderResult.error?.message}`);
  }

  // 5. Create Order Item
  const { error: itemError } = await supabase.from("order_items").insert({
    order_id: order.id,
    product_code: input.productCode,
    quiz_id: quizId,
    amount,
  });
  if (itemError) {
    assertTransition("order", "CREATED", "FAILED", orderTransitions);
    await supabase.from("orders").update({ status: "FAILED" }).eq("id", order.id);
    throw new Error(`Erro ao registrar item do pedido: ${itemError.message}`);
  }

  // 6. Invoke payment provider checkout creation
  const provider = getPaymentProvider(providerName);
  const siteUrl = getSiteUrl();

  assertTransition("order", "CREATED", "PROCESSING", orderTransitions);
  await supabase
    .from("orders")
    .update({ status: "PROCESSING" })
    .eq("id", order.id)
    .eq("status", "CREATED");

  let checkoutResult: CheckoutResult;
  try {
    checkoutResult = await provider.createCheckout({
      orderId: order.id,
      orderNumber,
      amount,
      currency,
      customerEmail: normalizedEmail,
      productCode: input.productCode,
      locale: orderLocale,
      successUrl: `${siteUrl}/${orderLocale}/checkout/success?order=${order.id}&token=${lookupToken}`,
      cancelUrl: `${siteUrl}/${orderLocale}/checkout/failed?order=${order.id}&token=${lookupToken}`,
      idempotencyKey: `checkout:${order.id}`,
    });
  } catch (error) {
    assertTransition("order", "PROCESSING", "FAILED", orderTransitions);
    await supabase
      .from("orders")
      .update({ status: "FAILED", updated_at: new Date().toISOString() })
      .eq("id", order.id)
      .eq("status", "PROCESSING");
    throw error;
  }

  // 7. Record payment attempt
  const { error: attemptError } = await supabase.from("payment_attempts").insert({
    order_id: order.id,
    provider: providerName,
    provider_attempt_id: checkoutResult.providerAttemptId,
    status: "REDIRECTED",
    checkout_url: checkoutResult.checkoutUrl,
  });
  if (attemptError) {
    assertTransition("order", "PROCESSING", "FAILED", orderTransitions);
    await supabase
      .from("orders")
      .update({ status: "FAILED", updated_at: new Date().toISOString() })
      .eq("id", order.id)
      .eq("status", "PROCESSING");
    throw new Error(`Erro ao persistir tentativa de pagamento: ${attemptError.message}`);
  }

  // 8. Transition order to PENDING
  const nextStatus = "PENDING";
  assertTransition("order", "PROCESSING", nextStatus, orderTransitions);

  const { error: pendingError } = await supabase
    .from("orders")
    .update({
      status: nextStatus,
      provider_checkout_id: checkoutResult.providerAttemptId,
      expires_at: checkoutResult.expiresAt ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", order.id)
    .eq("status", "PROCESSING");
  if (pendingError) {
    throw new Error(`Erro ao ativar pedido pendente: ${pendingError.message}`);
  }

  // 9. Funnel tracking
  await recordFunnelEvent({
    eventName: "checkout_initiated",
    sessionId: input.sessionId,
    quizSlug: sessionRecord.quiz_versions?.quizzes?.slug,
    locale: orderLocale,
    market: orderMarket,
    properties: {
      amount,
      currency,
      payment_provider: providerName,
      product_code: input.productCode,
    },
  }).catch(() => {});

  const orderRecord: OrderRecord = {
    id: order.id,
    orderNumber,
    sessionId: input.sessionId,
    status: nextStatus,
    amount,
    currency,
    market: orderMarket,
    paymentProvider: providerName,
    customerEmail: normalizedEmail,
  };

  return {
    order: orderRecord,
    checkoutUrl: checkoutResult.checkoutUrl,
    lookupToken,
  };
}

export interface GetOrderOptions {
  lookupToken?: string;
  sessionToken?: string;
  allowInternal?: boolean;
}

export async function getOrderById(
  orderId: string,
  options?: GetOrderOptions,
): Promise<OrderRecord | null> {
  const supabase = createSupabaseSecretClient();
  const { data: order, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      order_number,
      session_id,
      status,
      amount,
      currency,
      market,
      payment_provider,
      customer_email
    `,
    )
    .eq("id", orderId)
    .single();

  if (error || !order) return null;

  // Authorization check: require lookup token or session token
  if (!options?.allowInternal) {
    let authorized = false;

    if (options?.lookupToken) {
      const { data: tokenRecord } = await supabase
        .from("orders")
        .select("lookup_token_hash")
        .eq("id", orderId)
        .single();

      if (tokenRecord?.lookup_token_hash) {
        const candidateHash = hashToken(options.lookupToken);
        const candBuf = Buffer.from(candidateHash, "hex");
        const expectedBuf = Buffer.from(tokenRecord.lookup_token_hash, "hex");
        if (candBuf.length === expectedBuf.length && timingSafeEqual(candBuf, expectedBuf)) {
          authorized = true;
        }
      }
    }

    if (!authorized && options?.sessionToken && order.session_id) {
      const { data: sessRecord } = await supabase
        .from("quiz_sessions")
        .select("access_token_hash")
        .eq("id", order.session_id)
        .single();

      if (
        sessRecord?.access_token_hash &&
        matchesAnonymousSessionToken(options.sessionToken, sessRecord.access_token_hash)
      ) {
        authorized = true;
      }
    }

    if (!authorized) {
      return null;
    }
  }

  return {
    id: order.id,
    orderNumber: order.order_number,
    sessionId: order.session_id,
    status: order.status,
    amount: order.amount,
    currency: order.currency,
    market: order.market,
    paymentProvider: order.payment_provider,
    customerEmail: order.customer_email,
  };
}

export async function getOrderByNumber(
  orderNumber: string,
  options?: GetOrderOptions,
): Promise<OrderRecord | null> {
  const supabase = createSupabaseSecretClient();
  const { data: order, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      order_number,
      session_id,
      status,
      amount,
      currency,
      market,
      payment_provider,
      customer_email
    `,
    )
    .eq("order_number", orderNumber)
    .single();

  if (error || !order) return null;

  if (!options?.allowInternal) {
    let authorized = false;

    if (options?.lookupToken) {
      const { data: tokenRecord } = await supabase
        .from("orders")
        .select("lookup_token_hash")
        .eq("order_number", orderNumber)
        .single();

      if (tokenRecord?.lookup_token_hash) {
        const candidateHash = hashToken(options.lookupToken);
        const candBuf = Buffer.from(candidateHash, "hex");
        const expectedBuf = Buffer.from(tokenRecord.lookup_token_hash, "hex");
        if (candBuf.length === expectedBuf.length && timingSafeEqual(candBuf, expectedBuf)) {
          authorized = true;
        }
      }
    }

    if (!authorized && options?.sessionToken && order.session_id) {
      const { data: sessRecord } = await supabase
        .from("quiz_sessions")
        .select("access_token_hash")
        .eq("id", order.session_id)
        .single();

      if (
        sessRecord?.access_token_hash &&
        matchesAnonymousSessionToken(options.sessionToken, sessRecord.access_token_hash)
      ) {
        authorized = true;
      }
    }

    if (!authorized) {
      return null;
    }
  }

  return {
    id: order.id,
    orderNumber: order.order_number,
    sessionId: order.session_id,
    status: order.status,
    amount: order.amount,
    currency: order.currency,
    market: order.market,
    paymentProvider: order.payment_provider,
    customerEmail: order.customer_email,
  };
}
