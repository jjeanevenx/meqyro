-- Generated from the versioned BrainRank content source. Preserve all 1.0 questions/results.
insert into meqyro.quiz_versions (quiz_id, version, scoring_version, status, published_at)
select id, '1.1', '1.1', 'APPROVED'::meqyro.content_status, now() from meqyro.quizzes where slug = 'brainrank'
on conflict (quiz_id, version) do nothing;
update meqyro.quiz_versions set status = 'ARCHIVED' where quiz_id = (select id from meqyro.quizzes where slug = 'brainrank') and version = '1.0';
-- 4. BrainRank Questions and Options
do $$
declare
  v_quiz_version_id uuid;
  v_question_id uuid;
  v_option_id uuid;
begin
  select qv.id into v_quiz_version_id
  from meqyro.quiz_versions qv
  join meqyro.quizzes q on q.id = qv.quiz_id
  where q.slug = 'brainrank' and qv.version = '1.1';

  -- Question 1: BR_PAT_01
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_PAT_01', 1, 'SINGLE_CHOICE', '{"dimension":"PATTERN_RECOGNITION","difficulty":"EASY"}'::jsonb, '{"clue":{"pt":"2 · 6 · 12 · 20 · ?","en":"2 · 6 · 12 · 20 · ?","es":"2 · 6 · 12 · 20 · ?","fr":"2 · 6 · 12 · 20 · ?"}}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Qual número completa a sequência lógica?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Which number completes the logical sequence?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', '¿Qué número completa la secuencia lógica?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Quel nombre complète la suite logique ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '26')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '26')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '26')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '26')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '28')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '28')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '28')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '28')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '30')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '30')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '30')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '30')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '32')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '32')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '32')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '32')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 2: BR_PAT_02
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_PAT_02', 2, 'VISUAL_CHOICE', '{"dimension":"PATTERN_RECOGNITION","difficulty":"MEDIUM"}'::jsonb, '{"visualType":"ROTATION","stimulus":{"kind":"sequence","items":[{"elements":[{"shape":"arrow","rotation":0}]},{"elements":[{"shape":"arrow","rotation":45}]},{"elements":[{"shape":"arrow","rotation":-45}]},{"elements":[{"shape":"arrow","rotation":90}]},null]}}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Qual figura vem a seguir?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Which figure comes next?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', '¿Qué figura viene a continuación?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Quelle figure vient ensuite ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{"visual":{"elements":[{"shape":"arrow","rotation":180}]}}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Opção A')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Option A')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Opción A')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Option A')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb, '{"visual":{"elements":[{"shape":"arrow","rotation":-90}]}}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Opção B')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Option B')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Opción B')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Option B')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb, '{"visual":{"elements":[{"shape":"arrow","rotation":135}]}}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Opção C')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Option C')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Opción C')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Option C')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{"visual":{"elements":[{"shape":"arrow","rotation":90}]}}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Opção D')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Option D')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Opción D')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Option D')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 3: BR_PAT_03
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_PAT_03', 3, 'VISUAL_CHOICE', '{"dimension":"PATTERN_RECOGNITION","difficulty":"MEDIUM"}'::jsonb, '{"visualType":"MATRIX","stimulus":{"kind":"matrix","rows":[[{"elements":[{"shape":"triangle","filled":true}]},{"elements":[{"shape":"triangle","filled":true}]},{"elements":[{"shape":"circle","filled":true}]}],[{"elements":[{"shape":"circle","filled":true}]},{"elements":[{"shape":"triangle","filled":true}]},{"elements":[{"shape":"triangle","filled":true}]}],[{"elements":[{"shape":"triangle","filled":true}]},{"elements":[{"shape":"circle","filled":true}]},null]]}}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Qual opção completa o espaço vazio?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Which option completes the missing space?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', '¿Qué opción completa el espacio vacío?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Quelle option complète l''espace vide ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":true}'::jsonb, '{"visual":{"elements":[{"shape":"triangle","filled":true}]}}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Opção A')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Option A')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Opción A')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Option A')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":false}'::jsonb, '{"visual":{"elements":[{"shape":"circle","filled":true}]}}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Opção B')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Option B')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Opción B')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Option B')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb, '{"visual":{"elements":[{"shape":"square","filled":true}]}}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Opção C')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Option C')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Opción C')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Option C')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{"visual":{"elements":[{"shape":"diamond","filled":true}]}}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Opção D')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Option D')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Opción D')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Option D')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 4: BR_PAT_04
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_PAT_04', 4, 'VISUAL_CHOICE', '{"dimension":"PATTERN_RECOGNITION","difficulty":"HARD"}'::jsonb, '{"visualType":"MIXED","stimulus":{"kind":"sequence","items":[{"elements":[{"shape":"triangle","marker":"top"}]},{"elements":[{"shape":"square","marker":"bottom"}]},{"elements":[{"shape":"pentagon","marker":"top"}]},null]}}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Qual figura vem a seguir?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Which figure comes next?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', '¿Qué figura viene a continuación?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Quelle figure vient ensuite ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{"visual":{"elements":[{"shape":"pentagon","marker":"bottom"}]}}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Opção A')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Option A')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Opción A')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Option A')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb, '{"visual":{"elements":[{"shape":"hexagon","marker":"bottom"}]}}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Opção B')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Option B')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Opción B')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Option B')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb, '{"visual":{"elements":[{"shape":"hexagon","marker":"top"}]}}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Opção C')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Option C')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Opción C')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Option C')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{"visual":{"elements":[{"shape":"octagon","marker":"bottom"}]}}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Opção D')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Option D')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Opción D')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Option D')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 5: BR_LOG_01
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_LOG_01', 5, 'SINGLE_CHOICE', '{"dimension":"LOGICAL_REASONING","difficulty":"EASY"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Se todo Nilo é Vero e nenhum Vero é Mero, qual conclusão é estritamente necessária?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'If all Nilos are Veros and no Vero is Mero, which conclusion is strictly necessary?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Si todo Nilo es Vero y ningún Vero es Mero, ¿qué conclusión es estrictamente necesaria?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Si tout Nilo est Vero et aucun Vero n''est Mero, quelle conclusion est strictement nécessaire ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Algum Nilo é Mero')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Some Nilo is Mero')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Algún Nilo es Mero')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Certains Nilos sont Meros')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Nenhum Nilo é Mero')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'No Nilo is Mero')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Ningún Nilo es Mero')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Aucun Nilo n''est Mero')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Todo Mero é Nilo')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'All Meros are Nilos')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Todo Mero es Nilo')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Tout Mero est Nilo')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Algum Vero não é Nilo')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Some Vero is not Nilo')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Algún Vero no es Nilo')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Certains Veros ne sont pas Nilos')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 6: BR_LOG_02
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_LOG_02', 6, 'SINGLE_CHOICE', '{"dimension":"LOGICAL_REASONING","difficulty":"MEDIUM"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Se chove, a pista molha. A pista não está molhada. O que podemos deduzir?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'If it rains, the track gets wet. The track is not wet. What can we deduce?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Si llueve, la pista se moja. La pista no está mojada. ¿Qué podemos deducir?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'S''il pleut, la piste est mouillée. La piste n''est pas mouillée. Que peut-on déduire ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Não choveu')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'It did not rain')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'No llovió')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Il n''a pas plu')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Vai chover em breve')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'It will rain soon')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Lloverá pronto')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Il va bientôt pleuvoir')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'A pista secou rapidamente')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'The track dried fast')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'La pista se secó rápido')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'La piste a séché vite')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'A chuva foi fraca')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'The rain was light')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'La lluvia fue suave')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'La pluie était faible')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 7: BR_LOG_03
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_LOG_03', 7, 'SINGLE_CHOICE', '{"dimension":"LOGICAL_REASONING","difficulty":"MEDIUM"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Há ouro em exatamente uma de quatro caixas. As afirmações "O ouro está na caixa 1", "O ouro está na caixa 2" e "O ouro está na caixa 3" são todas falsas. Onde está o ouro?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Gold is in exactly one of four boxes. The statements "Gold is in box 1", "Gold is in box 2" and "Gold is in box 3" are all false. Where is the gold?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Hay oro en exactamente una de cuatro cajas. Las afirmaciones "El oro está en la caja 1", "El oro está en la caja 2" y "El oro está en la caja 3" son todas falsas. ¿Dónde está el oro?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'De l’or se trouve dans exactement une de quatre boîtes. Les affirmations « L’or est dans la boîte 1 », « L’or est dans la boîte 2 » et « L’or est dans la boîte 3 » sont toutes fausses. Où est l’or ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Na Caixa 1')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'In Box 1')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'En Caja 1')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Dans la Boîte 1')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Na Caixa 2')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'In Box 2')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'En Caja 2')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Dans la Boîte 2')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Na Caixa 4')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'In Box 4')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'En Caja 4')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Dans la Boîte 4')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Impossível saber')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Cannot be determined')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Imposible saber')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Indéterminé')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 8: BR_LOG_04
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_LOG_04', 8, 'SINGLE_CHOICE', '{"dimension":"LOGICAL_REASONING","difficulty":"HARD"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'A negação lógica estrita de ''Todas as manhãs são frias ou ensolaradas'' é:')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'The strict logical negation of ''All mornings are cold or sunny'' is:')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'La negación lógica estricta de ''Todas las mañanas son frías o soleadas'' es:')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'La négation logique stricte de ''Toutes les matinées sont froides ou ensoleillées'' est :')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Nenhuma manhã é fria e ensolarada')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'No morning is cold and sunny')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Ninguna mañana es fría y soleada')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Aucune matinée n''est froide et ensoleillée')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Existe ao menos uma manhã que não é fria nem ensolarada')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'There is at least one morning that is neither cold nor sunny')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Existe al menos una mañana que no es ni fría ni soleada')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Il existe au moins une matinée qui n''est ni froide ni ensoleillée')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Todas as manhãs são quentes e chuvosas')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'All mornings are warm and rainy')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Todas las mañanas son cálidas y lluviosas')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Toutes les matinées sont chaudes et pluvieuses')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Algumas manhãs são frias e ensolaradas')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Some mornings are cold and sunny')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Algunas mañanas son frías y soleadas')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Certaines matinées sont froides et ensoleillées')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 9: BR_NUM_01
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_NUM_01', 9, 'SINGLE_CHOICE', '{"dimension":"NUMERICAL_REASONING","difficulty":"EASY"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Uma operação é definida por a ◇ b = a × b + a + b + 2. Quanto vale 5 ◇ 6?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'An operation is defined by a ◇ b = a × b + a + b + 2. What is 5 ◇ 6?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Una operación se define como a ◇ b = a × b + a + b + 2. ¿Cuánto vale 5 ◇ 6?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Une opération est définie par a ◇ b = a × b + a + b + 2. Que vaut 5 ◇ 6 ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '36')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '36')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '36')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '36')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '43')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '43')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '43')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '43')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '45')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '45')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '45')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '45')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '51')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '51')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '51')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '51')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 10: BR_NUM_02
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_NUM_02', 10, 'SINGLE_CHOICE', '{"dimension":"NUMERICAL_REASONING","difficulty":"MEDIUM"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Um produto aumentou 20% e depois teve desconto de 20%. Em relação ao preço original, o valor final:')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'A price increased by 20% and then received a 20% discount. Compared to the original price, the final value is:')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Un producto aumentó un 20% y luego tuvo un descuento del 20%. En relación al precio original, el valor final:')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Un prix a augmenté de 20 % puis a bénéficié d''une remise de 20 %. Par rapport au prix initial, le prix final :')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'É igual ao original')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Is equal to original')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Es igual al original')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Est égal à l''original')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'É 4% menor')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Is 4% lower')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Es 4% menor')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Est 4 % inférieur')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'É 2% maior')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Is 2% higher')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Es 2% mayor')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Est 2 % supérieur')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'É 4% maior')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Is 4% higher')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Es 4% mayor')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Est 4 % supérieur')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 11: BR_NUM_03
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_NUM_03', 11, 'SINGLE_CHOICE', '{"dimension":"NUMERICAL_REASONING","difficulty":"MEDIUM"}'::jsonb, '{"clue":{"pt":"Observe a soma dos quadrados: x² + y²","en":"Observe sum of squares: x² + y²","es":"Observe la suma de cuadrados: x² + y²","fr":"Observez la somme des carrés : x² + y²"}}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Qual número completa a matriz? [2, 3 -> 13] | [4, 1 -> 17] | [3, 4 -> ?]')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Which number completes the matrix? [2, 3 -> 13] | [4, 1 -> 17] | [3, 4 -> ?]')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', '¿Qué número completa la matriz? [2, 3 -> 13] | [4, 1 -> 17] | [3, 4 -> ?]')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Quel nombre complète la matrice ? [2, 3 -> 13] | [4, 1 -> 17] | [3, 4 -> ?]')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '21')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '21')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '21')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '21')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '25')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '25')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '25')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '25')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '27')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '27')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '27')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '27')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '29')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '29')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '29')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '29')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 12: BR_NUM_04
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_NUM_04', 12, 'SINGLE_CHOICE', '{"dimension":"NUMERICAL_REASONING","difficulty":"HARD"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Em uma progressão harmônica de termos positivos, se x1 = 1/2 e x2 = 1/5, qual é o valor de x4?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'In a harmonic progression of positive terms, if x1 = 1/2 and x2 = 1/5, what is x4?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'En una progresión armónica de términos positivos, si x1 = 1/2 y x2 = 1/5, ¿cuál es x4?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Dans une progression harmonique de termes positifs, si x1 = 1/2 et x2 = 1/5, quelle est x4 ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '1/8')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '1/8')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '1/8')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '1/8')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '1/11')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '1/11')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '1/11')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '1/11')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '1/14')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '1/14')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '1/14')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '1/14')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '1/17')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '1/17')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '1/17')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '1/17')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 13: BR_ATT_01
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_ATT_01', 13, 'SINGLE_CHOICE', '{"dimension":"ATTENTION","difficulty":"EASY"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Qual palavra destoa do conjunto semântico?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Which word does not belong to the semantic group?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', '¿Qué palabra no pertenece al grupo semántico?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Quel mot n''appartient pas au groupe sémantique ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Círculo')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Circle')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Círculo')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Cercle')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Quadrado')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Square')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Cuadrado')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Carré')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Azul')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Blue')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Azul')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Bleu')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Triângulo')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Triangle')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Triángulo')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Triangle')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 14: BR_ATT_02
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_ATT_02', 14, 'SINGLE_CHOICE', '{"dimension":"ATTENTION","difficulty":"MEDIUM"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Quantas vezes a letra ''R'' aparece no texto: ''RACIOCINAR COM RIGOR REQUER RECONHECER REGRAS''?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'How many times does ''R'' appear in: ''RACIOCINAR COM RIGOR REQUER RECONHECER REGRAS''?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', '¿Cuántas veces aparece la letra ''R'' en: ''RACIOCINAR COM RIGOR REQUER RECONHECER REGRAS''?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Combien de fois la lettre ''R'' apparaît-elle dans : ''RACIOCINAR COM RIGOR REQUER RECONHECER REGRAS'' ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '6')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '6')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '6')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '6')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '7')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '7')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '7')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '7')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '12')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '12')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '12')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '12')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '9')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '9')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '9')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '9')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 15: BR_ATT_03
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_ATT_03', 15, 'SINGLE_CHOICE', '{"dimension":"ATTENTION","difficulty":"MEDIUM"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Identifique o par que NÃO é exatamente idêntico:')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Identify the pair that is NOT an exact match:')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Identifique el par que NO es exactamente idéntico:')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Identifiez la paire qui N''EST PAS exactement identique :')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'KX-94817 / KX-94817')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'KX-94817 / KX-94817')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'KX-94817 / KX-94817')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'KX-94817 / KX-94817')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'MW-38291 / MW-38219')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'MW-38291 / MW-38219')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'MW-38291 / MW-38219')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'MW-38291 / MW-38219')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'PL-77340 / PL-77340')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'PL-77340 / PL-77340')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'PL-77340 / PL-77340')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'PL-77340 / PL-77340')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'QR-10526 / QR-10526')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'QR-10526 / QR-10526')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'QR-10526 / QR-10526')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'QR-10526 / QR-10526')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 16: BR_ATT_04
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_ATT_04', 16, 'SINGLE_CHOICE', '{"dimension":"ATTENTION","difficulty":"HARD"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Qual sequência contém uma quebra na regra de alternância Maiúscula/Minúscula?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Which sequence contains a break in the Upper/Lower case alternating rule?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', '¿Qué secuencia contiene una ruptura en la regla de mayúsculas/minúsculas alternadas?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Quelle séquence présente une rupture dans l''alternance majuscule/minuscule ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'a B c D e F g')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'a B c D e F g')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'a B c D e F g')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'a B c D e F g')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Z y X w V u T')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Z y X w V u T')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Z y X w V u T')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Z y X w V u T')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'M n P q R S t')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'M n P q R S t')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'M n P q R S t')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'M n P q R S t')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'j K l M n O p')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'j K l M n O p')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'j K l M n O p')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'j K l M n O p')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 17: BR_PRB_01
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_PRB_01', 17, 'SINGLE_CHOICE', '{"dimension":"PROBLEM_SOLVING","difficulty":"EASY"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Três lâmpadas incandescentes, inicialmente apagadas e frias, são controladas por três interruptores na sala ao lado. As lâmpadas aquecem quando acesas e você pode verificar seu calor com segurança. Como associá-las aos interruptores entrando na sala apenas uma vez?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Three incandescent bulbs, initially off and cold, are controlled by three switches next door. Lit bulbs warm up and you can safely check their warmth. How can you match bulbs to switches with only one visit?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Tres bombillas incandescentes, inicialmente apagadas y frías, se controlan con tres interruptores de la sala contigua. Al encenderse se calientan y puedes comprobar su calor con seguridad. ¿Cómo asociarlas entrando una sola vez?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Trois ampoules à incandescence, initialement éteintes et froides, sont commandées par trois interrupteurs dans la pièce voisine. Elles chauffent lorsqu’elles sont allumées et leur chaleur peut être vérifiée sans danger. Comment les associer en une seule visite ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Ligar um por 10 min, desligar e ligar o segundo (calor e luz)')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Turn one on for 10 min, turn off and turn on the second (heat and light)')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Encender uno 10 min, apagarlo y encender el segundo (calor y luz)')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'En allumer un 10 min, l''éteindre et allumer le second (chaleur et lumière)')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Ligar os três ao mesmo tempo')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Turn all three on together')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Encender los tres a la vez')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Allumer les trois en même temps')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Alternar rapidamente dois interruptores')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Toggle two switches rapidly')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Alternar dos interruptores rápido')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Basculer rapidement deux interrupteurs')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'É matematicamente impossível')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'It is mathematically impossible')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Es matemáticamente imposible')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'C''est mathématiquement impossible')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 18: BR_PRB_02
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_PRB_02', 18, 'SINGLE_CHOICE', '{"dimension":"PROBLEM_SOLVING","difficulty":"MEDIUM"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Você tem dois baldes sem marcação: 5 litros e 3 litros. Como medir exatamente 4 litros de água usando uma torneira?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'You have two unmarked buckets: 5L and 3L. How can you measure exactly 4 liters using a tap?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Tienes dos cubos sin marcas: 5L y 3L. ¿Cómo medir exactamente 4 litros usando un grifo?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Vous avez deux seaux non gradués : 5L et 3L. Comment mesurer exactement 4 litres avec un robinet ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Encher o de 5L, despejar 3L no balde menor, esvaziar o menor, transferir os 2L restantes e encher 5L novamente até completar o menor')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Fill 5L, pour into 3L, empty 3L, transfer remaining 2L, fill 5L and top off 3L')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Llenar 5L, verter en 3L, vaciar 3L, transferir los 2L restantes, llenar 5L y completar 3L')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Remplir 5L, verser dans 3L, vider 3L, transférer 2L restants, remplir 5L et compléter 3L')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Encher o de 3L até a metade duas vezes')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Fill 3L halfway twice')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Llenar 3L a la mitad dos veces')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Remplir 3L à moitié deux fois')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Encher 5L e despejar aproximadamente 1L fora')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Fill 5L and pour roughly 1L out')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Llenar 5L y tirar aprox. 1L')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Remplir 5L et vider environ 1L')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Não é possível obter 4 litros exatos')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Cannot obtain exact 4L')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'No es posible obtener 4L exactos')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Impossible d''obtenir 4L exacts')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 19: BR_PRB_03
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_PRB_03', 19, 'SINGLE_CHOICE', '{"dimension":"PROBLEM_SOLVING","difficulty":"MEDIUM"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Três pessoas precisam atravessar uma ponte à noite com uma única tocha. Ela suporta no máximo 2 pessoas. Tempos individuais: 1 min, 2 min e 5 min. O grupo viaja na velocidade do mais lento. Menor tempo total:')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Three people cross a bridge at night with one torch (max 2 people). Times: 1 min, 2 min, 5 min. Pair walks at slower pace. Minimum total time:')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Tres personas cruzan un puente de noche con una antorcha (máx 2). Tiempos: 1 min, 2 min, 5 min. Pareja va al ritmo del más lento. Tiempo mínimo total:')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Trois personnes traversent un pont de nuit avec une torche (max 2). Temps : 1 min, 2 min, 5 min. Rythme du plus lent. Temps minimal :')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '7 minutos')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '7 minutes')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '7 minutos')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '7 minutes')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '8 minutos')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '8 minutes')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '8 minutos')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '8 minutes')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '9 minutos')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '9 minutes')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '9 minutos')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '9 minutes')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '10 minutos')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '10 minutes')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '10 minutos')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '10 minutes')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 20: BR_PRB_04
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_PRB_04', 20, 'SINGLE_CHOICE', '{"dimension":"PROBLEM_SOLVING","difficulty":"HARD"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Você tem 9 moedas idênticas na aparência, mas uma é ligeiramente mais pesada. Usando uma balança de dois pratos, qual é o número MÍNIMO de pesagens garantidas para encontrar a moeda falsa?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'You have 9 identical-looking coins, one slightly heavier. Using a balance scale, what is the MINIMUM number of weighings guaranteed to find the fake coin?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Tienes 9 monedas idénticas en apariencia, una ligeramente más pesada. Con balanza de dos platos, ¿cuál es el MÍNIMO de pesadas seguras?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Vous avez 9 pièces identiques en apparence, l''une est plus lourde. Avec une balance à plateaux, quel est le nombre MINIMUM de pesées garanties ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '1 pesagem')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '1 weighing')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '1 pesada')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '1 pesée')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '2 pesagens')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '2 weighings')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '2 pesadas')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '2 pesées')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '3 pesagens')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '3 weighings')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '3 pesadas')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '3 pesées')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '4 pesagens')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '4 weighings')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '4 pesadas')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '4 pesées')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 21: BR_SPD_01
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_SPD_01', 21, 'VISUAL_CHOICE', '{"dimension":"SPEED","difficulty":"EASY"}'::jsonb, '{"visualType":"COUNTING","stimulus":{"kind":"group","scene":{"elements":[{"shape":"diamond","x":8,"y":50,"size":8,"filled":true},{"shape":"triangle","x":18.5,"y":50,"size":8,"filled":true},{"shape":"circle","x":29,"y":50,"size":8,"filled":true},{"shape":"diamond","x":39.5,"y":50,"size":8,"filled":true},{"shape":"diamond","x":50,"y":50,"size":8,"filled":true},{"shape":"circle","x":60.5,"y":50,"size":8,"filled":true},{"shape":"triangle","x":71,"y":50,"size":8,"filled":true},{"shape":"diamond","x":81.5,"y":50,"size":8,"filled":true},{"shape":"circle","x":92,"y":50,"size":8,"filled":true}]}}}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Qual figura aparece menos vezes?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Which figure appears the fewest times?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', '¿Qué figura aparece menos veces?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Quelle figure apparaît le moins souvent ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{"visual":{"elements":[{"shape":"diamond","filled":true}]}}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Opção A')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Option A')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Opción A')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Option A')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb, '{"visual":{"elements":[{"shape":"triangle","filled":true}]}}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Opção B')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Option B')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Opción B')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Option B')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb, '{"visual":{"elements":[{"shape":"circle","filled":true}]}}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Opção C')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Option C')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Opción C')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Option C')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{"visual":{"elements":[{"shape":"diamond","x":25,"y":50,"size":18,"filled":true},{"shape":"triangle","x":50,"y":50,"size":18,"filled":true},{"shape":"circle","x":75,"y":50,"size":18,"filled":true}]}}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Todos iguais')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'All equal')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Todos iguales')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Tous égaux')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 22: BR_SPD_02
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_SPD_02', 22, 'SINGLE_CHOICE', '{"dimension":"SPEED","difficulty":"MEDIUM"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Resolva mentalmente o mais rápido possível: (15 × 4) - (12 × 3) + 7 = ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Solve mentally as fast as possible: (15 × 4) - (12 × 3) + 7 = ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Resuelva mentalmente lo más rápido posible: (15 × 4) - (12 × 3) + 7 = ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Résolvez mentalement le plus vite possible : (15 × 4) - (12 × 3) + 7 = ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '29')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '29')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '29')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '29')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '31')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '31')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '31')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '31')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '33')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '33')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '33')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '33')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '35')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '35')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '35')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '35')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 23: BR_SPD_03
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_SPD_03', 23, 'SINGLE_CHOICE', '{"dimension":"SPEED","difficulty":"MEDIUM"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Qual sequência contém exatamente as mesmas letras de "ROMA", uma vez cada?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Which sequence contains exactly the same letters as "ROMA", once each?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', '¿Qué secuencia contiene exactamente las mismas letras de "ROMA", una vez cada una?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Quelle suite contient exactement les mêmes lettres que « ROMA », une fois chacune ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'AMOR')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'AMOR')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'AMOR')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'AMOR')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'MORO')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'MORO')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'MORO')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'MORO')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'AROMA')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'AROMA')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'AROMA')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'AROMA')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'RAMAL')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'RAMAL')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'RAMAL')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'RAMAL')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 24: BR_SPD_04
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_SPD_04', 24, 'SINGLE_CHOICE', '{"dimension":"SPEED","difficulty":"HARD"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Identifique rapidamente a única combinação cujos algarismos somam um número primo:')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Quickly identify the only combination whose digits sum to a prime number:')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Identifique rápidamente la única combinación cuyos dígitos suman un número primo:')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Identifiez rapidement la seule combinaison dont les chiffres forment une somme première :')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '4 + 5 + 6 = 15')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '4 + 5 + 6 = 15')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '4 + 5 + 6 = 15')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '4 + 5 + 6 = 15')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '3 + 7 + 8 = 18')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '3 + 7 + 8 = 18')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '3 + 7 + 8 = 18')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '3 + 7 + 8 = 18')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '2 + 6 + 9 = 17')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '2 + 6 + 9 = 17')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '2 + 6 + 9 = 17')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '2 + 6 + 9 = 17')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '5 + 7 + 9 = 21')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '5 + 7 + 9 = 21')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '5 + 7 + 9 = 21')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '5 + 7 + 9 = 21')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 25: BR_PAT_05
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_PAT_05', 25, 'SINGLE_CHOICE', '{"dimension":"PATTERN_RECOGNITION","difficulty":"EASY"}'::jsonb, '{"clue":{"pt":"3 · 7 · 11 · 15 · ?","en":"3 · 7 · 11 · 15 · ?","es":"3 · 7 · 11 · 15 · ?","fr":"3 · 7 · 11 · 15 · ?"}}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Qual número completa a sequência lógica?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Which number completes the logical sequence?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', '¿Qué número completa la secuencia lógica?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Quel nombre complète la suite logique ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '17')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '17')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '17')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '17')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '18')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '18')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '18')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '18')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '19')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '19')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '19')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '19')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '20')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '20')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '20')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '20')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 26: BR_PAT_06
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_PAT_06', 26, 'SINGLE_CHOICE', '{"dimension":"PATTERN_RECOGNITION","difficulty":"EASY"}'::jsonb, '{"clue":{"pt":"1 · 4 · 9 · 16 · ?","en":"1 · 4 · 9 · 16 · ?","es":"1 · 4 · 9 · 16 · ?","fr":"1 · 4 · 9 · 16 · ?"}}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Identifique o próximo elemento da série quadrada:')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Identify the next element in the square series:')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Identifique el siguiente elemento de la serie cuadrada:')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Identifiez l''élément suivant de la série des carrés :')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '20')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '20')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '20')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '20')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '25')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '25')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '25')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '25')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '27')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '27')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '27')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '27')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '30')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '30')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '30')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '30')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 27: BR_PAT_07
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_PAT_07', 27, 'SINGLE_CHOICE', '{"dimension":"PATTERN_RECOGNITION","difficulty":"MEDIUM"}'::jsonb, '{"clue":{"pt":"3 · 6 · 11 · 18 · 27 · ?","en":"3 · 6 · 11 · 18 · 27 · ?","es":"3 · 6 · 11 · 18 · 27 · ?","fr":"3 · 6 · 11 · 18 · 27 · ?"}}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Qual número preenche a interrogação?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Which number replaces the question mark?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', '¿Qué número reemplaza el signo de interrogación?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Quel nombre remplace le point d''interrogation ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '36')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '36')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '36')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '36')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '38')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '38')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '38')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '38')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '39')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '39')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '39')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '39')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '42')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '42')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '42')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '42')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 28: BR_PAT_08
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_PAT_08', 28, 'SINGLE_CHOICE', '{"dimension":"PATTERN_RECOGNITION","difficulty":"MEDIUM"}'::jsonb, '{"clue":{"pt":"5 · 10 · 20 · 40 · ?","en":"5 · 10 · 20 · 40 · ?","es":"5 · 10 · 20 · 40 · ?","fr":"5 · 10 · 20 · 40 · ?"}}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Complete a progressão geométrica:')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Complete the geometric progression:')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Complete la progresión geométrica:')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Complétez la progression géométrique :')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '60')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '60')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '60')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '60')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '70')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '70')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '70')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '70')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '80')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '80')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '80')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '80')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '90')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '90')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '90')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '90')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 29: BR_PAT_09
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_PAT_09', 29, 'SINGLE_CHOICE', '{"dimension":"PATTERN_RECOGNITION","difficulty":"HARD"}'::jsonb, '{"clue":{"pt":"8 · 27 · 64 · 125 · ?","en":"8 · 27 · 64 · 125 · ?","es":"8 · 27 · 64 · 125 · ?","fr":"8 · 27 · 64 · 125 · ?"}}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Qual valor completa a sequência cúbica?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Which value completes the cubic sequence?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', '¿Qué valor completa la secuencia cúbica?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Quelle valeur complète la suite cubique ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '216')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '216')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '216')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '216')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '243')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '243')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '243')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '243')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '256')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '256')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '256')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '256')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '343')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '343')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '343')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '343')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 30: BR_PAT_10
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_PAT_10', 30, 'SINGLE_CHOICE', '{"dimension":"PATTERN_RECOGNITION","difficulty":"HARD"}'::jsonb, '{"clue":{"pt":"2 · 3 · 7 · 16 · 32 · ?","en":"2 · 3 · 7 · 16 · 32 · ?","es":"2 · 3 · 7 · 16 · 32 · ?","fr":"2 · 3 · 7 · 16 · 32 · ?"}}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Qual número completa a sequência com diferenças quadradas crescentes?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Which number completes the sequence with growing square differences?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', '¿Qué número completa la secuencia con diferencias cuadradas crecientes?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Quel nombre complète la suite aux différences de carrés croissants ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '52')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '52')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '52')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '52')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '55')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '55')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '55')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '55')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '57')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '57')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '57')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '57')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '64')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '64')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '64')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '64')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 31: BR_LOG_05
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_LOG_05', 31, 'SINGLE_CHOICE', '{"dimension":"LOGICAL_REASONING","difficulty":"EASY"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Se todos os gatos são mamíferos e Mia é um gato, o que se conclui necessariamente?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'If all cats are mammals and Mia is a cat, what must necessarily be true?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Si todos los gatos son mamíferos y Mía es un gato, ¿qué se concluye necesariamente?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Si tous les chats sont des mammifères et que Mia est un chat, que conclut-on nécessairement ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Mia é um mamífero')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Mia is a mammal')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Mía es un mamífero')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Mia est un mammifère')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Mia tem quatro patas')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Mia has four legs')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Mía tiene cuatro patas')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Mia a quatre pattes')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Todos os mamíferos são gatos')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'All mammals are cats')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Todos los mamíferos son gatos')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Tous les mammifères sont des chats')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Mia é um felino selvagem')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Mia is a wild feline')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Mía es un felino salvaje')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Mia est un félin sauvage')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 32: BR_LOG_06
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_LOG_06', 32, 'SINGLE_CHOICE', '{"dimension":"LOGICAL_REASONING","difficulty":"EASY"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Se chover, o trânsito atrasa. Choveu. Logo:')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'If it rains, traffic is delayed. It rained. Therefore:')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Si llueve, el tráfico se retrasa. Llovió. Por lo tanto:')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'S''il pleut, la circulation est ralentie. Il a plu. Donc :')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Não houve atraso')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'There was no delay')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'No hubo retraso')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Il n''y a pas eu de retard')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'O trânsito atrasou')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Traffic was delayed')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'El tráfico se retrasó')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'La circulation a été ralentie')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'O trânsito fluiu melhor')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Traffic flowed faster')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'El tráfico fluyó mejor')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'La circulation s''est améliorée')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'A chuva parou rápido')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'The rain stopped quickly')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'La lluvia paró rápido')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'La pluie s''est arrêtée vite')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 33: BR_LOG_07
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_LOG_07', 33, 'SINGLE_CHOICE', '{"dimension":"LOGICAL_REASONING","difficulty":"MEDIUM"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Lucas é mais velho que Pedro, e Pedro é mais velho que Mateus. Logo:')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Lucas is older than Pedro, and Pedro is older than Mateo. Therefore:')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Lucas es mayor que Pedro, y Pedro es mayor que Mateo. Por lo tanto:')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Lucas est plus âgé que Pierre, et Pierre est plus âgé que Mathieu. Donc :')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Mateus é o mais velho')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Mateo is the oldest')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Mateo es el mayor')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Mathieu est le plus âgé')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Lucas é mais novo que Mateus')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Lucas is younger than Mateo')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Lucas es menor que Mateo')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Lucas est plus jeune que Mathieu')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Lucas é mais velho que Mateus')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Lucas is older than Mateo')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Lucas es mayor que Mateo')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Lucas est plus âgé que Mathieu')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Pedro é o mais velho')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Pedro is the oldest')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Pedro es el mayor')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Pierre est le plus âgé')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 34: BR_LOG_08
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_LOG_08', 34, 'SINGLE_CHOICE', '{"dimension":"LOGICAL_REASONING","difficulty":"MEDIUM"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Em um grupo de 40 pessoas, 25 gostam de café e 20 de chá. Todos gostam de pelo menos um. Quantos gostam de ambos?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'In a group of 40 people, 25 like coffee and 20 like tea. Everyone likes at least one. How many like both?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'En un grupo de 40 personas, 25 gustan del café y 20 del té. A todos les gusta al menos uno. ¿Cuántos gustan de ambos?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Dans un groupe de 40 personnes, 25 aiment le café et 20 le thé. Tous aiment au moins l''un des deux. Combien aiment les deux ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '3')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '3')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '3')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '3')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '5')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '5')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '5')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '5')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '7')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '7')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '7')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '7')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '10')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '10')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '10')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '10')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 35: BR_LOG_09
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_LOG_09', 35, 'SINGLE_CHOICE', '{"dimension":"LOGICAL_REASONING","difficulty":"HARD"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Nenhum réptil tem pelos. Todos os jacarés são répteis. Alguns animais de zoológico têm pelos. Logo:')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'No reptile has fur. All alligators are reptiles. Some zoo animals have fur. Therefore:')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Ningún reptil tiene pelo. Todos los caimanes son reptiles. Algunos animales del zoológico tienen pelo. Por lo tanto:')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Aucun reptile n''a de poils. Tous les alligators sont des reptiles. Certains animaux de zoo ont des poils. Donc :')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Alguns jacarés têm pelos')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Some alligators have fur')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Algunos caimanes tienen pelo')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Certains alligators ont des poils')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Nenhum jacaré tem pelos')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'No alligator has fur')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Ningún caimán tiene pelo')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Aucun alligator n''a de poils')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Todos os animais do zoológico são répteis')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'All zoo animals are reptiles')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Todos los animales del zoológico son reptiles')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Tous les animaux du zoo sont des reptiles')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Nenhum réptil está no zoológico')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'No reptiles are in the zoo')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Ningún reptil está en el zoológico')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Aucun reptile n''est dans le zoo')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 36: BR_LOG_10
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_LOG_10', 36, 'SINGLE_CHOICE', '{"dimension":"LOGICAL_REASONING","difficulty":"HARD"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Se a afirmação ''Nem todo pássaro voa'' é verdadeira, o que é logicamente equivalente?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'If the statement ''Not every bird flies'' is true, which is logically equivalent?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Si la afirmación ''No todo pájaro vuela'' es verdadera, ¿qué es lógicamente equivalente?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Si l''affirmation ''Tous les oiseaux ne volent pas'' est vraie, laquelle est logiquement équivalente ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Nenhum pássaro voa')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'No birds fly')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Ningún pájaro vuela')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Aucun oiseau ne vole')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Existe pelo menos um pássaro que não voa')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'There is at least one bird that does not fly')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Existe al menos un pájaro que no vuela')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Il existe au moins un oiseau qui ne vole pas')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Todos os pássaros voam')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'All birds fly')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Todos los pájaros vuelan')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Tous les oiseaux volent')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'A maioria dos pássaros voa')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Most birds fly')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'La mayoría de los pájaros vuela')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'La plupart des oiseaux volent')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 37: BR_NUM_05
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_NUM_05', 37, 'SINGLE_CHOICE', '{"dimension":"NUMERICAL_REASONING","difficulty":"EASY"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Se 4 maçãs custam R$ 12,00, quanto custam 7 maçãs?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'If 4 apples cost $12.00, how much do 7 apples cost?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Si 4 manzanas cuestan 12,00 €, ¿cuánto cuestan 7 manzanas?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Si 4 pommes coûtent 12,00 €, combien coûtent 7 pommes ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'R$ 18,00')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '$18.00')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '18,00 €')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '18,00 €')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'R$ 21,00')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '$21.00')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '21,00 €')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '21,00 €')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'R$ 24,00')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '$24.00')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '24,00 €')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '24,00 €')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'R$ 28,00')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '$28.00')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '28,00 €')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '28,00 €')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 38: BR_NUM_06
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_NUM_06', 38, 'SINGLE_CHOICE', '{"dimension":"NUMERICAL_REASONING","difficulty":"EASY"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Qual é o valor de 25% de 240?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'What is 25% of 240?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', '¿Cuánto es el 25% de 240?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Combien font 25 % de 240 ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '50')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '50')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '50')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '50')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '60')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '60')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '60')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '60')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '70')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '70')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '70')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '70')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '80')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '80')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '80')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '80')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 39: BR_NUM_07
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_NUM_07', 39, 'SINGLE_CHOICE', '{"dimension":"NUMERICAL_REASONING","difficulty":"MEDIUM"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Um carro percorre 180 km a 60 km/h e volta a 90 km/h. Qual a velocidade média de todo o percurso?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'A car drives 180 km at 60 km/h and returns at 90 km/h. What is the average speed of the round trip?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Un automóvil recorre 180 km a 60 km/h y regresa a 90 km/h. ¿Cuál es la velocidad promedio de todo el recorrido?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Une voiture parcourt 180 km à 60 km/h et revient à 90 km/h. Quelle est la vitesse moyenne sur l''aller-retour ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '72 km/h')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '72 km/h')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '72 km/h')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '72 km/h')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '75 km/h')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '75 km/h')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '75 km/h')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '75 km/h')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '78 km/h')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '78 km/h')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '78 km/h')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '78 km/h')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '80 km/h')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '80 km/h')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '80 km/h')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '80 km/h')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 40: BR_NUM_08
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_NUM_08', 40, 'SINGLE_CHOICE', '{"dimension":"NUMERICAL_REASONING","difficulty":"MEDIUM"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Um produto de R$ 200 teve aumento de 20% e depois desconto de 20%. Qual seu preço final?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'A $200 item increased by 20% and then was discounted by 20%. What is its final price?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Un artículo de 200 € aumentó un 20% y luego tuvo un descuento del 20%. ¿Cuál es su precio final?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Un article à 200 € augmente de 20 % puis bénéficie d''une réduction de 20 %. Quel est son prix final ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'R$ 200')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '$200')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '200 €')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '200 €')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'R$ 192')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '$192')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '192 €')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '192 €')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'R$ 190')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '$190')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '190 €')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '190 €')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'R$ 188')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '$188')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '188 €')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '188 €')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 41: BR_NUM_09
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_NUM_09', 41, 'SINGLE_CHOICE', '{"dimension":"NUMERICAL_REASONING","difficulty":"HARD"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'A soma de dois números é 70 e sua diferença é 14. Qual é o produto desses dois números?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'The sum of two numbers is 70 and their difference is 14. What is their product?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'La suma de dos números es 70 y su diferencia es 14. ¿Cuál es su producto?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'La somme de deux nombres est 70 et leur différence est 14. Quel est leur produit ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '1126')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '1126')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '1126')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '1126')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '1176')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '1176')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '1176')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '1176')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '1200')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '1200')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '1200')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '1200')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '1244')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '1244')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '1244')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '1244')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 42: BR_NUM_10
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_NUM_10', 42, 'SINGLE_CHOICE', '{"dimension":"NUMERICAL_REASONING","difficulty":"HARD"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Uma torneira enche um reservatório em 3 horas e outra em 6 horas. Juntas, em quantas horas encherão o tanque?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'One tap fills a tank in 3 hours and another in 6 hours. Together, how many hours will they take to fill the tank?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Un grifo llena un depósito en 3 horas y otro en 6 horas. Juntos, ¿en cuántas horas llenarán el tanque?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Un robinet remplit un réservoir en 3 heures et un autre en 6 heures. Ensemble, en combien d''heures rempliront-ils le réservoir ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '1,5 hora')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '1.5 hours')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '1,5 horas')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '1,5 heure')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '2,0 horas')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '2.0 hours')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '2,0 horas')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '2,0 heures')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '2,5 horas')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '2.5 hours')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '2,5 horas')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '2,5 heures')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '4,5 horas')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '4.5 hours')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '4,5 horas')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '4,5 heures')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 43: BR_ATT_05
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_ATT_05', 43, 'SINGLE_CHOICE', '{"dimension":"ATTENTION","difficulty":"EASY"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Quantas letras ''T'' aparecem na sequência: T L T F T E T L T ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'How many letters ''T'' appear in the sequence: T L T F T E T L T ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', '¿Cuántas letras ''T'' aparecen en la secuencia: T L T F T E T L T ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Combien de lettres ''T'' apparaissent dans la suite : T L T F T E T L T ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '4')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '4')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '4')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '4')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '5')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '5')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '5')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '5')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '6')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '6')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '6')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '6')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '7')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '7')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '7')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '7')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 44: BR_ATT_06
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_ATT_06', 44, 'SINGLE_CHOICE', '{"dimension":"ATTENTION","difficulty":"EASY"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Qual das opções é perfeitamente idêntica à palavra de referência: ELEFANTÍASE')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Which option is perfectly identical to the reference word: ELEPHANTIASIS')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', '¿Cuál de las opciones es perfectamente idéntica a la palabra de referencia: ELEFANTIASIS')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Quelle option est parfaitement identique au mot de référence : ÉLÉPHANTIASIS')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'ELEFANTIASE')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'ELEPHANTIASI')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'ELEFANTIASI')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'ELEPHANTIASIS')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'ELEFANTÍASE')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'ELEPHANTIASIS')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'ELEFANTIASIS')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'ÉLÉPHANTIASIS')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'ELEFANTÍASI')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'ELEPHANTIASS')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'ELEFANTIASS')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'ÉLÉPHANTIASS')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'ELEFONTÍASE')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'ELEPHONTASIS')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'ELEFONTÍASIS')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'ÉLÉPHONTIASIS')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 45: BR_ATT_07
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_ATT_07', 45, 'SINGLE_CHOICE', '{"dimension":"ATTENTION","difficulty":"MEDIUM"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Identifique o único par de códigos que NÃO é idêntico:')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Identify the only pair of codes that is NOT identical:')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Identifique el único par de códigos que NO es idéntico:')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Identifiez la seule paire de codes qui n''est PAS identique :')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '9834-X7B / 9834-X7B')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '9834-X7B / 9834-X7B')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '9834-X7B / 9834-X7B')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '9834-X7B / 9834-X7B')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '4521-M9Q / 4521-M9Q')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '4521-M9Q / 4521-M9Q')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '4521-M9Q / 4521-M9Q')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '4521-M9Q / 4521-M9Q')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '7319-K2W / 7319-K2V')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '7319-K2W / 7319-K2V')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '7319-K2W / 7319-K2V')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '7319-K2W / 7319-K2V')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '6108-P4Z / 6108-P4Z')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '6108-P4Z / 6108-P4Z')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '6108-P4Z / 6108-P4Z')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '6108-P4Z / 6108-P4Z')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 46: BR_ATT_08
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_ATT_08', 46, 'SINGLE_CHOICE', '{"dimension":"ATTENTION","difficulty":"MEDIUM"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Quantos números pares existem na lista: 13, 22, 37, 48, 55, 64, 71, 86, 99?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'How many even numbers exist in the list: 13, 22, 37, 48, 55, 64, 71, 86, 99?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', '¿Cuántos números pares existen en la lista: 13, 22, 37, 48, 55, 64, 71, 86, 99?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Combien de nombres pairs se trouvent dans la liste : 13, 22, 37, 48, 55, 64, 71, 86, 99 ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '3')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '3')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '3')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '3')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '4')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '4')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '4')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '4')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '5')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '5')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '5')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '5')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '6')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '6')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '6')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '6')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 47: BR_ATT_09
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_ATT_09', 47, 'SINGLE_CHOICE', '{"dimension":"ATTENTION","difficulty":"HARD"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Qual linha contém exatamente 4 ocorrências do símbolo ''#'':')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Which line contains exactly 4 occurrences of the symbol ''#'':')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', '¿Qué línea contiene exactamente 4 ocurrencias del símbolo ''#'':')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Quelle ligne contient exactement 4 occurrences du symbole ''#'' :')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '##--#-----')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '##--#-----')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '##--#-----')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '##--#-----')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '#-#-#-#-#')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '#-#-#-#-#')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '#-#-#-#-#')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '#-#-#-#-#')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '#--#--#--#')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '#--#--#--#')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '#--#--#--#')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '#--#--#--#')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '##--##--#')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '##--##--#')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '##--##--#')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '##--##--#')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 48: BR_ATT_10
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_ATT_10', 48, 'SINGLE_CHOICE', '{"dimension":"ATTENTION","difficulty":"HARD"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Qual par apresenta a segunda sequência exatamente na ordem inversa da primeira?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Which pair has its second sequence in exactly the reverse order of the first?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', '¿Qué par presenta la segunda secuencia exactamente en el orden inverso de la primera?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Dans quelle paire la seconde suite est-elle exactement l’inverse de la première ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'ROMA / AMOR')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'ROMA / AMOR')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'ROMA / AMOR')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'ROMA / AMOR')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'LIVRO / ORVLI')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'LIVRO / ORVLI')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'LIVRO / ORVLI')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'LIVRO / ORVLI')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'CASA / AASC')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'CASA / AASC')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'CASA / AASC')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'CASA / AASC')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'MESA / AESM')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'MESA / AESM')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'MESA / AESM')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'MESA / AESM')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 49: BR_PRB_05
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_PRB_05', 49, 'SINGLE_CHOICE', '{"dimension":"PROBLEM_SOLVING","difficulty":"EASY"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Três amigos dividiram uma conta de R$ 150 em partes iguais. Um deles pagou com uma nota de R$ 100. Quanto deve receber de troco?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Three friends split a $150 bill equally. One pays with a $100 bill. How much change should they receive?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Tres amigos dividieron una cuenta de 150 € a partes iguales. Uno pagó con un billete de 100 €. ¿Cuánto cambio debe recibir?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Trois amis partagent une facture de 150 € en parts égales. L''un paie avec un billet de 100 €. Combien de monnaie doit-il recevoir ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'R$ 40')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '$40')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '40 €')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '40 €')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'R$ 50')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '$50')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '50 €')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '50 €')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'R$ 60')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '$60')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '60 €')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '60 €')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'R$ 70')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '$70')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '70 €')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '70 €')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 50: BR_PRB_06
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_PRB_06', 50, 'SINGLE_CHOICE', '{"dimension":"PROBLEM_SOLVING","difficulty":"EASY"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Um elevador suporta até 600 kg. Se 5 pessoas pesam juntas 420 kg, quanto peso adicional ainda é permitido?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'An elevator holds up to 600 kg. If 5 people together weigh 420 kg, how much additional weight is allowed?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Un ascensor soporta hasta 600 kg. Si 5 personas pesan juntas 420 kg, ¿cuánto peso adicional se permite?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Un ascenseur supporte jusqu''à 600 kg. Si 5 personnes pèsent ensemble 420 kg, quelle charge supplémentaire est encore autorisée ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '160 kg')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '160 kg')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '160 kg')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '160 kg')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '180 kg')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '180 kg')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '180 kg')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '180 kg')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '200 kg')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '200 kg')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '200 kg')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '200 kg')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '220 kg')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '220 kg')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '220 kg')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '220 kg')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 51: BR_PRB_07
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_PRB_07', 51, 'SINGLE_CHOICE', '{"dimension":"PROBLEM_SOLVING","difficulty":"MEDIUM"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Você precisa transportar 100 caixas em vans com capacidade máxima de 18 caixas cada. Qual o número mínimo de vans necessárias?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'You need to transport 100 boxes in vans with a maximum capacity of 18 boxes each. What is the minimum number of vans needed?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Necesita transportar 100 cajas en furgonetas con capacidad máxima de 18 cajas cada una. ¿Cuál es el número mínimo de furgonetas necesarias?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Vous devez transporter 100 cartons dans des camionnettes d''une capacité maximale de 18 cartons chacune. Quel est le nombre minimum de camionnettes requises ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '5')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '5')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '5')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '5')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '6')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '6')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '6')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '6')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '7')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '7')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '7')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '7')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '8')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '8')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '8')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '8')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 52: BR_PRB_08
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_PRB_08', 52, 'SINGLE_CHOICE', '{"dimension":"PROBLEM_SOLVING","difficulty":"MEDIUM"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Em um teste com 20 perguntas, cada acerto soma 5 pontos e cada erro retira 2 pontos. Se um candidato obteve 72 pontos respondendo a todas, quantas acertou?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'In a 20-question test, each correct answer adds 5 points and each error subtracts 2 points. If an applicant scored 72 points answering all, how many were correct?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'En un examen de 20 preguntas, cada acierto suma 5 puntos y cada error resta 2 puntos. Si un candidato obtuvo 72 puntos respondiendo todas, ¿cuántas acertó?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Lors d''un test de 20 questions, chaque bonne réponse rapporte 5 points et chaque erreur retire 2 points. Si un candidat a obtenu 72 points en répondant à tout, combien de bonnes réponses a-t-il eues ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '14')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '14')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '14')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '14')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '16')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '16')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '16')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '16')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '17')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '17')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '17')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '17')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '18')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '18')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '18')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '18')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 53: BR_PRB_09
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_PRB_09', 53, 'SINGLE_CHOICE', '{"dimension":"PROBLEM_SOLVING","difficulty":"HARD"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Cinco pessoas estão em uma reunião e todas apertam as mãos entre si exatamente uma vez. Quantos apertos de mão ocorreram?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Five people meet and everyone shakes hands with everyone else exactly once. How many handshakes occurred?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Cinco personas están en una reunión y todas se dan la mano exactamente una vez. ¿Cuántos apretones de manos ocurrieron?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Cinq personnes participent à une réunion et se serrent toutes la main exactement une fois. Combien de poignées de main ont eu lieu ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '8')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '8')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '8')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '8')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '10')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '10')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '10')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '10')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '15')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '15')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '15')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '15')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '20')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '20')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '20')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '20')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 54: BR_PRB_10
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_PRB_10', 54, 'SINGLE_CHOICE', '{"dimension":"PROBLEM_SOLVING","difficulty":"HARD"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Um relógio adianta 2 minutos a cada 3 horas. Quantos minutos ele terá adiantado ao final de 24 horas?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'A watch gains 2 minutes every 3 hours. How many minutes will it have gained after 24 hours?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Un reloj se adelanta 2 minutos cada 3 horas. ¿Cuántos minutos se habrá adelantado al cabo de 24 horas?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Une montre avance de 2 minutes toutes les 3 heures. De combien de minutes aura-t-elle avancé au bout de 24 heures ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '12 minutos')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '12 minutes')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '12 minutos')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '12 minutes')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '16 minutos')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '16 minutes')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '16 minutos')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '16 minutes')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '18 minutos')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '18 minutes')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '18 minutes')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '18 minutes')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '20 minutos')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '20 minutes')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '20 minutes')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '20 minutes')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 55: BR_SPD_05
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_SPD_05', 55, 'SINGLE_CHOICE', '{"dimension":"SPEED","difficulty":"EASY"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Qual é o resultado rápido de: 15 × 6?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'What is the rapid calculation of: 15 × 6?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', '¿Cuál es el resultado rápido de: 15 × 6?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Quel est le résultat rapide de : 15 × 6 ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '80')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '80')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '80')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '80')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '85')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '85')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '85')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '85')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '90')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '90')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '90')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '90')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '95')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '95')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '95')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '95')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 56: BR_SPD_06
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_SPD_06', 56, 'SINGLE_CHOICE', '{"dimension":"SPEED","difficulty":"EASY"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Qual número é o dobro de 47?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Which number is double of 47?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', '¿Qué número es el doble de 47?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Quel nombre est le double de 47 ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '84')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '84')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '84')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '84')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '92')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '92')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '92')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '92')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '94')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '94')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '94')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '94')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '96')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '96')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '96')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '96')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 57: BR_SPD_07
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_SPD_07', 57, 'SINGLE_CHOICE', '{"dimension":"SPEED","difficulty":"MEDIUM"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Resolva rapidamente: 250 - 87 = ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Solve quickly: 250 - 87 = ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Resuelva rápidamente: 250 - 87 = ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Résolvez rapidement : 250 - 87 = ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '153')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '153')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '153')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '153')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '163')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '163')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '163')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '163')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '173')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '173')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '173')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '173')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '183')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '183')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '183')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '183')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 58: BR_SPD_08
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_SPD_08', 58, 'SINGLE_CHOICE', '{"dimension":"SPEED","difficulty":"MEDIUM"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Identifique rapidamente qual fração é maior que 1/2:')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Identify quickly which fraction is greater than 1/2:')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Identifique rápidamente qué fracción es mayor que 1/2:')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Identifiez rapidement quelle fraction est supérieure à 1/2 :')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '3/7')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '3/7')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '3/7')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '3/7')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '4/9')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '4/9')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '4/9')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '4/9')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '5/9')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '5/9')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '5/9')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '5/9')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '5/11')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '5/11')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '5/11')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '5/11')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 59: BR_SPD_09
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_SPD_09', 59, 'SINGLE_CHOICE', '{"dimension":"SPEED","difficulty":"HARD"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Calcule com velocidade: 18 × 12 - 16 = ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Calculate swiftly: 18 × 12 - 16 = ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Calcule con rapidez: 18 × 12 - 16 = ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Calculez avec rapidité : 18 × 12 - 16 = ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '196')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '196')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '196')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '196')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '200')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '200')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '200')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '200')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '204')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '204')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '204')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '204')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '216')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '216')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '216')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '216')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 60: BR_SPD_10
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_SPD_10', 60, 'SINGLE_CHOICE', '{"dimension":"SPEED","difficulty":"HARD"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set position = excluded.position, kind = excluded.kind, scoring_key = excluded.scoring_key, metadata = excluded.metadata, active = true
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Identifique rapidamente qual dos números abaixo é divisível por 7 e por 9 simultaneamente:')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Quickly identify which number below is divisible by both 7 and 9 simultaneously:')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Identifique rápidamente qué número es divisible por 7 y por 9 simultáneamente:')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Identifiez rapidement quel nombre ci-dessous est divisible par 7 et par 9 simultanément :')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '568')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '568')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '568')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '568')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '630')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '630')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '630')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '630')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '694')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '694')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '694')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '694')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value, metadata)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb, '{}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value, metadata = excluded.metadata
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '720')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '720')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '720')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '720')
  on conflict (option_id, locale) do update set label = excluded.label;

