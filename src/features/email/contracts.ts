export type ResultDeliveryEmailInput = {
  recipientEmail: string;
  locale: string;
  quizSlug: string;
  sessionId: string;
  recoveryToken: string;
  unsubscribeToken?: string;
};

export type SessionRecoveryEmailInput = {
  recipientEmail: string;
  locale: string;
  quizSlug: string;
  sessionId: string;
  recoveryToken: string;
};

export type DataRequestEmailInput = {
  recipientEmail: string;
  locale: string;
  requestType: string;
  verificationToken: string;
};

export type PurchaseConfirmationEmailInput = {
  recipientEmail: string;
  locale: string;
  orderNumber: string;
  amount: number;
  currency: string;
  sessionId: string;
  resultToken?: string;
};

export type RefundEmailInput = {
  recipientEmail: string;
  locale: string;
  orderNumber: string;
  amount: number;
  currency: string;
};

export type ReportAccessEmailInput = {
  recipientEmail: string;
  locale: string;
  reportUrls: string[];
};

export type CoupleInviteEmailInput = {
  recipientEmail: string;
  locale: string;
  partnerName?: string;
  inviteCode: string;
};

export type CoupleUnlockedEmailInput = {
  recipientEmail: string;
  locale: string;
  inviteCode: string;
  comparisonUrl: string;
};

export type EmailResult = {
  success: boolean;
  messageId?: string;
  error?: string;
};
