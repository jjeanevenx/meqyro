import { memoryExercises } from "../src/content/quizzes/memory-exercises.ts";
import { brainRankMemoryPool } from "../src/content/quizzes/brainrank-memory.ts";

export function memorySeedSql(onlyBrainRank12 = false): string {
  const quote = (value: string) => `'${value.replace(/'/g, "''")}'`;
  const statements: string[] = ["do $$ declare v record; qid uuid; oid uuid; begin"];
  for (const bank of ["legacy", "brainrank12"] as const) {
    if (onlyBrainRank12 && bank === "legacy") continue;
    statements.push(
      bank === "legacy"
        ? "for v in select qv.id from meqyro.quiz_versions qv join meqyro.quizzes q on q.id=qv.quiz_id where (q.slug='focusstyle' or (q.slug='brainrank' and qv.version <> '1.2')) and qv.status in ('APPROVED','PUBLISHED') loop"
        : "for v in select qv.id from meqyro.quiz_versions qv join meqyro.quizzes q on q.id=qv.quiz_id where q.slug='brainrank' and qv.version='1.2' loop",
    );
    (bank === "legacy" ? memoryExercises : brainRankMemoryPool).forEach((exercise, index) => {
      statements.push(
        `insert into meqyro.questions(quiz_version_id,stable_key,position,kind,scoring_key,metadata) values(v.id,${quote(exercise.key)},${1001 + index},'SINGLE_CHOICE','{"dimension":"DELAYED_MEMORY"}'::jsonb,${quote(JSON.stringify({ memoryCue: exercise.cue }))}::jsonb) on conflict(quiz_version_id,stable_key) do update set metadata=excluded.metadata,scoring_key=excluded.scoring_key,active=true returning id into qid;`,
      );
      Object.entries(exercise.prompt).forEach(([locale, prompt]) =>
        statements.push(
          `insert into meqyro.question_translations(question_id,locale,prompt) values(qid,${quote(locale)},${quote(prompt)}) on conflict(question_id,locale) do update set prompt=excluded.prompt;`,
        ),
      );
      exercise.options.forEach((labels, option) => {
        statements.push(
          `insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,${quote(String.fromCharCode(65 + option))},${option + 1},'{"isCorrect":${option === exercise.correct}}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;`,
        );
        Object.entries(labels).forEach(([locale, label]) =>
          statements.push(
            `insert into meqyro.option_translations(option_id,locale,label) values(oid,${quote(locale)},${quote(label)}) on conflict(option_id,locale) do update set label=excluded.label;`,
          ),
        );
      });
    });
    statements.push("end loop;");
  }
  statements.push("end $$;");
  return statements.join("\n");
}
