import { reviewedBrainRankPool } from "../src/content/quizzes/brainrank-reviewed";
import {
  reviewedPersonalityQuestions,
  reviewedCareerQuestions,
  reviewedFocusQuestions,
} from "../src/content/quizzes/reviewed-likert";
import { reviewedDecisionScenarios } from "../src/content/quizzes/decisiondna-reviewed";
import {
  reviewedMoneyScenarios,
  reviewedCoupleScenarios,
} from "../src/content/quizzes/behavioral-reviewed";
import { brainRankMemoryPool } from "../src/content/quizzes/brainrank-memory";
import { memoryExercises } from "../src/content/quizzes/memory-exercises";
import type { Locale } from "../src/lib/i18n/config";

type SeedQuestion = {
  stableKey: string;
  position: number;
  kind: string;
  scoring: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  prompt: Record<Locale, string>;
  options?: readonly {
    stableKey: string;
    position: number;
    label: Record<Locale, string>;
    scoring: Record<string, unknown>;
    metadata?: Record<string, unknown>;
  }[];
};

const memory = (items: typeof memoryExercises | typeof brainRankMemoryPool): SeedQuestion[] =>
  items.map((q, i) => ({
    stableKey: q.key,
    position: 1001 + i,
    kind: "SINGLE_CHOICE",
    scoring: { dimension: "DELAYED_MEMORY" },
    metadata: { memoryCue: q.cue },
    prompt: q.prompt,
    options: q.options.map((label, index) => ({
      stableKey: String.fromCharCode(65 + index),
      position: index + 1,
      label,
      scoring: { isCorrect: index === q.correct },
    })),
  }));

/** This is the complete, reviewable candidate. Historical sources remain separate. */
export const reviewedBanks: readonly {
  slug: string;
  version: string;
  scoringVersion: string;
  questions: readonly SeedQuestion[];
}[] = [
  {
    slug: "brainrank",
    version: "1.3",
    scoringVersion: "1.3",
    questions: [
      ...reviewedBrainRankPool.map((q) => ({
        stableKey: q.stableKey,
        position: q.position,
        kind: q.kind ?? "SINGLE_CHOICE",
        scoring: { dimension: q.dimension, difficulty: q.difficulty },
        prompt: q.prompt,
        metadata: {
          ...(q.clue ? { clue: q.clue } : {}),
          ...(q.stimulus ? { stimulus: q.stimulus, visualType: q.visualType } : {}),
        },
        options: q.options.map((o) => ({
          stableKey: o.stableKey,
          position: o.position,
          label: o.label,
          scoring: { isCorrect: o.isCorrect },
          metadata: o.visual ? { visual: o.visual } : {},
        })),
      })),
      ...memory(brainRankMemoryPool),
    ],
  },
  {
    slug: "personality-map",
    version: "1.1",
    scoringVersion: "1.0",
    questions: reviewedPersonalityQuestions.map((q) => ({
      ...q,
      kind: "LIKERT",
      scoring: { dimension: q.dimension, direction: q.direction },
    })),
  },
  {
    slug: "careerfit",
    version: "v1.1.0",
    scoringVersion: "v1",
    questions: reviewedCareerQuestions.map((q) => ({
      ...q,
      kind: "LIKERT",
      scoring: { dimension: q.dimension },
    })),
  },
  {
    slug: "focusstyle",
    version: "v1.1.0",
    scoringVersion: "v1",
    questions: [
      ...reviewedFocusQuestions.map((q) => ({ ...q, kind: "LIKERT", scoring: { style: q.style } })),
      ...memory(memoryExercises),
    ],
  },
  {
    slug: "decisiondna",
    version: "v1.1.0",
    scoringVersion: "v1",
    questions: reviewedDecisionScenarios.map((q) => ({
      ...q,
      kind: "SINGLE_CHOICE",
      scoring: {},
      options: q.options.map((o, i) => ({ ...o, position: i + 1, scoring: { style: o.style } })),
    })),
  },
  ...(
    [
      ["moneydna", reviewedMoneyScenarios],
      ["coupledna", reviewedCoupleScenarios],
    ] as const
  ).map(([slug, items]) => ({
    slug,
    version: "v3.0.0",
    scoringVersion: "behavioral-v2",
    questions: items.map((q) => ({
      ...q,
      kind: "SCENARIO",
      scoring: { dimension: q.dimension, difficulty: q.difficulty },
      options: q.options.map((o, i) => ({
        ...o,
        position: i + 1,
        scoring: { signals: o.signals },
      })),
    })),
  })),
];

const quote = (value: string) => `'${value.replace(/'/g, "''")}'`;
const json = (value: unknown) => `${quote(JSON.stringify(value))}::jsonb`;

