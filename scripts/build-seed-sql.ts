import fs from "node:fs";
import path from "node:path";
import { brainRankQuestions } from "../src/content/quizzes/brainrank";
import { personalityMapQuestions } from "../src/content/quizzes/personality-map";
import { careerFitQuestions } from "../src/content/quizzes/careerfit";
import { moneyDnaQuestions } from "../src/content/quizzes/moneydna";
import { focusStyleQuestions } from "../src/content/quizzes/focusstyle";
import { decisionDnaScenarios } from "../src/content/quizzes/decisiondna";
import { coupleDnaQuestions } from "../src/content/quizzes/coupledna";

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
    "values ('brainrank', 'BRAINRANK', true), ('personality-map', 'PERSONALITY_MAP', true), ('careerfit', 'CAREERFIT', true), ('moneydna', 'MONEYDNA', true), ('focusstyle', 'FOCUSSTYLE', true), ('decisiondna', 'DECISIONDNA', true), ('coupledna', 'COUPLEDNA', true)",
    "on conflict (slug) do update set active = true;",
    "",
    "-- 2. Quiz Versions",
    "insert into meqyro.quiz_versions (quiz_id, version, scoring_version, status, published_at)",
    "select id, '1.0', '1.0', 'APPROVED'::meqyro.content_status, now() from meqyro.quizzes where slug in ('brainrank', 'personality-map')",
    "on conflict (quiz_id, version) do update set status = 'APPROVED', scoring_version = '1.0';",
    "",
    "insert into meqyro.quiz_versions (quiz_id, version, scoring_version, status, published_at)",
    "select id, 'v1.0.0', 'v1', 'PUBLISHED'::meqyro.content_status, now() from meqyro.quizzes where slug in ('careerfit', 'moneydna', 'focusstyle', 'decisiondna', 'coupledna')",
    "on conflict (quiz_id, version) do update set status = 'PUBLISHED', scoring_version = 'v1';",
    "",
    "-- 3. Product Prices",
    "insert into meqyro.product_prices (quiz_id, market, currency, amount, active)",
    "select q.id, price.market, price.currency, price.amount, true",
    "from meqyro.quizzes q",
    "cross join (values ('BR','BRL',1290),('US','USD',299),('EU','EUR',299),('GB','GBP',249)) as price(market,currency,amount)",
    "where q.slug in ('brainrank', 'personality-map')",
    "on conflict (quiz_id, market, currency) do update set active = true, amount = excluded.amount;",
    "",
    "insert into meqyro.product_prices (quiz_id, market, currency, amount, active)",
    "select q.id, price.market, price.currency, price.amount, true",
    "from meqyro.quizzes q",
    "cross join (values ('BR','BRL',1490),('US','USD',399),('EU','EUR',399),('GB','GBP',349)) as price(market,currency,amount)",
    "where q.slug in ('careerfit', 'moneydna', 'focusstyle', 'decisiondna', 'coupledna')",
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
    lines.push(
      `  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)`,
    );
    lines.push(
      `  values (v_quiz_version_id, '${q.stableKey}', ${q.position}, 'SINGLE_CHOICE', '${scoringKeyJson}'::jsonb, '${escapeSql(metadataJson)}'::jsonb)`,
    );
    lines.push(
      `  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key, metadata = excluded.metadata`,
    );
    lines.push(`  returning id into v_question_id;`);
    lines.push("");

    for (const [locale, promptText] of Object.entries(q.prompt)) {
      lines.push(`  insert into meqyro.question_translations (question_id, locale, prompt)`);
      lines.push(`  values (v_question_id, '${locale}', '${escapeSql(promptText)}')`);
      lines.push(`  on conflict (question_id, locale) do update set prompt = excluded.prompt;`);
    }
    lines.push("");

    for (const opt of q.options) {
      const scoringVal = JSON.stringify({ isCorrect: opt.isCorrect });
      lines.push(`  insert into meqyro.options (question_id, stable_key, position, scoring_value)`);
      lines.push(
        `  values (v_question_id, '${opt.stableKey}', ${opt.position}, '${scoringVal}'::jsonb)`,
      );
      lines.push(
        `  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value`,
      );
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
    lines.push(
      `  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)`,
    );
    lines.push(
      `  values (v_quiz_version_id, '${q.stableKey}', ${q.position}, 'LIKERT', '${scoringKeyJson}'::jsonb)`,
    );
    lines.push(
      `  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key`,
    );
    lines.push(`  returning id into v_question_id;`);
    lines.push("");

    for (const [locale, promptText] of Object.entries(q.prompt)) {
      lines.push(`  insert into meqyro.question_translations (question_id, locale, prompt)`);
      lines.push(`  values (v_question_id, '${locale}', '${escapeSql(promptText)}')`);
      lines.push(`  on conflict (question_id, locale) do update set prompt = excluded.prompt;`);
    }
    lines.push("");
  }
  lines.push("end $$;");
  lines.push("");

  // CareerFit questions
  lines.push("-- 6. CareerFit Questions");
  lines.push("do $$");
  lines.push("declare");
  lines.push("  v_quiz_version_id uuid;");
  lines.push("  v_question_id uuid;");
  lines.push("begin");
  lines.push("  select qv.id into v_quiz_version_id");
  lines.push("  from meqyro.quiz_versions qv");
  lines.push("  join meqyro.quizzes q on q.id = qv.quiz_id");
  lines.push("  where q.slug = 'careerfit' and qv.version = 'v1.0.0';");
  lines.push("");

  for (const q of careerFitQuestions) {
    const scoringKeyJson = JSON.stringify({ dimension: q.dimension });
    lines.push(`  -- Question ${q.position}: ${q.stableKey}`);
    lines.push(
      `  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)`,
    );
    lines.push(
      `  values (v_quiz_version_id, '${q.stableKey}', ${q.position}, 'LIKERT', '${scoringKeyJson}'::jsonb)`,
    );
    lines.push(
      `  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key`,
    );
    lines.push(`  returning id into v_question_id;`);
    lines.push("");

    for (const [locale, promptText] of Object.entries(q.prompt)) {
      lines.push(`  insert into meqyro.question_translations (question_id, locale, prompt)`);
      lines.push(`  values (v_question_id, '${locale}', '${escapeSql(promptText)}')`);
      lines.push(`  on conflict (question_id, locale) do update set prompt = excluded.prompt;`);
    }
    lines.push("");
  }
  lines.push("end $$;");
  lines.push("");

  // MoneyDNA questions
  lines.push("-- 7. MoneyDNA Questions");
  lines.push("do $$");
  lines.push("declare");
  lines.push("  v_quiz_version_id uuid;");
  lines.push("  v_question_id uuid;");
  lines.push("begin");
  lines.push("  select qv.id into v_quiz_version_id");
  lines.push("  from meqyro.quiz_versions qv");
  lines.push("  join meqyro.quizzes q on q.id = qv.quiz_id");
  lines.push("  where q.slug = 'moneydna' and qv.version = 'v1.0.0';");
  lines.push("");

  for (const q of moneyDnaQuestions) {
    const scoringKeyJson = JSON.stringify({ archetype: q.archetype });
    lines.push(`  -- Question ${q.position}: ${q.stableKey}`);
    lines.push(
      `  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)`,
    );
    lines.push(
      `  values (v_quiz_version_id, '${q.stableKey}', ${q.position}, 'LIKERT', '${scoringKeyJson}'::jsonb)`,
    );
    lines.push(
      `  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key`,
    );
    lines.push(`  returning id into v_question_id;`);
    lines.push("");

    for (const [locale, promptText] of Object.entries(q.prompt)) {
      lines.push(`  insert into meqyro.question_translations (question_id, locale, prompt)`);
      lines.push(`  values (v_question_id, '${locale}', '${escapeSql(promptText)}')`);
      lines.push(`  on conflict (question_id, locale) do update set prompt = excluded.prompt;`);
    }
    lines.push("");
  }
  lines.push("end $$;");
  lines.push("");

  // FocusStyle questions
  lines.push("-- 8. FocusStyle Questions");
  lines.push("do $$");
  lines.push("declare");
  lines.push("  v_quiz_version_id uuid;");
  lines.push("  v_question_id uuid;");
  lines.push("begin");
  lines.push("  select qv.id into v_quiz_version_id");
  lines.push("  from meqyro.quiz_versions qv");
  lines.push("  join meqyro.quizzes q on q.id = qv.quiz_id");
  lines.push("  where q.slug = 'focusstyle' and qv.version = 'v1.0.0';");
  lines.push("");

  for (const q of focusStyleQuestions) {
    const scoringKeyJson = JSON.stringify({ style: q.style });
    lines.push(`  -- Question ${q.position}: ${q.stableKey}`);
    lines.push(
      `  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)`,
    );
    lines.push(
      `  values (v_quiz_version_id, '${q.stableKey}', ${q.position}, 'LIKERT', '${scoringKeyJson}'::jsonb)`,
    );
    lines.push(
      `  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key`,
    );
    lines.push(`  returning id into v_question_id;`);
    lines.push("");

    for (const [locale, promptText] of Object.entries(q.prompt)) {
      lines.push(`  insert into meqyro.question_translations (question_id, locale, prompt)`);
      lines.push(`  values (v_question_id, '${locale}', '${escapeSql(promptText)}')`);
      lines.push(`  on conflict (question_id, locale) do update set prompt = excluded.prompt;`);
    }
    lines.push("");
  }
  lines.push("end $$;");
  lines.push("");

  // DecisionDNA scenarios
  lines.push("-- 9. DecisionDNA Scenarios");
  lines.push("do $$");
  lines.push("declare");
  lines.push("  v_quiz_version_id uuid;");
  lines.push("  v_question_id uuid;");
  lines.push("  v_option_id uuid;");
  lines.push("begin");
  lines.push("  select qv.id into v_quiz_version_id");
  lines.push("  from meqyro.quiz_versions qv");
  lines.push("  join meqyro.quizzes q on q.id = qv.quiz_id");
  lines.push("  where q.slug = 'decisiondna' and qv.version = 'v1.0.0';");
  lines.push("");

  for (const q of decisionDnaScenarios) {
    lines.push(`  -- Scenario ${q.position}: ${q.stableKey}`);
    lines.push(
      `  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)`,
    );
    lines.push(
      `  values (v_quiz_version_id, '${q.stableKey}', ${q.position}, 'SINGLE_CHOICE', '{}'::jsonb)`,
    );
    lines.push(`  on conflict (quiz_version_id, stable_key) do update set kind = 'SINGLE_CHOICE'`);
    lines.push(`  returning id into v_question_id;`);
    lines.push("");

    for (const [locale, promptText] of Object.entries(q.prompt)) {
      lines.push(`  insert into meqyro.question_translations (question_id, locale, prompt)`);
      lines.push(`  values (v_question_id, '${locale}', '${escapeSql(promptText)}')`);
      lines.push(`  on conflict (question_id, locale) do update set prompt = excluded.prompt;`);
    }
    lines.push("");

    for (let optIdx = 0; optIdx < q.options.length; optIdx++) {
      const opt = q.options[optIdx];
      const optPosition = optIdx + 1;
      const scoringVal = JSON.stringify({ style: opt.style });
      lines.push(`  insert into meqyro.options (question_id, stable_key, position, scoring_value)`);
      lines.push(
        `  values (v_question_id, '${opt.stableKey}', ${optPosition}, '${scoringVal}'::jsonb)`,
      );
      lines.push(
        `  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value`,
      );
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

  // CoupleDNA questions
  lines.push("-- 10. CoupleDNA Questions");
  lines.push("do $$");
  lines.push("declare");
  lines.push("  v_quiz_version_id uuid;");
  lines.push("  v_question_id uuid;");
  lines.push("begin");
  lines.push("  select qv.id into v_quiz_version_id");
  lines.push("  from meqyro.quiz_versions qv");
  lines.push("  join meqyro.quizzes q on q.id = qv.quiz_id");
  lines.push("  where q.slug = 'coupledna' and qv.version = 'v1.0.0';");
  lines.push("");

  for (const q of coupleDnaQuestions) {
    const scoringKeyJson = JSON.stringify({ dimension: q.dimension });
    lines.push(`  -- Question ${q.position}: ${q.stableKey}`);
    lines.push(
      `  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)`,
    );
    lines.push(
      `  values (v_quiz_version_id, '${q.stableKey}', ${q.position}, 'LIKERT', '${scoringKeyJson}'::jsonb)`,
    );
    lines.push(
      `  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key`,
    );
    lines.push(`  returning id into v_question_id;`);
    lines.push("");

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
