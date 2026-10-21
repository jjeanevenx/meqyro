import { moneyDnaScenarios } from "../src/content/quizzes/moneydna-v2";
import { coupleDnaScenarios } from "../src/content/quizzes/coupledna-v2";

const sqlText = (value: string) => `'${value.replace(/'/g, "''")}'`;
const json = (value: unknown) => `${sqlText(JSON.stringify(value))}::jsonb`;

/** Additive and repeatable: never updates v1 content or stored results. */
export function behavioralSeedSql(): string {
  const lines = ["-- Behavioral scenarios v2. Generated from content; no historical rewrites."];
  for (const [slug, questions] of [
    ["moneydna", moneyDnaScenarios],
    ["coupledna", coupleDnaScenarios],
  ] as const) {
    lines.push(`do $$ declare v_version uuid; v_question uuid; v_option uuid; begin
      insert into meqyro.quiz_versions (quiz_id, version, scoring_version, status, published_at)
      select id, 'v2.0.0', 'behavioral-v2', 'PUBLISHED'::meqyro.content_status, now()
      from meqyro.quizzes where slug = '${slug}'
      on conflict (quiz_id, version) do nothing;
      select v.id into strict v_version from meqyro.quiz_versions v join meqyro.quizzes q on q.id = v.quiz_id
      where q.slug = '${slug}' and v.version = 'v2.0.0';`);
    for (const q of questions) {
      lines.push(`insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
        values (v_version, '${q.stableKey}', ${q.position}, 'SCENARIO', ${json({ dimension: q.dimension, difficulty: q.difficulty })})
        on conflict (quiz_version_id, stable_key) do nothing;
        select id into strict v_question from meqyro.questions where quiz_version_id = v_version and stable_key = '${q.stableKey}';`);
      for (const [locale, prompt] of Object.entries(q.prompt)) {
        lines.push(`insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, '${locale}', ${sqlText(prompt)}) on conflict (question_id, locale) do nothing;`);
      }
      for (const [index, option] of q.options.entries()) {
        lines.push(`insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, '${option.stableKey}', ${index + 1}, ${json({ signals: option.signals })})
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = '${option.stableKey}';`);
        for (const [locale, label] of Object.entries(option.label)) {
          lines.push(`insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, '${locale}', ${sqlText(label)}) on conflict (option_id, locale) do nothing;`);
        }
      }
    }
    lines.push("end $$;");
  }
  return lines.join("\n") + "\n";
}
