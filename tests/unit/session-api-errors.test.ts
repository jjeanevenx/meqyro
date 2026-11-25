import { describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST as save } from "@/app/api/sessions/[id]/answers/route";
import { POST as complete } from "@/app/api/sessions/[id]/complete/route";

const state = vi.hoisted(() => ({ save: vi.fn(), complete: vi.fn() }));
vi.mock("@/features/quiz-engine/session-service", () => ({
  saveAnswer: state.save,
  completeQuizSession: state.complete,
}));
vi.mock("@/features/email/completed-report-delivery", () => ({
  deliverCompletedReports: vi.fn(),
}));

function request() {
  return new NextRequest("https://meqyro.com/api/sessions/test", {
    method: "POST",
    headers: { cookie: "meqyro_session=test-token", "content-type": "application/json" },
    body: JSON.stringify({ questionId: "question" }),
  });
}

const context = { params: Promise.resolve({ id: "test" }) };

describe("Session API error disclosure", () => {
  it("does not expose database details when saving an answer fails", async () => {
    state.save.mockRejectedValueOnce(new Error("private database constraint"));
    const response = await save(request(), context);
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Failed to save answer" });
  });

  it("does not expose database details when completing a session fails", async () => {
    state.complete.mockRejectedValueOnce(new Error("private database constraint"));
    const response = await complete(request(), context);
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Failed to complete quiz" });
  });

  it("preserves the forbidden status without exposing authorization details", async () => {
    const error = new Error("private authorization detail");
    error.name = "UnauthorizedSessionError";
    state.save.mockRejectedValueOnce(error);
    const response = await save(request(), context);
    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: "Unauthorized session access" });
  });
});
