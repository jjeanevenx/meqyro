import { readFileSync } from "node:fs";
import { transpileModule, ModuleKind } from "typescript";
import { describe, expect, it, vi } from "vitest";

function harness(status = "FULFILLED", alreadySent = false) {
  const send = vi.fn(async (url: string, init: RequestInit) => {
    expect(url).toBe("https://api.resend.com/emails");
    expect(init.method).toBe("POST");
    return Response.json({ id: "email-123" });
  });
  const update = vi.fn();
  const order = {
    status,
    customer_email: "buyer@example.com",
    session_id: "session",
    order_number: "123",
    confirmation_email_sent_at: alreadySent ? "2026-10-01" : null,
  };
  const db = {
    from: (table: string) => {
      const value =
        table === "orders"
          ? order
          : table === "quiz_sessions"
            ? {
                buyer_id: "buyer",
                status: "COMPLETED",
                quiz_versions: { quizzes: { product_code: "BRAINRANK" } },
              }
            : table === "report_deliveries"
              ? { sent_at: alreadySent ? "2026-10-01" : null, message_id: "email-123" }
              : [{ id: "grant" }];
      const result = { data: value, error: null };
      const chain: Record<string, unknown> = {
        then: (resolve: (value: unknown) => void) => resolve(result),
      };
      for (const method of ["select", "eq", "is", "limit", "gt"]) chain[method] = () => chain;
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
    /^import .*;\r?\n/,
    "",
  );
  const compiled = transpileModule(source, {
    compilerOptions: { module: ModuleKind.None },
  }).outputText;
  const secret = "test-only-secret-at-least-32-characters";
  const env: Record<string, string> = {
    REPORT_DELIVERY_SECRET: secret,
    RESEND_API_KEY: "test",
    SUPABASE_URL: "http://localhost",
    SUPABASE_SERVICE_ROLE_KEY: "test",
  };
  new Function("Deno", "createClient", "fetch", compiled)(
    {
      env: { get: (key: string) => env[key] },
      serve: (fn: typeof handler) => {
        handler = fn;
      },
    },
    () => db,
    send,
  );
  const request = (authenticated = true) =>
    new Request("http://localhost/deliver-report", {
      method: "POST",
      headers: authenticated ? { "x-report-delivery-secret": secret } : {},
      body: JSON.stringify({
        orderId: "order",
        sessionId: "session",
        productCode: "BRAINRANK",
        locale: "pt",
        filename: "meqyro-brainrank-resultado.html",
        html: "<h1>Árvore e atenção</h1>",
        text: "Seu resultado: atenção",
        customer_email: "attacker@example.com",
      }),
    });
  return { handler, request, send, update };
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
  it("uses the purchased recipient and attaches the complete UTF-8 result", async () => {
    const test = harness();
    expect((await test.handler(test.request())).status).toBe(200);
    const init = test.send.mock.calls[0][1] as RequestInit;
    const payload = JSON.parse(init.body as string);
    expect(payload.to).toBe("buyer@example.com");
    expect(payload.text).toContain("Seu resultado: atenção");
    expect(Buffer.from(payload.attachments[0].content, "base64").toString("utf8")).toBe(
      "<h1>Árvore e atenção</h1>",
    );
    expect(test.update).toHaveBeenCalledWith(
      expect.objectContaining({ confirmation_email_message_id: "email-123" }),
    );
  });
  it("does not send an already delivered report again", async () => {
    const test = harness("FULFILLED", true);
    expect((await test.handler(test.request())).status).toBe(200);
    expect(test.send).not.toHaveBeenCalled();
  });
});
