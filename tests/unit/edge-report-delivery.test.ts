import { renderTransactionalEmail } from "@/lib/email/branded-template";
import { readFileSync } from "node:fs";
import { transpileModule, ModuleKind } from "typescript";
import { describe, expect, it, vi } from "vitest";

type SmtpMessage = {
  to: string;
  text: string;
  html: string;
  attachments: { filename: string; content: string; encoding: string; contentType: string }[];
};
function harness(
  status = "FULFILLED",
  alreadySent = false,
  claim = true,
  productCode = "BRAINRANK",
  locale = "pt",
) {
  const send = vi.fn(async (message: SmtpMessage) => {
    return { messageId: "email-123", accepted: [message.to], rejected: [] };
  });
  const close = vi.fn();
  const createTransport = vi.fn(() => ({ sendMail: send, close }));
  const update = vi.fn();
  const order = {
    status,
    customer_email: "buyer@example.com",
    session_id: "session",
    order_number: "123",
    confirmation_email_sent_at: alreadySent ? "2026-10-01" : null,
  };
  const db = {
    rpc: vi.fn(async () => ({ data: claim, error: null })),
    from: (table: string) => {
      const value =
        table === "orders"
          ? order
          : table === "quiz_sessions"
            ? {
                buyer_id: "buyer",
                status: "COMPLETED",
                quiz_versions: { quizzes: { product_code: productCode } },
              }
            : table === "report_deliveries"
              ? { sent_at: alreadySent ? "2026-10-01" : null, message_id: "email-123" }
              : table === "couple_invites"
                ? { id: "pair", initiator_session_id: "session", partner_session_id: "partner" }
                : table === "couple_consents"
                  ? [{ session_id: "session" }, { session_id: "partner" }]
                  : [{ id: "grant" }];
      const result = { data: value, error: null };
      const chain: Record<string, unknown> = {
        then: (resolve: (value: unknown) => void) => resolve(result),
      };
      for (const method of ["select", "eq", "is", "limit", "gt", "or", "neq", "order"])
        chain[method] = () => chain;
      chain.in = () => ({
        eq: async () => ({ data: [{ id: "session" }, { id: "partner" }], error: null }),
      });
      chain.single = async () => result;
      chain.maybeSingle = async () => result;
      chain.upsert = (value: unknown) => {
        update(value);
        return chain;
      };
      chain.update = (value: unknown) => {
        update(value);
        return chain;
      };
      return chain;
    },
  };
  let handler!: (request: Request) => Promise<Response>;
  const source = readFileSync("supabase/functions/deliver-report/index.ts", "utf8").replace(
    /^import .*;\r?\n/gm,
    "",
  );
  const compiled = transpileModule(source, {
    compilerOptions: { module: ModuleKind.None },
  }).outputText;
  const secret = "test-only-secret-at-least-32-characters";
  const env: Record<string, string> = {
    REPORT_DELIVERY_SECRET: secret,
    SMTP_USER: "sender@example.com",
    SMTP_PASSWORD: "test-only-password",
    SUPABASE_URL: "http://localhost",
    SUPABASE_SERVICE_ROLE_KEY: "test",
  };
  new Function("Deno", "createClient", "nodemailer", "renderTransactionalEmail", compiled)(
    {
      env: { get: (key: string) => env[key] },
      serve: (fn: typeof handler) => {
        handler = fn;
      },
    },
    () => db,
    { createTransport },
    renderTransactionalEmail,
  );
  const request = (
    authenticated = true,
    pdfBase64 = Buffer.from("%PDF-1.7\nTest report").toString("base64"),
  ) =>
    new Request("http://localhost/deliver-report", {
      method: "POST",
      headers: authenticated ? { "x-report-delivery-secret": secret } : {},
      body: JSON.stringify({
        orderId: "order",
        sessionId: "session",
        productCode,
        locale,
        accessUrl: "https://meqyro.com/pt/results/access-token",
        filename: "meqyro-brainrank-resultado.pdf",
        pdfBase64,
        text: "Seu resultado: atenção",
        customer_email: "attacker@example.com",
      }),
    });
  return { handler, request, send, update, createTransport, close };
}

