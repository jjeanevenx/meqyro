export type ResultDeliveryEmailInput = {
  recipientEmail: string;
  locale: string;
  quizSlug: string;
  sessionId: string;
  recoveryToken: string;
  unsubscribeToken?: string;
};

export type DataRequestEmailInput = {
  recipientEmail: string;
  locale: string;
  requestType: string;
  verificationToken: string;
};

export type EmailResult = {
  success: boolean;
  messageId?: string;
};
