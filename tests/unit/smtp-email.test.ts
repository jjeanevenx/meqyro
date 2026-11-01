import { afterEach, describe, expect, it, vi } from "vitest";
import {
  sendResultDeliveryEmail,
  sendSessionRecoveryEmail,
  sendDataRequestEmail,
  sendPurchaseConfirmationEmail,
  sendRefundEmail,
  sendReportAccessEmail,
  sendCoupleInviteEmail,
  sendCoupleUnlockedEmail,
} from "@/features/email/email-service";
import { experiences } from "@/content/experiences";

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

describe("template coverage across assessments and email flows", () => {
  function configureSmtp() {
    vi.stubEnv("SMTP_USER", "sender@example.com");
    vi.stubEnv("SMTP_PASSWORD", "test-only-password");
    smtp.createTransport.mockReturnValue({ sendMail: smtp.sendMail, close: smtp.close });
    smtp.sendMail.mockResolvedValue({
      messageId: "email-message",
      accepted: [input.recipientEmail],
      rejected: [],
    });
  }

  const cases = experiences.flatMap(({ slug, brand }) =>
    ["pt", "en", "es", "fr"].map((locale) => ({ slug, brand, locale })),
  );
  it.each(cases)(
    "uses HTML for saved results and recovery: $slug / $locale",
    async ({ slug, brand, locale }) => {
      configureSmtp();
      await sendResultDeliveryEmail({ ...input, quizSlug: slug, locale });
      await sendSessionRecoveryEmail({ ...input, quizSlug: slug, locale });
      for (const [message] of smtp.sendMail.mock.calls) {
        expect(message.html).toContain(`lang="${locale}"`);
        expect(message.html).toContain("MEQ<span");
        expect(message.html).toContain(
          `/${locale}/quizzes/${slug}/play?session=session&amp;recover=test-only-token`,
        );
        expect(message.html).toContain('bgcolor="#082da7"');
        expect(message.text).toContain("test-only-token");
      }
      expect(smtp.sendMail.mock.calls[0][0].html).toContain(brand);
    },
  );

  it.each(["pt", "en", "es", "fr"])(
    "uses the brand template for every other transactional flow in %s",
    async (locale) => {
      configureSmtp();
      const common = { recipientEmail: input.recipientEmail, locale };
      await sendDataRequestEmail({
        ...common,
        requestType: "export",
        verificationToken: "verification-token",
      });
      await sendPurchaseConfirmationEmail({
        ...common,
        orderNumber: "order-123",
        amount: 1290,
        currency: "BRL",
        sessionId: "session",
        resultToken: "result-token",
      });
      await sendRefundEmail({ ...common, orderNumber: "order-123", amount: 1290, currency: "BRL" });
      await sendReportAccessEmail({
        ...common,
        reportUrls: ["https://meqyro.com/pt/results/first", "https://meqyro.com/pt/results/second"],
      });
      await sendCoupleInviteEmail({ ...common, inviteCode: "invite-code" });
      await sendCoupleUnlockedEmail({
        ...common,
        inviteCode: "invite-code",
        comparisonUrl: "https://meqyro.com/pt/comparison",
      });
      expect(smtp.sendMail).toHaveBeenCalledTimes(6);
      for (const [message] of smtp.sendMail.mock.calls) {
        expect(message.html).toContain(`lang="${locale}"`);
        expect(message.html).toContain("MEQ<span");
        expect(message.html).toContain("max-width:560px");
        expect(message.text).toBeTruthy();
      }
      const reportAccess = smtp.sendMail.mock.calls[3][0].html;
      expect(reportAccess).toContain('href="https://meqyro.com/pt/results/first"');
      expect(reportAccess).toContain('href="https://meqyro.com/pt/results/second"');
    },
  );
});