describe("Supabase report delivery handler", () => {
  it("rejects missing authentication and unconfirmed payments without sending", async () => {
    const auth = harness();
    expect((await auth.handler(auth.request(false))).status).toBe(401);
    expect(auth.send).not.toHaveBeenCalled();
    const unpaid = harness("PENDING");
    expect((await unpaid.handler(unpaid.request())).status).toBe(403);
    expect(unpaid.send).not.toHaveBeenCalled();
  });
  it("rejects non-PDF attachments before sending", async () => {
    const test = harness();
    expect(
      (
        await test.handler(
          test.request(true, Buffer.from("<html>invalid</html>").toString("base64")),
        )
      ).status,
    ).toBe(400);
    expect(test.send).not.toHaveBeenCalled();
  });
  it("uses the purchased recipient and attaches the complete UTF-8 result", async () => {
    const test = harness();
    expect((await test.handler(test.request())).status).toBe(200);
    const payload = test.send.mock.calls[0][0];
    expect(payload.to).toBe("buyer@example.com");
    expect(payload.text).toContain("Seu resultado: atenção");
    expect(Buffer.from(payload.attachments[0].content, "base64").toString()).toBe(
      "%PDF-1.7\nTest report",
    );
    expect(payload.attachments[0].encoding).toBe("base64");
    expect(payload.attachments[0].filename).toBe("meqyro-brainrank-resultado.pdf");
    expect(payload.attachments[0].contentType).toBe("application/pdf");
    expect(test.createTransport).toHaveBeenCalledWith(
      expect.objectContaining({
        host: "smtp.hostinger.com",
        port: 465,
        secure: true,
        disableFileAccess: true,
        disableUrlAccess: true,
      }),
    );
    expect(test.close).toHaveBeenCalled();
    expect(test.update).toHaveBeenCalledWith(
      expect.objectContaining({ confirmation_email_message_id: "email-123" }),
    );
  });
  it("does not send an already delivered report again", async () => {
    const test = harness("FULFILLED", true);
    expect((await test.handler(test.request())).status).toBe(200);
    expect(test.send).not.toHaveBeenCalled();
  });
  it("does not send when another worker has reserved the delivery", async () => {
    const test = harness("FULFILLED", false, false);
    expect((await test.handler(test.request())).status).toBe(409);
    expect(test.send).not.toHaveBeenCalled();
  });
  it("records no sent timestamp when SMTP fails and closes the connection", async () => {
    const test = harness();
    test.send.mockRejectedValueOnce(new Error("SMTP unavailable"));
    expect((await test.handler(test.request())).status).toBe(502);
    expect(test.update).not.toHaveBeenCalled();
    expect(test.close).toHaveBeenCalled();
  });
});

describe("paid email template coverage for all seven assessments", () => {
  const products = [
    "BRAINRANK",
    "PERSONALITY_MAP",
    "CAREERFIT",
    "MONEYDNA",
    "COUPLEDNA",
    "DECISIONDNA",
    "FOCUSSTYLE",
  ];
  const cases = products.flatMap((productCode) =>
    ["pt", "en", "es", "fr"].map((locale) => ({ productCode, locale })),
  );
  it.each(cases)(
    "delivers HTML in the email body and preserves the report attachment: $productCode / $locale",
    async ({ productCode, locale }) => {
      const test = harness("FULFILLED", false, true, productCode, locale);
      expect((await test.handler(test.request())).status).toBe(200);
      const message = test.send.mock.calls[0][0];
      expect(message.html).toContain(`lang="${locale}"`);
      expect(message.html).toContain("MEQ<span");
      expect(message.html).toContain('href="https://meqyro.com/pt/results/access-token"');
      expect(message.text).toContain("Seu resultado: atenção");
      expect(Buffer.from(message.attachments[0].content, "base64").toString()).toBe(
        "%PDF-1.7\nTest report",
      );
      expect(message.attachments[0].contentType).toBe("application/pdf");
    },
  );
});
