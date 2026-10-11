import { afterEach, describe, expect, it, vi } from "vitest";
import { sendSessionRecoveryEmail } from "@/features/email/email-service";

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
