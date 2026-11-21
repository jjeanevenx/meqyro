import process from "node:process";

// Vercel injects deployment variables before running this command. Local builds
// remain usable with test credentials; explicit production checks never load a file.
if (process.env.VERCEL_ENV === "production" || process.argv.includes("--production")) {
  const issues = [];
  const env = process.env;
  function required(name, valid = (value) => value.length > 0) {
    const value = env[name]?.trim();
    if (!value || !valid(value)) issues.push(name);
  }
  const https = (value) => {
    try {
      const url = new URL(value);
      return (
        url.protocol === "https:" && !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
      );
    } catch {
      return false;
    }
  };
  const role = (value) => {
    try {
      return JSON.parse(Buffer.from(value.split(".")[1], "base64url").toString()).role;
    } catch {
      return null;
    }
  };
  required("NEXT_PUBLIC_SITE_URL", https);
  required("NEXT_PUBLIC_SUPABASE_URL", https);
  required(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    (value) => value.startsWith("sb_publishable_") || role(value) === "anon",
  );
  required(
    "SUPABASE_SECRET_KEY",
    (value) => value.startsWith("sb_secret_") || role(value) === "service_role",
  );
  for (const name of ["TOKEN_SECURITY_SECRET", "ADMIN_API_SECRET", "CRON_SECRET"])
    required(name, (value) => value.length >= 16);
  required("REPORT_DELIVERY_SECRET", (value) => value.length >= 32);
  required("STRIPE_SECRET_KEY", (value) => /^(sk|rk)_live_\S+$/.test(value));
  required("STRIPE_WEBHOOK_SECRET", (value) => /^whsec_\S+$/.test(value));
  required("SMTP_HOST");
  required("SMTP_PORT", (value) => value === "465");
  required("SMTP_USER", (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
  required("SMTP_PASSWORD");
  required("EMAIL_FROM", (value) => /[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+/.test(value));
  if (issues.length) {
    process.stderr.write(
      `Production configuration missing or invalid: ${issues.join(", ")}. Configure the Production target before building. Values are never printed.\n`,
    );
    process.exitCode = 1;
  } else {
    process.stdout.write(
      "Production environment configuration passed. Provider connectivity and end-to-end delivery still require acceptance.\n",
    );
  }
}
