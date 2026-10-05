-- Read-only inspection of the local homologation candidate; no personal data.
select q.slug, q.product_code, qv.version, qv.status,
       count(distinct qu.id) filter (where qu.active) as active_pool_items,
       count(distinct qu.id) filter (where qu.active and qu.scoring_key->>'dimension' = 'DELAYED_MEMORY') as memory_pool_items,
       count(distinct qt.locale) as translated_locales
from meqyro.quizzes q
join meqyro.quiz_versions qv on qv.quiz_id = q.id
left join meqyro.questions qu on qu.quiz_version_id = qv.id
left join meqyro.question_translations qt on qt.question_id = qu.id
where qv.status in ('APPROVED', 'PUBLISHED')
group by q.slug, q.product_code, qv.version, qv.status
order by q.slug;
