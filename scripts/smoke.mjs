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
  await verify("/pt/quizzes/brainrank", "BrainRank");
  await verify("/en/quizzes/personality-map", "Personality Map");
  await verify("/pt/quizzes/careerfit", "CareerFit");
  await verify("/en/quizzes/moneydna", "MoneyDNA");
  await verify("/pt/quizzes/focusstyle", "FocusStyle");
  await verify("/es/quizzes/decisiondna", "DecisionDNA");
  await verify("/pt/quizzes/coupledna", "CoupleDNA");
  await verify("/pt/legal/privacy", "Política de Privacidade");
  await verify("/pt/legal/terms", "Termos de Uso");
  await verify("/pt/privacy/data-request", "Exercício de Direitos");
  await verify("/pt/unsubscribe", "unsubscribe-card");
  await verify("/pt/checkout", "checkout-shell");
  await verify("/pt/checkout/success", "checkout-return-card");
  await verify("/pt/checkout/pending", "checkout-return-card");
  await verify("/pt/checkout/failed", "checkout-return-card");
  await verify("/sitemap.xml", "<urlset");
  await verify("/robots.txt", "Disallow");
} finally {
  if (server) server.kill();
}
