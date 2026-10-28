-- Meqyro database seed - Catalog & Quiz Engine content
-- Auto-generated from src/content/quizzes

-- 1. Quizzes
insert into meqyro.quizzes (slug, product_code, active)
values ('brainrank', 'BRAINRANK', true), ('personality-map', 'PERSONALITY_MAP', true), ('careerfit', 'CAREERFIT', true), ('moneydna', 'MONEYDNA', true), ('focusstyle', 'FOCUSSTYLE', true), ('decisiondna', 'DECISIONDNA', true), ('coupledna', 'COUPLEDNA', true)
on conflict (slug) do update set active = true;

-- 2. Quiz Versions
insert into meqyro.quiz_versions (quiz_id, version, scoring_version, status, published_at)
select id, '1.0', '1.0', 'APPROVED'::meqyro.content_status, now() from meqyro.quizzes where slug = 'personality-map'
on conflict (quiz_id, version) do update set status = 'APPROVED', scoring_version = '1.0';

insert into meqyro.quiz_versions (quiz_id, version, scoring_version, status, published_at)
select id, 'v1.0.0', 'v1', 'PUBLISHED'::meqyro.content_status, now() from meqyro.quizzes where slug in ('careerfit', 'moneydna', 'focusstyle', 'decisiondna', 'coupledna')
on conflict (quiz_id, version) do update set status = 'PUBLISHED', scoring_version = 'v1';

insert into meqyro.quiz_versions (quiz_id, version, scoring_version, status, published_at)
select id, '1.2', '1.2', 'APPROVED'::meqyro.content_status, now() from meqyro.quizzes where slug = 'brainrank'
on conflict (quiz_id, version) do nothing;
update meqyro.quiz_versions set status = 'ARCHIVED' where quiz_id = (select id from meqyro.quizzes where slug = 'brainrank') and version in ('1.0','1.1');

-- 3. Product Prices
insert into meqyro.product_prices (quiz_id, market, currency, amount, active)
select q.id, price.market, price.currency, price.amount, true
from meqyro.quizzes q
cross join (values ('BR','BRL',1290),('US','USD',299),('EU','EUR',299),('GB','GBP',249)) as price(market,currency,amount)
where q.slug in ('brainrank', 'personality-map')
on conflict (quiz_id, market, currency) do update set active = true, amount = excluded.amount;

insert into meqyro.product_prices (quiz_id, market, currency, amount, active)
select q.id, price.market, price.currency, price.amount, true
from meqyro.quizzes q
cross join (values ('BR','BRL',1490),('US','USD',399),('EU','EUR',399),('GB','GBP',349)) as price(market,currency,amount)
where q.slug in ('careerfit', 'moneydna', 'focusstyle', 'decisiondna', 'coupledna')
on conflict (quiz_id, market, currency) do update set active = true, amount = excluded.amount;

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
  where q.slug = 'brainrank' and qv.version = '1.2';

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

-- 5. Personality Map Questions
do $$
declare
  v_quiz_version_id uuid;
  v_question_id uuid;
begin
  select qv.id into v_quiz_version_id
  from meqyro.quiz_versions qv
  join meqyro.quizzes q on q.id = qv.quiz_id
  where q.slug = 'personality-map' and qv.version = '1.0';

  -- Question 1: PM_OPN_01
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'PM_OPN_01', 1, 'LIKERT', '{"dimension":"OPENNESS","direction":"DIRECT"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Tenho vivo interesse por ideias novas, teorias e conceitos abstratos.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I have a keen interest in new ideas, theories, and abstract concepts.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Tengo un vivo interés por ideas nuevas, teorías y conceptos abstractos.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'J''ai un vif intérêt pour les idées nouvelles, les théories et les concepts abstraits.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 2: PM_OPN_02
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'PM_OPN_02', 2, 'LIKERT', '{"dimension":"OPENNESS","direction":"DIRECT"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Aprecio arte, música e experiências estéticas originais.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I appreciate art, music, and original aesthetic experiences.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Aprecio el arte, la música y las experiencias estéticas originales.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'J''apprécie l''art, la musique et les expériences esthétiques originales.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 3: PM_OPN_03
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'PM_OPN_03', 3, 'LIKERT', '{"dimension":"OPENNESS","direction":"DIRECT"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Gosto de refletir sobre perspectivas incomuns antes de tomar uma decisão.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I enjoy considering unusual perspectives before making a decision.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Me gusta reflexionar sobre perspectivas inusuales antes de tomar una decisión.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'J''aime réfléchir à des perspectives inhabituelles avant de prendre une décision.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 4: PM_OPN_04
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'PM_OPN_04', 4, 'LIKERT', '{"dimension":"OPENNESS","direction":"DIRECT"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Tenho imaginação fértil e gosto de explorar cenários hipotéticos.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I have a vivid imagination and enjoy exploring hypothetical scenarios.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Tengo una imaginación fértil y disfruto explorando escenarios hipotéticos.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'J''ai une imagination fertile et j''aime explorer des scénarios hypothétiques.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 5: PM_OPN_05
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'PM_OPN_05', 5, 'LIKERT', '{"dimension":"OPENNESS","direction":"REVERSE"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Prefiro manter rotinas estabelecidas a experimentar métodos não testados.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I prefer sticking to established routines rather than trying untested methods.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Prefiero mantener rutinas establecidas antes que probar métodos no probados.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je préfère m''en tenir à des routines établies plutôt que d''essayer des méthodes non testées.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 6: PM_OPN_06
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'PM_OPN_06', 6, 'LIKERT', '{"dimension":"OPENNESS","direction":"REVERSE"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Discussões puramente conceituais ou filosóficas me cansam rapidamente.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Purely conceptual or philosophical discussions drain me quickly.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Las discusiones puramente conceptuales o filosóficas me cansan rápidamente.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Les discussions purement conceptuelles ou philosophiques me fatiguent vite.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 7: PM_OPN_07
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'PM_OPN_07', 7, 'LIKERT', '{"dimension":"OPENNESS","direction":"REVERSE"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Raramente busco novidades culturais fora do que já conheço e confio.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I rarely seek out cultural novelties outside what I already know and trust.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Rara vez busco novedades culturales fuera de lo que ya conozco y confío.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je cherche rarement des nouveautés culturelles en dehors de ce que je connais déjà.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 8: PM_OPN_08
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'PM_OPN_08', 8, 'LIKERT', '{"dimension":"OPENNESS","direction":"REVERSE"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Considero mais produtivo focar em fatos imediatos do que em possibilidades futuras.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I find it more productive to focus on immediate facts rather than future possibilities.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Considero más productivo enfocarme en hechos inmediatos que en posibilidades futuras.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je trouve plus productif de me concentrer sur les faits immédiats que sur les possibilités.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 9: PM_CON_01
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'PM_CON_01', 9, 'LIKERT', '{"dimension":"CONSCIENTIOUSNESS","direction":"DIRECT"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Mantenho meus planos organizados e cumpro prazos com disciplina.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I keep my plans organized and meet deadlines with discipline.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Mantengo mis planes organizados y cumplo los plazos con disciplina.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je garde mes plans organisés et respecte les délais avec discipline.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 10: PM_CON_02
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'PM_CON_02', 10, 'LIKERT', '{"dimension":"CONSCIENTIOUSNESS","direction":"DIRECT"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Presto muita atenção a detalhes importantes em tudo o que entrego.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I pay careful attention to important details in everything I deliver.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Presto mucha atención a detalles importantes en todo lo que entrego.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je prête une attention soignée aux détails importants dans tout ce que je livre.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 11: PM_CON_03
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'PM_CON_03', 11, 'LIKERT', '{"dimension":"CONSCIENTIOUSNESS","direction":"DIRECT"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Gosto de concluir uma tarefa por completo antes de iniciar outra.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I like to complete a task thoroughly before starting another.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Me gusta terminar una tarea por completo antes de comenzar otra.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'J''aime terminer une tâche complètement avant d''en commencer une autre.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 12: PM_CON_04
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'PM_CON_04', 12, 'LIKERT', '{"dimension":"CONSCIENTIOUSNESS","direction":"DIRECT"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Planejo com antecedência para evitar surpresas ou retrabalho.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I plan ahead to avoid surprises or unnecessary rework.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Planifico con anticipación para evitar sorpresas o retrabajo.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je planifie à l''avance pour éviter les surprises ou le travail inutile.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 13: PM_CON_05
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'PM_CON_05', 13, 'LIKERT', '{"dimension":"CONSCIENTIOUSNESS","direction":"REVERSE"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Com frequência deixo obrigações importantes para o último momento.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I frequently leave important obligations until the last minute.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Con frecuencia dejo obligaciones importantes para el último momento.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je laisse souvent des obligations importantes à la dernière minute.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 14: PM_CON_06
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'PM_CON_06', 14, 'LIKERT', '{"dimension":"CONSCIENTIOUSNESS","direction":"REVERSE"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Tenho dificuldade em manter meu espaço ou arquivos consistentemente ordenados.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I have difficulty keeping my space or files consistently organized.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Me cuesta mantener mi espacio o archivos consistentemente ordenados.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'J''ai du mal à garder mon espace ou mes dossiers bien ordonnés.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 15: PM_CON_07
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'PM_CON_07', 15, 'LIKERT', '{"dimension":"CONSCIENTIOUSNESS","direction":"REVERSE"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Costumo perder o interesse em projetos longos quando a novidade passa.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I tend to lose interest in long-term projects once the novelty fades.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Suelo perder el interés en proyectos largos cuando la novedad se desvanece.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'J''ai tendance à me désintéresser des projets longs une fois la nouveauté passée.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 16: PM_CON_08
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'PM_CON_08', 16, 'LIKERT', '{"dimension":"CONSCIENTIOUSNESS","direction":"REVERSE"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Prefiro improvisar do que seguir um cronograma detalhado.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I prefer improvising rather than following a detailed schedule.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Prefiero improvisar antes que seguir un cronograma detallado.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je préfère improviser plutôt que suivre un calendrier détaillé.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 17: PM_EXT_01
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'PM_EXT_01', 17, 'LIKERT', '{"dimension":"EXTRAVERSION","direction":"DIRECT"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Sinto-me energizado ao interagir com grupos dinâmicos e conhecer pessoas.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I feel energized interacting with lively groups and meeting new people.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Me siento lleno de energía interactuando con grupos y conociendo gente nueva.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je me sens énergisé en interagissant avec des groupes et en rencontrant du monde.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 18: PM_EXT_02
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'PM_EXT_02', 18, 'LIKERT', '{"dimension":"EXTRAVERSION","direction":"DIRECT"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Tomo a iniciativa em conversas sociais com naturalidade e entusiasmo.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I easily take initiative in social conversations with enthusiasm.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Tomo la iniciativa en conversaciones sociales con naturalidad y entusiasmo.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je prends facilement l''initiative des conversations sociales avec enthousiasme.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 19: PM_EXT_03
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'PM_EXT_03', 19, 'LIKERT', '{"dimension":"EXTRAVERSION","direction":"DIRECT"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Gosto de ambientes movimentados e cheios de estímulos.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I enjoy bustling, fast-paced environments full of activity.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Me gustan los ambientes concurridos y llenos de estímulos.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'J''aime les environnements animés et pleins d''activité.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 20: PM_EXT_04
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'PM_EXT_04', 20, 'LIKERT', '{"dimension":"EXTRAVERSION","direction":"DIRECT"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Expresso minhas opiniões abertamente em discussões coletivas.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I express my opinions openly in group discussions.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Expreso mis opiniones abiertamente en debates colectivos.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'J''exprime mes opinions ouvertement dans les discussions collectives.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 21: PM_EXT_05
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'PM_EXT_05', 21, 'LIKERT', '{"dimension":"EXTRAVERSION","direction":"REVERSE"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Prefiro passar momentos de descanso em silêncio ou sozinho.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I prefer spending leisure time in quiet or by myself.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Prefiero pasar momentos de descanso en silencio o a solas.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je préfère passer mes moments de détente dans le calme ou seul.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 22: PM_EXT_06
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'PM_EXT_06', 22, 'LIKERT', '{"dimension":"EXTRAVERSION","direction":"REVERSE"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Eventos sociais com muitos estranhos drenam minha energia rapidamente.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Large social gatherings with strangers quickly drain my energy.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Grandes eventos sociales con desconocidos agotan mi energía rápidamente.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Les grands événements avec des inconnus épuisent vite mon énergie.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 23: PM_EXT_07
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'PM_EXT_07', 23, 'LIKERT', '{"dimension":"EXTRAVERSION","direction":"REVERSE"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Costumo manter pensamentos e impressões para mim até ser perguntado.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I usually keep thoughts and impressions to myself until asked.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Suelo guardar pensamientos e impresiones para mí hasta que me preguntan.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je garde généralement mes pensées pour moi jusqu''à ce qu''on me demande.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 24: PM_EXT_08
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'PM_EXT_08', 24, 'LIKERT', '{"dimension":"EXTRAVERSION","direction":"REVERSE"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Evito ser o centro das atenções em situações sociais ou profissionais.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I avoid being the center of attention in social or professional settings.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Evito ser el centro de atención en situaciones sociales o laborales.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'J''évite d''être le centre de l''attention en société ou au travail.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 25: PM_AGR_01
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'PM_AGR_01', 25, 'LIKERT', '{"dimension":"AGREEABLENESS","direction":"DIRECT"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Preocupo-me genuinamente com o bem-estar e sentimentos dos outros.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I genuinely care about the well-being and feelings of others.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Me preocupo genuinamente por el bienestar y sentimientos de los demás.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je me soucie sincèrement du bien-être et des sentiments des autres.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 26: PM_AGR_02
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'PM_AGR_02', 26, 'LIKERT', '{"dimension":"AGREEABLENESS","direction":"DIRECT"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Procuro encontrar consensos harmoniosos mesmo quando há divergências.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I strive to find harmonious consensus even when there are disagreements.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Intento encontrar consensos armoniosos incluso cuando hay desacuerdos.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je m''efforce de trouver des consensus harmonieux même en cas de désaccord.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 27: PM_AGR_03
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'PM_AGR_03', 27, 'LIKERT', '{"dimension":"AGREEABLENESS","direction":"DIRECT"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Tenho facilidade em perdoar equívocos e dar segundas chances.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I find it easy to forgive mistakes and give second chances.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Tengo facilidad para perdonar errores y dar segundas oportunidades.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'J''ai de la facilité à pardonner les erreurs et donner de nouvelles chances.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 28: PM_AGR_04
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'PM_AGR_04', 28, 'LIKERT', '{"dimension":"AGREEABLENESS","direction":"DIRECT"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Acredito na boa intenção fundamental da maioria das pessoas.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I tend to believe in the good intentions of most people.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Tiendo a creer en las buenas intenciones de la mayoría de las personas.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'J''ai tendance à croire aux bonnes intentions de la plupart des gens.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 29: PM_AGR_05
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'PM_AGR_05', 29, 'LIKERT', '{"dimension":"AGREEABLENESS","direction":"REVERSE"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Sou naturalmente cético em relação aos motivos ocultos de terceiros.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I am naturally skeptical of other people''s hidden motives.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Soy naturalmente escéptico respecto a las motivaciones de terceros.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je suis naturellement sceptique quant aux motivations cachées des autres.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 30: PM_AGR_06
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'PM_AGR_06', 30, 'LIKERT', '{"dimension":"AGREEABLENESS","direction":"REVERSE"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Não hesito em confrontar alguém asperamente se achar necessário.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I do not hesitate to confront someone sharply if I deem it necessary.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'No dudo en confrontar a alguien con dureza si lo considero necesario.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je n''hésite pas à confronter quelqu''un fermement si nécessaire.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 31: PM_AGR_07
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'PM_AGR_07', 31, 'LIKERT', '{"dimension":"AGREEABLENESS","direction":"REVERSE"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Priorizo meus próprios objetivos antes de considerar o impacto nos outros.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I prioritize my own goals before considering the impact on others.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Priorizo mis propios objetivos antes de considerar el impacto en otros.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je priorise mes propres objectifs avant de considérer l''impact sur autrui.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 32: PM_AGR_08
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'PM_AGR_08', 32, 'LIKERT', '{"dimension":"AGREEABLENESS","direction":"REVERSE"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Considero competição implacável mais eficiente do que colaboração suave.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I consider sharp competition more effective than gentle collaboration.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Considero la competencia implacable más eficaz que la colaboración suave.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je considère la compétition directe plus efficace que la collaboration douce.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 33: PM_EMS_01
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'PM_EMS_01', 33, 'LIKERT', '{"dimension":"EMOTIONAL_STABILITY","direction":"DIRECT"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Mantenho a calma e o equilíbrio mesmo sob forte pressão ou imprevistos.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I remain calm and poised even under heavy pressure or unexpected events.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Mantengo la calma y el equilibrio incluso bajo fuerte presión o imprevistos.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je reste calme et équilibré même sous forte pression ou imprévus.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 34: PM_EMS_02
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'PM_EMS_02', 34, 'LIKERT', '{"dimension":"EMOTIONAL_STABILITY","direction":"DIRECT"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Recupero-me com rapidez de contratempos ou desapontamentos cotidianos.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I bounce back quickly from setbacks or everyday disappointments.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Me recupero con rapidez de contratiempos o decepciones cotidianas.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je me remets rapidement des revers ou déceptions du quotidien.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 35: PM_EMS_03
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'PM_EMS_03', 35, 'LIKERT', '{"dimension":"EMOTIONAL_STABILITY","direction":"DIRECT"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Raramente sinto ansiedade desproporcional diante de incertezas.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I rarely experience disproportionate anxiety in the face of uncertainty.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Rara vez siento ansiedad desproporcionada ante la incertidumbre.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je ressens rarement une anxiété disproportionnée face à l''incertitude.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 36: PM_EMS_04
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'PM_EMS_04', 36, 'LIKERT', '{"dimension":"EMOTIONAL_STABILITY","direction":"DIRECT"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Tenho confiança estável na minha capacidade de lidar com desafios.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I have stable confidence in my ability to handle challenges.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Tengo una confianza estable en mi capacidad para afrontar desafíos.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'J''ai une confiance stable dans ma capacité à faire face aux défis.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 37: PM_EMS_05
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'PM_EMS_05', 37, 'LIKERT', '{"dimension":"EMOTIONAL_STABILITY","direction":"REVERSE"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Costumo me preocupar excessivamente com coisas fora do meu controle.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I tend to worry excessively about things beyond my control.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Suelo preocuparme en exceso por cosas fuera de mi control.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'J''ai tendance à m''inquiéter excessivement de choses hors de mon contrôle.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 38: PM_EMS_06
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'PM_EMS_06', 38, 'LIKERT', '{"dimension":"EMOTIONAL_STABILITY","direction":"REVERSE"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Mudanças repentinas de humor afetam minha concentração ou disposição.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Sudden mood shifts affect my concentration or motivation.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Cambios repentinos de humor afectan mi concentración o disposición.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Des changements soudains d''humeur affectent ma concentration ou mon élan.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 39: PM_EMS_07
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'PM_EMS_07', 39, 'LIKERT', '{"dimension":"EMOTIONAL_STABILITY","direction":"REVERSE"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Sinto-me sobrecarregado facilmente quando múltiplas demandas surgem juntas.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I easily feel overwhelmed when multiple demands arrive at once.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Me siento abrumado con facilidad cuando surgen múltiples demandas a la vez.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je me sens facilement dépassé lorsque plusieurs demandes arrivent ensemble.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 40: PM_EMS_08
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'PM_EMS_08', 40, 'LIKERT', '{"dimension":"EMOTIONAL_STABILITY","direction":"REVERSE"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Críticas ou julgamentos negativos costumam abalar minha autoconfiança por dias.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Criticism or negative judgment often shakes my self-confidence for days.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Las críticas o juicios negativos suelen sacudir mi autoconfianza durante días.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Les critiques ou jugements négatifs ébranlent souvent ma confiance pendant des jours.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

end $$;

-- 6. CareerFit Questions
do $$
declare
  v_quiz_version_id uuid;
  v_question_id uuid;