/** Stage as DRAFT until the matching code is deployed. Re-running cannot rewrite answered versions. */
export function reviewedQuestionSeedSql(): string {
  const lines = [
    "-- Reviewed question banks. Additive, immutable; activate only with matching application code.",
  ];
  for (const bank of reviewedBanks) {
    lines.push(`do $$ declare v uuid; qid uuid; oid uuid; begin
      if not exists(select 1 from meqyro.quizzes where slug=${quote(bank.slug)}) then raise exception 'Missing assessment ${bank.slug}'; end if;
      if exists(select 1 from meqyro.quiz_versions v join meqyro.quizzes q on q.id=v.quiz_id where q.slug=${quote(bank.slug)} and v.version=${quote(bank.version)}) then return; end if;
      insert into meqyro.quiz_versions(quiz_id,version,scoring_version,status)
      select id,${quote(bank.version)},${quote(bank.scoringVersion)},'DRAFT'::meqyro.content_status from meqyro.quizzes where slug=${quote(bank.slug)} returning id into strict v;`);
    for (const q of bank.questions) {
      lines.push(
        `insert into meqyro.questions(quiz_version_id,stable_key,position,kind,scoring_key,metadata,active) values(v,${quote(q.stableKey)},${q.position},${quote(q.kind)},${json(q.scoring)},${json(q.metadata ?? {})},true) returning id into qid;`,
      );
      for (const [locale, prompt] of Object.entries(q.prompt))
        lines.push(
          `insert into meqyro.question_translations(question_id,locale,prompt) values(qid,${quote(locale)},${quote(prompt)});`,
        );
      for (const o of q.options ?? []) {
        lines.push(
          `insert into meqyro.options(question_id,stable_key,position,scoring_value,metadata) values(qid,${quote(o.stableKey)},${o.position},${json(o.scoring)},${json(o.metadata ?? {})}) returning id into oid;`,
        );
        for (const [locale, label] of Object.entries(o.label))
          lines.push(
            `insert into meqyro.option_translations(option_id,locale,label) values(oid,${quote(locale)},${quote(label)});`,
          );
      }
    }
    lines.push("end $$;");
  }
  return lines.join("\n") + "\n";
}

/** Run after the matching application release, or in an isolated test database. */
export function activateReviewedBanksSql(): string {
  return reviewedBanks
    .map(
      (b) => `do $$ declare vid uuid; begin
    select v.id into strict vid from meqyro.quiz_versions v join meqyro.quizzes q on q.id=v.quiz_id where q.slug=${quote(b.slug)} and v.version=${quote(b.version)};
    if (select count(*) from meqyro.questions where quiz_version_id=vid and active) <> ${b.questions.length} then raise exception 'Incomplete reviewed bank ${b.slug}'; end if;
    if (select scoring_version from meqyro.quiz_versions where id=vid) <> ${quote(b.scoringVersion)} then raise exception 'Unexpected scoring version'; end if;
    if exists(select 1 from meqyro.questions q cross join (values ('pt'),('en'),('es'),('fr')) l(locale)
      where q.quiz_version_id=vid and q.active and not exists(select 1 from meqyro.question_translations t where t.question_id=q.id and t.locale=l.locale and btrim(t.prompt)<>'')) then raise exception 'Missing reviewed prompt'; end if;
    if exists(select 1 from meqyro.questions q where q.quiz_version_id=vid and q.active and q.kind<>'LIKERT' and (select count(*) from meqyro.options o where o.question_id=q.id)<>4) then raise exception 'Incomplete reviewed options'; end if;
    if exists(select 1 from meqyro.questions q join meqyro.options o on o.question_id=q.id cross join (values ('pt'),('en'),('es'),('fr')) l(locale)
      where q.quiz_version_id=vid and q.active and not exists(select 1 from meqyro.option_translations t where t.option_id=o.id and t.locale=l.locale and btrim(t.label)<>'')) then raise exception 'Missing reviewed option label'; end if;
    update meqyro.quiz_versions set status='ARCHIVED' where quiz_id=(select quiz_id from meqyro.quiz_versions where id=vid) and id<>vid and status in ('APPROVED','PUBLISHED');
    update meqyro.quiz_versions set status='PUBLISHED',published_at=coalesce(published_at,now()) where id=vid;
  end $$;`,
    )
    .join("\n");
}

/** Follow-up to the already staged migration; fail closed once a draft has been served. */
export function clarifyReviewedBrainRankDraftSql(): string {
  const bank = reviewedBanks.find((b) => b.slug === "brainrank")!;
  const keys = ["BR_PRB_02", "BR_LOG_02", "BR_NUM_04", "BR_PAT_02", "BR_SPD_01"];
  const lines = [
    `-- Clarify only the unserved BrainRank 1.3 draft; preserve all historical versions.
do $$ declare vid uuid; qid uuid; oid uuid; begin
  select v.id into strict vid from meqyro.quiz_versions v join meqyro.quizzes q on q.id=v.quiz_id where q.slug='brainrank' and v.version='1.3' and v.status='DRAFT';
  if exists(select 1 from meqyro.quiz_sessions where quiz_version_id=vid) then raise exception 'Cannot revise an assigned instrument'; end if;`,
  ];
  for (const q of bank.questions.filter((q) => keys.includes(q.stableKey))) {
    lines.push(`select id into strict qid from meqyro.questions where quiz_version_id=vid and stable_key=${quote(q.stableKey)};
      update meqyro.questions set metadata=${json(q.metadata ?? {})} where id=qid;`);
    for (const [locale, prompt] of Object.entries(q.prompt))
      lines.push(
        `update meqyro.question_translations set prompt=${quote(prompt)} where question_id=qid and locale=${quote(locale)};`,
      );
    for (const o of q.options ?? []) {
      lines.push(`select id into strict oid from meqyro.options where question_id=qid and stable_key=${quote(o.stableKey)};
        update meqyro.options set metadata=${json(o.metadata ?? {})} where id=oid;`);
      for (const [locale, label] of Object.entries(o.label))
        lines.push(
          `update meqyro.option_translations set label=${quote(label)} where option_id=oid and locale=${quote(locale)};`,
        );
    }
  }
  lines.push("end $$;\n");
  return lines.join("\n");
}
