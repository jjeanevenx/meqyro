-- Meqyro database seed - Catalog & Quiz Engine content
-- Auto-generated from src/content/quizzes

-- 1. Quizzes
insert into meqyro.quizzes (slug, product_code, active)
values ('brainrank', 'BRAINRANK', true), ('personality-map', 'PERSONALITY_MAP', true)
on conflict (slug) do update set active = true;

-- 2. Quiz Versions
insert into meqyro.quiz_versions (quiz_id, version, scoring_version, status, published_at)
select id, '1.0', '1.0', 'APPROVED'::meqyro.content_status, now() from meqyro.quizzes
on conflict (quiz_id, version) do update set status = 'APPROVED', scoring_version = '1.0';

-- 3. Product Prices
insert into meqyro.product_prices (quiz_id, market, currency, amount, active)
select q.id, price.market, price.currency, price.amount, true
from meqyro.quizzes q
cross join (values ('BR','BRL',1290),('US','USD',299),('EU','EUR',299),('GB','GBP',249)) as price(market,currency,amount)
where q.slug in ('brainrank', 'personality-map')
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
  where q.slug = 'brainrank' and qv.version = '1.0';

  -- Question 1: BR_PAT_01
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_PAT_01', 1, 'SINGLE_CHOICE', '{"dimension":"PATTERN_RECOGNITION","difficulty":"EASY"}'::jsonb, '{"clue":{"pt":"2 · 6 · 12 · 20 · ?","en":"2 · 6 · 12 · 20 · ?","es":"2 · 6 · 12 · 20 · ?","fr":"2 · 6 · 12 · 20 · ?"}}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key, metadata = excluded.metadata
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

  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'B', 2, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'C', 3, '{"isCorrect":true}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  values (v_quiz_version_id, 'BR_PAT_02', 2, 'SINGLE_CHOICE', '{"dimension":"PATTERN_RECOGNITION","difficulty":"MEDIUM"}'::jsonb, '{"clue":{"pt":"45° horário · 90° anti-horário · 135° horário · ?","en":"45° clockwise · 90° counter-clockwise · 135° clockwise · ?","es":"45° horario · 90° antihorario · 135° horario · ?","fr":"45° horaire · 90° anti-horaire · 135° horaire · ?"}}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key, metadata = excluded.metadata
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Observe a rotação dos ponteiros e indique o próximo passo:')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Observe the rotation pattern and indicate the next step:')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Observe la rotación de las manecillas e indique el siguiente paso:')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Observez le motif de rotation et indiquez l''étape suivante :')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '180° horário')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '180° clockwise')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '180° horario')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '180° horaire')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '180° anti-horário')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '180° counter-clockwise')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '180° antihorario')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '180° anti-horaire')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '225° horário')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '225° clockwise')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '225° horario')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '225° horaire')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '90° horário')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '90° clockwise')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '90° horario')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '90° horaire')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 3: BR_PAT_03
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_PAT_03', 3, 'SINGLE_CHOICE', '{"dimension":"PATTERN_RECOGNITION","difficulty":"MEDIUM"}'::jsonb, '{"clue":{"pt":"Linha 1: ▲ ▲ ● | Linha 2: ● ▲ ▲ | Linha 3: ▲ ● ?","en":"Row 1: ▲ ▲ ● | Row 2: ● ▲ ▲ | Row 3: ▲ ● ?","es":"Fila 1: ▲ ▲ ● | Fila 2: ● ▲ ▲ | Fila 3: ▲ ● ?","fr":"Ligne 1 : ▲ ▲ ● | Ligne 2 : ● ▲ ▲ | Ligne 3 : ▲ ● ?"}}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key, metadata = excluded.metadata
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Qual matriz de símbolos mantém a paridade de linhas e colunas?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Which symbol matrix maintains row and column parity?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', '¿Qué matriz de símbolos mantiene la paridad de filas y columnas?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Quelle matrice de symboles maintient la parité des lignes et colonnes ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'A', 1, '{"isCorrect":true}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '▲')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '▲')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '▲')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '▲')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'B', 2, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '●')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '●')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '●')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '●')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '■')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '■')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '■')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '■')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '◆')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '◆')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '◆')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '◆')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 4: BR_PAT_04
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_PAT_04', 4, 'SINGLE_CHOICE', '{"dimension":"PATTERN_RECOGNITION","difficulty":"HARD"}'::jsonb, '{"clue":{"pt":"Inversão vertical com incremento de vértices: 3→4, 4→5, 5→?","en":"Vertical flip with vertex increment: 3→4, 4→5, 5→?","es":"Inversión vertical con incremento de vértices: 3→4, 4→5, 5→?","fr":"Inversion verticale avec incrément de sommets : 3→4, 4→5, 5→?"}}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key, metadata = excluded.metadata
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Qual elemento preserva a transformação bidimensional combinada?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Which element preserves the combined two-dimensional transformation?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', '¿Qué elemento conserva la transformación bidimensional combinada?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Quel élément préserve la transformation bidimensionnelle combinée ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Pentágono invertido')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Inverted pentagon')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Pentágono invertido')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Pentagone inversé')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Hexágono invertido')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Inverted hexagon')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Hexágono invertido')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Hexagone inversé')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Heptágono direto')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Direct heptagon')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Heptágono directo')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Heptagone direct')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Octógono duplo')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'Double octagon')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Octágono doble')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Octogone double')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 5: BR_LOG_01
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_LOG_01', 5, 'SINGLE_CHOICE', '{"dimension":"LOGICAL_REASONING","difficulty":"EASY"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key, metadata = excluded.metadata
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

  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key, metadata = excluded.metadata
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

  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'A', 1, '{"isCorrect":true}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'B', 2, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key, metadata = excluded.metadata
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Quatro caixas rotuladas: apenas uma diz a verdade. Caixa 1: ''O ouro está aqui''. Caixa 2: ''O ouro não está aqui''. Caixa 3: ''O ouro está na Caixa 2''. Onde está o ouro se Caixa 1 e 3 mentem?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Four boxes labeled: only one tells the truth. Box 1: ''Gold is here''. Box 2: ''Gold is not here''. Box 3: ''Gold is in Box 2''. Where is the gold if Box 1 and 3 lie?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Cuatro cajas con etiquetas: solo una dice la verdad. Caja 1: ''El oro está aquí''. Caja 2: ''El oro no está aquí''. Caja 3: ''El oro está en Caja 2''. ¿Dónde está el oro si Caja 1 y 3 mienten?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Quatre boîtes étiquetées : une seule dit la vérité. Boîte 1 : ''L''or est ici''. Boîte 2 : ''L''or n''est pas ici''. Boîte 3 : ''L''or est dans la boîte 2''. Où est l''or si 1 et 3 mentent ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'B', 2, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'C', 3, '{"isCorrect":true}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key, metadata = excluded.metadata
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

  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key, metadata = excluded.metadata
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Qual valor preenche a interrogação? 3 × 4 = 21, 4 × 5 = 31, 5 × 6 = ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Which value replaces the question mark? 3 × 4 = 21, 4 × 5 = 31, 5 × 6 = ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', '¿Qué valor sustituye la interrogación? 3 × 4 = 21, 4 × 5 = 31, 5 × 6 = ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Quelle valeur remplace le point d''interrogation ? 3 × 4 = 21, 4 × 5 = 31, 5 × 6 = ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '41')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '41')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '41')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '41')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key, metadata = excluded.metadata
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

  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key, metadata = excluded.metadata
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

  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key, metadata = excluded.metadata
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

  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key, metadata = excluded.metadata
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

  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'B', 2, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'C', 3, '{"isCorrect":true}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key, metadata = excluded.metadata
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

  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'B', 2, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'C', 3, '{"isCorrect":true}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key, metadata = excluded.metadata
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

  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key, metadata = excluded.metadata
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

  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'B', 2, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'C', 3, '{"isCorrect":true}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key, metadata = excluded.metadata
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Três lâmpadas no teto são controladas por 3 interruptores na sala ao lado. Você pode entrar na sala das lâmpadas apenas uma vez. Como identificar qual interruptor controla qual lâmpada?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Three lamps in a room are controlled by 3 switches outside. You can enter the lamp room only once. How do you identify which switch controls which lamp?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', 'Tres lámparas son controladas por 3 interruptores fuera. Puedes entrar a la habitación solo una vez. ¿Cómo identificar qué interruptor corresponde a cada lámpara?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Trois lampes sont contrôlées par 3 interrupteurs extérieurs. Vous ne pouvez entrer dans la pièce qu''une fois. Comment identifier chaque interrupteur ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'A', 1, '{"isCorrect":true}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'B', 2, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key, metadata = excluded.metadata
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

  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'A', 1, '{"isCorrect":true}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'B', 2, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key, metadata = excluded.metadata
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

  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key, metadata = excluded.metadata
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

  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  values (v_quiz_version_id, 'BR_SPD_01', 21, 'SINGLE_CHOICE', '{"dimension":"SPEED","difficulty":"EASY"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key, metadata = excluded.metadata
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Qual símbolo aparece com MENOR frequência na linha: ◆ ▲ ● ◆ ▲ ◆ ● ▲ ◆ ● ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Which symbol appears with LOWEST frequency: ◆ ▲ ● ◆ ▲ ◆ ● ▲ ◆ ● ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', '¿Qué símbolo aparece con MENOR frecuencia: ◆ ▲ ● ◆ ▲ ◆ ● ▲ ◆ ● ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Quel symbole apparaît avec la PLUS FAIBLE fréquence : ◆ ▲ ● ◆ ▲ ◆ ● ▲ ◆ ● ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '◆ (losango)')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '◆ (diamond)')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '◆ (rombo)')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '◆ (losange)')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '▲ (triângulo)')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '▲ (triangle)')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '▲ (triángulo)')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '▲ (triangle)')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', '● (círculo)')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', '● (circle)')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', '● (círculo)')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', '● (cercle)')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'Todos aparecem igual')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'All appear equal')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'Todos aparecen igual')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'Tous apparaissent également')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 22: BR_SPD_02
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_SPD_02', 22, 'SINGLE_CHOICE', '{"dimension":"SPEED","difficulty":"MEDIUM"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key, metadata = excluded.metadata
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

  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'B', 2, '{"isCorrect":true}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key, metadata = excluded.metadata
  returning id into v_question_id;

  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'pt', 'Qual palavra é o anagrama direto de ''ROMA''?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'en', 'Which word is an exact anagram of ''AMOR''?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'es', '¿Qué palabra es anagrama directo de ''ROMA''?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;
  insert into meqyro.question_translations (question_id, locale, prompt)
  values (v_question_id, 'fr', 'Quel mot est un anagramme exact de ''AMOR'' ?')
  on conflict (question_id, locale) do update set prompt = excluded.prompt;

  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'A', 1, '{"isCorrect":true}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'AMOR')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'ROMA')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'AMOR')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'RAMO')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'B', 2, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'MORA')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'ROAM')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'MORA')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'MORA')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'C', 3, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'AROMA')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'ARMOR')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'AROMA')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'AROME')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
  returning id into v_option_id;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'pt', 'RAMAL')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'en', 'MORAL')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'es', 'RAMAL')
  on conflict (option_id, locale) do update set label = excluded.label;
  insert into meqyro.option_translations (option_id, locale, label)
  values (v_option_id, 'fr', 'MORAL')
  on conflict (option_id, locale) do update set label = excluded.label;

  -- Question 24: BR_SPD_04
  insert into meqyro.questions (quiz_version_id, stable_key, position, kind, scoring_key, metadata)
  values (v_quiz_version_id, 'BR_SPD_04', 24, 'SINGLE_CHOICE', '{"dimension":"SPEED","difficulty":"HARD"}'::jsonb, '{}'::jsonb)
  on conflict (quiz_version_id, stable_key) do update set scoring_key = excluded.scoring_key, metadata = excluded.metadata
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

  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'A', 1, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'B', 2, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'C', 3, '{"isCorrect":true}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
  insert into meqyro.options (question_id, stable_key, position, scoring_value)
  values (v_question_id, 'D', 4, '{"isCorrect":false}'::jsonb)
  on conflict (question_id, stable_key) do update set scoring_value = excluded.scoring_value
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