begin
  select qv.id into v_quiz_version_id
  from meqyro.quiz_versions qv
  join meqyro.quizzes q on q.id = qv.quiz_id
  where q.slug = 'careerfit' and qv.version = 'v1.0.0';

  -- Question 1: CF_TECH_01
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'CF_TECH_01', 1, 'LIKERT', '{"dimension":"TECHNICAL"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Prefiro aprofundar minha especialidade técnica do que assumir funções de gestão geral.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I prefer deepening my technical expertise over taking on general management roles.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Prefiero profundizar mi especialidad técnica que asumir funciones de gestión general.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je préfère approfondir mon expertise technique plutôt que d''assumer des fonctions de gestion générale.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 2: CF_TECH_02
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'CF_TECH_02', 2, 'LIKERT', '{"dimension":"TECHNICAL"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Sinto orgulho quando sou procurado como referência no assunto que domino.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I feel proud when colleagues seek me out as a subject-matter reference.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Me siento orgulloso cuando me buscan como referente en el tema que domino.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je suis fier d''être consulté comme référence dans le domaine que je maîtrise.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 3: CF_TECH_03
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'CF_TECH_03', 3, 'LIKERT', '{"dimension":"TECHNICAL"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Resolver desafios complexos com rigor e qualidade é mais motivador do que política corporativa.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Solving complex challenges with rigor and craft is more motivating than corporate politics.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Resolver retos complejos con rigor y calidad es más motivador que la política corporativa.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Résoudre des défis complexes avec rigueur et qualité est plus motivant que la politique d''entreprise.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 4: CF_TECH_04
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'CF_TECH_04', 4, 'LIKERT', '{"dimension":"TECHNICAL"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Mantenho-me constantemente atualizado sobre ferramentas e metodologias avançadas da minha área.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I constantly keep up to date with cutting-edge tools and methodologies in my field.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Me mantengo constantemente actualizado sobre herramientas y metodologías de vanguardia.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je me tiens constamment informé des outils et méthodologies de pointe de mon secteur.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 5: CF_MGT_01
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'CF_MGT_01', 5, 'LIKERT', '{"dimension":"MANAGERIAL"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Gosto de coordenar pessoas, alinhar objetivos e acompanhar entregas de equipe.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I enjoy coordinating people, aligning goals, and tracking team deliverables.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Disfruto coordinando personas, alineando objetivos y supervisando entregas de equipo.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'J''aime coordonner les personnes, aligner les objectifs et suivre les livrables d''équipe.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 6: CF_MGT_02
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'CF_MGT_02', 6, 'LIKERT', '{"dimension":"MANAGERIAL"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Assumir a responsabilidade final pelo resultado global me energiza.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Taking ultimate responsibility for overall outcomes energizes me.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Asumir la responsabilidad final por los resultados globales me llena de energía.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Prendre la responsabilité finale des résultats globaux me stimule.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 7: CF_MGT_03
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'CF_MGT_03', 7, 'LIKERT', '{"dimension":"MANAGERIAL"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Tenho facilidade para articular interesses distintos entre áreas e liderar mudanças.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I easily navigate diverse cross-functional interests and lead organizational change.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Tengo facilidad para articular intereses diversos entre áreas y liderar el cambio.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'J''articule facilement des intérêts variés entre services et mène le changement.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 8: CF_MGT_04
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'CF_MGT_04', 8, 'LIKERT', '{"dimension":"MANAGERIAL"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Desenvolver talentos e preparar sucessores é uma prioridade natural no meu trabalho.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Developing talent and mentoring future leaders is a natural priority in my work.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Desarrollar talento y preparar sucesores es una prioridad natural en mi trabajo.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Développer les talents et préparer la relève est une priorité naturelle dans mon travail.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 9: CF_CREAT_01
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'CF_CREAT_01', 9, 'LIKERT', '{"dimension":"CREATIVE"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Sinto necessidade constante de criar produtos, formatos ou soluções inéditas.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I feel a constant urge to create novel products, formats, or original solutions.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Siento una necesidad constante de crear productos, formatos o soluciones novedosas.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'J''éprouve le besoin constant de créer des produits, formats ou solutions inédites.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 10: CF_CREAT_02
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'CF_CREAT_02', 10, 'LIKERT', '{"dimension":"CREATIVE"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Rotinas repetitivas esgotam rapidamente meu entusiasmo profissional.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Repetitive routines quickly drain my professional enthusiasm.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Las rutinas repetitivas agotan rápidamente mi entusiasmo profesional.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Les routines répétitives épuisent rapidement mon enthousiasme professionnel.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 11: CF_CREAT_03
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'CF_CREAT_03', 11, 'LIKERT', '{"dimension":"CREATIVE"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Prefiro trabalhar em projetos onde tenho liberdade estética e conceitual.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I prefer working on initiatives where I have artistic and conceptual freedom.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Prefiero trabajar en proyectos donde cuento con libertad estética y conceptual.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je préfère travailler sur des projets où je dispose d''une liberté esthétique et conceptuelle.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 12: CF_CREAT_04
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'CF_CREAT_04', 12, 'LIKERT', '{"dimension":"CREATIVE"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Conectar ideias de áreas aparentemente desconexas é meu principal diferencial.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Connecting ideas from seemingly unrelated domains is my core strength.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Conectar ideas de áreas aparentemente inconexas es mi principal ventaja diferencial.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Faire des ponts entre des domaines apparemment sans lien est mon atout majeur.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 13: CF_AUTO_01
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'CF_AUTO_01', 13, 'LIKERT', '{"dimension":"AUTONOMOUS"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Valorizo mais a autonomia de horários e método do que o prestígio de um cargo fixo.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I value autonomy over schedule and methods more than the prestige of a rigid title.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Valoro más la autonomía de horarios y métodos que el prestigio de un puesto fijo.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'J''accorde plus de valeur à l''autonomie d''horaires et de méthodes qu''au prestige d''un titre rigide.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 14: CF_AUTO_02
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'CF_AUTO_02', 14, 'LIKERT', '{"dimension":"AUTONOMOUS"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Prefiro definir minhas próprias prioridades a seguir manuais operacionais estritos.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I prefer setting my own priorities over following strict operational playbooks.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Prefiero definir mis propias prioridades a seguir manuales operativos estrictos.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je préfère définir mes propres priorités plutôt que de suivre des manuels stricts.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 15: CF_AUTO_03
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'CF_AUTO_03', 15, 'LIKERT', '{"dimension":"AUTONOMOUS"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Trabalhar como profissional independente ou empreendedor é uma aspiração forte.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Working independently or building an entrepreneurial venture is a strong aspiration.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Trabajar de forma independiente o emprender es una aspiración firme para mí.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Travailler de manière indépendante ou entreprendre est une forte aspiration.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 16: CF_AUTO_04
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'CF_AUTO_04', 16, 'LIKERT', '{"dimension":"AUTONOMOUS"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Produzo meus melhores resultados quando ninguém microgerencia meu dia a dia.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I deliver my best results when nobody micromanages my daily flow.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Produzco mis mejores resultados cuando nadie microgestiona mi día a día.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je produis mes meilleurs résultats lorsque personne ne microgère mon quotidien.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 17: CF_SEC_01
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'CF_SEC_01', 17, 'LIKERT', '{"dimension":"SECURITY"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Estabilidade contratual e previsibilidade de remuneração são essenciais para minha paz mental.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Contract stability and predictable compensation are essential for my peace of mind.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'La estabilidad contractual y la previsibilidad salarial son indispensables para mi tranquilidad.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'La stabilité contractuelle et la prévisibilité salariale sont indispensables à ma sérénité.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 18: CF_SEC_02
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'CF_SEC_02', 18, 'LIKERT', '{"dimension":"SECURITY"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Prefiro organizações consolidadas a startups que operam em incerteza contínua.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I prefer well-established organizations over early startups operating in constant uncertainty.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Prefiero empresas consolidadas a startups que operan en incertidumbre continua.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je préfère les organisations établies aux startups fonctionnant dans une incertitude permanente.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 19: CF_SEC_03
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'CF_SEC_03', 19, 'LIKERT', '{"dimension":"SECURITY"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Benefícios sólidos (plano de saúde, previdência) pesam muito na escolha de um trabalho.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Comprehensive benefits (healthcare, retirement) weigh heavily when choosing an opportunity.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Beneficios sólidos (salud, pensiones) tienen un gran peso al elegir una propuesta de trabajo.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Des avantages solides (mutuelle, retraite) pèsent lourd dans mes choix professionnels.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 20: CF_SEC_04
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'CF_SEC_04', 20, 'LIKERT', '{"dimension":"SECURITY"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Ter clareza sobre critérios de promoção e estabilidade me traz segurança produtiva.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Clear criteria for advancement and job security gives me productive confidence.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Tener claridad sobre los criterios de ascenso y estabilidad me brinda seguridad para rendir.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Une clarté sur les critères d''avancement et la pérennité me donne confiance au travail.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 21: CF_CAUSE_01
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'CF_CAUSE_01', 21, 'LIKERT', '{"dimension":"CAUSE"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Preciso sentir que meu trabalho diário melhora concretamente a vida das pessoas.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I need to feel that my daily work tangibly improves people''s lives.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Necesito sentir que mi trabajo diario mejora concretamente la vida de las personas.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'J''ai besoin de sentir que mon travail quotidien améliore concrètement la vie d''autrui.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 22: CF_CAUSE_02
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'CF_CAUSE_02', 22, 'LIKERT', '{"dimension":"CAUSE"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Abriria mão de remuneração maior para atuar em uma organização com forte impacto social.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I would trade higher pay to work for an organization with strong social impact.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Renunciaría a un mayor sueldo para trabajar en una organización con impacto social positivo.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je renoncerais à un salaire supérieur pour œuvrer dans une structure à fort impact sociétal.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 23: CF_CAUSE_03
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'CF_CAUSE_03', 23, 'LIKERT', '{"dimension":"CAUSE"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Não consigo me dedicar a produtos ou projetos que violem meus valores éticos.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I cannot commit to products or missions that conflict with my core ethical values.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'No puedo involucrarme en proyectos que contradigan mis principios éticos esenciales.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je ne peux pas m''investir dans des projets qui heurtent mes valeurs éthiques.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 24: CF_CAUSE_04
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'CF_CAUSE_04', 24, 'LIKERT', '{"dimension":"CAUSE"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Deixar um legado positivo para a sociedade é minha principal métrica de realização.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Leaving a positive societal legacy is my chief measure of professional fulfillment.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Dejar un legado positivo para la sociedad es mi mayor medida de realización personal.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Laisser un impact positif dans la société est mon critère majeur d''accomplissement.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

end $$;

-- 7. MoneyDNA Questions
do $$
declare
  v_quiz_version_id uuid;
  v_question_id uuid;
begin
  select qv.id into v_quiz_version_id
  from meqyro.quiz_versions qv
  join meqyro.quizzes q on q.id = qv.quiz_id
  where q.slug = 'moneydna' and qv.version = 'v1.0.0';

  -- Question 1: MD_BLD_01
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'MD_BLD_01', 1, 'LIKERT', '{"archetype":"BUILDER"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Vejo o dinheiro principalmente como ferramenta para construir projetos e novos negócios.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I see money primarily as a tool to build ambitious projects and ventures.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Veo el dinero principalmente como una herramienta para construir proyectos e iniciativas.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je conçois l''argent avant tout comme un levier pour bâtir des projets et entreprises.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 2: MD_BLD_02
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'MD_BLD_02', 2, 'LIKERT', '{"archetype":"BUILDER"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Prefiro reinvestir a maior parte dos meus ganhos do que gastar em consumo supérfluo.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I prefer reinvesting most of my earnings into assets rather than spending on non-essentials.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Prefiero reinvertir la mayoría de mis ingresos antes que gastar en consumo superfluo.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je préfère réinvestir l''essentiel de mes gains plutôt que de consommer du superflu.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 3: MD_BLD_03
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'MD_BLD_03', 3, 'LIKERT', '{"archetype":"BUILDER"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Tenho satisfação em ver meu patrimônio líquido crescer de forma consistente ao longo dos anos.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I take deep satisfaction in watching my net worth grow steadily over the years.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Disfruto profundamente ver crecer mi patrimonio neto de manera constante con el tiempo.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'J''éprouve une réelle satisfaction à voir mon patrimoine net croître au fil des années.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 4: MD_BLD_04
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'MD_BLD_04', 4, 'LIKERT', '{"archetype":"BUILDER"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Estou sempre buscando novas fontes de renda ou maneiras de alavancar resultados.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I am always looking for new income streams and ways to compound my results.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Siempre busco nuevas fuentes de ingresos y formas de escalar mis resultados.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je recherche constamment de nouvelles sources de revenus et de leviers d''action.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 5: MD_GRD_01
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'MD_GRD_01', 5, 'LIKERT', '{"archetype":"GUARDIAN"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Manter uma reserva de emergência confortável é prioritário antes de qualquer investimento arriscado.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Maintaining a solid emergency cushion takes priority over any speculative investment.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Mantener un colchón de emergencia amplio es prioritario antes de cualquier inversión de riesgo.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Conserver une épargne de précaution confortable prime sur tout investissement à risque.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 6: MD_GRD_02
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'MD_GRD_02', 6, 'LIKERT', '{"archetype":"GUARDIAN"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'A possibilidade de perder dinheiro investido me causa desconforto imediato.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'The prospect of losing invested capital causes me immediate unease.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'La posibilidad de perder capital invertido me causa una intranquilidad inmediata.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'L''éventualité de perdre un capital investi me crée un inconfort certain.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 7: MD_GRD_03
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'MD_GRD_03', 7, 'LIKERT', '{"archetype":"GUARDIAN"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Pesquiso minuciosamente preços e condições antes de realizar qualquer compra relevante.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I thoroughly compare prices and terms before making any significant purchase.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Investigo minuciosamente precios y condiciones antes de efectuar compras importantes.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je compare minutieusement les prix et conditions avant chaque achat significatif.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 8: MD_GRD_04
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'MD_GRD_04', 8, 'LIKERT', '{"archetype":"GUARDIAN"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Dívidas financeiras tiram meu sono, por isso priorizo quitá-las o mais rápido possível.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Debt keeps me awake at night, so I prioritize clearing balances as quickly as possible.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Tener deudas me quita el sueño, así que priorizo liquidarlas de inmediato.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Les dettes financières me pèsent, je m''efforce donc de les solder au plus vite.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 9: MD_STRAT_01
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'MD_STRAT_01', 9, 'LIKERT', '{"archetype":"STRATEGIST"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Acompanho métricas de inflação, rentabilidade real e diversificação de carteira com rigor.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I closely track inflation metrics, real yields, and disciplined portfolio allocation.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Sigo con rigor métricas de inflación, rendimiento real y diversificación de cartera.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je suis avec méthode l''inflation, les rendements réels et l''allocation de portefeuille.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 10: MD_STRAT_02
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'MD_STRAT_02', 10, 'LIKERT', '{"archetype":"STRATEGIST"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Tomo decisões financeiras baseadas em dados e modelos racionais, nunca por impulso emocional.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I make financial decisions using data and rational models, never emotional impulses.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Tomo decisiones financieras basadas en datos y lógica, jamás por impulsos de euforia.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je prends mes décisions financières d''après des données rationnelles, jamais par impulsion.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 11: MD_STRAT_03
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'MD_STRAT_03', 11, 'LIKERT', '{"archetype":"STRATEGIST"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Tenho metas financeiras detalhadas para 3, 5 e 10 anos à frente.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I have well-defined financial roadmaps for 3, 5, and 10 years ahead.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Dispongo de metas financieras estructuradas para los próximos 3, 5 y 10 años.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'J''établis des plans financiers clairs à 3, 5 et 10 ans.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 12: MD_STRAT_04
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'MD_STRAT_04', 12, 'LIKERT', '{"archetype":"STRATEGIST"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Gosto de entender a fundo a estrutura de custos, tributos e taxas de qualquer produto financeiro.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I make a point of understanding cost structures, taxes, and fees behind any instrument.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Comprendo a fondo las comisiones, impuestos y costes ocultos de cada producto.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je veille à comprendre les frais, fiscalités et mécanismes de chaque placement.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 13: MD_ADV_01
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'MD_ADV_01', 13, 'LIKERT', '{"archetype":"ADVENTURER"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Aceito volatilidade alta se houver chance real de retornos assimétricos expressivos.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I embrace high volatility when there is genuine opportunity for asymmetric upside.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Acepto volatilidad elevada si existe una posibilidad real de retornos asimétricos.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'J''accepte une forte volatilité s''il y a un vrai potentiel de gain asymétrique.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 14: MD_ADV_02
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'MD_ADV_02', 14, 'LIKERT', '{"archetype":"ADVENTURER"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Valorizo experiências memoráveis (viagens, eventos) mais do que acumular números na conta.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I value unforgettable experiences (travel, events) more than hoarding digits in an account.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Valoro las vivencias memorables (viajes, experiencias) más que acumular saldos bancarios.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je privilégie les expériences marquantes (voyages, découvertes) à l''accumulation passive.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 15: MD_ADV_03
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'MD_ADV_03', 15, 'LIKERT', '{"archetype":"ADVENTURER"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Frequentemente me empolgo com ideias arrojadas de novos investimentos e apostas de mercado.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I often get excited about bold new market plays and unconventional ventures.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Suelo entusiasmarme con apuestas atrevidas e innovadoras de inversión.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je m''enthousiasme facilement pour des paris d''investissement audacieux et novateurs.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 16: MD_ADV_04
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'MD_ADV_04', 16, 'LIKERT', '{"archetype":"ADVENTURER"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Para mim, o dinheiro existe para ser desfrutado no presente com intensidade e liberdade.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'To me, money exists to be enjoyed in the present with boldness and freedom.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Para mí, el dinero existe para disfrutarse en el presente con libertad y plenitud.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Pour moi, l''argent sert à profiter du présent avec intensité et liberté.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 17: MD_BAL_01
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'MD_BAL_01', 17, 'LIKERT', '{"archetype":"BALANCER"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Busco equilíbrio sereno entre guardar para o futuro e desfrutar com moderação o presente.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I seek calm balance between saving for tomorrow and enjoying today with moderation.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Busco un equilibrio sensato entre ahorrar para el futuro y disfrutar con mesura el hoy.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je recherche un juste équilibre entre prévoyance pour demain et plaisir mesuré au présent.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 18: MD_BAL_02
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'MD_BAL_02', 18, 'LIKERT', '{"archetype":"BALANCER"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Não deixo o dinheiro se tornar fonte de obsessão nem de negligência na minha rotina.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I do not let finances become an obsession nor an area of chronic neglect.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'No permito que el dinero sea ni motivo de obsesión ni de descuido en mi vida.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je ne laisse pas l''argent devenir une obsession ni une source de négligence.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 19: MD_BAL_03
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'MD_BAL_03', 19, 'LIKERT', '{"archetype":"BALANCER"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Minhas despesas cabem confortavelmente no meu padrão de vida sem apertos nem ostentação.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'My expenditures fit comfortably within my lifestyle without stress or ostentation.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Mis gastos se ajustan con comodidad a mi estilo de vida, sin estrecheces ni ostentación.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Mes dépenses correspondent sereinement à mon mode de vie, sans privation ni apparat.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 20: MD_BAL_04
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'MD_BAL_04', 20, 'LIKERT', '{"archetype":"BALANCER"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Generosidade e compartilhar recursos com quem precisa são aspectos centrais da minha ética.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Generosity and sharing with those in need are central pillars of my financial ethics.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'La generosidad y compartir con quienes lo necesitan son pilares de mi ética financiera.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'La générosité et le partage solidaire sont au cœur de mon éthique financière.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

end $$;

-- 8. FocusStyle Questions
do $$
declare
  v_quiz_version_id uuid;
  v_question_id uuid;
