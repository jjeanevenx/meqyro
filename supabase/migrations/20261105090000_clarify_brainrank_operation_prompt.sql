-- Clarify the wording only. Keep options, correct answer, and scoring unchanged.
update meqyro.question_translations as translation
set prompt = wording.prompt
from meqyro.questions as question
join meqyro.quiz_versions as version on version.id = question.quiz_version_id
join meqyro.quizzes as quiz on quiz.id = version.quiz_id,
(values
  ('pt', 'Uma operação com dois números segue esta regra: multiplique os dois números, some os dois números ao produto e acrescente 2. Qual é o resultado para os números 5 e 6?'),
  ('en', 'An operation on two numbers follows this rule: multiply the two numbers, add both numbers to the product, then add 2. What is the result for the numbers 5 and 6?'),
  ('es', 'Una operación con dos números sigue esta regla: multiplica los dos números, suma ambos números al producto y añade 2. ¿Cuál es el resultado para los números 5 y 6?'),
  ('fr', 'Une opération sur deux nombres suit cette règle : multipliez les deux nombres, ajoutez les deux nombres au produit, puis ajoutez 2. Quel est le résultat pour les nombres 5 et 6 ?')
) as wording(locale, prompt)
where translation.question_id = question.id
  and translation.locale::text = wording.locale
  and quiz.slug = 'brainrank'
  and version.status in ('APPROVED', 'PUBLISHED')
  and question.stable_key = 'BR_NUM_01';
