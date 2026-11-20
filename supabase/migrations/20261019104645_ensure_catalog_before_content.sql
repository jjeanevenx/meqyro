-- Clean database replays run migrations before seed.sql. Historical content
-- migrations need these catalog identities to exist, starting with BrainRank 1.1.
-- Order this prerequisite immediately before the first such content migration.
-- Existing quiz identities, activation, versions, questions and results are untouched.
insert into meqyro.quizzes (slug, product_code, active)
values
  ('brainrank', 'BRAINRANK', false),
  ('personality-map', 'PERSONALITY_MAP', false),
  ('careerfit', 'CAREERFIT', false),
  ('moneydna', 'MONEYDNA', false),
  ('focusstyle', 'FOCUSSTYLE', false),
  ('decisiondna', 'DECISIONDNA', false),
  ('coupledna', 'COUPLEDNA', false)
on conflict (slug) do nothing;