begin
  select qv.id into v_quiz_version_id
  from meqyro.quiz_versions qv
  join meqyro.quizzes q on q.id = qv.quiz_id
  where q.slug = 'focusstyle' and qv.version = 'v1.0.0';

  -- Question 1: FS_HYPER_01
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'FS_HYPER_01', 1, 'LIKERT', '{"style":"IMMERSIVE_HYPERFOCUS"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Entro em estado de fluxo profundo e perco a noção do tempo quando mergulho em uma única tarefa complexa.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I enter deep flow and lose track of time when fully immersed in a single complex task.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Entro en un estado de flujo profundo y pierdo la noción del tiempo ante una tarea compleja.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'J''entre en état de flow profond et perds la notion du temps sur une tâche complexe.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 2: FS_HYPER_02
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'FS_HYPER_02', 2, 'LIKERT', '{"style":"IMMERSIVE_HYPERFOCUS"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Interrupções constantes enquanto estou concentrado me custam muita energia para retomar o raciocínio.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Frequent interruptions while in the zone cost me significant cognitive energy to resume.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Las interrupciones cuando estoy concentrado me cuestan mucha energía para reanudar el hilo.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Les interruptions en pleine concentration me coûtent une énergie mentale considérable.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 3: FS_HYPER_03
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'FS_HYPER_03', 3, 'LIKERT', '{"style":"IMMERSIVE_HYPERFOCUS"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Prefiro blocos contínuos de 3 a 4 horas de silêncio absoluto para trabalhar com qualidade.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I thrive best with 3 to 4 uninterrupted hours of quiet for high-depth output.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Rindo mucho mejor en bloques continuos de 3 a 4 horas de silencio para trabajar a fondo.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je donne le meilleur de moi-même avec des plages continues de 3 à 4 heures de calme.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 4: FS_HYPER_04
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'FS_HYPER_04', 4, 'LIKERT', '{"style":"IMMERSIVE_HYPERFOCUS"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Quando resolvo um problema difícil, continuo pensando nele mesmo longe do computador.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'When tackling a hard problem, it stays running in the back of my mind even off-screen.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Al afrontar un problema difícil, sigo reflexionando en él incluso lejos del escritorio.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Face à un problème complexe, mon esprit continue d''y travailler même loin de l''écran.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 5: FS_HYPER_05
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'FS_HYPER_05', 5, 'LIKERT', '{"style":"IMMERSIVE_HYPERFOCUS"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Gosto de esgotar todas as nuances de um tópico antes de passar para o assunto seguinte.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I prefer exhausting every nuance of a subject before moving on to the next topic.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Me gusta explorar todos los matices de un tema antes de pasar al siguiente asunto.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'J''aime épuiser chaque nuance d''un sujet avant de basculer vers un autre thème.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 6: FS_MOD_01
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'FS_MOD_01', 6, 'LIKERT', '{"style":"MODULAR_SERIAL"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Divido meu dia em blocos estruturados e sinto satisfação em ticar tarefas concluídas.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I structure my day into modular timeblocks and love checking off completed items.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Organizo mi jornada en bloques estructurados y disfruto tachando tareas terminadas.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'J''organise mes journées en blocs structurés et apprécie cocher les tâches accomplies.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 7: FS_MOD_02
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'FS_MOD_02', 7, 'LIKERT', '{"style":"MODULAR_SERIAL"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Utilizo listas de pendências e técnicas de ritmo (como Pomodoro) com naturalidade.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I naturally use structured task backlogs and interval pacing (like Pomodoro).')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Uso listas de pendientes y técnicas de intervalos estructurados con fluidez.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'J''utilise naturellement des listes ordonnées et des rythmes par intervalles (type Pomodoro).')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 8: FS_MOD_03
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'FS_MOD_03', 8, 'LIKERT', '{"style":"MODULAR_SERIAL"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Prefiro alternar entre 2 ou 3 tipos diferentes de atividades ao longo do dia para não cansar.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I prefer rotating across 2 or 3 distinct task types throughout the day to stay fresh.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Prefiero alternar entre 2 o 3 tipos de actividad a lo largo del día para no saturarme.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'J''alterne volontiers entre 2 ou 3 types d''activités dans la journée pour garder ma fraîcheur.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 9: FS_MOD_04
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'FS_MOD_04', 9, 'LIKERT', '{"style":"MODULAR_SERIAL"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Definir marcos claros e entregáveis parciais me mantém motivado e disciplinado.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Setting explicit milestones and incremental deliverables keeps me focused and on track.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Fijar hitos claros y entregables parciales me mantiene constante y motivado.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Fixer des jalons explicites et des livrables partiels préserve ma discipline.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 10: FS_MOD_05
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'FS_MOD_05', 10, 'LIKERT', '{"style":"MODULAR_SERIAL"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Mantenho minha caixa de entrada, arquivos e ambiente de trabalho sempre organizados.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I maintain an organized inbox, disciplined filing system, and tidy work desk.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Mantengo mi bandeja de entrada, carpetas y mesa de trabajo ordenados metódicamente.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je garde ma boîte de réception, mes dossiers et mon espace de travail soigneusement ordonnés.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 11: FS_COL_01
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'FS_COL_01', 11, 'LIKERT', '{"style":"COLLABORATIVE"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Penso melhor em voz alta, discutindo ideias e hipóteses com colegas em tempo real.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I think best out loud, batting ideas and hypotheses around with peers in real time.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Pienso mejor en voz alta, debatiendo ideas e hipótesis con colegas en tiempo real.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je réfléchis mieux à voix haute, en échangeant des idées avec mes pairs en direct.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 12: FS_COL_02
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'FS_COL_02', 12, 'LIKERT', '{"style":"COLLABORATIVE"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Sessões de cocriação e brainstorming coletivo elevam muito meu ritmo de entrega.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Collaborative brainstorming and group workshops accelerate my productivity cadence.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Las sesiones de cocreación y lluvia de ideas multiplican mi ritmo de trabajo.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Les sessions de co-création et ateliers collectifs démultiplient ma dynamique.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 13: FS_COL_03
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'FS_COL_03', 13, 'LIKERT', '{"style":"COLLABORATIVE"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Trabalhar em isolamento total por muitos dias consecutivos me deixa desmotivado.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Working in total isolation for extended periods drains my motivation.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Trabajar en aislamiento total durante varios días seguidos me desmotiva.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Travailler dans un isolement complet plusieurs jours de suite érode ma motivation.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 14: FS_COL_04
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'FS_COL_04', 14, 'LIKERT', '{"style":"COLLABORATIVE"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Receber feedback frequente e rápido me ajuda a calibrar prioridades com assertividade.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Getting quick, iterative feedback helps me calibrate priorities effectively.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Recibir retroalimentación frecuente y ágil me ayuda a calibrar el rumbo.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Recevoir des retours rapides et réguliers m''aide à bien ajuster mes priorités.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 15: FS_COL_05
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'FS_COL_05', 15, 'LIKERT', '{"style":"COLLABORATIVE"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Gosto de construir consensos e engajar o grupo em torno de uma direção comum.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I enjoy building alignment and galvanizing the team around a shared direction.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Me entusiasma generar consensos y movilizar al equipo hacia un objetivo común.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'J''aime fédérer les énergies et bâtir un consensus autour d''une vision partagée.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 16: FS_SPR_01
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'FS_SPR_01', 16, 'LIKERT', '{"style":"REACTIVE_SPRINT"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Produzo com intensidade máxima quando há prazos curtos e urgência real no ar.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I produce at peak intensity when deadlines are tight and real urgency is present.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Rindo al máximo nivel cuando hay plazos apretados y urgencia real en el ambiente.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je délivre une intensité maximale lorsque les échéances sont courtes et l''urgence palpable.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 17: FS_SPR_02
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'FS_SPR_02', 17, 'LIKERT', '{"style":"REACTIVE_SPRINT"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Situações imprevistas e crises que exigem respostas rápidas me energizam.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Unforeseen emergencies requiring swift, tactical responses bring out my best.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Los imprevistos y las crisis que exigen respuestas rápidas despiertan mi energía.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Les imprévus et les crises exigeant une réaction rapide mobilisent toute mon énergie.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 18: FS_SPR_03
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'FS_SPR_03', 18, 'LIKERT', '{"style":"REACTIVE_SPRINT"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Prefiro semanas dinâmicas e imprevisíveis a rotinas perfeitamente planejadas com antecedência.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I prefer fast-moving, dynamic weeks over rigidly scripted routines.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Prefiero semanas dinámicas e impredecibles a calendarios monótonos hiperplanificados.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je préfère les semaines dynamiques et mouvantes aux plannings rigides et prévisibles.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 19: FS_SPR_04
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'FS_SPR_04', 19, 'LIKERT', '{"style":"REACTIVE_SPRINT"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Tenho facilidade para tomar decisões com informações incompletas sob pressão de tempo.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I readily make sound judgment calls under time crunch with incomplete data.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Decido con agilidad incluso con información parcial y presión de reloj.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je tranche sans hésiter même avec des données partielles et sous pression du temps.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 20: FS_SPR_05
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'FS_SPR_05', 20, 'LIKERT', '{"style":"REACTIVE_SPRINT"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Alterno períodos de esforço concentrado de alta carga com momentos de descompressão rápida.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I alternate high-octane crunch sprints with deliberate quick decompression periods.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Alterno picos de sprint de máxima exigencia con etapas de descompresión ágil.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'J''alterne des sprints à haute intensité avec des phases de récupération ciblée.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

end $$;

-- 9. DecisionDNA Scenarios
do $$
declare
  v_quiz_version_id uuid;
  v_question_id uuid;
  v_option_id uuid;
begin
  select qv.id into v_quiz_version_id
  from meqyro.quiz_versions qv
  join meqyro.quizzes q on q.id = qv.quiz_id
  where q.slug = 'decisiondna' and qv.version = 'v1.0.0';

  -- Scenario 1: DD_SCEN_01
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'DD_SCEN_01', 1, 'SINGLE_CHOICE', '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set kind = 'SINGLE_CHOICE'
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Você tem 24 horas para escolher entre duas propostas de fornecedor com custos e prazos diferentes. Como você decide?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'You have 24 hours to choose between two vendor proposals with varying costs and timelines. How do you decide?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Tienes 24 horas para elegir entre dos propuestas de proveedores con costes y plazos distintos. ¿Cómo decides?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Vous avez 24 heures pour trancher entre deux offres de prestataires aux coûts et délais différents. Comment décidez-vous ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'DD_01_A', 1, '{"style":"ANALYTICAL"}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Monto uma planilha comparativa ponderando custo-benefício, SLAs e riscos de entrega.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'I build a comparison model weighting cost-benefit, SLAs, and delivery risks.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Construyo una matriz comparativa ponderando coste-beneficio, ANS y riesgos.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Je construis une matrice comparant coûts-bénéfices, SLA et risques de livraison.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'DD_01_B', 2, '{"style":"INTUITIVE"}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Confio no histórico de relacionamento e na impressão inicial de confiabilidade da equipe.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'I trust past track record and my gut reading on team trustworthiness.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Confío en mi intuición sobre la fiabilidad del equipo y antecedentes clave.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Je me fie à mon ressenti sur la fiabilité de l''équipe et leur réputation.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'DD_01_C', 3, '{"style":"PRAGMATIC"}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Escolho a opção com menor risco operacional imediato para destrancar a entrega.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'I pick whichever has the lowest immediate operational friction to keep moving.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Elijo la opción con menor fricción operativa para desbloquear la entrega de inmediato.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Je retiens l''option au risque opérationnel minimal pour avancer sans attendre.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'DD_01_D', 4, '{"style":"COLLABORATIVE"}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Reúno os líderes afetados para um alinhamento rápido e busco decisão consensual.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'I gather impacted team leads for a brief sync and aim for team consensus.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Reúno a los responsables afectados para consensuar la mejor alternativa conjunta.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Je réunis les parties prenantes pour un alignement rapide et cherche le consensus.')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Scenario 2: DD_SCEN_02
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'DD_SCEN_02', 2, 'SINGLE_CHOICE', '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set kind = 'SINGLE_CHOICE'
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Um lançamento importante apresenta uma falha não-crítica a poucas horas do anúncio oficial. Qual sua postura?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'A major launch exhibits a non-critical glitch hours before official announcement. What is your stance?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Un lanzamiento clave muestra un fallo no crítico a pocas horas del anuncio oficial. ¿Qué postura adoptas?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Un lancement majeur révèle un bug non bloquant quelques heures avant l''annonce officielle. Quelle est votre réaction ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'DD_02_A', 1, '{"style":"PRAGMATIC"}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Mantenho o lançamento, documento o contorno e programo a correção para o ciclo seguinte.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Proceed with the release, document workarounds, and patch in the next sprint.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Mantengo el lanzamiento, documento la solución temporal y programo el parche.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Je maintiens la sortie, documente le contournement et planifie le correctif.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'DD_02_B', 2, '{"style":"ANALYTICAL"}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Avalio estatisticamente o impacto potencial nos usuários antes de tomar qualquer decisão.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Run statistical impact analysis on affected user cohorts before deciding.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Evalúo con datos el porcentaje de usuarios afectados antes de mover un dedo.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'J''analyse méthodiquement la proportion d''utilisateurs touchés avant d''agir.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'DD_02_C', 3, '{"style":"INTUITIVE"}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Se meu sexto sentido indicar que a reputação pode ser ferida, pauso sem hesitar.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'If my instincts signal brand perception risk, I hit pause without hesitation.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Si mi instinto me dice que la reputación puede verse dañada, pauso el evento.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Si mon intuition me souffle un risque d''image, je suspends sans hésiter.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'DD_02_D', 4, '{"style":"COLLABORATIVE"}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Consulto suporte, produto e marketing para deliberar o caminho com menor dano geral.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Consult support, product, and comms leads to jointly weigh trade-offs.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Consulto a soporte, producto y comunicación para decidir juntos la mejor salida.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Je consulte le support, le produit et la communication pour arbitrer ensemble.')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Scenario 3: DD_SCEN_03
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'DD_SCEN_03', 3, 'SINGLE_CHOICE', '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set kind = 'SINGLE_CHOICE'
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Você recebe um orçamento extra inesperado para o trimestre. Onde você investe?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'You receive an unexpected surplus budget for the quarter. Where do you allocate it?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Recibes un presupuesto extra inesperado este trimestre. ¿Cómo decides asignarlo?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Vous bénéficiez d''un budget excédentaire imprévu ce trimestre. Comment l''allouez-vous ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'DD_03_A', 1, '{"style":"ANALYTICAL"}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Simulo o ROI projetado em diferentes frentes e direciono para a de maior retorno esperado.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Model expected ROI across competing initiatives and fund the highest-yield option.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Modelo el retorno de inversión proyectado y financio la opción con mayor rendimiento.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Je modélise le ROI prévisionnel et alloue les fonds au levier le plus rentable.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'DD_03_B', 2, '{"style":"COLLABORATIVE"}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Abro espaço para a equipe sugerir melhorias estruturais e decidimos por votação deliberativa.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Solicit proposals from the broader team and decide through structured consultation.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Pido propuestas al equipo y decidimos mediante una votación consultiva compartida.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Je recueille les propositions de l''équipe et nous arbitrons collectivement.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'DD_03_C', 3, '{"style":"PRAGMATIC"}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Elimino dívidas técnicas ou gargalos imediatos que estão travando a velocidade diária.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Direct funds toward eliminating technical debt or acute bottlenecks slowing delivery.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Elimino cuellos de botella técnicos inmediatos que frenan el ritmo diario de trabajo.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'J''élimine en priorité la dette technique et les goulots d''étranglement quotidiens.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'DD_03_D', 4, '{"style":"INTUITIVE"}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Aposto em uma inovação ousada que vejo como oportunidade de salto à frente da concorrência.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Bet on a bold bet that I intuitively recognize as a leapfrogging opportunity.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Apuesto por una idea vanguardista que percibo como un gran salto competitivo.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Je parie sur une innovation audacieuse que je pressens comme un avantage clé.')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Scenario 4: DD_SCEN_04
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'DD_SCEN_04', 4, 'SINGLE_CHOICE', '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set kind = 'SINGLE_CHOICE'
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Ao contratar para uma posição-chave, você encontra um candidato brilhante tecnicamente, mas com dúvidas de alinhamento cultural. O que faz?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Hiring for a key role, you find a candidate technically stellar but with cultural fit questions. What do you do?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Al contratar un puesto clave, encuentras un candidato técnicamente brillante pero con dudas culturales. ¿Qué haces?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'En recrutant pour un rôle clé, un profil est techniquement brillant mais pose question sur la culture d''équipe. Que faites-vous ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'DD_04_A', 1, '{"style":"COLLABORATIVE"}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Coloco o candidato em dinâmica real com os futuros pares e respeito o veredito da equipe.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Have candidate shadow future peers in a collaborative session and respect team verdict.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Pongo al candidato a trabajar con sus futuros pares y sigo el consenso del equipo.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Je le fais échanger avec ses futurs pairs et m''en remets au retour d''équipe.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'DD_04_B', 2, '{"style":"PRAGMATIC"}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Contrato com período de experiência objetivo focado em entregáveis concretos e combinados.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Hire on a milestone-based trial period strictly tied to deliverables and team norms.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Contrato con un periodo de prueba claro supeditado a entregables y pautas fijadas.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'J''engage une période d''essai cadrée sur des objectifs et livrables précis.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'DD_04_C', 3, '{"style":"ANALYTICAL"}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Aplico testes estruturados de competências e checo múltiplas referências detalhadas.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Run structured competencies scoring and conduct rigorous 360-degree reference checks.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Aplico evaluaciones estructuradas y realizo una verificación exhaustiva de referencias.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'J''utilise des grilles de compétences formelles et vérifie scrupuleusement les références.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'DD_04_D', 4, '{"style":"INTUITIVE"}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Se a conversa informal me causou desconforto sutil, não contrato, pois confio na sintonia.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'If informal dialogue triggered intuitive red flags, I pass; chemistry matters most.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Si en la charla informal sentí señales de fricción, rechazo; la sintonía no se fuerza.')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Si l''échange informel m''a laissé un doute subtil, je refuse ; l''harmonie est capitale.')
  on conflict (option_id, locale) do update set label = excluded.label;

end $$;

-- 10. CoupleDNA Questions
do $$
declare
  v_quiz_version_id uuid;
  v_question_id uuid;
begin
  select qv.id into v_quiz_version_id
  from meqyro.quiz_versions qv
  join meqyro.quizzes q on q.id = qv.quiz_id
  where q.slug = 'coupledna' and qv.version = 'v1.0.0';

  -- Question 1: CD_COMM_01
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'CD_COMM_01', 1, 'LIKERT', '{"dimension":"COMMUNICATION"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Consigo expressar minhas vulnerabilidades e medos com meu parceiro(a) com total segurança emocional.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I can share my deepest vulnerabilities and fears with my partner with complete emotional safety.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Puedo expresar mis vulnerabilidades e inseguridades a mi pareja con total seguridad emocional.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je peux exprimer mes vulnérabilités et doutes à mon partenaire en toute sécurité émotionnelle.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 2: CD_COMM_02
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'CD_COMM_02', 2, 'LIKERT', '{"dimension":"COMMUNICATION"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Conversamos abertamente sobre nossos sentimentos sem medo de julgamentos ou retaliações.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'We talk candidly about our feelings without fearing judgment or unspoken retaliation.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Hablamos con honestidad de lo que sentimos sin temor a juicios ni reproches guardados.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Nous parlons librement de nos ressentis sans craindre de jugement ni de ressentiment.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 3: CD_COMM_03
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'CD_COMM_03', 3, 'LIKERT', '{"dimension":"COMMUNICATION"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Sinto que sou verdadeiramente ouvido(a) e compreendido(a) quando divido um incômodo.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I feel truly heard and understood whenever I voice a personal frustration.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Me siento genuinamente escuchado(a) y comprendido(a) cuando comparto una inquietud.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Je me sens véritablement écouté(e) et compris(e) lorsque j''exprime une préoccupation.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 4: CD_COMM_04
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'CD_COMM_04', 4, 'LIKERT', '{"dimension":"COMMUNICATION"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Temos o hábito de checar um ao outro sobre nosso estado de espírito ao longo da semana.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'We regularly check in on each other''s emotional well-being throughout the week.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Tenemos el hábito de interesarnos mutuamente por nuestro estado de ánimo durante la semana.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Nous prenons régulièrement des nouvelles de notre état émotionnel au cours de la semaine.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 5: CD_VAL_01
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'CD_VAL_01', 5, 'LIKERT', '{"dimension":"LIFE_VALUES"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Compartilhamos princípios éticos e morais fundamentais que guiam nossas escolhas de vida.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'We share fundamental ethical and moral values that guide our major life choices.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Compartimos principios éticos y morales esenciales que guían nuestras decisiones de vida.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Nous partageons des principes éthiques et moraux essentiels qui guident nos choix de vie.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 6: CD_VAL_02
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'CD_VAL_02', 6, 'LIKERT', '{"dimension":"LIFE_VALUES"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Temos visões harmoniosas sobre o papel da família, amigos e convivência social.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'We hold aligned views regarding family presence, friendships, and social life.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Mantenemos posturas afines sobre el lugar de la familia, amistades y vida social.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Nos visions s''accordent sur la place de la famille, des amis et de la vie sociale.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 7: CD_VAL_03
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'CD_VAL_03', 7, 'LIKERT', '{"dimension":"LIFE_VALUES"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Respeitamos a espiritualidade, crenças e filosofia de vida um do outro.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'We genuinely respect each other''s spiritual beliefs, philosophies, and worldviews.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Respetamos sinceramente las creencias, espiritualidad y filosofía de vida del otro.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Nous respectons profondément la spiritualité et la philosophie de vie de chacun.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 8: CD_VAL_04
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'CD_VAL_04', 8, 'LIKERT', '{"dimension":"LIFE_VALUES"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'O que consideramos sucesso e realização pessoal aponta para a mesma direção geral.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Our definitions of personal success and meaningful living point in a shared direction.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Lo que consideramos éxito y realización personal camina en una dirección similar.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Notre conception du bonheur et de la réussite personnelle converge vers un cap commun.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 9: CD_CONF_01
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'CD_CONF_01', 9, 'LIKERT', '{"dimension":"CONFLICT_MANAGEMENT"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Quando divergimos, conseguimos debater sem recorrer a agressividade, ironia ou silêncio punitivo.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'When we disagree, we navigate friction without hostility, stonewalling, or contempt.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Ante desacuerdos, debatimos sin caer en agresividad, ironías ni silencios castigadores.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Lors des désaccords, nous échangeons sans agressivité, sarcasme ni silence punitif.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 10: CD_CONF_02
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'CD_CONF_02', 10, 'LIKERT', '{"dimension":"CONFLICT_MANAGEMENT"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Temos capacidade mútua de pedir desculpas e perdoar de coração após uma discussão.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'We both have the humility to apologize and forgive sincerely after a disagreement.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Tenemos la capacidad mutua de pedir perdón y perdonar de corazón tras una discusión.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Nous savons tous deux présenter des excuses sincères et pardonner après un différend.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 11: CD_CONF_03
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'CD_CONF_03', 11, 'LIKERT', '{"dimension":"CONFLICT_MANAGEMENT"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Buscamos soluções em que ambos se sintam contemplados em vez de vencer a disputa.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'We aim for collaborative solutions where both win, rather than scoring points in an argument.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Buscamos acuerdos donde ambos se sientan respetados en vez de competir por tener la razón.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Nous recherchons des compromis bienveillants plutôt que de vouloir avoir raison.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 12: CD_CONF_04
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'CD_CONF_04', 12, 'LIKERT', '{"dimension":"CONFLICT_MANAGEMENT"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Sabemos dar uma pausa para respirar quando a conversa esquenta antes de dizer algo prejudicial.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'We know how to pause and cool down when tempers flare before saying hurtful things.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Sabemos hacer una pausa para serenarnos cuando la charla se tensa antes de herir al otro.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Nous savons marquer une pause pour apaiser les tensions avant de blesser l''autre.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 13: CD_FIN_01
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'CD_FIN_01', 13, 'LIKERT', '{"dimension":"FINANCES"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Temos transparência total sobre rendas, gastos, dívidas e investimentos individuais e conjuntos.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'We practice transparent honesty regarding earnings, spending, debts, and investments.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Existe transparencia plena sobre ingresos, gastos, deudas y ahorros compartidos.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Nous cultivons une transparence complète sur les revenus, dépenses, dettes et épargne.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 14: CD_FIN_02
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'CD_FIN_02', 14, 'LIKERT', '{"dimension":"FINANCES"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Nossos hábitos de consumo e equilíbrio entre poupar e gastar são compatíveis.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Our spending habits and rhythm between saving and enjoying are mutually compatible.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Nuestros hábitos de gasto y la disciplina entre ahorrar y disfrutar son afines.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Nos habitudes financières et notre équilibre entre épargne et plaisir sont compatibles.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 15: CD_FIN_03
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'CD_FIN_03', 15, 'LIKERT', '{"dimension":"FINANCES"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Planejamos compras de maior porte juntos e respeitamos os combinados orçamentários.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'We plan significant purchases jointly and respect agreed financial boundaries.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Planificamos juntos las compras importantes y respetamos los acuerdos de presupuesto.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Nous concertons les achats majeurs et respectons les accords budgétaires conclus.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 16: CD_FIN_04
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'CD_FIN_04', 16, 'LIKERT', '{"dimension":"FINANCES"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Assuntos de dinheiro no relacionamento são tratados como trabalho em equipe, não cobrança.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Money matters in our relationship are approached as teamwork rather than blame.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Los temas económicos se abordan como una labor en equipo y no como reproche.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Les questions financières sont abordées comme une équipe, sans reproches unilatéraux.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 17: CD_FUT_01
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'CD_FUT_01', 17, 'LIKERT', '{"dimension":"FUTURE_PLANS"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Temos clareza e convergência sobre onde desejamos morar e nosso estilo de vida nos próximos anos.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'We share alignment on our preferred living environment and lifestyle for the years ahead.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Tenemos sintonía sobre dónde deseamos residir y qué estilo de vida proyectamos juntos.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Nous partageons une vision claire sur notre lieu de vie et nos choix des prochaines années.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 18: CD_FUT_02
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'CD_FUT_02', 18, 'LIKERT', '{"dimension":"FUTURE_PLANS"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Estamos alinhados em relação a ter ou não ter filhos (e como criá-los).')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'We are aligned on our intentions regarding children (and how to raise them).')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Estamos alineados sobre la decisión de tener hijos (y las pautas de crianza).')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Nous sommes en harmonie concernant le projet d''enfants (et leur éducation).')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 19: CD_FUT_03
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'CD_FUT_03', 19, 'LIKERT', '{"dimension":"FUTURE_PLANS"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Apoiamos mutuamente os sonhos e ambições profissionais de cada um no longo prazo.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'We actively champion each other''s individual long-term professional dreams.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Apoyamos con entusiasmo los sueños y proyectos profesionales del otro a largo plazo.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Nous soutenons activement les ambitions professionnelles à long terme de chacun.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  -- Question 20: CD_FUT_04
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
  values (v_quiz_version_id, 'CD_FUT_04', 20, 'LIKERT', '{"dimension":"FUTURE_PLANS"}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Visualizo nosso futuro conjunto com entusiasmo, companheirismo e propósito duradouro.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'I look forward to our shared future with deep excitement, trust, and lasting partnership.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Visualizo nuestro futuro compartido con entusiasmo, complicidad y propósito sólido.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'J''envisage notre avenir commun avec confiance, complicité et enthousiasme durable.')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

