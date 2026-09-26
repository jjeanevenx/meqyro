import "server-only";

import { randomBytes, timingSafeEqual } from "node:crypto";
import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { matchesAnonymousSessionToken } from "@/lib/security/anonymous-session";
import { generateSecureToken, hashToken } from "@/features/privacy/consent-service";
import { getSiteUrl } from "@/lib/config/env";
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
import { isBundleProduct, getBundlePrice } from "@/lib/market/prices";
import { resolveMarketContext, type Market } from "@/lib/market/market-context";
import type { Locale } from "@/lib/i18n/config";

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
): Promise<{ order: OrderRecord; checkoutUrl: string; lookupToken: string }> {
  const supabase = createSupabaseSecretClient();

  // 1. Verify session
  const { data: session, error: sessionError } = await supabase
    .from("quiz_sessions")
    .select(
      `
      id,
      access_token_hash,
      status,
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
    const bundlePrice = getBundlePrice(input.productCode, input.market as Market);
    if (!bundlePrice) {
      throw new Error(`Preço de bundle não configurado para o mercado ${input.market}.`);
    }
    const safeLocale: Locale =
      input.locale === "en" || input.locale === "es" || input.locale === "fr" ? input.locale : "pt";
    const marketCtx = resolveMarketContext({ locale: safeLocale, market: input.market });
    amount = bundlePrice;
    currency = marketCtx.currency;
  } else {
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

    amount = priceRecord.amount;
    currency = priceRecord.currency;
  }

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
  const lookupToken = generateSecureToken();
  const lookupTokenHash = hashToken(lookupToken);

  // 4. Create Order with status CREATED and lookup_token_hash
  const baseOrderPayload = {
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
  };

  let orderResult = await supabase
    .from("orders")
    .insert({
      ...baseOrderPayload,
      lookup_token_hash: lookupTokenHash,
    })
    .select()
    .single();

  if (orderResult.error && orderResult.error.message.includes("lookup_token_hash")) {
    orderResult = await supabase.from("orders").insert(baseOrderPayload).select().single();
  }

  const order = orderResult.data;
  if (orderResult.error || !order) {
    throw new Error(`Erro ao criar pedido: ${orderResult.error?.message}`);
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
  const siteUrl = getSiteUrl();

  const checkoutResult = await provider.createCheckout({
    orderId: order.id,
    orderNumber,
    amount,
    currency,
    customerEmail: normalizedEmail,
    productCode: input.productCode,
    locale: input.locale,
    successUrl: `${siteUrl}/${input.locale}/checkout/success?session=${input.sessionId}&order=${orderNumber}&token=${lookupToken}`,
    cancelUrl: `${siteUrl}/${input.locale}/checkout/failed?session=${input.sessionId}&order=${orderNumber}&token=${lookupToken}`,
  });

  // 7. Record payment attempt
  await supabase.from("payment_attempts").insert({
    order_id: order.id,
    provider: providerName,
    provider_attempt_id: checkoutResult.providerAttemptId,
    status: "REDIRECTED",
    checkout_url: checkoutResult.checkoutUrl,
  });

  // 8. Transition order to PENDING
  const nextStatus = "PENDING";
  assertTransition("order", "CREATED", nextStatus, orderTransitions);

  await supabase
    .from("orders")
    .update({ status: nextStatus, updated_at: new Date().toISOString() })
    .eq("id", order.id);

  // 9. Funnel tracking
  await recordFunnelEvent({
    eventName: "checkout_initiated",
    sessionId: input.sessionId,
    quizSlug: sessionRecord.quiz_versions?.quizzes?.slug,
    locale: input.locale as Locale,
    market: input.market as Market,
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
    market: input.market,
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
    paymentProvider: order.payment_provider as PaymentProviderName,
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
    paymentProvider: order.payment_provider as PaymentProviderName,
    customerEmail: order.customer_email,
  };
}
