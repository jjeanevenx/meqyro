import fs from "node:fs";
import path from "node:path";
import { brainRankQuestions } from "../src/content/quizzes/brainrank";
import { personalityMapQuestions } from "../src/content/quizzes/personality-map";

function escapeSql(str: string): string {
  return str.replace(/'/g, "''");
}

export function generateSeedSql(): string {
  const lines: string[] = [
    "-- Meqyro database seed - Catalog & Quiz Engine content",
    "-- Auto-generated from src/content/quizzes",
    "",
    "-- 1. Quizzes",
    "insert into meqyro.quizzes (slug, product_code, active)",
    "values ('brainrank', 'BRAINRANK', true), ('personality-map', 'PERSONALITY_MAP', true)",
    "on conflict (slug) do update set active = true;",
    "",
    "-- 2. Quiz Versions",
    "insert into meqyro.quiz_versions (quiz_id, version, scoring_version, status, published_at)",
    "select id, '1.0', '1.0', 'APPROVED'::meqyro.content_status, now() from meqyro.quizzes",
    "on conflict (quiz_id, version) do update set status = 'APPROVED', scoring_version = '1.0';",
    "",
    "-- 3. Product Prices",
    "insert into meqyro.product_prices (quiz_id, market, currency, amount, active)",
    "select q.id, price.market, price.currency, price.amount, true",
    "from meqyro.quizzes q",
    "cross join (values ('BR','BRL',1290),('US','USD',299),('EU','EUR',299),('GB','GBP',249)) as price(market,currency,amount)",
    "where q.slug in ('brainrank', 'personality-map')",
    "on conflict (quiz_id, market, currency) do update set active = true, amount = excluded.amount;",
    "",
    "-- 4. BrainRank Questions and Options",
    "do $$",
    "declare",
    "  v_quiz_version_id uuid;",
    "  v_question_id uuid;",
    "  v_option_id uuid;",
    "begin",
    "  select qv.id into v_quiz_version_id",
    "  from meqyro.quiz_versions qv",
    "  join meqyro.quizzes q on q.id = qv.quiz_id",
    "  where q.slug = 'brainrank' and qv.version = '1.0';",
    "",
  ];

  // BrainRank questions
  for (const q of brainRankQuestions) {
    const scoringKeyJson = JSON.stringify({
      dimension: q.dimension,
      difficulty: q.difficulty,
    });
    const metadataJson = JSON.stringify(q.clue ? { clue: q.clue } : {});

    lines.push(`  -- Question ${q.position}: ${q.stableKey}`);
    lines.push(`  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)`);
    lines.push(`  values (v_quiz_version_id, '${q.stableKey}', ${q.position}, 'SINGLE_CHOICE', '${scoringKeyJson}'::jsonb, '${escapeSql(metadataJson)}'::jsonb)`);
    lines.push(`  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key, metadata = excluded.metadata`);
    lines.push(`  returning id into v_question_id;`);
    lines.push("");

    // Question translations
    for (const [locale, promptText] of Object.entries(q.prompt)) {
      lines.push(`  insert into meqyro.question_translations (question_id, locale, prompt)`);
      lines.push(`  values (v_question_id, '${locale}', '${escapeSql(promptText)}')`);
      lines.push(`  on conflict (question_id, locale) do update set prompt = excluded.prompt;`);
    }
    lines.push("");

    // Options
    for (const opt of q.options) {
      const scoringVal = JSON.stringify({ isCorrect: opt.isCorrect });
      lines.push(`  insert into meqyro.options (question_id, stable_key, position, scoring_value)`);
      lines.push(`  values (v_question_id, '${opt.stableKey}', ${opt.position}, '${scoringVal}'::jsonb)`);
      lines.push(`  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value`);
      lines.push(`  returning id into v_option_id;`);

      for (const [locale, labelText] of Object.entries(opt.label)) {
        lines.push(`  insert into meqyro.option_translations (option_id, locale, label)`);
        lines.push(`  values (v_option_id, '${locale}', '${escapeSql(labelText)}')`);
        lines.push(`  on conflict (option_id, locale) do update set label = excluded.label;`);
      }
    }
    lines.push("");
  }

  lines.push("end $$;");
  lines.push("");

  // Personality Map questions
  lines.push("-- 5. Personality Map Questions");
  lines.push("do $$");
  lines.push("declare");
  lines.push("  v_quiz_version_id uuid;");
  lines.push("  v_question_id uuid;");
  lines.push("begin");
  lines.push("  select qv.id into v_quiz_version_id");
  lines.push("  from meqyro.quiz_versions qv");
  lines.push("  join meqyro.quizzes q on q.id = qv.quiz_id");
  lines.push("  where q.slug = 'personality-map' and qv.version = '1.0';");
  lines.push("");

  for (const q of personalityMapQuestions) {
    const scoringKeyJson = JSON.stringify({
      dimension: q.dimension,
      direction: q.direction,
    });

    lines.push(`  -- Question ${q.position}: ${q.stableKey}`);
    lines.push(`  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)`);
    lines.push(`  values (v_quiz_version_id, '${q.stableKey}', ${q.position}, 'LIKERT', '${scoringKeyJson}'::jsonb)`);
    lines.push(`  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key`);
    lines.push(`  returning id into v_question_id;`);
    lines.push("");

    // Question translations
    for (const [locale, promptText] of Object.entries(q.prompt)) {
      lines.push(`  insert into meqyro.question_translations (question_id, locale, prompt)`);
      lines.push(`  values (v_question_id, '${locale}', '${escapeSql(promptText)}')`);
      lines.push(`  on conflict (question_id, locale) do update set prompt = excluded.prompt;`);
    }
    lines.push("");
  }

  lines.push("end $$;");
  lines.push("");

  return lines.join("\n");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const sql = generateSeedSql();
  const targetPath = path.resolve(import.meta.dirname, "../supabase/seed.sql");
  fs.writeFileSync(targetPath, sql, "utf8");
  console.log(`Updated ${targetPath} (${sql.length} bytes)`);
}
