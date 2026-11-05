-- BrainRank 1.3: correct the R-count alternative without rewriting pinned attempts.
do $$
declare
  source_version uuid;
  target_version uuid;
begin
  select v.id into source_version
  from meqyro.quiz_versions v join meqyro.quizzes q on q.id = v.quiz_id
  where q.slug = 'brainrank' and v.version = '1.2';
  if source_version is null then
    raise exception 'BrainRank 1.2 must be installed first';
  end if;

  insert into meqyro.quiz_versions (quiz_id, version, scoring_version, status, published_at)
  select quiz_id, '1.3', '1.3', 'APPROVED', now()
  from meqyro.quiz_versions where id = source_version
  on conflict (quiz_id, version) do nothing;

  select v.id into target_version
  from meqyro.quiz_versions v join meqyro.quizzes q on q.id = v.quiz_id
  where q.slug = 'brainrank' and v.version = '1.3';

  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata, active)
  select target_version, stable_key, position, kind, scoring_key, metadata, active
  from meqyro.questions where quiz_version_id = source_version
  on conflict (quiz_version_id, stable_key) do nothing;

  insert into meqyro.question_translations (question_id, locale, prompt, accessibility_text)
  select n.id, t.locale, t.prompt, t.accessibility_text
  from meqyro.questions o
  join meqyro.questions n on n.quiz_version_id = target_version and n.stable_key = o.stable_key
  join meqyro.question_translations t on t.question_id = o.id
  where o.quiz_version_id = source_version
  on conflict (question_id, locale) do nothing;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  select n.id, a.stable_key, a.position, a.scoring_value, a.metadata
  from meqyro.questions o
  join meqyro.questions n on n.quiz_version_id = target_version and n.stable_key = o.stable_key
  join meqyro.options a on a.question_id = o.id
  where o.quiz_version_id = source_version
  on conflict (question_id, stable_key) do nothing;

  insert into meqyro.option_translations (option_id, locale, label, image_alt)
  select b.id, t.locale,
    case when o.stable_key = 'BR_ATT_02' and a.stable_key = 'C' then '10' else t.label end,
    t.image_alt
  from meqyro.questions o
  join meqyro.questions n on n.quiz_version_id = target_version and n.stable_key = o.stable_key
  join meqyro.options a on a.question_id = o.id
  join meqyro.options b on b.question_id = n.id and b.stable_key = a.stable_key
  join meqyro.option_translations t on t.option_id = a.id
  where o.quiz_version_id = source_version
  on conflict (option_id, locale) do nothing;

  update meqyro.quiz_versions set status = 'ARCHIVED'
  where id = source_version;
end $$;
