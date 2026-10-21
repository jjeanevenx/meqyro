// Run against a local Next server: node tests/e2e/brainrank-timing.cjs
// PLAYWRIGHT_MODULE_PATH may point to an existing bundled Playwright installation.
const base = process.env.E2E_BASE_URL || "http://localhost:3100";
if (!["localhost", "127.0.0.1"].includes(new URL(base).hostname))
  throw new Error("This suite only changes local test attempts");
const output = process.env.E2E_OUTPUT_DIR;
const continueLabels = { pt: "Continuar", en: "Continue", es: "Continuar", fr: "Continuer" };

(async () => {
  const { default: assert } = await import("node:assert/strict");
  const fs = await import("node:fs");
  const path = await import("node:path");
  const { pathToFileURL } = await import("node:url");
  const { createClient } = await import("@supabase/supabase-js");
  const pwModule = process.env.PLAYWRIGHT_MODULE_PATH
    ? pathToFileURL(path.resolve(process.env.PLAYWRIGHT_MODULE_PATH)).href
    : "playwright";
  const { chromium } = await import(pwModule);
  new Function(fs.readFileSync(path.join(__dirname, "../setup.ts"), "utf8"))();
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
    db: { schema: "meqyro" },
  });
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.E2E_CHROMIUM_EXECUTABLE || undefined,
  });
  const checks = [];
  try {
    for (const locale of ["pt", "en", "es", "fr"]) {
      const context = await browser.newContext({
        viewport: locale === "pt" ? { width: 1440, height: 1000 } : { width: 390, height: 844 },
      });
      const page = await context.newPage();
      await page.clock.install();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      const sessionResponse = page.waitForResponse(
        (r) => new URL(r.url()).pathname === "/api/sessions" && r.request().method() === "POST",
      );
      await page.goto(`${base}/${locale}/quizzes/brainrank/play`);
      const created = await (await sessionResponse).json();
      assert.ok(created.session?.id, "Session was created");
      const id = created.session.id;
      await page.locator("#observation-title").waitFor();
      assert.equal(
        await page.getByRole("timer").count(),
        0,
        "Information has no evaluative countdown",
      );
      await page.getByRole("button", { name: continueLabels[locale], exact: true }).click();
      const timer = page.getByRole("timer");
      await page.waitForFunction(() =>
        /^\d{2}:\d{2}$/.test(document.querySelector('[role="timer"]')?.textContent || ""),
      );
      const { data: first } = await db
        .from("quiz_session_questions")
        .select("question_id,question_started_at,question_expires_at,time_limit_seconds")
        .eq("session_id", id)
        .eq("position", 1)
        .single();
      assert.ok(first?.question_started_at);
      const beforeTick = await timer.textContent();
      await page.clock.fastForward(1000);
      assert.notEqual(
        await timer.textContent(),
        beforeTick,
        "Countdown advances with a controlled clock",
      );
      await page.getByRole("radio").first().click();
      const { data: selected } = await db
        .from("quiz_session_questions")
        .select("question_started_at")
        .eq("session_id", id)
        .eq("position", 1)
        .single();
      assert.equal(
        selected.question_started_at,
        first.question_started_at,
        "Selecting does not restart the deadline",
      );
      await page.reload();
      await page.waitForFunction(() =>
        /^\d{2}:\d{2}$/.test(document.querySelector('[role="timer"]')?.textContent || ""),
      );
      const { data: resumed } = await db
        .from("quiz_session_questions")
        .select("question_expires_at")
        .eq("session_id", id)
        .eq("position", 1)
        .single();
      assert.equal(
        resumed.question_expires_at,
        first.question_expires_at,
        "Reload preserves the deadline",
      );
      assert.equal(
        await page.locator("#observation-title").count(),
        0,
        "Completed information does not reopen",
      );
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
        false,
        "No horizontal overflow",
      );
      if (output) {
        fs.mkdirSync(output, { recursive: true });
        await page.screenshot({
          path: path.join(output, `brainrank-${locale}.png`),
          fullPage: true,
        });
      }
      if (locale === "pt") {
        let completionRequests = 0;
        let answerRequests = 0;
        page.on("request", (request) => {
          if (new URL(request.url()).pathname === `/api/sessions/${id}/answers`) answerRequests++;
        });
        let lostAnswerResponse = false;
        await page.route(`**/api/sessions/${id}/answers`, async (route) => {
          if (!lostAnswerResponse) {
            lostAnswerResponse = true;
            const saved = await route.fetch();
            assert.equal(saved.status(), 200, "Timeout is saved before its response is lost");
            await route.abort("failed");
          } else {
            await route.continue();
          }
        });
        await page.route(`**/api/sessions/${id}/complete`, async (route) => {
          completionRequests++;
          if (completionRequests === 1) {
            const completed = await route.fetch();
            assert.equal(completed.status(), 200, "Server completes before the response is lost");
            await route.abort("failed");
          } else {
            await route.continue();
          }
        });
        // Control persisted deadlines rather than waiting in real time or trusting the device clock.
        const { error } = await db
          .from("quiz_session_questions")
          .update({
            question_started_at: "2000-01-01T00:00:00Z",
            question_expires_at: "2000-01-01T00:00:30Z",
          })
          .eq("session_id", id)
          .eq("position", 1);
        assert.equal(error, null);
        await page.reload();
        await page.locator(".question-timer button").click();
        await page.waitForFunction(
          () => document.querySelector(".quiz-runner__counter")?.textContent?.trim() === "2 / 24",
        );
        assert.equal(answerRequests, 1, "Recovery reads the saved timeout without resubmitting it");
        assert.equal(
          await page.locator(".progress__track").getAttribute("aria-valuenow"),
          "4",
          "Recovered timeout contributes to visible progress",
        );
        const { data: expired } = await db
          .from("answers")
          .select("answer_status,option_id,duration_ms")
          .eq("session_id", id)
          .eq("question_id", first.question_id)
          .single();
        assert.equal(expired.answer_status, "TIMEOUT");
        assert.equal(expired.option_id, null);
        assert.equal(expired.duration_ms, first.time_limit_seconds * 1000);
        for (let position = 2; position <= 24; position++) {
          if (await page.locator("#observation-title").isVisible())
            await page.getByRole("button", { name: "Continuar", exact: true }).click();
          await page.waitForFunction(
            () => document.querySelector('[role="radio"]')?.disabled === false,
          );
          await page.getByRole("radio").first().click();
          const response = page.waitForResponse(
            (r) =>
              r.url().includes(`/api/sessions/${id}/answers`) && r.request().method() === "POST",
          );
          await page.locator(".quiz-runner__submit-btn").click();
          assert.equal((await response).status(), 200);
          if (position < 24)
            await page.waitForFunction(
              (expected) =>
                document.querySelector(".quiz-runner__counter")?.textContent?.trim() ===
                  `${expected} / 24` || !!document.querySelector("#observation-title"),
              position + 1,
            );
        }
        const retry = page.locator(".question-timer button");
        await retry.waitFor();
        const requestsBeforeRetry = answerRequests;
        await retry.click();
        await page.waitForURL(/\/result\?session=/);
        assert.equal(completionRequests, 2, "Completion recovers after a lost response");
        assert.equal(
          answerRequests,
          requestsBeforeRetry,
          "Retry does not resubmit the final answer",
        );
        const { data: result } = await db
          .from("results")
          .select("score")
          .eq("session_id", id)
          .single();
        assert.equal(result.score.timing.measuredQuestions, 24);
        assert.equal(result.score.timing.timeouts, 1);
        assert.equal(result.score.timing.memory.total, 3);
        const { count: resultCount } = await db
          .from("results")
          .select("id", { count: "exact", head: true })
          .eq("session_id", id);
        assert.equal(resultCount, 1, "Completion recovery preserves one result");
      }
      assert.deepEqual(errors, [], "No uncaught browser errors");
      checks.push({ locale, viewport: page.viewportSize(), passed: true });
      await context.close();
    }
    process.stdout.write(JSON.stringify({ checks }, null, 2) + "\n");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  process.stderr.write(error.stack + "\n");
  process.exitCode = 1;
});
