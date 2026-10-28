import fs from "node:fs";
import path from "node:path";
import { memorySeedSql } from "./memory-seed.ts";

// Regenerate only before application. Applied migration files remain immutable.
const clone = `-- BrainRank 1.2: add a varied story bank; preserve historical attempts and results.
do $$ begin
 if not exists (select 1 from meqyro.quiz_versions v join meqyro.quizzes q on q.id=v.quiz_id where q.slug='brainrank' and v.version='1.1') then
   raise exception 'BrainRank 1.1 must be installed first';
 end if;
end $$;
insert into meqyro.quiz_versions(quiz_id,version,scoring_version,status,published_at)
select id,'1.2','1.2','APPROVED',now() from meqyro.quizzes where slug='brainrank'
on conflict(quiz_id,version) do nothing;
do $$ declare oldv uuid; newv uuid; begin
select v.id into oldv from meqyro.quiz_versions v join meqyro.quizzes q on q.id=v.quiz_id where q.slug='brainrank' and v.version='1.1';
select v.id into newv from meqyro.quiz_versions v join meqyro.quizzes q on q.id=v.quiz_id where q.slug='brainrank' and v.version='1.2';
insert into meqyro.questions(quiz_version_id,stable_key,position,kind,scoring_key,metadata,active)
select newv,stable_key,position,kind,scoring_key,metadata,active from meqyro.questions where quiz_version_id=oldv and scoring_key->>'dimension'<>'DELAYED_MEMORY'
on conflict(quiz_version_id,stable_key) do nothing;
insert into meqyro.question_translations(question_id,locale,prompt,accessibility_text)
select n.id,t.locale,t.prompt,t.accessibility_text from meqyro.questions o join meqyro.questions n on n.quiz_version_id=newv and n.stable_key=o.stable_key join meqyro.question_translations t on t.question_id=o.id where o.quiz_version_id=oldv
on conflict(question_id,locale) do nothing;
insert into meqyro.options(question_id,stable_key,position,scoring_value,metadata)
select n.id,a.stable_key,a.position,a.scoring_value,a.metadata from meqyro.questions o join meqyro.questions n on n.quiz_version_id=newv and n.stable_key=o.stable_key join meqyro.options a on a.question_id=o.id where o.quiz_version_id=oldv
on conflict(question_id,stable_key) do nothing;
insert into meqyro.option_translations(option_id,locale,label,image_alt)
select b.id,t.locale,t.label,t.image_alt from meqyro.questions o join meqyro.questions n on n.quiz_version_id=newv and n.stable_key=o.stable_key join meqyro.options a on a.question_id=o.id join meqyro.options b on b.question_id=n.id and b.stable_key=a.stable_key join meqyro.option_translations t on t.option_id=a.id where o.quiz_version_id=oldv
on conflict(option_id,locale) do nothing;
end $$;
`;

const previous = fs.readFileSync(
  path.resolve(
    import.meta.dirname,
    "../supabase/migrations/20261019031558_delayed_recall_execution_plan.sql",
  ),
  "utf8",
);
const start = previous.indexOf("  -- Derive cue positions");
const end = previous.indexOf("  if cue is not null", start);
const guard = `  -- Identify cycles by their persisted positions, never by a particular story ID.
  with recalls as (
    select sq.position, d.stable_key, row_number() over(order by sq.position) as cycle,
      lag(sq.position,1,0) over(order by sq.position) as previous_recall
    from meqyro.quiz_session_questions sq join meqyro.questions d on d.id=sq.question_id
    where sq.session_id=p_session_id and d.scoring_key->>'dimension'='DELAYED_MEMORY'
  ), plan as (
    select array_agg(position order by position)=array[8,least(n-5,n/2+6),n] as spaced
    from recalls cross join (select max(position) as n from meqyro.quiz_session_questions where session_id=p_session_id) total group by n
  )
  select stable_key into cue from recalls cross join plan
  where (case when spaced then case cycle when 1 then 1 when 2 then position-5 else position-4 end
    else previous_recall+1 end)=q.position;
`;
const migration =
  clone +
  memorySeedSql(true) +
  "\n" +
  previous.slice(0, start) +
  guard +
  previous.slice(end) +
  `
update meqyro.quiz_versions set status='ARCHIVED'
where quiz_id=(select id from meqyro.quizzes where slug='brainrank') and version in ('1.0','1.1');
`;
fs.writeFileSync(
  path.resolve(
    import.meta.dirname,
    "../supabase/migrations/20261022090000_brainrank_varied_recall.sql",
  ),
  migration,
);
