import { describe, expect, it } from "vitest";
import { money } from "@/lib/domain/money";
import {
  assertTransition,
  eventTransitions,
  grantTransitions,
  orderTransitions,
  sessionTransitions,
} from "@/lib/domain/states";

describe("domain contracts", () => {
  it("keeps money in integer minor units", () => {
    expect(money(1290, "BRL")).toEqual({ amount: 1290, currency: "BRL" });
    expect(() => money(12.9, "BRL")).toThrow(/minor units/);
  });

  it("accepts intended transitions", () => {
    expect(assertTransition("session", "CREATED", "IN_PROGRESS", sessionTransitions)).toBe(
      "IN_PROGRESS",
    );
    expect(assertTransition("order", "PENDING", "PAID", orderTransitions)).toBe("PAID");
    expect(assertTransition("event", "VERIFIED", "PROCESSED", eventTransitions)).toBe("PROCESSED");
    expect(assertTransition("grant", "ACTIVE", "REVOKED", grantTransitions)).toBe("REVOKED");
  });

  it("rejects invalid or reversible terminal transitions", () => {
    expect(() =>
      assertTransition("session", "COMPLETED", "IN_PROGRESS", sessionTransitions),
    ).toThrow();
    expect(() => assertTransition("order", "PAID", "PENDING", orderTransitions)).toThrow();
    expect(() => assertTransition("grant", "REVOKED", "ACTIVE", grantTransitions)).toThrow();
  });
});
