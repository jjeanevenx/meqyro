import nodemailer from "nodemailer";
import { describe, expect, it } from "vitest";
import { renderTransactionalEmail } from "@/lib/email/branded-template";

describe("branded email MIME delivery", () => {
  it("includes both the HTML body and plain text alternative in a real MIME message", async () => {
    const transport = nodemailer.createTransport({ streamTransport: true, buffer: true });
    const text = "Seu relatório está no anexo.\n\nhttps://meqyro.com/pt/results/example";
    const html = renderTransactionalEmail({
      locale: "pt",
      subject: "Seu resultado está pronto",
      text,
    });
    const sent = await transport.sendMail({
      from: "Meqyro <noreply@example.com>",
      to: "recipient@example.com",
      subject: "Seu resultado está pronto",
      text,
      html,
      attachments: [
        {
          filename: "resultado.html",
          content: "<h1>Relatório</h1>",
          contentType: "text/html; charset=utf-8",
        },
      ],
    });
    const message = sent.message.toString("utf8");
    expect(message).toContain("multipart/alternative");
    expect(message).toContain("multipart/mixed");
    expect(message).toContain("Content-Type: text/plain; charset=utf-8");
    expect(message.match(/Content-Type: text\/html; charset=utf-8/g)).toHaveLength(2);
    expect(message).toContain("Content-Disposition: attachment; filename=resultado.html");
    transport.close();
  });

  it("escapes message content and never turns unsafe protocols into action links", () => {
    const html = renderTransactionalEmail({
      locale: "pt",
      subject: '<img src=x onerror="alert(1)">',
      text: '<script>alert(1)</script>\n\njavascript:alert(1)\n\nhttps://meqyro.com/?a=1&b="value"',
    });
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<img");
    expect(html).not.toContain('href="javascript:');
    expect(html).toContain("&amp;b=&quot;value&quot;");
  });
});
