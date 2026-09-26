import { spawn } from "node:child_process";
import process from "node:process";

const port = process.env.SMOKE_PORT ?? "3100";
const baseUrl = process.env.SMOKE_BASE_URL ?? `http://127.0.0.1:${port}`;
const nextBin = new URL("../node_modules/next/dist/bin/next", import.meta.url);
const server = process.env.SMOKE_BASE_URL
  ? null
  : spawn(process.execPath, [nextBin.pathname.slice(1), "start", "-p", port], {
      cwd: new URL("..", import.meta.url),
      stdio: ["ignore", "pipe", "pipe"],
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

async function verify(path, expected) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: "manual" });
  const body = await response.text();
  if (!response.ok || !body.includes(expected)) {
    throw new Error(`${path} failed: ${response.status}; expected ${JSON.stringify(expected)}`);
  }
  console.log(`PASS ${path} (${response.status})`);
}

try {
  await waitUntilReady();
  await verify("/api/health", '"status":"ok"');
  await verify("/pt", "Descubra mais sobre você");
  await verify("/en", "Discover more about you");
  await verify("/es", "Descubre más sobre ti");
  await verify("/fr", "Découvrez-en davantage sur vous");

  // Catalog and Landing
  await verify("/pt/discover", "Catálogo");
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
  await verify("/api/admin/metrics", '"metrics"');
  await verify("/sitemap.xml", "<urlset");
  await verify("/robots.txt", "Disallow");
} finally {
  if (server) server.kill();
}
