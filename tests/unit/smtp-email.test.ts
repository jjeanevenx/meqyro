import { afterEach, describe, expect, it, vi } from "vitest";
import { sendResultDeliveryEmail, sendSessionRecoveryEmail } from "@/features/email/email-service";

const smtp = vi.hoisted(() => ({ sendMail: vi.fn(), close: vi.fn(), createTransport: vi.fn() }));
vi.mock("nodemailer", () => ({ default: { createTransport: smtp.createTransport } }));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

const input = {
  recipientEmail: "recipient@example.com",
  sessionId: "session",
  recoveryToken: "test-only-token",
  locale: "pt",
  quizSlug: "brainrank",
};

describe("Hostinger transactional SMTP", () => {
  it("requires SMTP credentials in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("SMTP_USER", "");
    vi.stubEnv("SMTP_PASSWORD", "");
    expect((await sendSessionRecoveryEmail(input)).success).toBe(false);
    expect(smtp.createTransport).not.toHaveBeenCalled();
  });
  it("uses encrypted SMTP and closes the connection after sending", async () => {
    vi.stubEnv("SMTP_USER", "sender@example.com");
    vi.stubEnv("SMTP_PASSWORD", "test-only-password");
    smtp.createTransport.mockReturnValue({ sendMail: smtp.sendMail, close: smtp.close });
    smtp.sendMail.mockResolvedValue({
      messageId: "smtp-message",
      accepted: [input.recipientEmail],
      rejected: [],
    });
    expect(await sendSessionRecoveryEmail(input)).toEqual({
      success: true,
      messageId: "smtp-message",
    });
    expect(smtp.createTransport).toHaveBeenCalledWith(
      expect.objectContaining({
        host: "smtp.hostinger.com",
        port: 465,
        secure: true,
        tls: { minVersion: "TLSv1.2", rejectUnauthorized: true },
      }),
    );
    expect(smtp.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: input.recipientEmail,
        text: expect.stringContaining("test-only-token"),
      }),
    );
    expect(smtp.close).toHaveBeenCalled();
  });
  it("returns a generic error without leaking SMTP credentials or recipient", async () => {
    vi.stubEnv("SMTP_USER", "sender@example.com");
    vi.stubEnv("SMTP_PASSWORD", "test-only-password");
    smtp.createTransport.mockReturnValue({ sendMail: smtp.sendMail, close: smtp.close });
    smtp.sendMail.mockRejectedValue(new Error("test-only-password recipient@example.com"));
    expect(await sendSessionRecoveryEmail(input)).toEqual({
      success: false,
      error: "Email delivery failed.",
    });
    expect(smtp.close).toHaveBeenCalled();
  });
});

describe("branded result delivery email", () => {
  const actions = [
    ["pt", "Ver meu resultado"],
    ["en", "View my result"],
    ["es", "Ver mi resultado"],
    ["fr", "Voir mon résultat"],
  ];

  it.each(actions)("sends localized HTML and plain text for %s", async (locale, action) => {
    vi.stubEnv("SMTP_USER", "sender@example.com");
    vi.stubEnv("SMTP_PASSWORD", "test-only-password");
    smtp.createTransport.mockReturnValue({ sendMail: smtp.sendMail, close: smtp.close });
    smtp.sendMail.mockResolvedValue({
      messageId: "result-message",
      accepted: [input.recipientEmail],
      rejected: [],
    });

    expect(
      (
        await sendResultDeliveryEmail({
          ...input,
          locale,
          unsubscribeToken: "test-only-unsubscribe",
        })
      ).success,
    ).toBe(true);
    const message = smtp.sendMail.mock.calls[0][0];
    expect(message.html).toContain(`<html lang="${locale}">`);
    expect(message.html).toContain(action);
    expect(message.html).toContain("BrainRank");
    expect(message.html).toContain("session=session&amp;recover=test-only-token");
    expect(message.html).toContain(`/${locale}/unsubscribe?token=test-only-unsubscribe`);
    expect(message.text).toContain(action);
    expect(message.text).toContain("session=session&recover=test-only-token");
    expect(message.text).toContain("\n\n");
  });

  it("escapes dynamic URLs and omits unsubscribe when no token is provided", async () => {
    vi.stubEnv("SMTP_USER", "sender@example.com");
    vi.stubEnv("SMTP_PASSWORD", "test-only-password");
    smtp.createTransport.mockReturnValue({ sendMail: smtp.sendMail, close: smtp.close });
    smtp.sendMail.mockResolvedValue({
      messageId: "result-message",
      accepted: [input.recipientEmail],
      rejected: [],
    });

    await sendResultDeliveryEmail({ ...input, recoveryToken: 'token"<injected>' });
    const message = smtp.sendMail.mock.calls[0][0];
    expect(message.html).not.toContain("<injected>");
    expect(message.html).toContain("token&quot;&lt;injected&gt;");
    expect(message.html).not.toContain("/unsubscribe");
    expect(message.text).not.toContain("/unsubscribe");
  });
});
