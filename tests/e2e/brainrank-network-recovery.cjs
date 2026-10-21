// Focused UI regression: real QuizRunner with only its HTTP dependencies simulated.
// Run against the local Next app with the same Playwright env as brainrank-timing.cjs.
(async () => {
  const { default: assert } = await import("node:assert/strict");
  const { pathToFileURL } = await import("node:url");
  const base = process.env.E2E_BASE_URL || "http://localhost:3100";
  if (!["localhost", "127.0.0.1"].includes(new URL(base).hostname))
    throw new Error("This regression only runs against the local app");
  const { chromium } = await import(
    process.env.PLAYWRIGHT_MODULE_PATH
      ? pathToFileURL(process.env.PLAYWRIGHT_MODULE_PATH).href
      : "playwright"
  );
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.E2E_CHROMIUM_EXECUTABLE || undefined,
  });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.clock.install();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const id = "00000000-0000-4000-8000-000000000001";
    const questions = [1, 2].map((number) => ({
      id: `00000000-0000-4000-8000-00000000000${number + 1}`,
      stableKey: `FIXTURE_${number}`,
      position: number,
      kind: "SINGLE_CHOICE",
      prompt: `Pergunta de teste ${number}`,
      options: [
        {
          id: `option-${number}`,
          stableKey: `OPTION_${number}`,
          position: 1,
          label: "Alternativa",
        },
      ],
    }));
    const session = {
      id,
      quizVersionId: id,
      quizSlug: "brainrank",
      quizVersion: "1.0",
      scoringVersion: "1.0",
      locale: "pt",
      market: "BR",
      status: "CREATED",
      currentPosition: 1,
      memorySeen: [],
      expiresAt: "2099-01-01T00:00:00Z",
      answers: {},
    };
    const saved = new Set();
    let answerRequests = 0;
    let completionRequests = 0;
    let resultWrites = 0;
    let releaseAnswer;
    const answerGate = new Promise((resolve) => {
      releaseAnswer = resolve;
    });
    const summary = {
      sessionId: id,
      quizSlug: "brainrank",
      quizVersion: "1.0",
      scoringVersion: "1.0",
      overallScore: 0,
    };
    await page.route("**/api/sessions", (route) => route.fulfill({ json: { session, questions } }));
    await page.route(`**/api/sessions/${id}/question-clock`, (route) => {
      const questionId = route.request().postDataJSON().questionId;
      const now = Date.now();
      return route.fulfill({
        json: {
          questionStartedAt: new Date(now).toISOString(),
          questionExpiresAt: new Date(now + 30000).toISOString(),
          serverNow: new Date(now).toISOString(),
          timeLimitSeconds: 30,
          answered: saved.has(questionId),
          answerStatus: saved.has(questionId) ? "TIMEOUT" : undefined,
          currentPosition: saved.has(questionId) ? 2 : 1,
        },
      });
    });
    await page.route(`**/api/sessions/${id}/answers`, async (route) => {
      answerRequests++;
      const payload = route.request().postDataJSON();
      if (payload.questionId === questions[0].id) {
        assert.equal(payload.timeout, true);
        saved.add(payload.questionId);
        await route.abort("failed");
      } else {
        await answerGate;
        saved.add(payload.questionId);
        await route.fulfill({
          json: { success: true, currentPosition: 2, answerStatus: "ANSWERED" },
        });
      }
    });
    await page.route(`**/api/sessions/${id}/complete`, async (route) => {
      completionRequests++;
      if (completionRequests === 1) {
        await route.fulfill({ status: 503, json: { error: "Temporary failure" } });
      } else if (completionRequests === 2) {
        resultWrites++;
        await route.abort("failed");
      } else {
        await route.fulfill({ json: { result: summary } });
      }
    });
    await page.route(`**/api/sessions/${id}/result?*`, (route) =>
      route.fulfill({ json: { result: { summary, accessLevel: "FREE_PARTIAL" } } }),
    );

    await page.goto(`${base}/pt/quizzes/brainrank/play`);
    await page.waitForFunction(() =>
      /^\d{2}:\d{2}$/.test(document.querySelector('[role="timer"]')?.textContent || ""),
    );
    await page.clock.fastForward(31000);
    const retry = page.locator(".question-timer button");
    await retry.click();
    await page.waitForFunction(
      () => document.querySelector(".quiz-runner__counter")?.textContent?.trim() === "2 / 2",
    );
    assert.equal(await page.locator(".progress__track").getAttribute("aria-valuenow"), "50");
    assert.equal(
      answerRequests,
      1,
      "Lost timeout acknowledgement does not cause a second submission",
    );
    await page.getByRole("radio").first().click();
    await page.locator(".quiz-runner__submit-btn").click();
    await page.waitForFunction(
      () =>
        document.querySelector(".quiz-runner__submit-btn")?.getAttribute("aria-busy") === "true",
    );
    const frozenTime = await page.getByRole("timer").textContent();
    await page.clock.fastForward(5000);
    assert.equal(
      await page.getByRole("timer").textContent(),
      frozenTime,
      "Confirmation freezes the visible countdown",
    );
    assert.equal(await page.getByRole("radio").first().isDisabled(), true);
    releaseAnswer();
    await retry.click(); // Retry the temporary 503.
    await retry.click(); // Recover the successful completion whose response was lost.
    await page.waitForURL(/\/result\?session=/);
    assert.equal(answerRequests, 2, "Neither completion retry resubmits an answer");
    assert.equal(completionRequests, 3);
    assert.equal(resultWrites, 1);
    assert.deepEqual(errors, []);
    process.stdout.write(
      "PASS: saved timeout recovery, stopped countdown, failed completion and lost completion response\n",
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  process.stderr.write(error.stack + "\n");
  process.exitCode = 1;
});
