import type {
  CheckoutInput,
  PaymentProvider,
  PaymentProviderName,
  RawWebhookInput,
} from "@/features/commerce/contracts";

export class ControlledPaymentProvider implements PaymentProvider {
  constructor(public readonly name: PaymentProviderName) {}

  async createCheckout(input: CheckoutInput) {
    return {
      provider: this.name,
      providerAttemptId: `${this.name}_attempt_${input.orderId}`,
      checkoutUrl: `https://payments.test/${this.name}/${input.orderId}`,
    };
  }

  async getPaymentStatus() {
    return { status: "PENDING" as const };
  }

  async verifyWebhook(input: RawWebhookInput) {
    const payload = input.payload as Record<string, unknown>;
    const object = (payload.data as { object: Record<string, unknown> }).object;
    const metadata = object.metadata as Record<string, string>;
    return {
      provider: this.name,
      providerEventId: String(payload.id),
      eventType: String(payload.type),
      orderId: String(object.client_reference_id),
      orderNumber: metadata.order_number,
      status: "CONFIRMED" as const,
      amount: Number(object.amount_total),
      currency: String(object.currency).toUpperCase(),
      providerPaymentId: `payment_${String(payload.id)}`,
    };
  }
}
