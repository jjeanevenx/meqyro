import { spawn } from "node:child_process";
import process from "node:process";
import { fileURLToPath } from "node:url";

const port = process.env.SMOKE_PORT ?? "3100";
const baseUrl = process.env.SMOKE_BASE_URL ?? `http://127.0.0.1:${port}`;
const nextBin = new URL("../node_modules/next/dist/bin/next", import.meta.url);
const adminSecret = process.env.ADMIN_API_SECRET ?? "admin-super-secure-secret-token-meqyro-v1";
const server = process.env.SMOKE_BASE_URL
  ? null
  : spawn(process.execPath, [fileURLToPath(nextBin), "start", "-p", port], {
      cwd: new URL("..", import.meta.url),
      stdio: ["ignore", "pipe", "pipe"],
      env: {
        ...process.env,
        ADMIN_API_SECRET: adminSecret,
      },
    });

async function waitUntilReady() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/api/health`);
      if (response.ok) return;
    } catch {
      // The server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Smoke server did not become ready at ${baseUrl}`);
}

async function verify(path, expected, options = {}) {
  const displayPath = path.split("?")[0];
  const headers = options.headers ?? {};
  const response = await fetch(`${baseUrl}${path}`, { redirect: "manual", headers });
  const body = await response.text();
  if (!response.ok || !body.includes(expected)) {
    throw new Error(
      `${displayPath} failed: ${response.status}; expected ${JSON.stringify(expected)}`,
    );
  }
  console.log(`PASS ${displayPath} (${response.status})`);
}

try {
  await waitUntilReady();
  await verify("/api/health", '"status":"ok"');
  await verify("/pt", "Entenda como você pensa.");
  await verify("/en", "Understand how you think.");
  await verify("/es", "Entiende cómo piensas.");
  await verify("/fr", "Comprenez comment vous pensez.");

  // Catalog and Landing
  await verify("/pt/discover", "Escolha uma experiência");
  await verify("/pt/quizzes/brainrank", "BrainRank");
  await verify("/en/quizzes/personality-map", "Personality Map");
  await verify("/pt/quizzes/careerfit", "CareerFit");
  await verify("/en/quizzes/moneydna", "MoneyDNA");
  await verify("/pt/quizzes/focusstyle", "FocusStyle");
  await verify("/es/quizzes/decisiondna", "DecisionDNA");
  await verify("/pt/quizzes/coupledna", "CoupleDNA");

  // Play Runners (Render interactive QuizRunner shell)
  await verify("/pt/quizzes/brainrank/play", "quiz-runner");
  await verify("/pt/quizzes/personality-map/play", "quiz-runner");
  await verify("/pt/quizzes/careerfit/play", "quiz-runner");
  await verify("/pt/quizzes/moneydna/play", "quiz-runner");
  await verify("/pt/quizzes/focusstyle/play", "quiz-runner");
  await verify("/pt/quizzes/decisiondna/play", "quiz-runner");
  await verify("/pt/quizzes/coupledna/play", "quiz-runner");

  // Editorial & Institutional
  await verify("/pt/articles", "Artigos");
  await verify("/pt/articles/how-logical-reasoning-works", "Como funciona o raciocínio");
  await verify("/pt/contact", "support@meqyro.com");
  await verify("/pt/cookies", "Cookies");
  await verify("/pt/legal/privacy", "Política de Privacidade");
  await verify("/pt/legal/terms", "Termos de Uso");

  // Privacy & Commerce
  await verify("/pt/privacy/data-request", "Exercício de Direitos");
  await verify("/pt/unsubscribe", "unsubscribe-card");
  await verify("/pt/checkout", "checkout-shell");
  await verify("/pt/checkout/success", "checkout-return-card");
  await verify("/pt/checkout/pending", "checkout-return-card");
  await verify("/pt/checkout/failed", "checkout-return-card");

  // Admin & SEO
  await verify("/pt/admin", "Painel de Operações");
  await verify(`/pt/admin?token=${adminSecret}`, "Painel de Operações Meqyro");

  // Verify unauthorized admin metrics is blocked (401)
  const unauthRes = await fetch(`${baseUrl}/api/admin/metrics`);
  if (unauthRes.status !== 401) {
    throw new Error(`/api/admin/metrics unauth gate failed with status ${unauthRes.status}`);
  }
  console.log("PASS /api/admin/metrics (401 Unauthorized Gate)");

  // Verify authenticated admin metrics succeeds (200)
  await verify("/api/admin/metrics", '"metrics"', {
    headers: { "x-admin-token": adminSecret },
  });
  await verify("/sitemap.xml", "<urlset");
  await verify("/robots.txt", "Disallow");
} finally {
  if (server) server.kill();
}
