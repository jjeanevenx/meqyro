import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "@/app/api/sessions/[id]/result/route";

const state = vi.hoisted(() => ({ result: vi.fn() }));
vi.mock("next/headers", () => ({ cookies: async () => ({ get: () => undefined }) }));
vi.mock("@/features/results/result-service", () => ({ getProtectedResult: state.result }));

beforeEach(() => {
  vi.resetAllMocks();
});

describe("Private result response headers", () => {
  it.each([200, 401, 403, 404, 400])("prevents caching for status %i", async (status) => {
    if (status === 200) state.result.mockResolvedValueOnce({ accessLevel: "PREMIUM_UNLOCKED" });
    if (status === 403) state.result.mockRejectedValueOnce(new Error("Token de acesso inválido"));
    if (status === 404) state.result.mockRejectedValueOnce(new Error("Sessão não encontrada"));
    if (status === 400) state.result.mockRejectedValueOnce(new Error("Internal error"));
    const request = new NextRequest("https://meqyro.com/api/sessions/test/result", {
      headers: status === 401 ? {} : { "x-session-token": "test-token" },
    });
    const response = await GET(request, { params: Promise.resolve({ id: "test" }) });
    expect(response.status).toBe(status);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(response.headers.get("referrer-policy")).toBe("no-referrer");
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
  });
});
