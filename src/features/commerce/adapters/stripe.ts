import "server-only";

import Stripe from "stripe";
import type {
  PaymentProvider,
  PaymentProviderName,
  CheckoutInput,
  CheckoutResult,
  PaymentLookup,
  PaymentStatus,
  RawWebhookInput,
  VerifiedPaymentEvent,
} from "../contracts";

function requireEnv(name: "STRIPE_SECRET_KEY" | "STRIPE_WEBHOOK_SECRET"): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is not configured on server.`);
  return value;
}

function createStripeClient(): Stripe {
  return new Stripe(requireEnv("STRIPE_SECRET_KEY"), {
    appInfo: { name: "Meqyro", version: "0.1.0" },
  });
}

function metadataFromObject(object: Stripe.Event.Data.Object): Record<string, string> {
  if ("metadata" in object && object.metadata) {
    return object.metadata as Record<string, string>;
  }
  return {};
}

const stripeLocaleByLocale: Record<string, Stripe.Checkout.SessionCreateParams.Locale> = {
  pt: "pt-BR",
  en: "en",
  es: "es",
  fr: "fr",
};

const checkoutCopyByLocale: Record<
  string,
  { product: string; description: string; submit: string }
> = {
  pt: {
    product: "Meqyro — Relatório BrainRank",
    description: "Relatório completo para download após confirmação do pagamento.",
    submit: "Pagamento seguro. Seu relatório será liberado no e-mail informado.",
  },
  en: {
    product: "Meqyro — BrainRank Report",
    description: "Complete report to download after payment confirmation.",
    submit: "Secure payment. Your report will be delivered to the email provided.",
  },
  es: {
    product: "Meqyro — Informe BrainRank",
    description: "Informe completo descargable tras confirmar el pago.",
    submit: "Pago seguro. Recibirás tu informe en el correo indicado.",
  },
  fr: {
    product: "Meqyro — Rapport BrainRank",
    description: "Rapport analytique complet, téléchargeable et envoyé par e-mail.",
    submit: "Paiement sécurisé. Votre rapport sera envoyé à l’adresse indiquée.",
  },
};

function checkoutCopy(locale: string, productCode: string) {
  const copy = checkoutCopyByLocale[locale] ?? checkoutCopyByLocale.pt;
  if (productCode.toUpperCase() === "BRAINRANK") return copy;

  return {
    ...copy,
    product: `Meqyro — ${productCode}`,
  };
}

export class StripeAdapter implements PaymentProvider {
  public readonly name: PaymentProviderName = "stripe";

  async createCheckout(input: CheckoutInput): Promise<CheckoutResult> {
    const stripe = createStripeClient();
    const copy = checkoutCopy(input.locale, input.productCode);
    const brandIconFile = process.env.STRIPE_BRAND_ICON_FILE_ID?.trim();
    const metadata = {
      order_id: input.orderId,
      order_number: input.orderNumber,
      product_code: input.productCode,
    };

    const session = await stripe.checkout.sessions.create(
      {
        ui_mode: "hosted_page",
        mode: "payment",
        billing_address_collection: "auto",
        phone_number_collection: { enabled: false },
        automatic_tax: { enabled: false },
        allow_promotion_codes: false,
        submit_type: "auto",
        integration_identifier: "hosted_web_0001",
        origin_context: "web",
        success_url: input.successUrl,
        cancel_url: input.cancelUrl,
        customer_email: input.customerEmail,
        client_reference_id: input.orderId,
        locale: stripeLocaleByLocale[input.locale] ?? "auto",
        branding_settings: {
          display_name: "Meqyro",
          background_color: "#F5F8FC",
          button_color: "#123FC4",
          border_style: "rounded",
          font_family: "inter",
          ...(brandIconFile ? { icon: { type: "file" as const, file: brandIconFile } } : {}),
        },
        custom_text: {
          submit: { message: copy.submit },
        },
        metadata,
        payment_intent_data: { metadata },
        line_items: [
          {
            price_data: {
              currency: input.currency.toLowerCase(),
              unit_amount: input.amount,
              product_data: {
                name: copy.product,
                description: copy.description,
              },
            },
            quantity: 1,
          },
        ],
      },
      { idempotencyKey: input.idempotencyKey },
    );

    if (!session.url) throw new Error("Stripe Checkout Session did not return a redirect URL.");

    return {
      provider: "stripe",
      providerAttemptId: session.id,
      checkoutUrl: session.url,
      expiresAt: new Date(session.expires_at * 1000).toISOString(),
    };
  }

  async getPaymentStatus(input: PaymentLookup): Promise<PaymentStatus> {
    const session = await createStripeClient().checkout.sessions.retrieve(input.providerAttemptId);

    if (session.payment_status === "paid") {
      return {
        status: "CONFIRMED",
        transactionId:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id,
      };
    }
    if (session.status === "expired") return { status: "EXPIRED" };
    return { status: "PENDING" };
  }

  async verifyWebhook(input: RawWebhookInput): Promise<VerifiedPaymentEvent> {
    if (typeof input.payload !== "string") {
      throw new Error("Stripe webhook verification requires the untouched raw request body.");
    }

    const signature = input.signature ?? (input.headers["stripe-signature"] as string | undefined);
    if (!signature) throw new Error("Missing stripe-signature header.");

    const stripe = createStripeClient();
    const event = stripe.webhooks.constructEvent(
      input.payload,
      signature,
      requireEnv("STRIPE_WEBHOOK_SECRET"),
      300,
    );

    const object = event.data.object;
    const metadata = metadataFromObject(object);

    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      const session = object as Stripe.Checkout.Session;
      if (session.payment_status !== "paid") {
        return {
          provider: "stripe",
          providerEventId: event.id,
          eventType: event.type,
          status: "IGNORED",
        };
      }

      return {
        provider: "stripe",
        providerEventId: event.id,
        eventType: event.type,
        orderId: session.client_reference_id ?? metadata.order_id,
        orderNumber: metadata.order_number,
        providerPaymentId:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id,
        productCode: metadata.product_code,
        status: "CONFIRMED",
        amount: session.amount_total ?? undefined,
        currency: session.currency?.toUpperCase(),
      };
    }

    if (event.type === "checkout.session.async_payment_failed") {
      const session = object as Stripe.Checkout.Session;
      return {
        provider: "stripe",
        providerEventId: event.id,
        eventType: event.type,
        orderId: session.client_reference_id ?? metadata.order_id,
        orderNumber: metadata.order_number,
        status: "FAILED",
      };
    }

    if (event.type === "charge.refunded" || event.type === "charge.dispute.created") {
      let charge: Stripe.Charge;
      if (event.type === "charge.refunded") {
        charge = object as Stripe.Charge;
      } else {
        const dispute = object as Stripe.Dispute;
        charge =
          typeof dispute.charge === "string"
            ? await stripe.charges.retrieve(dispute.charge)
            : dispute.charge;
      }

      const providerPaymentId =
        typeof charge.payment_intent === "string"
          ? charge.payment_intent
          : charge.payment_intent?.id;
      let chargeMetadata = metadataFromObject(charge);
      if (!chargeMetadata.order_id && providerPaymentId) {
        const paymentIntent = await stripe.paymentIntents.retrieve(providerPaymentId);
        chargeMetadata = paymentIntent.metadata;
      }
      return {
        provider: "stripe",
        providerEventId: event.id,
        eventType: event.type,
        orderId: chargeMetadata.order_id,
        orderNumber: chargeMetadata.order_number,
        providerPaymentId,
        status: event.type === "charge.refunded" ? "REFUNDED" : "CHARGEBACK",
      };
    }

    return {
      provider: "stripe",
      providerEventId: event.id,
      eventType: event.type,
      status: "IGNORED",
    };
  }
}
