import type { Market } from "@/lib/market/market-context";

export type PaymentProviderName = "infinitepay" | "stripe";

export type CheckoutInput = {
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  customerEmail: string;
  productCode: string;
  locale: string;
  successUrl: string;
  cancelUrl: string;
};

export type CheckoutResult = {
  provider: PaymentProviderName;
  providerAttemptId: string;
  checkoutUrl: string;
  rawResponse?: Record<string, unknown>;
};

export type PaymentLookup = {
  orderId: string;
  providerAttemptId: string;
};

export type PaymentStatus = {
  status: "PENDING" | "CONFIRMED" | "FAILED" | "EXPIRED";
  paidAt?: string;
  transactionId?: string;
};

export type RawWebhookInput = {
  payload: string | Record<string, unknown>;
  headers: Record<string, string | string[] | undefined>;
  signature?: string;
};

export type VerifiedPaymentEvent = {
  provider: PaymentProviderName;
  providerEventId: string;
  eventType: string;
  orderId?: string;
  orderNumber?: string;
  status: "CONFIRMED" | "FAILED" | "REFUNDED" | "CHARGEBACK" | "IGNORED";
  amount?: number;
  currency?: string;
};

export interface PaymentProvider {
  name: PaymentProviderName;
  createCheckout(input: CheckoutInput): Promise<CheckoutResult>;
  getPaymentStatus(input: PaymentLookup): Promise<PaymentStatus>;
  verifyWebhook(input: RawWebhookInput): Promise<VerifiedPaymentEvent>;
}

export type CreateOrderInput = {
  sessionId: string;
  sessionToken: string;
  productCode: string;
  customerEmail: string;
  market: Market;
  locale: string;
  referralCode?: string;
};

export type OrderRecord = {
  id: string;
  orderNumber: string;
  sessionId: string;
  status: string;
  amount: number;
  currency: string;
  market: string;
  paymentProvider: PaymentProviderName;
  customerEmail: string;
};