end $$;

do $$ declare v record; qid uuid; oid uuid; begin
for v in select qv.id from meqyro.quiz_versions qv join meqyro.quizzes q on q.id=qv.quiz_id where q.slug = 'brainrank' and qv.version = '1.1' loop
insert into meqyro.questions(quiz_version_id,stable_key,position,kind,scoring_key,metadata) values(v.id,'MEMORY_01',1001,'SINGLE_CHOICE','{"dimension":"DELAYED_MEMORY"}'::jsonb,'{"memoryCue":{"pt":"Observe esta sequência: lua → chave → árvore → barco.","en":"Look at this sequence: moon → key → tree → boat.","es":"Observa esta secuencia: luna → llave → árbol → barco.","fr":"Observez cette suite : lune → clé → arbre → bateau."}}'::jsonb) on conflict(quiz_version_id,stable_key) do update set metadata=excluded.metadata,scoring_key=excluded.scoring_key,active=true returning id into qid;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'pt','Na sequência que você viu, o que vinha logo depois da chave?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'en','In the sequence you saw, what came right after the key?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'es','En la secuencia que viste, ¿qué venía justo después de la llave?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'fr','Dans la suite présentée, qu’est-ce qui venait juste après la clé ?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'A',1,'{"isCorrect":false}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Lua') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','Moon') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Luna') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Lune') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'B',2,'{"isCorrect":true}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Árvore') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','Tree') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Árbol') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Arbre') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'C',3,'{"isCorrect":false}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Barco') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','Boat') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Barco') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Bateau') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'D',4,'{"isCorrect":false}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Chave') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','Key') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Llave') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Clé') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.questions(quiz_version_id,stable_key,position,kind,scoring_key,metadata) values(v.id,'MEMORY_02',1002,'SINGLE_CHOICE','{"dimension":"DELAYED_MEMORY"}'::jsonb,'{"memoryCue":{"pt":"Ana deixou um caderno verde na segunda gaveta e marcou um encontro para quinta-feira.","en":"Ana left a green notebook in the second drawer and arranged a meeting for Thursday.","es":"Ana dejó un cuaderno verde en el segundo cajón y acordó una reunión para el jueves.","fr":"Ana a laissé un carnet vert dans le deuxième tiroir et prévu une rencontre jeudi."}}'::jsonb) on conflict(quiz_version_id,stable_key) do update set metadata=excluded.metadata,scoring_key=excluded.scoring_key,active=true returning id into qid;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'pt','Qual combinação corresponde ao que você leu sobre Ana?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'en','Which combination matches what you read about Ana?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'es','¿Qué combinación corresponde a lo que leíste sobre Ana?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'fr','Quelle combinaison correspond à ce que vous avez lu sur Ana ?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'A',1,'{"isCorrect":false}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Verde · primeira gaveta · quinta') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','Green · first drawer · Thursday') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Verde · primer cajón · jueves') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Vert · premier tiroir · jeudi') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'B',2,'{"isCorrect":false}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Azul · segunda gaveta · quinta') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','Blue · second drawer · Thursday') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Azul · segundo cajón · jueves') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Bleu · deuxième tiroir · jeudi') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'C',3,'{"isCorrect":true}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Verde · segunda gaveta · quinta') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','Green · second drawer · Thursday') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Verde · segundo cajón · jueves') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Vert · deuxième tiroir · jeudi') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'D',4,'{"isCorrect":false}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Verde · segunda gaveta · terça') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','Green · second drawer · Tuesday') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Verde · segundo cajón · martes') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Vert · deuxième tiroir · mardi') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.questions(quiz_version_id,stable_key,position,kind,scoring_key,metadata) values(v.id,'MEMORY_03',1003,'SINGLE_CHOICE','{"dimension":"DELAYED_MEMORY"}'::jsonb,'{"memoryCue":{"pt":"Observe estas associações: círculo = 4; triângulo = 7; quadrado = 2.","en":"Look at these pairs: circle = 4; triangle = 7; square = 2.","es":"Observa estas asociaciones: círculo = 4; triángulo = 7; cuadrado = 2.","fr":"Observez ces associations : cercle = 4 ; triangle = 7 ; carré = 2."}}'::jsonb) on conflict(quiz_version_id,stable_key) do update set metadata=excluded.metadata,scoring_key=excluded.scoring_key,active=true returning id into qid;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'pt','Qual número estava associado ao triângulo?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'en','Which number was paired with the triangle?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'es','¿Qué número estaba asociado al triángulo?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'fr','Quel nombre était associé au triangle ?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'A',1,'{"isCorrect":false}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','2') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','2') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','2') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','2') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'B',2,'{"isCorrect":false}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','4') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','4') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','4') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','4') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'C',3,'{"isCorrect":false}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','9') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','9') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','9') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','9') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'D',4,'{"isCorrect":true}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','7') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','7') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','7') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','7') on conflict(option_id,locale) do update set label=excluded.label;
end loop; end $$;