export const sessionStates = ["CREATED", "IN_PROGRESS", "COMPLETED", "EXPIRED"] as const;
export const attemptStates = ["ACTIVE", "COMPLETED", "ABANDONED", "EXPIRED"] as const;
export const orderStates = [
  "CREATED",
  "PROCESSING",
  "PENDING",
  "PAID",
  "FULFILLED",
  "FAILED",
  "CANCELLED",
  "EXPIRED",
  "REFUNDED",
] as const;
export const eventStates = ["RECEIVED", "VERIFIED", "PROCESSED", "REJECTED"] as const;
export const grantStates = ["PENDING", "ACTIVE", "REVOKED"] as const;

export type SessionState = (typeof sessionStates)[number];
export type AttemptState = (typeof attemptStates)[number];
export type OrderState = (typeof orderStates)[number];
export type EventState = (typeof eventStates)[number];
export type GrantState = (typeof grantStates)[number];

type TransitionMap<T extends string> = Readonly<Record<T, readonly T[]>>;

export const sessionTransitions: TransitionMap<SessionState> = {
  CREATED: ["IN_PROGRESS", "EXPIRED"],
  IN_PROGRESS: ["COMPLETED", "EXPIRED"],
  COMPLETED: [],
  EXPIRED: [],
};
export const attemptTransitions: TransitionMap<AttemptState> = {
  ACTIVE: ["COMPLETED", "ABANDONED", "EXPIRED"],
  COMPLETED: [],
  ABANDONED: [],
  EXPIRED: [],
};
export const orderTransitions: TransitionMap<OrderState> = {
  CREATED: ["PROCESSING", "FAILED", "CANCELLED"],
  // A verified payment can arrive before checkout creation finishes persisting.
  PROCESSING: ["PENDING", "FULFILLED", "FAILED", "CANCELLED"],
  PENDING: ["PAID", "FULFILLED", "FAILED", "CANCELLED", "EXPIRED"],
  PAID: ["FULFILLED", "REFUNDED"],
  FULFILLED: ["REFUNDED"],
  FAILED: [],
  CANCELLED: ["FULFILLED"],
  EXPIRED: [],
  REFUNDED: [],
};
export const eventTransitions: TransitionMap<EventState> = {
  RECEIVED: ["VERIFIED", "REJECTED"],
  VERIFIED: ["PROCESSED", "REJECTED"],
  PROCESSED: [],
  REJECTED: [],
};
export const grantTransitions: TransitionMap<GrantState> = {
  PENDING: ["ACTIVE", "REVOKED"],
  ACTIVE: ["REVOKED"],
  REVOKED: [],
};

export function assertTransition<T extends string>(
  entity: string,
  current: T,
  next: T,
  transitions: TransitionMap<T>,
): T {
  if (!transitions[current].includes(next)) {
    throw new Error(`Invalid ${entity} transition: ${current} -> ${next}`);
  }
  return next;
}
