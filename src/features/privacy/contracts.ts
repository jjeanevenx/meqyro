export const CURRENT_POLICY_VERSION = "2026-09-v1";

export type ConsentType = "TRANSACTIONAL_RESULTS" | "MARKETING_PROMOTIONAL";

export type LeadCaptureInput = {
  sessionId: string;
  sessionToken: string;
  email: string;
  marketingConsent: boolean;
  locale: string;
  market: string;
  ip?: string;
  userAgent?: string;
};

export type LeadCaptureResult = {
  leadId: string;
  sessionId: string;
  maskedEmail: string;
  recoveryToken: string;
  unsubscribeToken?: string;
};

export type DataRequestType = "EXPORT" | "RECTIFICATION" | "DELETION";

export type DataRequestInput = {
  email: string;
  requestType: DataRequestType;
  details?: Record<string, unknown>;
  locale: string;
  market: string;
};

export type DataRequestResult = {
  success: boolean;
  message: string;
};

export type ConsentAuditEntry = {
  consentType: ConsentType;
  granted: boolean;
  policyVersion: string;
  createdAt: string;
};
