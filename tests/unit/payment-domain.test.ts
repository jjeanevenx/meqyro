import { describe, expect, it } from "vitest";
import { resolvePaymentProvider } from "@/features/commerce/order-service";
import { assertTransition, orderTransitions } from "@/lib/domain/states";

describe("payment domain", () => {
  it("resolves Stripe for every market and currency", () => {
    expect(resolvePaymentProvider("BR", "BRL")).toBe("stripe");
    expect(resolvePaymentProvider("US", "USD")).toBe("stripe");
    expect(resolvePaymentProvider("EU", "EUR")).toBe("stripe");
    expect(resolvePaymentProvider("GB", "GBP")).toBe("stripe");
    expect(resolvePaymentProvider("BR", "USD")).toBe("stripe");
  });

  it("allows only explicit order state transitions", () => {
    expect(assertTransition("order", "CREATED", "PROCESSING", orderTransitions)).toBe("PROCESSING");
    expect(assertTransition("order", "PROCESSING", "PENDING", orderTransitions)).toBe("PENDING");
    expect(assertTransition("order", "PENDING", "FULFILLED", orderTransitions)).toBe("FULFILLED");
    expect(() => assertTransition("order", "FAILED", "FULFILLED", orderTransitions)).toThrow(
      /Invalid order transition/,
    );
  });
});