end $$;

do $$ declare v record; qid uuid; oid uuid; begin
for v in select qv.id from meqyro.quiz_versions qv join meqyro.quizzes q on q.id=qv.quiz_id where (q.slug='focusstyle' or (q.slug='brainrank' and qv.version <> '1.2')) and qv.status in ('APPROVED','PUBLISHED') loop
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
end loop;
for v in select qv.id from meqyro.quiz_versions qv join meqyro.quizzes q on q.id=qv.quiz_id where q.slug='brainrank' and qv.version='1.2' loop
insert into meqyro.questions(quiz_version_id,stable_key,position,kind,scoring_key,metadata) values(v.id,'MEMORY_04',1001,'SINGLE_CHOICE','{"dimension":"DELAYED_MEMORY"}'::jsonb,'{"memoryCue":{"pt":"Marina chegou a Aurora na terça-feira. Ficou no Hotel Central e visitou o museu à tarde.","en":"Marina arrived in Aurora on Tuesday. She stayed at the Central Hotel and visited the museum that afternoon.","es":"Marina llegó a Aurora el martes. Se alojó en el Hotel Central y visitó el museo por la tarde.","fr":"Marina est arrivée à Aurora mardi. Elle a séjourné à l’hôtel Central et visité le musée l’après-midi."}}'::jsonb) on conflict(quiz_version_id,stable_key) do update set metadata=excluded.metadata,scoring_key=excluded.scoring_key,active=true returning id into qid;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'pt','Em qual hotel Marina ficou?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'en','Which hotel did Marina stay at?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'es','¿En qué hotel se alojó Marina?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'fr','Dans quel hôtel Marina a-t-elle séjourné ?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'A',1,'{"isCorrect":true}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Central') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','Central') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Central') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Central') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'B',2,'{"isCorrect":false}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Aurora') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','Aurora') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Aurora') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Aurora') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'C',3,'{"isCorrect":false}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Horizonte') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','Horizon') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Horizonte') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Horizon') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'D',4,'{"isCorrect":false}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Imperial') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','Imperial') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Imperial') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Impérial') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.questions(quiz_version_id,stable_key,position,kind,scoring_key,metadata) values(v.id,'MEMORY_05',1002,'SINGLE_CHOICE','{"dimension":"DELAYED_MEMORY"}'::jsonb,'{"memoryCue":{"pt":"Na biblioteca, Rafael guardou um livro de viagens na prateleira azul. A devolução ficou marcada para sexta-feira.","en":"At the library, Rafael put a travel book on the blue shelf. Its return was scheduled for Friday.","es":"En la biblioteca, Rafael dejó un libro de viajes en la estantería azul. La devolución quedó fijada para el viernes.","fr":"À la bibliothèque, Rafael a rangé un livre de voyage sur l’étagère bleue. Le retour était prévu vendredi."}}'::jsonb) on conflict(quiz_version_id,stable_key) do update set metadata=excluded.metadata,scoring_key=excluded.scoring_key,active=true returning id into qid;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'pt','De que cor era a prateleira usada por Rafael?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'en','What colour was the shelf Rafael used?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'es','¿De qué color era la estantería que usó Rafael?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'fr','De quelle couleur était l’étagère utilisée par Rafael ?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'A',1,'{"isCorrect":false}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Verde') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','Green') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Verde') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Verte') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'B',2,'{"isCorrect":true}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Azul') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','Blue') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Azul') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Bleue') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'C',3,'{"isCorrect":false}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Branca') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','White') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Blanca') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Blanche') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'D',4,'{"isCorrect":false}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Amarela') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','Yellow') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Amarilla') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Jaune') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.questions(quiz_version_id,stable_key,position,kind,scoring_key,metadata) values(v.id,'MEMORY_06',1003,'SINGLE_CHOICE','{"dimension":"DELAYED_MEMORY"}'::jsonb,'{"memoryCue":{"pt":"Clara recebeu uma caixa de cerâmica pela manhã. Deixou a caixa na sala e combinou a retirada para quarta-feira.","en":"Clara received a box of pottery in the morning. She left it in the living room and arranged collection for Wednesday.","es":"Clara recibió una caja de cerámica por la mañana. La dejó en la sala y acordó recogerla el miércoles.","fr":"Clara a reçu une boîte de céramiques le matin. Elle l’a laissée au salon et prévu son retrait mercredi."}}'::jsonb) on conflict(quiz_version_id,stable_key) do update set metadata=excluded.metadata,scoring_key=excluded.scoring_key,active=true returning id into qid;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'pt','Para qual dia Clara combinou a retirada?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'en','Which day did Clara arrange collection for?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'es','¿Para qué día acordó Clara la recogida?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'fr','Quel jour Clara avait-elle prévu pour le retrait ?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'A',1,'{"isCorrect":false}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Segunda-feira') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','Monday') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Lunes') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Lundi') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'B',2,'{"isCorrect":false}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Sexta-feira') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','Friday') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Viernes') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Vendredi') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'C',3,'{"isCorrect":true}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Quarta-feira') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','Wednesday') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Miércoles') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Mercredi') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'D',4,'{"isCorrect":false}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Sábado') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','Saturday') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Sábado') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Samedi') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.questions(quiz_version_id,stable_key,position,kind,scoring_key,metadata) values(v.id,'MEMORY_07',1004,'SINGLE_CHOICE','{"dimension":"DELAYED_MEMORY"}'::jsonb,'{"memoryCue":{"pt":"Diego pegou o ônibus 42 para visitar a irmã. Levou uma mochila cinza e desceu perto da praça.","en":"Diego took bus 42 to visit his sister. He carried a grey backpack and got off near the square.","es":"Diego tomó el autobús 42 para visitar a su hermana. Llevaba una mochila gris y bajó cerca de la plaza.","fr":"Diego a pris le bus 42 pour rendre visite à sa sœur. Il portait un sac gris et est descendu près de la place."}}'::jsonb) on conflict(quiz_version_id,stable_key) do update set metadata=excluded.metadata,scoring_key=excluded.scoring_key,active=true returning id into qid;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'pt','Qual ônibus Diego pegou?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'en','Which bus did Diego take?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'es','¿Qué autobús tomó Diego?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'fr','Quel bus Diego a-t-il pris ?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'A',1,'{"isCorrect":false}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','24') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','24') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','24') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','24') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'B',2,'{"isCorrect":false}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','32') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','32') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','32') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','32') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'C',3,'{"isCorrect":false}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','48') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','48') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','48') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','48') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'D',4,'{"isCorrect":true}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','42') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','42') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','42') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','42') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.questions(quiz_version_id,stable_key,position,kind,scoring_key,metadata) values(v.id,'MEMORY_08',1005,'SINGLE_CHOICE','{"dimension":"DELAYED_MEMORY"}'::jsonb,'{"memoryCue":{"pt":"Luiza plantou manjericão em um vaso amarelo na varanda. Regou a planta depois do almoço.","en":"Luiza planted basil in a yellow pot on the balcony. She watered it after lunch.","es":"Luiza plantó albahaca en una maceta amarilla en el balcón. La regó después de comer.","fr":"Luiza a planté du basilic dans un pot jaune sur le balcon. Elle l’a arrosé après le déjeuner."}}'::jsonb) on conflict(quiz_version_id,stable_key) do update set metadata=excluded.metadata,scoring_key=excluded.scoring_key,active=true returning id into qid;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'pt','O que Luiza plantou?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'en','What did Luiza plant?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'es','¿Qué plantó Luiza?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'fr','Qu’a planté Luiza ?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'A',1,'{"isCorrect":true}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Manjericão') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','Basil') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Albahaca') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Basilic') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'B',2,'{"isCorrect":false}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Hortelã') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','Mint') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Menta') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Menthe') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'C',3,'{"isCorrect":false}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Alecrim') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','Rosemary') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Romero') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Romarin') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'D',4,'{"isCorrect":false}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Salsa') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','Parsley') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Perejil') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Persil') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.questions(quiz_version_id,stable_key,position,kind,scoring_key,metadata) values(v.id,'MEMORY_09',1006,'SINGLE_CHOICE','{"dimension":"DELAYED_MEMORY"}'::jsonb,'{"memoryCue":{"pt":"Na oficina de desenho, Bruno sentou na mesa 6. Usou papel bege e levou os desenhos para casa em uma pasta.","en":"At the drawing workshop, Bruno sat at table 6. He used beige paper and took his drawings home in a folder.","es":"En el taller de dibujo, Bruno se sentó en la mesa 6. Usó papel beige y llevó los dibujos a casa en una carpeta.","fr":"À l’atelier de dessin, Bruno s’est assis à la table 6. Il a utilisé du papier beige et emporté ses dessins dans une pochette."}}'::jsonb) on conflict(quiz_version_id,stable_key) do update set metadata=excluded.metadata,scoring_key=excluded.scoring_key,active=true returning id into qid;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'pt','Em qual mesa Bruno sentou?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'en','Which table did Bruno sit at?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'es','¿En qué mesa se sentó Bruno?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'fr','À quelle table Bruno s’est-il assis ?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'A',1,'{"isCorrect":false}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Mesa 3') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','Table 3') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Mesa 3') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Table 3') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'B',2,'{"isCorrect":true}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Mesa 6') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','Table 6') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Mesa 6') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Table 6') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'C',3,'{"isCorrect":false}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Mesa 8') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','Table 8') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Mesa 8') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Table 8') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'D',4,'{"isCorrect":false}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Mesa 9') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','Table 9') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Mesa 9') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Table 9') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.questions(quiz_version_id,stable_key,position,kind,scoring_key,metadata) values(v.id,'MEMORY_10',1007,'SINGLE_CHOICE','{"dimension":"DELAYED_MEMORY"}'::jsonb,'{"memoryCue":{"pt":"Sofia encontrou Pedro no Café Jardim às três da tarde. Pediu chá de limão e sentou perto da janela.","en":"Sofia met Pedro at Garden Café at three in the afternoon. She ordered lemon tea and sat near the window.","es":"Sofía se encontró con Pedro en el Café Jardín a las tres de la tarde. Pidió té de limón y se sentó junto a la ventana.","fr":"Sofia a retrouvé Pedro au Café du Jardin à quinze heures. Elle a commandé un thé au citron et s’est assise près de la fenêtre."}}'::jsonb) on conflict(quiz_version_id,stable_key) do update set metadata=excluded.metadata,scoring_key=excluded.scoring_key,active=true returning id into qid;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'pt','O que Sofia pediu no café?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'en','What did Sofia order at the café?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'es','¿Qué pidió Sofía en el café?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'fr','Qu’a commandé Sofia au café ?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'A',1,'{"isCorrect":false}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Café') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','Coffee') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Café') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Café') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'B',2,'{"isCorrect":false}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Suco de laranja') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','Orange juice') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Zumo de naranja') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Jus d’orange') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'C',3,'{"isCorrect":true}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Chá de limão') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','Lemon tea') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Té de limón') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Thé au citron') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'D',4,'{"isCorrect":false}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Chocolate quente') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','Hot chocolate') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Chocolate caliente') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Chocolat chaud') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.questions(quiz_version_id,stable_key,position,kind,scoring_key,metadata) values(v.id,'MEMORY_11',1008,'SINGLE_CHOICE','{"dimension":"DELAYED_MEMORY"}'::jsonb,'{"memoryCue":{"pt":"Na exposição, Helena viu fotografias na sala Norte. Comprou um cartão-postal e saiu pela porta do jardim.","en":"At the exhibition, Helena saw photographs in the North room. She bought a postcard and left through the garden door.","es":"En la exposición, Helena vio fotografías en la sala Norte. Compró una postal y salió por la puerta del jardín.","fr":"À l’exposition, Helena a vu des photographies dans la salle Nord. Elle a acheté une carte postale et est sortie par la porte du jardin."}}'::jsonb) on conflict(quiz_version_id,stable_key) do update set metadata=excluded.metadata,scoring_key=excluded.scoring_key,active=true returning id into qid;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'pt','Em qual sala estavam as fotografias?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'en','Which room held the photographs?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'es','¿En qué sala estaban las fotografías?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'fr','Dans quelle salle étaient les photographies ?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'A',1,'{"isCorrect":false}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Sul') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','South') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Sur') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Sud') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'B',2,'{"isCorrect":false}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Leste') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','East') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Este') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Est') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'C',3,'{"isCorrect":false}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Oeste') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','West') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Oeste') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Ouest') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'D',4,'{"isCorrect":true}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Norte') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','North') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Norte') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Nord') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.questions(quiz_version_id,stable_key,position,kind,scoring_key,metadata) values(v.id,'MEMORY_12',1009,'SINGLE_CHOICE','{"dimension":"DELAYED_MEMORY"}'::jsonb,'{"memoryCue":{"pt":"Miguel organizou um piquenique no domingo. Levou uma toalha vermelha e encontrou os amigos perto do lago.","en":"Miguel organised a picnic on Sunday. He brought a red blanket and met his friends near the lake.","es":"Miguel organizó un pícnic el domingo. Llevó una manta roja y se reunió con sus amigos junto al lago.","fr":"Miguel a organisé un pique-nique dimanche. Il a apporté une nappe rouge et retrouvé ses amis près du lac."}}'::jsonb) on conflict(quiz_version_id,stable_key) do update set metadata=excluded.metadata,scoring_key=excluded.scoring_key,active=true returning id into qid;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'pt','Onde Miguel encontrou os amigos?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'en','Where did Miguel meet his friends?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'es','¿Dónde se reunió Miguel con sus amigos?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'fr','Où Miguel a-t-il retrouvé ses amis ?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'A',1,'{"isCorrect":true}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Perto do lago') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','Near the lake') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Junto al lago') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Près du lac') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'B',2,'{"isCorrect":false}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Perto da ponte') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','Near the bridge') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Junto al puente') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Près du pont') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'C',3,'{"isCorrect":false}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Na entrada') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','At the entrance') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','En la entrada') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','À l’entrée') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'D',4,'{"isCorrect":false}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','No jardim') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','In the garden') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','En el jardín') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Dans le jardin') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.questions(quiz_version_id,stable_key,position,kind,scoring_key,metadata) values(v.id,'MEMORY_13',1010,'SINGLE_CHOICE','{"dimension":"DELAYED_MEMORY"}'::jsonb,'{"memoryCue":{"pt":"Beatriz foi ao cinema com a prima. A sessão começou às seis da tarde e elas ficaram na fileira D.","en":"Beatriz went to the cinema with her cousin. The screening began at six in the evening and they sat in row D.","es":"Beatriz fue al cine con su prima. La sesión empezó a las seis de la tarde y se sentaron en la fila D.","fr":"Beatriz est allée au cinéma avec sa cousine. La séance a commencé à dix-huit heures et elles étaient au rang D."}}'::jsonb) on conflict(quiz_version_id,stable_key) do update set metadata=excluded.metadata,scoring_key=excluded.scoring_key,active=true returning id into qid;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'pt','Em qual fileira Beatriz ficou?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'en','Which row did Beatriz sit in?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'es','¿En qué fila se sentó Beatriz?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'fr','À quel rang Beatriz était-elle assise ?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'A',1,'{"isCorrect":false}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','B') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','B') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','B') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','B') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'B',2,'{"isCorrect":true}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','D') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','D') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','D') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','D') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'C',3,'{"isCorrect":false}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','F') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','F') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','F') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','F') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'D',4,'{"isCorrect":false}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','H') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','H') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','H') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','H') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.questions(quiz_version_id,stable_key,position,kind,scoring_key,metadata) values(v.id,'MEMORY_14',1011,'SINGLE_CHOICE','{"dimension":"DELAYED_MEMORY"}'::jsonb,'{"memoryCue":{"pt":"Lucas deixou uma encomenda na portaria do prédio. A caixa tinha uma fita laranja e deveria ser entregue a Camila.","en":"Lucas left a parcel at the building reception. The box had orange tape and was addressed to Camila.","es":"Lucas dejó un paquete en la recepción del edificio. La caja tenía cinta naranja y era para Camila.","fr":"Lucas a laissé un colis à l’accueil de l’immeuble. La boîte avait un ruban orange et était destinée à Camila."}}'::jsonb) on conflict(quiz_version_id,stable_key) do update set metadata=excluded.metadata,scoring_key=excluded.scoring_key,active=true returning id into qid;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'pt','Para quem era a encomenda?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'en','Who was the parcel for?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'es','¿Para quién era el paquete?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'fr','À qui était destiné le colis ?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'A',1,'{"isCorrect":false}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Marina') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','Marina') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Marina') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Marina') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'B',2,'{"isCorrect":false}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Clara') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','Clara') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Clara') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Clara') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'C',3,'{"isCorrect":true}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Camila') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','Camila') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Camila') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Camila') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'D',4,'{"isCorrect":false}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Sofia') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','Sofia') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Sofía') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Sofia') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.questions(quiz_version_id,stable_key,position,kind,scoring_key,metadata) values(v.id,'MEMORY_15',1012,'SINGLE_CHOICE','{"dimension":"DELAYED_MEMORY"}'::jsonb,'{"memoryCue":{"pt":"Teresa marcou uma caminhada para sábado de manhã. Combinou encontrar Nuno na ponte e levar água.","en":"Teresa planned a walk for Saturday morning. She arranged to meet Nuno at the bridge and bring water.","es":"Teresa organizó un paseo para el sábado por la mañana. Quedó con Nuno en el puente y acordó llevar agua.","fr":"Teresa a prévu une promenade samedi matin. Elle devait retrouver Nuno au pont et apporter de l’eau."}}'::jsonb) on conflict(quiz_version_id,stable_key) do update set metadata=excluded.metadata,scoring_key=excluded.scoring_key,active=true returning id into qid;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'pt','Para quando Teresa marcou a caminhada?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'en','When did Teresa plan the walk?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'es','¿Para cuándo organizó Teresa el paseo?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.question_translations(question_id,locale,prompt) values(qid,'fr','Quand Teresa avait-elle prévu la promenade ?') on conflict(question_id,locale) do update set prompt=excluded.prompt;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'A',1,'{"isCorrect":false}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Sexta de manhã') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','Friday morning') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Viernes por la mañana') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Vendredi matin') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'B',2,'{"isCorrect":false}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Sábado à tarde') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','Saturday afternoon') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Sábado por la tarde') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Samedi après-midi') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'C',3,'{"isCorrect":false}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Domingo de manhã') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','Sunday morning') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Domingo por la mañana') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Dimanche matin') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.options(question_id,stable_key,position,scoring_value) values(qid,'D',4,'{"isCorrect":true}'::jsonb) on conflict(question_id,stable_key) do update set scoring_value=excluded.scoring_value returning id into oid;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'pt','Sábado de manhã') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'en','Saturday morning') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'es','Sábado por la mañana') on conflict(option_id,locale) do update set label=excluded.label;
insert into meqyro.option_translations(option_id,locale,label) values(oid,'fr','Samedi matin') on conflict(option_id,locale) do update set label=excluded.label;
end loop;
end $$;
-- Behavioral scenarios v2. Generated from content; no historical rewrites.
do $$ declare v_version uuid; v_question uuid; v_option uuid; begin
      insert into meqyro.quiz_versions (quiz_id, version, scoring_version, status, published_at)
      select id, 'v2.0.0', 'behavioral-v2', 'PUBLISHED'::meqyro.content_status, now()
      from meqyro.quizzes where slug = 'moneydna'
      on conflict (quiz_id, version) do nothing;
      select v.id into strict v_version from meqyro.quiz_versions v join meqyro.quizzes q on q.id = v.quiz_id
      where q.slug = 'moneydna' and v.version = 'v2.0.0';
insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
        values (v_version, 'MD2_01', 1, 'SCENARIO', '{"dimension":"BUILDER","difficulty":"EASY"}'::jsonb)
        on conflict (quiz_version_id, stable_key) do nothing;
        select id into strict v_question from meqyro.questions where quiz_version_id = v_version and stable_key = 'MD2_01';
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'pt', 'Uma folga inesperada. Você recebe um pequeno valor extra e tem contas em dia. Qual destino mais combina com seu momento?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'en', 'An unexpected bonus. You receive a little extra money and your bills are covered. What best fits your situation?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'es', 'Un pequeño extra. Recibes algo de dinero y tienes las cuentas al día. ¿Qué destino encaja contigo?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'fr', 'Un petit supplément. Vous recevez une somme imprévue et vos factures sont réglées. Quel usage vous correspond ?') on conflict (question_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_01_1', 1, '{"signals":{"BUILDER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_01_1';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Adiantar um projeto pessoal.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Move a personal project forward.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Adelantar un proyecto personal.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Faire avancer un projet personnel.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_01_2', 2, '{"signals":{"GUARDIAN":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_01_2';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Reforçar a reserva para imprevistos.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Add to my emergency cushion.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Reforzar mi reserva para imprevistos.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Renforcer ma réserve pour les imprévus.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_01_3', 3, '{"signals":{"STRATEGIST":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_01_3';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Comparar minhas prioridades antes de decidir.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Compare my priorities before deciding.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Comparar mis prioridades antes de decidir.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Comparer mes priorités avant de décider.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_01_4', 4, '{"signals":{"ADVENTURER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_01_4';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Aproveitar uma experiência que vinha adiando.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Enjoy an experience I have been postponing.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Disfrutar una experiencia que venía aplazando.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Vivre une expérience que je repousse.') on conflict (option_id, locale) do nothing;
insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
        values (v_version, 'MD2_02', 2, 'SCENARIO', '{"dimension":"GUARDIAN","difficulty":"EASY"}'::jsonb)
        on conflict (quiz_version_id, stable_key) do nothing;
        select id into strict v_question from meqyro.questions where quiz_version_id = v_version and stable_key = 'MD2_02';
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'pt', 'O celular parou. Você precisa dele no dia a dia; consertar custa menos, mas a duração é incerta. O que faria primeiro?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'en', 'Your phone breaks. You need it daily; a repair costs less but may not last. What would you do first?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'es', 'El móvil se rompe. Lo necesitas a diario; repararlo cuesta menos, pero no sabes cuánto durará. ¿Qué harías primero?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'fr', 'Votre téléphone tombe en panne. La réparation coûte moins cher mais sa durée reste incertaine. Que faites-vous d’abord ?') on conflict (question_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_02_1', 1, '{"signals":{"GUARDIAN":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_02_1';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Consertaria para preservar minha reserva.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Repair it to preserve my savings.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Repararlo para conservar mi reserva.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Le réparer pour préserver mon épargne.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_02_2', 2, '{"signals":{"STRATEGIST":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_02_2';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Compararia garantia, prazo e custo total.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Compare warranty, timing and total cost.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Comparar garantía, plazo y coste total.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Comparer garantie, délai et coût total.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_02_3', 3, '{"signals":{"BUILDER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_02_3';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Compraria um modelo melhor para meus projetos.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Buy a better model for my projects.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Comprar un modelo mejor para mis proyectos.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Acheter un modèle adapté à mes projets.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_02_4', 4, '{"signals":{"BALANCER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_02_4';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Escolheria um substituto simples e manteria parte do dinheiro livre.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Choose a basic replacement and keep some money flexible.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Elegir un sustituto sencillo y conservar algo de margen.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Choisir un remplacement simple et garder une marge.') on conflict (option_id, locale) do nothing;
insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
        values (v_version, 'MD2_03', 3, 'SCENARIO', '{"dimension":"STRATEGIST","difficulty":"EASY"}'::jsonb)
        on conflict (quiz_version_id, stable_key) do nothing;
        select id into strict v_question from meqyro.questions where quiz_version_id = v_version and stable_key = 'MD2_03';
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'pt', 'Duas assinaturas. Você usa pouco dois serviços, mas um facilita a rotina e outro diverte. Como decidiria o que manter?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'en', 'Two subscriptions. You rarely use either: one saves time, the other is fun. How would you decide what to keep?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'es', 'Dos suscripciones. Usas poco ambas: una facilita la rutina y otra entretiene. ¿Cómo decides cuál mantener?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'fr', 'Deux abonnements. Vous les utilisez peu : l’un simplifie le quotidien, l’autre vous divertit. Comment choisir ?') on conflict (question_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_03_1', 1, '{"signals":{"STRATEGIST":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_03_1';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Revisaria o uso e o custo de cada um.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Review actual use and cost.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Revisar el uso real y el coste.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Examiner leur usage réel et leur coût.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_03_2', 2, '{"signals":{"ADVENTURER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_03_2';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Manteria o que traz mais prazer agora.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Keep the one I enjoy most now.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Mantener la que más disfruto ahora.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Garder celui qui me plaît le plus maintenant.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_03_3', 3, '{"signals":{"GUARDIAN":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_03_3';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Pausaria ambos para ampliar minha folga.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Pause both to increase my cushion.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Pausar ambas para tener más reserva.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Suspendre les deux pour augmenter ma réserve.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_03_4', 4, '{"signals":{"BALANCER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_03_4';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Manteria um e reservaria espaço para pequenos prazeres.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Keep one and leave room for small treats.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Mantener una y dejar margen para pequeños gustos.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'En garder un et préserver de petits plaisirs.') on conflict (option_id, locale) do nothing;
insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
        values (v_version, 'MD2_04', 4, 'SCENARIO', '{"dimension":"ADVENTURER","difficulty":"EASY"}'::jsonb)
        on conflict (quiz_version_id, stable_key) do nothing;
        select id into strict v_question from meqyro.questions where quiz_version_id = v_version and stable_key = 'MD2_04';
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'pt', 'Convite de última hora. Amigos propõem um passeio que cabe no mês, mas adia uma meta pessoal. Qual seria sua reação?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'en', 'A last-minute invitation. Friends suggest an outing you can afford, but it would delay a personal goal. How would you react?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'es', 'Una invitación de última hora. Puedes pagar el plan, pero retrasaría una meta personal. ¿Qué harías?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'fr', 'Une invitation de dernière minute. La sortie est abordable mais retarderait un objectif personnel. Votre réaction ?') on conflict (question_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_04_1', 1, '{"signals":{"ADVENTURER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_04_1';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Iria: esse encontro vale o adiamento.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Go: seeing them is worth the delay.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Ir: el encuentro merece el aplazamiento.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Y aller : ce moment vaut le report.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_04_2', 2, '{"signals":{"BUILDER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_04_2';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Guardaria o valor para a meta.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Keep the money for my goal.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Guardar el dinero para mi meta.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Garder l’argent pour mon objectif.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_04_3', 3, '{"signals":{"BALANCER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_04_3';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Proporia uma versão mais barata do encontro.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Suggest a cheaper way to meet.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Proponer una forma más económica de vernos.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Proposer une rencontre moins chère.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_04_4', 4, '{"signals":{"STRATEGIST":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_04_4';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Estimaria o atraso da meta antes de responder.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Estimate the delay before replying.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Calcular el retraso antes de responder.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Estimer le retard avant de répondre.') on conflict (option_id, locale) do nothing;
insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
        values (v_version, 'MD2_05', 5, 'SCENARIO', '{"dimension":"BALANCER","difficulty":"EASY"}'::jsonb)
        on conflict (quiz_version_id, stable_key) do nothing;
        select id into strict v_question from meqyro.questions where quiz_version_id = v_version and stable_key = 'MD2_05';
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'pt', 'Um mês mais apertado. Depois das despesas essenciais, sobra menos que o esperado. O que ajustaria primeiro?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'en', 'A tighter month. After essentials, less is left than expected. What would you adjust first?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'es', 'Un mes ajustado. Tras lo esencial queda menos de lo previsto. ¿Qué ajustarías primero?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'fr', 'Un mois serré. Après les dépenses essentielles, il reste moins que prévu. Quel premier ajustement ?') on conflict (question_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_05_1', 1, '{"signals":{"BALANCER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_05_1';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Reduziria um pouco lazer e poupança, preservando ambos.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Reduce both leisure and saving a little.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Reducir un poco ocio y ahorro, conservando ambos.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Réduire un peu loisirs et épargne sans supprimer les deux.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_05_2', 2, '{"signals":{"GUARDIAN":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_05_2';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Manteria a reserva e pausaria o lazer pago.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Protect savings and pause paid outings.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Proteger el ahorro y pausar las salidas de pago.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Protéger l’épargne et suspendre les sorties payantes.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_05_3', 3, '{"signals":{"ADVENTURER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_05_3';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Manteria uma experiência importante e adiaria outra meta.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Keep one meaningful experience and delay another goal.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Mantener una experiencia importante y aplazar otra meta.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Garder une expérience importante et reporter un autre objectif.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_05_4', 4, '{"signals":{"BUILDER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_05_4';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Buscaria uma tarefa remunerada para sustentar meus planos.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Look for paid work to support my plans.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Buscar una tarea remunerada para sostener mis planes.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Chercher une mission rémunérée pour financer mes projets.') on conflict (option_id, locale) do nothing;
insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
        values (v_version, 'MD2_06', 6, 'SCENARIO', '{"dimension":"BUILDER","difficulty":"MEDIUM"}'::jsonb)
        on conflict (quiz_version_id, stable_key) do nothing;
        select id into strict v_question from meqyro.questions where quiz_version_id = v_version and stable_key = 'MD2_06';
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'pt', 'Aprender ou guardar. Um curso acessível pode ajudar num projeto, mas não garante retorno. Como usaria o valor disponível?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'en', 'Learn or save. An affordable course could help a project, without guaranteed returns. How would you use the available money?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'es', 'Aprender o ahorrar. Un curso asequible podría ayudar a un proyecto sin garantizar resultados. ¿Qué harías con el dinero?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'fr', 'Apprendre ou épargner. Une formation abordable pourrait aider un projet, sans résultat garanti. Comment utiliser la somme ?') on conflict (question_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_06_1', 1, '{"signals":{"BUILDER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_06_1';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Testaria uma versão curta para avançar no projeto.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Try a short version to move the project forward.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Probar una versión breve para avanzar.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Tester un module court pour avancer.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_06_2', 2, '{"signals":{"GUARDIAN":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_06_2';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Guardaria até ter mais margem para errar.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Save until I have more room for setbacks.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Ahorrar hasta tener más margen ante contratiempos.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Épargner jusqu’à disposer de plus de marge.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_06_3', 3, '{"signals":{"STRATEGIST":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_06_3';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Compararia conteúdo, tempo exigido e alternativas gratuitas.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Compare content, time and free alternatives.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Comparar contenido, tiempo y alternativas gratuitas.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Comparer contenu, temps et solutions gratuites.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_06_4', 4, '{"signals":{"BALANCER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_06_4';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Dividiria entre o curso e outras prioridades do mês.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Split it between the course and this month’s other priorities.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Repartirlo entre el curso y otras prioridades del mes.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Partager entre formation et autres priorités du mois.') on conflict (option_id, locale) do nothing;
insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
        values (v_version, 'MD2_07', 7, 'SCENARIO', '{"dimension":"GUARDIAN","difficulty":"MEDIUM"}'::jsonb)
        on conflict (quiz_version_id, stable_key) do nothing;
        select id into strict v_question from meqyro.questions where quiz_version_id = v_version and stable_key = 'MD2_07';
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'pt', 'Parcela ou reserva. Você pode quitar uma dívida sem juros ou manter o dinheiro disponível para imprevistos. O que pesa mais?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'en', 'Instalments or cushion. You could repay an interest-free debt or keep cash for surprises. What matters most?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'es', 'Cuotas o reserva. Puedes liquidar una deuda sin intereses o conservar efectivo para imprevistos. ¿Qué pesa más?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'fr', 'Mensualités ou réserve. Vous pouvez solder une dette sans intérêts ou garder des liquidités. Qu’est-ce qui compte le plus ?') on conflict (question_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_07_1', 1, '{"signals":{"GUARDIAN":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_07_1';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Manter liquidez até o vencimento das parcelas.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Keep cash until the instalments fall due.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Mantener liquidez hasta los vencimientos.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Garder les fonds jusqu’aux échéances.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_07_2', 2, '{"signals":{"BUILDER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_07_2';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Quitar para liberar espaço para um projeto.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Repay it to free up room for a project.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Liquidarla para liberar margen para un proyecto.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Solder pour libérer de la place pour un projet.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_07_3', 3, '{"signals":{"STRATEGIST":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_07_3';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Simular os dois caminhos no orçamento.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Model both paths in my budget.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Simular ambos caminos en mi presupuesto.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Simuler les deux options dans mon budget.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_07_4', 4, '{"signals":{"BALANCER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_07_4';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Quitar parte e preservar margem para a rotina.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Repay part and preserve everyday flexibility.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Pagar una parte y conservar flexibilidad cotidiana.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Rembourser une partie et garder de la souplesse.') on conflict (option_id, locale) do nothing;
insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
        values (v_version, 'MD2_08', 8, 'SCENARIO', '{"dimension":"STRATEGIST","difficulty":"MEDIUM"}'::jsonb)
        on conflict (quiz_version_id, stable_key) do nothing;
        select id into strict v_question from meqyro.questions where quiz_version_id = v_version and stable_key = 'MD2_08';
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'pt', 'Promoção que termina hoje. Um item desejado está com desconto; comprá-lo usaria o valor reservado para o mês seguinte. Como decidiria?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'en', 'A sale ends today. Something you want is discounted; buying it uses money set aside for next month. How would you decide?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'es', 'La oferta acaba hoy. Algo que deseas está rebajado; comprarlo usa dinero del mes próximo. ¿Cómo decides?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'fr', 'La promotion finit ce soir. L’achat utiliserait l’argent prévu pour le mois prochain. Comment décider ?') on conflict (question_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_08_1', 1, '{"signals":{"STRATEGIST":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_08_1';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Conferiria o custo total e o que precisaria adiar.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Check total cost and what I would postpone.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Revisar el coste total y lo que aplazaría.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Vérifier le coût total et ce que je reporterais.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_08_2', 2, '{"signals":{"ADVENTURER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_08_2';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Aproveitaria, pois esse prazer tem valor para mim.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Buy it because enjoying it matters to me.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Comprarlo porque disfrutarlo tiene valor para mí.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Acheter car ce plaisir compte pour moi.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_08_3', 3, '{"signals":{"GUARDIAN":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_08_3';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Esperaria outra ocasião para manter minha margem.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Wait for another chance to protect my cushion.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Esperar otra ocasión para conservar mi margen.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Attendre une autre occasion pour garder ma marge.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_08_4', 4, '{"signals":{"BALANCER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_08_4';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Compraria apenas se ainda pudesse manter parte da reserva e do lazer.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Buy only if I can preserve some savings and leisure money.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Comprar solo si conservo algo de ahorro y ocio.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Acheter si je peux préserver une part d’épargne et de loisirs.') on conflict (option_id, locale) do nothing;
insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
        values (v_version, 'MD2_09', 9, 'SCENARIO', '{"dimension":"ADVENTURER","difficulty":"MEDIUM"}'::jsonb)
        on conflict (quiz_version_id, stable_key) do nothing;
        select id into strict v_question from meqyro.questions where quiz_version_id = v_version and stable_key = 'MD2_09';
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'pt', 'Uma viagem rara. Há uma chance de visitar alguém querido, mas ela adia a compra de uma ferramenta para um projeto. O que faria?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'en', 'A rare trip. Visiting someone dear would delay buying a tool for a project. What would you do?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'es', 'Un viaje poco frecuente. Visitar a alguien querido retrasa comprar una herramienta para un proyecto. ¿Qué harías?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'fr', 'Un voyage rare. Voir un proche retarderait l’achat d’un outil pour un projet. Que feriez-vous ?') on conflict (question_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_09_1', 1, '{"signals":{"ADVENTURER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_09_1';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Faria a viagem enquanto a oportunidade existe.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Take the trip while the chance exists.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Viajar mientras exista la oportunidad.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Voyager tant que l’occasion existe.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_09_2', 2, '{"signals":{"BUILDER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_09_2';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Priorizaria a ferramenta e combinaria outra visita.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Prioritise the tool and arrange a later visit.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Priorizar la herramienta y acordar otra visita.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Prioriser l’outil et prévoir une autre visite.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_09_3', 3, '{"signals":{"STRATEGIST":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_09_3';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Pesquisaria datas e alternativas antes de escolher.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Research dates and alternatives before choosing.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Investigar fechas y alternativas antes de elegir.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Rechercher dates et alternatives avant de choisir.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_09_4', 4, '{"signals":{"BALANCER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_09_4';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Encurtaria a viagem para manter parte do plano.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Shorten the trip to preserve part of the plan.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Acortar el viaje para mantener parte del plan.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Raccourcir le voyage pour préserver une partie du projet.') on conflict (option_id, locale) do nothing;
insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
        values (v_version, 'MD2_10', 10, 'SCENARIO', '{"dimension":"BALANCER","difficulty":"MEDIUM"}'::jsonb)
        on conflict (quiz_version_id, stable_key) do nothing;
        select id into strict v_question from meqyro.questions where quiz_version_id = v_version and stable_key = 'MD2_10';
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'pt', 'Um pedido de ajuda. Uma pessoa próxima pede um empréstimo que você pode fazer, mas não sabe quando receberá de volta. Como responderia?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'en', 'A request for help. Someone close asks for a loan you can afford, with no clear repayment date. How would you respond?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'es', 'Una petición de ayuda. Alguien cercano pide un préstamo que puedes hacer sin fecha clara de devolución. ¿Cómo respondes?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'fr', 'Une demande d’aide. Un proche demande un prêt abordable, sans date de retour précise. Votre réponse ?') on conflict (question_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_10_1', 1, '{"signals":{"BALANCER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_10_1';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Ofereceria uma quantia menor que preserve meus compromissos.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Offer a smaller amount that preserves my commitments.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Ofrecer menos para conservar mis compromisos.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Proposer moins pour préserver mes engagements.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_10_2', 2, '{"signals":{"GUARDIAN":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_10_2';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Preferiria ajudar de outra forma e manter minha reserva.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Help another way and keep my cushion.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Ayudar de otra forma y mantener mi reserva.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Aider autrement et garder ma réserve.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_10_3', 3, '{"signals":{"STRATEGIST":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_10_3';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Conversaria sobre prazos e cenários antes de decidir.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Discuss timing and possible outcomes first.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Hablar de plazos y posibles situaciones primero.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Discuter des délais et des éventualités d’abord.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_10_4', 4, '{"signals":{"ADVENTURER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_10_4';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Ajudaria com o valor pedido, adiando um plano pessoal.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Lend the requested amount and delay a personal plan.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Prestar lo solicitado y aplazar un plan personal.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Prêter la somme demandée et reporter un projet personnel.') on conflict (option_id, locale) do nothing;
insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
        values (v_version, 'MD2_11', 11, 'SCENARIO', '{"dimension":"BUILDER","difficulty":"HARD"}'::jsonb)
        on conflict (quiz_version_id, stable_key) do nothing;
        select id into strict v_question from meqyro.questions where quiz_version_id = v_version and stable_key = 'MD2_11';
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'pt', 'Renda variável. Seu mês foi melhor que o esperado, mas o próximo é incerto. Como distribuiria a diferença?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'en', 'Variable income. This month went well but next month is uncertain. What would you do with the difference?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'es', 'Ingresos variables. Este mes fue bueno pero el próximo es incierto. ¿Cómo repartirías la diferencia?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'fr', 'Revenus variables. Le mois a été bon mais le prochain reste incertain. Comment répartir la différence ?') on conflict (question_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_11_1', 1, '{"signals":{"BUILDER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_11_1';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Financiaria um pequeno passo de um projeto futuro.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Fund a small step towards a future project.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Financiar un pequeño paso de un proyecto futuro.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Financer une étape d’un futur projet.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_11_2', 2, '{"signals":{"GUARDIAN":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_11_2';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Guardaria para cobrir meses mais fracos.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Save it for leaner months.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Guardar para meses más flojos.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Épargner pour les mois plus faibles.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_11_3', 3, '{"signals":{"BALANCER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_11_3';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Separaria uma parte para aproveitar e outra para os meses seguintes.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Split it between enjoyment and future months.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Repartir entre disfrute y meses siguientes.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Partager entre plaisir et mois suivants.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_11_4', 4, '{"signals":{"STRATEGIST":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_11_4';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Revisaria o histórico de entradas antes de definir valores.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Review my income history before allocating amounts.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Revisar el historial de ingresos antes de asignar cantidades.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Examiner mon historique de revenus avant de répartir.') on conflict (option_id, locale) do nothing;
insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
        values (v_version, 'MD2_12', 12, 'SCENARIO', '{"dimension":"GUARDIAN","difficulty":"HARD"}'::jsonb)
        on conflict (quiz_version_id, stable_key) do nothing;
        select id into strict v_question from meqyro.questions where quiz_version_id = v_version and stable_key = 'MD2_12';
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'pt', 'Trabalho extra incerto. Um serviço exige pagar transporte antes de saber se o cliente vai confirmar. Qual seria seu primeiro passo?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'en', 'Uncertain extra work. A job requires travel costs before the client confirms. What is your first move?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'es', 'Trabajo extra incierto. Debes pagar transporte antes de que el cliente confirme. ¿Cuál es tu primer paso?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'fr', 'Une mission incertaine. Le transport est à payer avant confirmation du client. Votre premier geste ?') on conflict (question_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_12_1', 1, '{"signals":{"GUARDIAN":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_12_1';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Esperar confirmação para preservar meu caixa.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Wait for confirmation to protect my cash.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Esperar confirmación para proteger mi efectivo.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Attendre la confirmation pour protéger ma trésorerie.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_12_2', 2, '{"signals":{"STRATEGIST":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_12_2';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Negociar condições e estimar o custo de uma desistência.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Negotiate terms and estimate cancellation costs.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Negociar condiciones y calcular el coste de una cancelación.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Négocier les conditions et estimer le coût d’une annulation.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_12_3', 3, '{"signals":{"BUILDER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_12_3';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Aceitar o custo como teste para ampliar minha renda.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Accept the cost as a test to grow my income.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Aceptar el coste como prueba para ampliar mis ingresos.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Accepter ce coût pour tester une nouvelle source de revenus.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_12_4', 4, '{"signals":{"BALANCER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_12_4';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Limitar a tentativa a uma quantia que não tire meu descanso habitual.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Limit the trial so it does not displace my usual downtime.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Limitar la prueba para conservar mi descanso habitual.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Limiter l’essai pour préserver mes moments de repos.') on conflict (option_id, locale) do nothing;
insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
        values (v_version, 'MD2_13', 13, 'SCENARIO', '{"dimension":"STRATEGIST","difficulty":"HARD"}'::jsonb)
        on conflict (quiz_version_id, stable_key) do nothing;
        select id into strict v_question from meqyro.questions where quiz_version_id = v_version and stable_key = 'MD2_13';
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'pt', 'A conta subiu. Um serviço essencial ficou mais caro; trocar exige tempo e pode interrompê-lo por um dia. Como agiria?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'en', 'A bill rises. Switching an essential service saves money but takes time and may interrupt it for a day. What would you do?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'es', 'Sube una factura. Cambiar un servicio esencial ahorra dinero, pero requiere tiempo y puede interrumpirlo un día. ¿Qué harías?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'fr', 'Une facture augmente. Changer de prestataire économise de l’argent mais demande du temps et une possible coupure. Que faites-vous ?') on conflict (question_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_13_1', 1, '{"signals":{"STRATEGIST":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_13_1';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Compararia a economia com o trabalho e o risco da troca.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Compare savings with effort and disruption risk.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Comparar el ahorro con el esfuerzo y el riesgo.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Comparer économies, effort et risque de coupure.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_13_2', 2, '{"signals":{"GUARDIAN":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_13_2';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Manteria por enquanto para evitar surpresas.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Stay for now to avoid surprises.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Mantenerlo por ahora para evitar sorpresas.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Rester pour le moment afin d’éviter les surprises.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_13_3', 3, '{"signals":{"BUILDER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_13_3';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Trocaria e destinaria a economia a um projeto.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Switch and put the savings towards a project.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Cambiar y destinar el ahorro a un proyecto.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Changer et consacrer l’économie à un projet.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_13_4', 4, '{"signals":{"BALANCER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_13_4';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Buscaria um plano intermediário para preservar conforto e orçamento.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Look for a middle plan preserving comfort and budget.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Buscar un plan intermedio que preserve comodidad y presupuesto.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Chercher une formule intermédiaire entre confort et budget.') on conflict (option_id, locale) do nothing;
insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
        values (v_version, 'MD2_14', 14, 'SCENARIO', '{"dimension":"ADVENTURER","difficulty":"HARD"}'::jsonb)
        on conflict (quiz_version_id, stable_key) do nothing;
        select id into strict v_question from meqyro.questions where quiz_version_id = v_version and stable_key = 'MD2_14';
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'pt', 'O grupo escolheu caro. Num encontro, as pessoas escolhem um lugar acima do seu plano. Você tem margem, mas ela teria outro destino. O que faria?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'en', 'The group chooses an expensive place. You have room, but had other plans for the money. What would you do?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'es', 'El grupo elige un sitio caro. Tienes margen, pero el dinero tenía otro destino. ¿Qué harías?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'fr', 'Le groupe choisit un lieu cher. Vous avez une marge, mais l’argent était destiné à autre chose. Que faites-vous ?') on conflict (question_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_14_1', 1, '{"signals":{"ADVENTURER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_14_1';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Acompanharia para viver o momento com o grupo.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Join to enjoy the moment together.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Ir para disfrutar el momento con el grupo.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Suivre le groupe pour profiter du moment.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_14_2', 2, '{"signals":{"BALANCER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_14_2';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Proporia outro lugar com um limite de gasto.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Suggest another place within a spending limit.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Proponer otro sitio con un límite de gasto.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Proposer un autre lieu avec un budget limite.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_14_3', 3, '{"signals":{"GUARDIAN":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_14_3';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Ficaria fora desta vez para manter a reserva.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Sit this one out to keep my cushion.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'No ir esta vez para mantener mi reserva.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Passer mon tour pour garder ma réserve.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_14_4', 4, '{"signals":{"STRATEGIST":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_14_4';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Verificaria o impacto nos próximos dias antes de confirmar.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Check the impact on the coming days before confirming.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Revisar el impacto en los próximos días antes de confirmar.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Vérifier l’impact sur les jours suivants avant de confirmer.') on conflict (option_id, locale) do nothing;
insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
        values (v_version, 'MD2_15', 15, 'SCENARIO', '{"dimension":"BALANCER","difficulty":"HARD"}'::jsonb)
        on conflict (quiz_version_id, stable_key) do nothing;
        select id into strict v_question from meqyro.questions where quiz_version_id = v_version and stable_key = 'MD2_15';
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'pt', 'Uma meta longa perdeu a graça. Você guarda há meses, mas uma vontade nova ganhou importância. Como reagiria?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'en', 'A long goal loses its appeal. You have saved for months, but a new wish now matters more. What would you do?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'es', 'Una meta larga pierde atractivo. Llevas meses ahorrando, pero surge un deseo importante. ¿Qué harías?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'fr', 'Un objectif perd de son attrait. Vous épargnez depuis des mois, mais une nouvelle envie prend de l’importance. Votre réaction ?') on conflict (question_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_15_1', 1, '{"signals":{"BALANCER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_15_1';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Repartiria os próximos aportes entre as duas vontades.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Split future savings between the two.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Repartir los próximos ahorros entre ambos.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Partager les prochains versements entre les deux.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_15_2', 2, '{"signals":{"BUILDER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_15_2';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Manteria a meta original para concluir o que comecei.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Keep the original goal to finish what I started.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Mantener la meta original para terminar lo iniciado.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Garder l’objectif initial pour aller au bout.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_15_3', 3, '{"signals":{"ADVENTURER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_15_3';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Redirecionaria o dinheiro para o que faz sentido agora.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Redirect the money to what matters now.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Redirigir el dinero a lo que importa ahora.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Réorienter l’argent vers ce qui compte maintenant.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_15_4', 4, '{"signals":{"STRATEGIST":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_15_4';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Reavaliaria prazo, custo e importância das duas metas.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Reassess timing, cost and importance of both goals.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Revisar plazo, coste e importancia de ambas metas.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Réévaluer délai, coût et importance des deux objectifs.') on conflict (option_id, locale) do nothing;
insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
        values (v_version, 'MD2_16', 16, 'SCENARIO', '{"dimension":"BUILDER","difficulty":"HARD"}'::jsonb)
        on conflict (quiz_version_id, stable_key) do nothing;
        select id into strict v_question from meqyro.questions where quiz_version_id = v_version and stable_key = 'MD2_16';
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'pt', 'Tempo também custa. Você pode ganhar um extra no fim de semana, descansar ou rever alguém querido. O dinheiro ajudaria, mas não é urgente. O que escolheria?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'en', 'Time has a cost. You could earn extra this weekend, rest or see someone dear. The money helps but is not urgent. What would you choose?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'es', 'El tiempo también cuesta. Puedes ganar un extra, descansar o ver a alguien querido. El dinero ayuda, pero no urge. ¿Qué eliges?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'fr', 'Le temps a un coût. Ce week-end permet de gagner un complément, de se reposer ou de voir un proche. L’argent aide sans urgence. Que choisir ?') on conflict (question_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_16_1', 1, '{"signals":{"BUILDER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_16_1';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Faria o trabalho para antecipar uma meta.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Work to bring a goal closer.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Trabajar para adelantar una meta.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Travailler pour avancer un objectif.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_16_2', 2, '{"signals":{"ADVENTURER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_16_2';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Preservaria o encontro que raramente acontece.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Keep the rare chance to meet.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Conservar ese encuentro poco frecuente.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Préserver cette rare rencontre.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_16_3', 3, '{"signals":{"BALANCER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_16_3';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Aceitaria só parte do trabalho para manter descanso.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Take part of the work and preserve rest.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Aceptar parte del trabajo y conservar descanso.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Accepter une partie du travail et garder du repos.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_16_4', 4, '{"signals":{"STRATEGIST":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_16_4';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Compararia o ganho líquido com tempo e deslocamento.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Compare net income with time and travel.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Comparar ingreso neto, tiempo y desplazamiento.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Comparer gain net, temps et trajet.') on conflict (option_id, locale) do nothing;
insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
        values (v_version, 'MD2_17', 17, 'SCENARIO', '{"dimension":"GUARDIAN","difficulty":"HARD"}'::jsonb)
        on conflict (quiz_version_id, stable_key) do nothing;
        select id into strict v_question from meqyro.questions where quiz_version_id = v_version and stable_key = 'MD2_17';
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'pt', 'Imprevisto depois do esforço. Surge uma despesa essencial após meses guardando para um projeto. Usar a reserva é possível. Como reorganizaria o plano?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'en', 'A surprise after months of saving. An essential expense appears; you can use your cushion. How would you reset your project plan?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'es', 'Un imprevisto tras meses de ahorro. Surge un gasto esencial que puedes cubrir con la reserva. ¿Cómo reorganizas el proyecto?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'fr', 'Un imprévu après des mois d’effort. Une dépense essentielle peut être couverte par votre réserve. Comment revoir le projet ?') on conflict (question_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_17_1', 1, '{"signals":{"GUARDIAN":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_17_1';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Usaria a reserva e priorizaria recompô-la.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Use the cushion and prioritise rebuilding it.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Usar la reserva y priorizar reponerla.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Utiliser la réserve et prioriser sa reconstitution.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_17_2', 2, '{"signals":{"BUILDER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_17_2';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Reduziria o projeto para começar mesmo assim.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Scale down the project so I can still start.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Reducir el proyecto para poder empezarlo.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Réduire le projet pour commencer quand même.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_17_3', 3, '{"signals":{"STRATEGIST":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_17_3';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Recalcularia prazos com diferentes formas de pagamento.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Recalculate timing with different payment arrangements.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Recalcular plazos con distintas formas de pago.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Recalculer les délais selon les modalités de paiement.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_17_4', 4, '{"signals":{"BALANCER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_17_4';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Ajustaria projeto e lazer sem suspender nenhum totalmente.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Adjust both project and leisure without stopping either.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Ajustar proyecto y ocio sin suspender ninguno.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Ajuster projet et loisirs sans arrêter l’un ou l’autre.') on conflict (option_id, locale) do nothing;
insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
        values (v_version, 'MD2_18', 18, 'SCENARIO', '{"dimension":"STRATEGIST","difficulty":"HARD"}'::jsonb)
        on conflict (quiz_version_id, stable_key) do nothing;
        select id into strict v_question from meqyro.questions where quiz_version_id = v_version and stable_key = 'MD2_18';
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'pt', 'Conselhos diferentes. Uma pessoa recomenda guardar tudo; outra diz para aproveitar mais. Você está em dúvida sobre um valor livre. O que faria?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'en', 'Conflicting advice. One person says save everything; another says enjoy life more. You are unsure about some spare money. What would you do?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'es', 'Consejos distintos. Una persona dice ahorrar todo; otra, disfrutar más. Dudas sobre un dinero disponible. ¿Qué harías?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'fr', 'Des conseils opposés. L’un recommande de tout épargner, l’autre de profiter davantage. Vous hésitez sur une somme disponible. Que faites-vous ?') on conflict (question_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_18_1', 1, '{"signals":{"STRATEGIST":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_18_1';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Definiria meus critérios e compararia as sugestões.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Define my criteria and compare the suggestions.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Definir mis criterios y comparar sugerencias.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Définir mes critères et comparer les suggestions.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_18_2', 2, '{"signals":{"GUARDIAN":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_18_2';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Guardaria até ter maior tranquilidade.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Save until I feel more secure.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Guardar hasta sentir más tranquilidad.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Épargner jusqu’à me sentir plus serein.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_18_3', 3, '{"signals":{"ADVENTURER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_18_3';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Escolheria uma experiência significativa neste momento.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Choose a meaningful experience right now.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Elegir una experiencia significativa ahora.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Choisir une expérience qui compte maintenant.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_18_4', 4, '{"signals":{"BALANCER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_18_4';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Destinaria partes a segurança e prazer.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Allocate portions to security and enjoyment.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Repartir entre seguridad y disfrute.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Répartir entre sécurité et plaisir.') on conflict (option_id, locale) do nothing;
insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
        values (v_version, 'MD2_19', 19, 'SCENARIO', '{"dimension":"ADVENTURER","difficulty":"HARD"}'::jsonb)
        on conflict (quiz_version_id, stable_key) do nothing;
        select id into strict v_question from meqyro.questions where quiz_version_id = v_version and stable_key = 'MD2_19';
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'pt', 'Um plano não deu retorno. Você gastou numa atividade nova e não gostou. Ainda há uma segunda etapa opcional. Qual seria sua decisão?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'en', 'A plan disappoints. You paid for a new activity and did not enjoy it. A second stage is optional. What would you decide?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'es', 'Un plan decepciona. Pagaste una actividad nueva y no te gustó. Hay una segunda etapa opcional. ¿Qué decides?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'fr', 'Un projet déçoit. Une activité payante ne vous a pas plu. Une seconde étape est facultative. Que décidez-vous ?') on conflict (question_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_19_1', 1, '{"signals":{"ADVENTURER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_19_1';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Testaria a segunda etapa pela experiência diferente.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Try the second stage for a different experience.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Probar la segunda por vivir algo distinto.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Tester la seconde pour vivre autre chose.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_19_2', 2, '{"signals":{"GUARDIAN":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_19_2';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Encerraria para preservar o dinheiro restante.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Stop to preserve the remaining money.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Parar para conservar el dinero restante.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Arrêter pour préserver l’argent restant.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_19_3', 3, '{"signals":{"STRATEGIST":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_19_3';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Investigaria o que muda na segunda etapa antes de decidir.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Find out what changes in stage two before deciding.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Averiguar qué cambia en la segunda antes de decidir.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Comprendre ce qui change avant de décider.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_19_4', 4, '{"signals":{"BUILDER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_19_4';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Usaria o restante para avançar num projeto conhecido.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Use the rest to advance a familiar project.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Usar el resto para avanzar en un proyecto conocido.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Utiliser le reste pour un projet connu.') on conflict (option_id, locale) do nothing;
insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
        values (v_version, 'MD2_20', 20, 'SCENARIO', '{"dimension":"BALANCER","difficulty":"HARD"}'::jsonb)
        on conflict (quiz_version_id, stable_key) do nothing;
        select id into strict v_question from meqyro.questions where quiz_version_id = v_version and stable_key = 'MD2_20';
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'pt', 'Aumento pequeno, escolhas reais. Sua renda melhora um pouco e há desejos antigos e metas futuras. O que mudaria primeiro?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'en', 'A small raise, real choices. Your income improves a little; old wishes and future goals compete. What would change first?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'es', 'Un pequeño aumento. Mejoran un poco tus ingresos; compiten deseos antiguos y metas futuras. ¿Qué cambia primero?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'fr', 'Une petite hausse de revenus. Des envies anciennes et des objectifs futurs se disputent cette marge. Quel premier changement ?') on conflict (question_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_20_1', 1, '{"signals":{"BALANCER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_20_1';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Melhoraria um pouco a rotina e guardaria uma parte.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Improve daily life a little and save some.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Mejorar algo la rutina y guardar una parte.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Améliorer un peu le quotidien et épargner une part.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_20_2', 2, '{"signals":{"BUILDER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_20_2';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Direcionaria o aumento a uma meta de construção.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Put the increase towards building a goal.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Destinar el aumento a construir una meta.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Consacrer la hausse à un objectif à construire.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_20_3', 3, '{"signals":{"GUARDIAN":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_20_3';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Elevaria minha margem para imprevistos.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Increase my emergency margin.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Ampliar mi margen para imprevistos.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Augmenter ma marge pour les imprévus.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'MD2_20_4', 4, '{"signals":{"ADVENTURER":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'MD2_20_4';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Realizaria uma vontade que vinha adiando.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Fulfil a wish I have been postponing.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Cumplir un deseo que venía aplazando.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Réaliser une envie que je repousse.') on conflict (option_id, locale) do nothing;
end $$;
do $$ declare v_version uuid; v_question uuid; v_option uuid; begin
      insert into meqyro.quiz_versions (quiz_id, version, scoring_version, status, published_at)
      select id, 'v2.0.0', 'behavioral-v2', 'PUBLISHED'::meqyro.content_status, now()
      from meqyro.quizzes where slug = 'coupledna'
      on conflict (quiz_id, version) do nothing;
      select v.id into strict v_version from meqyro.quiz_versions v join meqyro.quizzes q on q.id = v.quiz_id
      where q.slug = 'coupledna' and v.version = 'v2.0.0';
insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
        values (v_version, 'CD2_01', 1, 'SCENARIO', '{"dimension":"COMMUNICATION","difficulty":"EASY"}'::jsonb)
        on conflict (quiz_version_id, stable_key) do nothing;
        select id into strict v_question from meqyro.questions where quiz_version_id = v_version and stable_key = 'CD2_01';
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'pt', 'A noite mudou. A pessoa com quem você se relaciona cancela um encontro por trabalho pela segunda vez no mês. O que faria primeiro?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'en', 'Plans change. Your partner cancels a date for work for the second time this month. What would you do first?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'es', 'La noche cambia. Tu pareja cancela por trabajo una cita por segunda vez este mes. ¿Qué harías primero?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'fr', 'La soirée change. Votre partenaire annule un rendez-vous pour le travail, pour la deuxième fois du mois. Votre premier geste ?') on conflict (question_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_01_1', 1, '{"signals":{"COMMUNICATION":3}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_01_1';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Diria como me senti e proporia conversar sobre os próximos encontros.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Share how I feel and discuss future plans together.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Decir cómo me siento y hablar de los próximos encuentros.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Exprimer mon ressenti et discuter des prochains rendez-vous.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_01_2', 2, '{"signals":{"COMMUNICATION":2}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_01_2';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Perguntaria se ainda podemos preservar parte do tempo juntos.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Ask whether we can still keep some time together.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Preguntar si aún podemos conservar parte del tiempo juntos.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Demander si nous pouvons garder un peu de temps ensemble.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_01_3', 3, '{"signals":{"COMMUNICATION":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_01_3';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Reorganizaria minha noite e retomaria o assunto depois.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Reorganise my evening and return to it later.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Reorganizar mi noche y retomar el tema después.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Réorganiser ma soirée et en reparler plus tard.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_01_4', 4, '{"signals":{"COMMUNICATION":0}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_01_4';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Organizaria meus sentimentos antes de escolher o que dizer.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Sort through my feelings before choosing what to say.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Ordenar mis emociones antes de elegir qué decir.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Clarifier mes émotions avant de choisir mes mots.') on conflict (option_id, locale) do nothing;
insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
        values (v_version, 'CD2_02', 2, 'SCENARIO', '{"dimension":"LIFE_VALUES","difficulty":"EASY"}'::jsonb)
        on conflict (quiz_version_id, stable_key) do nothing;
        select id into strict v_question from meqyro.questions where quiz_version_id = v_version and stable_key = 'CD2_02';
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'pt', 'Um sábado, duas vontades. Você quer descansar sozinho; a outra pessoa quer visitar amigos em comum. Como encaminharia?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'en', 'One Saturday, two wishes. You want time alone; your partner wants to see mutual friends. How would you approach it?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'es', 'Un sábado, dos deseos. Quieres descansar a solas; tu pareja quiere visitar amigos comunes. ¿Cómo lo abordarías?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'fr', 'Un samedi, deux envies. Vous voulez du repos seul ; votre partenaire souhaite voir des amis communs. Comment avancer ?') on conflict (question_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_02_1', 1, '{"signals":{"LIFE_VALUES":0}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_02_1';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Preservaria meu descanso e combinaria nos vermos depois.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Keep my rest time and arrange to meet afterwards.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Conservar mi descanso y vernos después.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Garder mon repos et nous retrouver ensuite.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_02_2', 2, '{"signals":{"LIFE_VALUES":2}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_02_2';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Proporia uma visita curta e um tempo sozinho em seguida.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Suggest a short visit followed by time alone.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Proponer una visita breve y tiempo a solas luego.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Proposer une visite courte puis du temps seul.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_02_3', 3, '{"signals":{"LIFE_VALUES":3}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_02_3';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Conversaria sobre o que esse sábado representa para cada um.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Discuss what this Saturday means to each of us.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Hablar de lo que significa ese sábado para cada persona.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Discuter de ce que ce samedi représente pour chacun.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_02_4', 4, '{"signals":{"LIFE_VALUES":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_02_4';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Refletiria sobre minha energia antes de propor um plano.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Think about my energy before proposing a plan.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Pensar en mi energía antes de proponer un plan.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Évaluer mon énergie avant de proposer un programme.') on conflict (option_id, locale) do nothing;
insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
        values (v_version, 'CD2_03', 3, 'SCENARIO', '{"dimension":"CONFLICT_MANAGEMENT","difficulty":"EASY"}'::jsonb)
        on conflict (quiz_version_id, stable_key) do nothing;
        select id into strict v_question from meqyro.questions where quiz_version_id = v_version and stable_key = 'CD2_03';
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'pt', 'O tom subiu. Uma conversa sobre a rotina fica emocional e vocês querem se entender. Qual seria seu próximo passo?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'en', 'Voices rise. A conversation about daily life becomes emotional and you both want understanding. What is your next step?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'es', 'Sube el tono. Hablar de la rutina se vuelve emocional y quieren entenderse. ¿Cuál sería tu siguiente paso?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'fr', 'Le ton monte. Une discussion sur le quotidien devient chargée d’émotion. Quel serait votre prochain geste ?') on conflict (question_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_03_1', 1, '{"signals":{"CONFLICT_MANAGEMENT":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_03_1';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Pediria uma pausa com horário para retomar.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Ask for a break with a time to return.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Pedir una pausa con hora para retomar.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Demander une pause avec un moment convenu pour reprendre.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_03_2', 2, '{"signals":{"CONFLICT_MANAGEMENT":3}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_03_2';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Tentaria resumir os dois pontos de vista ali mesmo.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Try to summarise both perspectives right now.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Intentar resumir ambas perspectivas en ese momento.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Essayer de résumer nos deux points de vue tout de suite.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_03_3', 3, '{"signals":{"CONFLICT_MANAGEMENT":2}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_03_3';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Proporia resolver só uma parte agora e deixar o restante para depois.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Resolve one part now and leave the rest for later.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Resolver una parte ahora y dejar el resto para después.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Résoudre une partie maintenant et garder le reste pour plus tard.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_03_4', 4, '{"signals":{"CONFLICT_MANAGEMENT":0}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_03_4';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Precisaria pensar sozinho antes de retomar, avisando isso.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Explain that I need to think alone before returning.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Avisar que necesito pensar a solas antes de retomar.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Expliquer que j’ai besoin de réfléchir seul avant de reprendre.') on conflict (option_id, locale) do nothing;
insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
        values (v_version, 'CD2_04', 4, 'SCENARIO', '{"dimension":"FINANCES","difficulty":"EASY"}'::jsonb)
        on conflict (quiz_version_id, stable_key) do nothing;
        select id into strict v_question from meqyro.questions where quiz_version_id = v_version and stable_key = 'CD2_04';
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'pt', 'Um jantar acima do previsto. Vocês querem celebrar, mas têm limites de gasto diferentes. Como decidiria sua parte?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'en', 'A dinner over budget. You want to celebrate but have different spending limits. How would you decide your part?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'es', 'Una cena por encima de lo previsto. Quieren celebrar con límites de gasto distintos. ¿Cómo decidirías tu parte?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'fr', 'Un dîner plus cher que prévu. Vous souhaitez célébrer avec des budgets différents. Comment décider de votre part ?') on conflict (question_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_04_1', 1, '{"signals":{"FINANCES":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_04_1';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Definiria meu limite e comunicaria antes de escolher.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Set my limit and communicate it before choosing.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Fijar mi límite y comunicarlo antes de elegir.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Définir ma limite et l’annoncer avant de choisir.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_04_2', 2, '{"signals":{"FINANCES":3}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_04_2';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Proporia juntos um formato que caiba para os dois.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Plan a format together that works for both.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Diseñar juntos un plan que funcione para ambos.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Concevoir ensemble une formule adaptée aux deux.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_04_3', 3, '{"signals":{"FINANCES":0}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_04_3';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Pensaria em quanto posso gastar antes de conversar.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Think through what I can spend before discussing it.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Pensar cuánto puedo gastar antes de hablar.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Réfléchir à ma capacité de dépense avant d’en parler.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_04_4', 4, '{"signals":{"FINANCES":2}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_04_4';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Sugeriria um lugar mais simples e um detalhe especial.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Suggest a simpler place with one special touch.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Sugerir un lugar sencillo con un detalle especial.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Proposer un lieu simple avec une attention particulière.') on conflict (option_id, locale) do nothing;
insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
        values (v_version, 'CD2_05', 5, 'SCENARIO', '{"dimension":"FUTURE_PLANS","difficulty":"EASY"}'::jsonb)
        on conflict (quiz_version_id, stable_key) do nothing;
        select id into strict v_question from meqyro.questions where quiz_version_id = v_version and stable_key = 'CD2_05';
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'pt', 'Férias em aberto. Ainda faltam meses e vocês têm ideias diferentes para os dias livres. O que faria primeiro?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'en', 'An open holiday plan. Months remain and you have different ideas for time off. What would you do first?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'es', 'Vacaciones abiertas. Faltan meses y tienen ideas diferentes para los días libres. ¿Qué harías primero?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'fr', 'Des vacances à définir. Il reste des mois et vos idées diffèrent. Quel premier geste ?') on conflict (question_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_05_1', 1, '{"signals":{"FUTURE_PLANS":3}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_05_1';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Conversaria sobre o que cada um espera desse período.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Discuss what each of us hopes for.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Hablar de lo que espera cada persona.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Discuter de ce que chacun en attend.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_05_2', 2, '{"signals":{"FUTURE_PLANS":0}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_05_2';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Reuniria minhas preferências antes de comparar planos.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Clarify my preferences before comparing plans.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Aclarar mis preferencias antes de comparar planes.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Clarifier mes préférences avant de comparer les projets.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_05_3', 3, '{"signals":{"FUTURE_PLANS":2}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_05_3';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Proporia reservar alguns dias em comum e deixar outros livres.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Reserve some shared days and leave others flexible.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Reservar algunos días comunes y dejar otros libres.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Réserver des jours communs et laisser les autres libres.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_05_4', 4, '{"signals":{"FUTURE_PLANS":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_05_4';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Faria uma lista pessoal de possibilidades para compartilhar depois.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Make a personal shortlist to share later.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Hacer una lista personal para compartir después.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Dresser une liste personnelle à partager ensuite.') on conflict (option_id, locale) do nothing;
insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
        values (v_version, 'CD2_06', 6, 'SCENARIO', '{"dimension":"COMMUNICATION","difficulty":"MEDIUM"}'::jsonb)
        on conflict (quiz_version_id, stable_key) do nothing;
        select id into strict v_question from meqyro.questions where quiz_version_id = v_version and stable_key = 'CD2_06';
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'pt', 'Uma mensagem curta. Você recebe uma resposta seca num dia importante e não sabe se há algo errado. Como reagiria?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'en', 'A short message. You get a terse reply on an important day and are unsure why. What would you do?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'es', 'Un mensaje breve. Recibes una respuesta seca en un día importante y no sabes por qué. ¿Cómo reaccionas?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'fr', 'Un message bref. Une réponse sèche arrive un jour important, sans raison claire. Votre réaction ?') on conflict (question_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_06_1', 1, '{"signals":{"COMMUNICATION":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_06_1';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Esperaria uma conversa presencial para entender o contexto.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Wait to understand the context in person.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Esperar a entender el contexto en persona.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Attendre de comprendre le contexte en personne.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_06_2', 2, '{"signals":{"COMMUNICATION":3}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_06_2';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Perguntaria diretamente como a pessoa está e explicaria minha dúvida.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Ask how they are and explain my uncertainty.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Preguntar cómo está y explicar mi duda.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Demander comment va l’autre et expliquer mon doute.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_06_3', 3, '{"signals":{"COMMUNICATION":2}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_06_3';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Diria que gostaria de conversar quando houver espaço.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Say I would like to talk when there is space.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Decir que me gustaría hablar cuando haya espacio.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Dire que j’aimerais parler quand un moment sera disponible.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_06_4', 4, '{"signals":{"COMMUNICATION":0}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_06_4';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Reveria minhas expectativas antes de interpretar a mensagem.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Review my expectations before interpreting the message.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Revisar mis expectativas antes de interpretar el mensaje.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Revoir mes attentes avant d’interpréter le message.') on conflict (option_id, locale) do nothing;
insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
        values (v_version, 'CD2_07', 7, 'SCENARIO', '{"dimension":"LIFE_VALUES","difficulty":"MEDIUM"}'::jsonb)
        on conflict (quiz_version_id, stable_key) do nothing;
        select id into strict v_question from meqyro.questions where quiz_version_id = v_version and stable_key = 'CD2_07';
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'pt', 'Famílias com costumes diferentes. Há dois convites para a mesma data e você gostaria de preservar suas tradições. O que proporia?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'en', 'Different family traditions. Two invitations fall on the same date and your traditions matter to you. What would you propose?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'es', 'Costumbres familiares distintas. Dos invitaciones coinciden y quieres preservar tus tradiciones. ¿Qué propones?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'fr', 'Des traditions familiales différentes. Deux invitations tombent le même jour et vos habitudes comptent. Que proposer ?') on conflict (question_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_07_1', 1, '{"signals":{"LIFE_VALUES":3}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_07_1';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Conversar sobre o significado das duas tradições antes de escolher.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Discuss what both traditions mean before choosing.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Hablar del significado de ambas tradiciones antes de elegir.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Discuter du sens des deux traditions avant de choisir.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_07_2', 2, '{"signals":{"LIFE_VALUES":0}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_07_2';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Manter meu compromisso e nos encontrarmos em outro momento.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Keep my commitment and meet at another time.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Mantener mi compromiso y vernos en otro momento.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Garder mon engagement et nous voir à un autre moment.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_07_3', 3, '{"signals":{"LIFE_VALUES":2}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_07_3';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Dividir a data de um jeito viável para ambos.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Split the day in a workable way for both.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Repartir el día de forma viable para ambos.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Partager la journée de manière viable pour les deux.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_07_4', 4, '{"signals":{"LIFE_VALUES":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_07_4';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Escolher minha prioridade primeiro e depois apresentar uma proposta.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Choose my priority first, then bring a proposal.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Elegir primero mi prioridad y presentar una propuesta después.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Choisir ma priorité puis présenter une proposition.') on conflict (option_id, locale) do nothing;
insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
        values (v_version, 'CD2_08', 8, 'SCENARIO', '{"dimension":"CONFLICT_MANAGEMENT","difficulty":"MEDIUM"}'::jsonb)
        on conflict (quiz_version_id, stable_key) do nothing;
        select id into strict v_question from meqyro.questions where quiz_version_id = v_version and stable_key = 'CD2_08';
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'pt', 'A mesma tarefa outra vez. Uma tarefa combinada ficou sem fazer e você está irritado. Qual seria sua primeira ação?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'en', 'The same chore again. An agreed task was left undone and you feel irritated. What comes first?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'es', 'La misma tarea otra vez. Una tarea acordada quedó pendiente y te molesta. ¿Qué harías primero?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'fr', 'Encore la même tâche. Une tâche convenue n’a pas été faite et vous êtes irrité. Votre premier geste ?') on conflict (question_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_08_1', 1, '{"signals":{"CONFLICT_MANAGEMENT":0}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_08_1';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Pensaria no que preciso mudar antes de abordar o assunto.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Think about what I need before raising it.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Pensar qué necesito cambiar antes de hablar.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Réfléchir à mes besoins avant d’en parler.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_08_2', 2, '{"signals":{"CONFLICT_MANAGEMENT":3}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_08_2';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Chamaria para revisar o acordo e ouvir o que aconteceu.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Review the agreement together and hear what happened.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Revisar juntos el acuerdo y escuchar qué ocurrió.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Revoir l’accord ensemble et écouter ce qui s’est passé.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_08_3', 3, '{"signals":{"CONFLICT_MANAGEMENT":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_08_3';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Cuidaria do urgente e marcaria uma conversa curta depois.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Handle the urgent part and arrange a short talk later.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Resolver lo urgente y acordar una charla breve después.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Gérer l’urgence et convenir d’une courte discussion ensuite.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_08_4', 4, '{"signals":{"CONFLICT_MANAGEMENT":2}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_08_4';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Proporia um ajuste provisório para testarmos nesta semana.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Suggest a temporary change to test this week.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Proponer un ajuste provisional para probar esta semana.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Proposer un ajustement provisoire à tester cette semaine.') on conflict (option_id, locale) do nothing;
insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
        values (v_version, 'CD2_09', 9, 'SCENARIO', '{"dimension":"FINANCES","difficulty":"MEDIUM"}'::jsonb)
        on conflict (quiz_version_id, stable_key) do nothing;
        select id into strict v_question from meqyro.questions where quiz_version_id = v_version and stable_key = 'CD2_09';
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'pt', 'Uma compra pessoal. Você quer comprar algo com seu dinheiro, mas isso reduz sua margem para um plano em comum. Como encaminharia?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'en', 'A personal purchase. Using your own money would reduce your room for a shared plan. How would you approach it?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'es', 'Una compra personal. Usar tu dinero reduce el margen para un plan común. ¿Cómo lo abordarías?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'fr', 'Un achat personnel. Utiliser votre argent réduirait votre marge pour un projet commun. Comment avancer ?') on conflict (question_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_09_1', 1, '{"signals":{"FINANCES":0}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_09_1';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Calcularia meu limite individual antes de levar o tema à conversa.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Calculate my individual limit before discussing it.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Calcular mi límite individual antes de hablar.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Calculer ma limite individuelle avant d’en parler.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_09_2', 2, '{"signals":{"FINANCES":3}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_09_2';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Compararia com a outra pessoa os efeitos sobre o plano comum.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Compare the effects on our shared plan together.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Comparar juntos el efecto en el plan común.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Comparer ensemble l’impact sur notre projet commun.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_09_3', 3, '{"signals":{"FINANCES":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_09_3';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Manteria a compra e proporia ajustar minha contribuição depois.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Keep the purchase and propose adjusting my contribution later.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Mantener la compra y proponer ajustar mi aportación después.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Maintenir l’achat et proposer d’ajuster ma contribution ensuite.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_09_4', 4, '{"signals":{"FINANCES":2}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_09_4';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Proporia uma compra menor para preservar parte do combinado.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Suggest a smaller purchase to preserve part of the agreement.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Proponer una compra menor para preservar parte del acuerdo.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Proposer un achat plus petit pour préserver une partie de l’accord.') on conflict (option_id, locale) do nothing;
insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
        values (v_version, 'CD2_10', 10, 'SCENARIO', '{"dimension":"FUTURE_PLANS","difficulty":"MEDIUM"}'::jsonb)
        on conflict (quiz_version_id, stable_key) do nothing;
        select id into strict v_question from meqyro.questions where quiz_version_id = v_version and stable_key = 'CD2_10';
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'pt', 'Ritmos diferentes. Você gostaria de definir um próximo passo na relação; a outra pessoa pede mais tempo. Qual seria sua primeira atitude?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'en', 'Different timelines. You want to define a next step; your partner asks for more time. What is your first move?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'es', 'Ritmos distintos. Quieres definir un siguiente paso; tu pareja pide más tiempo. ¿Qué haces primero?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'fr', 'Des rythmes différents. Vous souhaitez définir une prochaine étape ; l’autre demande du temps. Votre premier geste ?') on conflict (question_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_10_1', 1, '{"signals":{"FUTURE_PLANS":0}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_10_1';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Esclareceria para mim o que consigo esperar.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Clarify for myself what waiting would mean.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Aclarar para mí qué puedo esperar.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Clarifier pour moi ce que je peux attendre.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_10_2', 2, '{"signals":{"FUTURE_PLANS":3}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_10_2';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Conversaria sobre necessidades e prazos possíveis para os dois.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Discuss both our needs and possible timelines.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Hablar de las necesidades y plazos posibles de ambos.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Discuter de nos besoins et des délais possibles.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_10_3', 3, '{"signals":{"FUTURE_PLANS":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_10_3';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Proporia uma data para voltarmos ao assunto, sem fechar a decisão.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Set a date to revisit it without deciding yet.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Fijar una fecha para retomarlo sin decidir aún.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Fixer une date pour en reparler sans décider encore.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_10_4', 4, '{"signals":{"FUTURE_PLANS":2}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_10_4';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Sugeriria um pequeno passo reversível antes de uma decisão maior.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Suggest a small reversible step before a bigger decision.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Sugerir un paso pequeño y reversible antes de uno mayor.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Proposer une petite étape réversible avant une grande décision.') on conflict (option_id, locale) do nothing;
insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
        values (v_version, 'CD2_11', 11, 'SCENARIO', '{"dimension":"COMMUNICATION","difficulty":"HARD"}'::jsonb)
        on conflict (quiz_version_id, stable_key) do nothing;
        select id into strict v_question from meqyro.questions where quiz_version_id = v_version and stable_key = 'CD2_11';
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'pt', 'Carinho em linguagens diferentes. Você gosta de palavras; a outra pessoa costuma demonstrar cuidado fazendo coisas. Como abordaria sua necessidade?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'en', 'Different expressions of affection. You like words; your partner often shows care through actions. How would you raise your need?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'es', 'Formas distintas de cariño. Te gustan las palabras; tu pareja suele cuidar con acciones. ¿Cómo expresarías tu necesidad?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'fr', 'Des expressions d’affection différentes. Vous aimez les mots ; l’autre montre son attention par des gestes. Comment exprimer votre besoin ?') on conflict (question_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_11_1', 1, '{"signals":{"COMMUNICATION":3}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_11_1';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Daria um exemplo concreto do que gostaria de ouvir e perguntaria sobre a preferência da outra pessoa.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Give an example of words I value and ask about their preference.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Dar un ejemplo de palabras que valoro y preguntar su preferencia.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Donner un exemple de mots appréciés et demander sa préférence.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_11_2', 2, '{"signals":{"COMMUNICATION":2}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_11_2';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Reconheceria os gestos e pediria um pequeno momento de conversa.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Acknowledge the gestures and ask for a short conversation.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Reconocer los gestos y pedir un breve momento para hablar.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Reconnaître les gestes et demander un court échange.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_11_3', 3, '{"signals":{"COMMUNICATION":0}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_11_3';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Observaria melhor meus sentimentos antes de fazer um pedido.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Explore my feelings before making a request.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Explorar mis emociones antes de hacer una petición.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Explorer mon ressenti avant de formuler une demande.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_11_4', 4, '{"signals":{"COMMUNICATION":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_11_4';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Testaria uma forma de expressar carinho e conversaria sobre ela depois.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Try one way of expressing affection and discuss it later.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Probar una forma de expresar cariño y comentarla después.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Tester une forme d’affection et en discuter ensuite.') on conflict (option_id, locale) do nothing;
insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
        values (v_version, 'CD2_12', 12, 'SCENARIO', '{"dimension":"LIFE_VALUES","difficulty":"HARD"}'::jsonb)
        on conflict (quiz_version_id, stable_key) do nothing;
        select id into strict v_question from meqyro.questions where quiz_version_id = v_version and stable_key = 'CD2_12';
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'pt', 'Privacidade e proximidade. Você quer um tempo sem mensagens durante uma atividade pessoal. A outra pessoa está acostumada a contato frequente. O que faria?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'en', 'Privacy and closeness. You want message-free time during a personal activity; your partner is used to frequent contact. What would you do?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'es', 'Privacidad y cercanía. Quieres tiempo sin mensajes en una actividad personal; tu pareja suele mantener contacto frecuente. ¿Qué harías?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'fr', 'Intimité et proximité. Vous souhaitez une activité sans messages ; l’autre préfère un contact fréquent. Que faites-vous ?') on conflict (question_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_12_1', 1, '{"signals":{"LIFE_VALUES":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_12_1';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Explicaria meu limite e avisaria quando estarei disponível.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Explain my boundary and when I will be available.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Explicar mi límite y cuándo estaré disponible.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Expliquer ma limite et mes disponibilités.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_12_2', 2, '{"signals":{"LIFE_VALUES":3}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_12_2';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Conversaria sobre segurança, privacidade e contato para construir um acordo.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Discuss reassurance, privacy and contact to build an agreement.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Hablar de tranquilidad, privacidad y contacto para acordarlo.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Discuter de réassurance, de vie privée et de contact pour convenir d’un accord.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_12_3', 3, '{"signals":{"LIFE_VALUES":2}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_12_3';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Proporia um aviso breve antes e depois da atividade.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Suggest a brief check-in before and after the activity.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Proponer un aviso breve antes y después.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Proposer un bref message avant et après.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_12_4', 4, '{"signals":{"LIFE_VALUES":0}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_12_4';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Definiria primeiro o espaço de que preciso e depois comunicaria.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'First define the space I need, then communicate it.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Definir primero el espacio que necesito y comunicarlo luego.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Définir d’abord l’espace nécessaire puis le communiquer.') on conflict (option_id, locale) do nothing;
insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
        values (v_version, 'CD2_13', 13, 'SCENARIO', '{"dimension":"CONFLICT_MANAGEMENT","difficulty":"HARD"}'::jsonb)
        on conflict (quiz_version_id, stable_key) do nothing;
        select id into strict v_question from meqyro.questions where quiz_version_id = v_version and stable_key = 'CD2_13';
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'pt', 'Desculpa recebida, incômodo presente. Depois de uma divergência, você recebe um pedido de desculpas, mas ainda está mexido. Como seguiria?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'en', 'An apology, lingering feelings. After a disagreement, you receive an apology but still feel unsettled. What comes next?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'es', 'Disculpas, pero sigue el malestar. Recibes una disculpa tras una diferencia y aún te afecta. ¿Cómo seguirías?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'fr', 'Des excuses, un malaise persistant. Après un désaccord, des excuses arrivent mais vous restez touché. Comment avancer ?') on conflict (question_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_13_1', 1, '{"signals":{"CONFLICT_MANAGEMENT":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_13_1';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Diria que preciso de tempo para processar e combinaria retomar.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Say I need processing time and agree to return.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Decir que necesito tiempo y acordar retomarlo.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Dire que j’ai besoin de temps et convenir de reprendre.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_13_2', 2, '{"signals":{"CONFLICT_MANAGEMENT":3}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_13_2';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Explicaria o que ainda me afeta e ouviria como a outra pessoa vê o episódio.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Explain what still affects me and hear their view.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Explicar qué me afecta aún y escuchar su perspectiva.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Expliquer ce qui me touche encore et écouter son point de vue.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_13_3', 3, '{"signals":{"CONFLICT_MANAGEMENT":2}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_13_3';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Agradeceria e proporia combinar uma ação concreta agora.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Acknowledge it and agree on a concrete next action now.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Agradecer y acordar una acción concreta ahora.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Reconnaître les excuses et convenir d’une action concrète maintenant.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_13_4', 4, '{"signals":{"CONFLICT_MANAGEMENT":0}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_13_4';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Organizaria meus sentimentos antes de dizer o que ainda falta.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Organise my feelings before saying what I still need.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Ordenar mis emociones antes de decir qué falta.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Clarifier mes émotions avant de dire ce qui manque.') on conflict (option_id, locale) do nothing;
insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
        values (v_version, 'CD2_14', 14, 'SCENARIO', '{"dimension":"FINANCES","difficulty":"HARD"}'::jsonb)
        on conflict (quiz_version_id, stable_key) do nothing;
        select id into strict v_question from meqyro.questions where quiz_version_id = v_version and stable_key = 'CD2_14';
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'pt', 'Rendas diferentes. Um plano compartilhado pesa mais no orçamento de uma pessoa. Você quer participar sem criar desconforto. Como começaria?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'en', 'Different incomes. A shared plan strains one budget more than the other. You want to join without discomfort. How would you start?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'es', 'Ingresos distintos. Un plan común pesa más en un presupuesto. Quieres participar sin incomodidad. ¿Cómo empezarías?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'fr', 'Des revenus différents. Un projet commun pèse davantage sur l’un des budgets. Comment commencer sans malaise ?') on conflict (question_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_14_1', 1, '{"signals":{"FINANCES":3}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_14_1';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Conversaria sobre limites e formas de dividir que ambos aceitem.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Discuss limits and splits both can accept.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Hablar de límites y repartos aceptables para ambos.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Discuter des limites et d’un partage acceptable pour les deux.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_14_2', 2, '{"signals":{"FINANCES":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_14_2';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Definiria minha contribuição possível e a apresentaria.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Define the contribution I can offer and present it.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Definir y presentar la aportación que puedo hacer.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Définir ma contribution possible et la présenter.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_14_3', 3, '{"signals":{"FINANCES":2}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_14_3';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Proporia um plano menor para testar um acordo simples.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Suggest a smaller plan to test a simple arrangement.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Proponer un plan menor para probar un acuerdo sencillo.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Proposer un projet plus petit pour tester un accord simple.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_14_4', 4, '{"signals":{"FINANCES":0}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_14_4';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Revisaria minhas despesas antes de abrir a negociação.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Review my expenses before opening negotiations.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Revisar mis gastos antes de negociar.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Revoir mes dépenses avant d’ouvrir la discussion.') on conflict (option_id, locale) do nothing;
insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
        values (v_version, 'CD2_15', 15, 'SCENARIO', '{"dimension":"FUTURE_PLANS","difficulty":"HARD"}'::jsonb)
        on conflict (quiz_version_id, stable_key) do nothing;
        select id into strict v_question from meqyro.questions where quiz_version_id = v_version and stable_key = 'CD2_15';
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'pt', 'Uma proposta em outra cidade. A pessoa com quem você se relaciona recebe uma oportunidade importante. Seus planos também seriam afetados. Qual seria sua primeira atitude?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'en', 'An offer in another city. Your partner gets an important opportunity that would affect your plans too. What is your first move?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'es', 'Una oferta en otra ciudad. Tu pareja recibe una oportunidad importante que afecta tus planes. ¿Qué harías primero?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'fr', 'Une offre dans une autre ville. L’autre reçoit une opportunité importante qui affecte aussi vos projets. Votre premier geste ?') on conflict (question_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_15_1', 1, '{"signals":{"FUTURE_PLANS":3}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_15_1';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Conversaria sobre impactos nos objetivos individuais e comuns.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Discuss effects on individual and shared goals.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Hablar del efecto sobre metas individuales y comunes.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Discuter des effets sur les objectifs individuels et communs.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_15_2', 2, '{"signals":{"FUTURE_PLANS":0}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_15_2';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Analisaria minhas próprias prioridades antes de apresentar limites.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Examine my priorities before presenting my boundaries.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Examinar mis prioridades antes de presentar mis límites.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Examiner mes priorités avant de présenter mes limites.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_15_3', 3, '{"signals":{"FUTURE_PLANS":2}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_15_3';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Proporia testar uma solução temporária antes da mudança.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Suggest a temporary trial before moving.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Proponer una prueba temporal antes de mudarnos.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Proposer une solution temporaire avant un déménagement.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_15_4', 4, '{"signals":{"FUTURE_PLANS":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_15_4';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Reuniria informações práticas para uma conversa posterior.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Gather practical information for a later conversation.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Reunir información práctica para hablar después.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Réunir des informations pratiques pour un échange ultérieur.') on conflict (option_id, locale) do nothing;
insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
        values (v_version, 'CD2_16', 16, 'SCENARIO', '{"dimension":"COMMUNICATION","difficulty":"HARD"}'::jsonb)
        on conflict (quiz_version_id, stable_key) do nothing;
        select id into strict v_question from meqyro.questions where quiz_version_id = v_version and stable_key = 'CD2_16';
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'pt', 'Uma semana pesada. A outra pessoa pede apoio; você também está esgotado e não sabe que ajuda ela espera. Como responderia?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'en', 'A heavy week. Your partner asks for support; you are exhausted too and unsure what help they want. How would you respond?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'es', 'Una semana pesada. Tu pareja pide apoyo; también estás agotado y no sabes qué necesita. ¿Cómo respondes?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'fr', 'Une semaine lourde. L’autre demande du soutien ; vous êtes épuisé et ignorez l’aide souhaitée. Votre réponse ?') on conflict (question_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_16_1', 1, '{"signals":{"COMMUNICATION":3}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_16_1';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Perguntaria que apoio faria diferença e diria como estou.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Ask what support would help and share how I am.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Preguntar qué apoyo ayudaría y contar cómo estoy.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Demander quel soutien aiderait et dire comment je vais.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_16_2', 2, '{"signals":{"COMMUNICATION":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_16_2';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Ofereceria um cuidado prático e combinaria conversar depois.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Offer practical care and arrange a later talk.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Ofrecer un cuidado práctico y hablar después.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Offrir une aide pratique et prévoir un échange ensuite.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_16_3', 3, '{"signals":{"COMMUNICATION":0}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_16_3';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Pediria um breve tempo para recuperar energia antes de escutar.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Ask for a short recovery period before listening.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Pedir un breve descanso antes de escuchar.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Demander un bref repos avant d’écouter.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_16_4', 4, '{"signals":{"COMMUNICATION":2}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_16_4';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Proporia uma conversa curta agora, deixando o restante para outro momento.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Have a short talk now and leave the rest for later.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Hablar un rato ahora y dejar el resto para otro momento.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Parler un peu maintenant et garder le reste pour plus tard.') on conflict (option_id, locale) do nothing;
insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
        values (v_version, 'CD2_17', 17, 'SCENARIO', '{"dimension":"LIFE_VALUES","difficulty":"HARD"}'::jsonb)
        on conflict (quiz_version_id, stable_key) do nothing;
        select id into strict v_question from meqyro.questions where quiz_version_id = v_version and stable_key = 'CD2_17';
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'pt', 'Uma diferença importante. Você descobre uma preferência de vida da outra pessoa que não compartilha. Ainda não há decisão urgente. Como exploraria o tema?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'en', 'An important difference. You discover a life preference you do not share, with no urgent decision needed. How would you explore it?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'es', 'Una diferencia importante. Descubres una preferencia de vida que no compartes y no urge decidir. ¿Cómo explorarías el tema?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'fr', 'Une différence importante. Une préférence de vie de l’autre diffère de la vôtre, sans urgence à décider. Comment l’explorer ?') on conflict (question_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_17_1', 1, '{"signals":{"LIFE_VALUES":0}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_17_1';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Refletiria sobre meus limites antes de voltar ao assunto.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Reflect on my boundaries before returning to it.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Reflexionar sobre mis límites antes de retomarlo.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Réfléchir à mes limites avant d’y revenir.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_17_2', 2, '{"signals":{"LIFE_VALUES":3}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_17_2';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Perguntaria o significado dessa preferência e compartilharia o meu.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Ask what the preference means and share my own view.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Preguntar qué significa y compartir mi visión.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Demander ce que cette préférence signifie et partager mon regard.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_17_3', 3, '{"signals":{"LIFE_VALUES":2}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_17_3';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Proporia uma experiência pequena que respeite os dois limites.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Try a small experience respecting both boundaries.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Probar una experiencia pequeña que respete ambos límites.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Tester une petite expérience respectant nos limites.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_17_4', 4, '{"signals":{"LIFE_VALUES":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_17_4';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Apresentaria meu ponto de vista e combinaria conversar com calma depois.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'State my view and arrange a calmer conversation later.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Explicar mi punto de vista y hablar con calma después.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Exposer mon point de vue et prévoir un échange plus calme.') on conflict (option_id, locale) do nothing;
insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
        values (v_version, 'CD2_18', 18, 'SCENARIO', '{"dimension":"CONFLICT_MANAGEMENT","difficulty":"HARD"}'::jsonb)
        on conflict (quiz_version_id, stable_key) do nothing;
        select id into strict v_question from meqyro.questions where quiz_version_id = v_version and stable_key = 'CD2_18';
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'pt', 'O assunto voltou. Uma divergência antiga reaparece quando há pouco tempo para conversar. O que você tende a fazer?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'en', 'The topic returns. An old disagreement resurfaces when there is little time. What would you tend to do?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'es', 'El tema vuelve. Reaparece una diferencia antigua cuando hay poco tiempo. ¿Qué sueles hacer?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'fr', 'Le sujet revient. Un ancien désaccord resurgit alors que le temps manque. Que faites-vous généralement ?') on conflict (question_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_18_1', 1, '{"signals":{"CONFLICT_MANAGEMENT":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_18_1';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Definir um momento para retomar depois de pensar melhor.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Set a time to return after reflection.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Fijar un momento para retomar tras reflexionar.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Fixer un moment pour reprendre après réflexion.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_18_2', 2, '{"signals":{"CONFLICT_MANAGEMENT":3}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_18_2';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Identificar juntos qual parte precisa de decisão hoje.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Identify together what needs a decision today.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Identificar juntos qué parte necesita decisión hoy.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Identifier ensemble ce qui doit être décidé aujourd’hui.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_18_3', 3, '{"signals":{"CONFLICT_MANAGEMENT":2}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_18_3';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Combinar uma solução provisória e revisar depois.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Agree on a temporary solution and review it later.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Acordar una solución provisional y revisarla luego.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Convenir d’une solution provisoire à revoir ensuite.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_18_4', 4, '{"signals":{"CONFLICT_MANAGEMENT":0}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_18_4';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Pedir tempo para esclarecer o que mudou para mim.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Ask for time to clarify what has changed for me.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Pedir tiempo para aclarar qué cambió para mí.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Demander du temps pour clarifier ce qui a changé pour moi.') on conflict (option_id, locale) do nothing;
insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
        values (v_version, 'CD2_19', 19, 'SCENARIO', '{"dimension":"FINANCES","difficulty":"HARD"}'::jsonb)
        on conflict (quiz_version_id, stable_key) do nothing;
        select id into strict v_question from meqyro.questions where quiz_version_id = v_version and stable_key = 'CD2_19';
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'pt', 'Ajuda à família e plano comum. Você quer ajudar um familiar com seu dinheiro, mas isso pode adiar um projeto a dois. Como encaminharia?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'en', 'Family help and a shared plan. You want to help a relative with your own money, possibly delaying a joint project. How would you proceed?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'es', 'Ayuda familiar y plan común. Quieres ayudar con tu dinero a un familiar y podría retrasar un proyecto compartido. ¿Cómo sigues?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'fr', 'Aide familiale et projet commun. Aider un proche avec votre argent pourrait retarder un projet à deux. Comment avancer ?') on conflict (question_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_19_1', 1, '{"signals":{"FINANCES":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_19_1';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Definiria quanto posso oferecer antes de discutir o impacto.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Set what I can offer before discussing the impact.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Fijar cuánto puedo ofrecer antes de hablar del efecto.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Définir mon aide possible avant d’en discuter l’effet.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_19_2', 2, '{"signals":{"FINANCES":3}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_19_2';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Conversaria sobre ajuda, limites e o efeito no plano compartilhado.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Discuss support, boundaries and effects on our shared plan.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Hablar de ayuda, límites e impacto en el plan común.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Discuter de l’aide, des limites et de l’impact sur le projet commun.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_19_3', 3, '{"signals":{"FINANCES":2}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_19_3';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Proporia uma ajuda menor para preservar parte do projeto.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Offer smaller support to preserve part of the project.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Proponer una ayuda menor para preservar parte del proyecto.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Proposer une aide plus petite pour préserver une partie du projet.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_19_4', 4, '{"signals":{"FINANCES":0}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_19_4';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Analisaria minhas responsabilidades e comunicaria uma proposta depois.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Review my responsibilities and communicate a proposal later.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Revisar mis responsabilidades y comunicar una propuesta después.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Revoir mes responsabilités puis communiquer une proposition.') on conflict (option_id, locale) do nothing;
insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key)
        values (v_version, 'CD2_20', 20, 'SCENARIO', '{"dimension":"FUTURE_PLANS","difficulty":"HARD"}'::jsonb)
        on conflict (quiz_version_id, stable_key) do nothing;
        select id into strict v_question from meqyro.questions where quiz_version_id = v_version and stable_key = 'CD2_20';
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'pt', 'Um plano que mudou. Uma meta comum deixou de fazer sentido para você, mas a outra pessoa ainda está animada. Qual seria seu primeiro passo?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'en', 'A plan changes. A shared goal no longer fits you, but your partner is still excited. What would you do first?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'es', 'Un plan cambia. Una meta común ya no encaja contigo, pero tu pareja sigue ilusionada. ¿Qué harías primero?') on conflict (question_id, locale) do nothing;
insert into meqyro.question_translations (question_id, locale, prompt)
          values (v_question, 'fr', 'Un projet change. Un objectif commun ne vous correspond plus mais enthousiasme encore l’autre. Votre premier geste ?') on conflict (question_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_20_1', 1, '{"signals":{"FUTURE_PLANS":0}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_20_1';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Entenderia sozinho o que mudou antes de abrir a conversa.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Understand what changed for me before discussing it.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Entender qué cambió para mí antes de hablar.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Comprendre ce qui a changé pour moi avant d’en parler.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_20_2', 2, '{"signals":{"FUTURE_PLANS":3}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_20_2';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Compartilharia a mudança e ouviria o significado da meta para a outra pessoa.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Share the change and hear what the goal means to them.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Compartir el cambio y escuchar qué significa la meta para la otra persona.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Partager ce changement et écouter le sens de l’objectif pour l’autre.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_20_3', 3, '{"signals":{"FUTURE_PLANS":2}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_20_3';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Proporia adaptar uma etapa para testar um novo caminho juntos.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Adapt one step to test a new path together.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Adaptar una etapa para probar un camino nuevo juntos.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Adapter une étape pour tester ensemble une nouvelle voie.') on conflict (option_id, locale) do nothing;
insert into meqyro.options (question_id, stable_key, position, scoring_value)
          values (v_question, 'CD2_20_4', 4, '{"signals":{"FUTURE_PLANS":1}}'::jsonb)
          on conflict (question_id, stable_key) do nothing;
          select id into strict v_option from meqyro.options where question_id = v_question and stable_key = 'CD2_20_4';
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'pt', 'Reuniria alternativas e pediria um momento para avaliá-las depois.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'en', 'Gather alternatives and arrange to review them later.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'es', 'Reunir alternativas y acordar revisarlas después.') on conflict (option_id, locale) do nothing;
insert into meqyro.option_translations (option_id, locale, label)
            values (v_option, 'fr', 'Réunir des alternatives et prévoir de les examiner ensuite.') on conflict (option_id, locale) do nothing;
end $$;
