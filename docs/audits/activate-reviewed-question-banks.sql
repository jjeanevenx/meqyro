-- Execute only after deploying matching reviewed-question code.
begin;
do $$ declare vid uuid; begin
    select v.id into strict vid from meqyro.quiz_versions v join meqyro.quizzes q on q.id=v.quiz_id where q.slug='brainrank' and v.version='1.3';
    if (select count(*) from meqyro.questions where quiz_version_id=vid and active) <> 108 then raise exception 'Incomplete reviewed bank brainrank'; end if;
    if (select scoring_version from meqyro.quiz_versions where id=vid) <> '1.3' then raise exception 'Unexpected scoring version'; end if;
    if exists(select 1 from meqyro.questions q cross join (values ('pt'),('en'),('es'),('fr')) l(locale)
      where q.quiz_version_id=vid and q.active and not exists(select 1 from meqyro.question_translations t where t.question_id=q.id and t.locale=l.locale and btrim(t.prompt)<>'')) then raise exception 'Missing reviewed prompt'; end if;
    if exists(select 1 from meqyro.questions q where q.quiz_version_id=vid and q.active and q.kind<>'LIKERT' and (select count(*) from meqyro.options o where o.question_id=q.id)<>4) then raise exception 'Incomplete reviewed options'; end if;
    if exists(select 1 from meqyro.questions q join meqyro.options o on o.question_id=q.id cross join (values ('pt'),('en'),('es'),('fr')) l(locale)
      where q.quiz_version_id=vid and q.active and not exists(select 1 from meqyro.option_translations t where t.option_id=o.id and t.locale=l.locale and btrim(t.label)<>'')) then raise exception 'Missing reviewed option label'; end if;
    update meqyro.quiz_versions set status='ARCHIVED' where quiz_id=(select quiz_id from meqyro.quiz_versions where id=vid) and id<>vid and status in ('APPROVED','PUBLISHED');
    update meqyro.quiz_versions set status='PUBLISHED',published_at=coalesce(published_at,now()) where id=vid;
  end $$;
do $$ declare vid uuid; begin
    select v.id into strict vid from meqyro.quiz_versions v join meqyro.quizzes q on q.id=v.quiz_id where q.slug='personality-map' and v.version='1.1';
    if (select count(*) from meqyro.questions where quiz_version_id=vid and active) <> 40 then raise exception 'Incomplete reviewed bank personality-map'; end if;
    if (select scoring_version from meqyro.quiz_versions where id=vid) <> '1.0' then raise exception 'Unexpected scoring version'; end if;
    if exists(select 1 from meqyro.questions q cross join (values ('pt'),('en'),('es'),('fr')) l(locale)
      where q.quiz_version_id=vid and q.active and not exists(select 1 from meqyro.question_translations t where t.question_id=q.id and t.locale=l.locale and btrim(t.prompt)<>'')) then raise exception 'Missing reviewed prompt'; end if;
    if exists(select 1 from meqyro.questions q where q.quiz_version_id=vid and q.active and q.kind<>'LIKERT' and (select count(*) from meqyro.options o where o.question_id=q.id)<>4) then raise exception 'Incomplete reviewed options'; end if;
    if exists(select 1 from meqyro.questions q join meqyro.options o on o.question_id=q.id cross join (values ('pt'),('en'),('es'),('fr')) l(locale)
      where q.quiz_version_id=vid and q.active and not exists(select 1 from meqyro.option_translations t where t.option_id=o.id and t.locale=l.locale and btrim(t.label)<>'')) then raise exception 'Missing reviewed option label'; end if;
    update meqyro.quiz_versions set status='ARCHIVED' where quiz_id=(select quiz_id from meqyro.quiz_versions where id=vid) and id<>vid and status in ('APPROVED','PUBLISHED');
    update meqyro.quiz_versions set status='PUBLISHED',published_at=coalesce(published_at,now()) where id=vid;
  end $$;
do $$ declare vid uuid; begin
    select v.id into strict vid from meqyro.quiz_versions v join meqyro.quizzes q on q.id=v.quiz_id where q.slug='careerfit' and v.version='v1.1.0';
    if (select count(*) from meqyro.questions where quiz_version_id=vid and active) <> 24 then raise exception 'Incomplete reviewed bank careerfit'; end if;
    if (select scoring_version from meqyro.quiz_versions where id=vid) <> 'v1' then raise exception 'Unexpected scoring version'; end if;
    if exists(select 1 from meqyro.questions q cross join (values ('pt'),('en'),('es'),('fr')) l(locale)
      where q.quiz_version_id=vid and q.active and not exists(select 1 from meqyro.question_translations t where t.question_id=q.id and t.locale=l.locale and btrim(t.prompt)<>'')) then raise exception 'Missing reviewed prompt'; end if;
    if exists(select 1 from meqyro.questions q where q.quiz_version_id=vid and q.active and q.kind<>'LIKERT' and (select count(*) from meqyro.options o where o.question_id=q.id)<>4) then raise exception 'Incomplete reviewed options'; end if;
    if exists(select 1 from meqyro.questions q join meqyro.options o on o.question_id=q.id cross join (values ('pt'),('en'),('es'),('fr')) l(locale)
      where q.quiz_version_id=vid and q.active and not exists(select 1 from meqyro.option_translations t where t.option_id=o.id and t.locale=l.locale and btrim(t.label)<>'')) then raise exception 'Missing reviewed option label'; end if;
    update meqyro.quiz_versions set status='ARCHIVED' where quiz_id=(select quiz_id from meqyro.quiz_versions where id=vid) and id<>vid and status in ('APPROVED','PUBLISHED');
    update meqyro.quiz_versions set status='PUBLISHED',published_at=coalesce(published_at,now()) where id=vid;
  end $$;
do $$ declare vid uuid; begin
    select v.id into strict vid from meqyro.quiz_versions v join meqyro.quizzes q on q.id=v.quiz_id where q.slug='focusstyle' and v.version='v1.1.0';
    if (select count(*) from meqyro.questions where quiz_version_id=vid and active) <> 23 then raise exception 'Incomplete reviewed bank focusstyle'; end if;
    if (select scoring_version from meqyro.quiz_versions where id=vid) <> 'v1' then raise exception 'Unexpected scoring version'; end if;
    if exists(select 1 from meqyro.questions q cross join (values ('pt'),('en'),('es'),('fr')) l(locale)
      where q.quiz_version_id=vid and q.active and not exists(select 1 from meqyro.question_translations t where t.question_id=q.id and t.locale=l.locale and btrim(t.prompt)<>'')) then raise exception 'Missing reviewed prompt'; end if;
    if exists(select 1 from meqyro.questions q where q.quiz_version_id=vid and q.active and q.kind<>'LIKERT' and (select count(*) from meqyro.options o where o.question_id=q.id)<>4) then raise exception 'Incomplete reviewed options'; end if;
    if exists(select 1 from meqyro.questions q join meqyro.options o on o.question_id=q.id cross join (values ('pt'),('en'),('es'),('fr')) l(locale)
      where q.quiz_version_id=vid and q.active and not exists(select 1 from meqyro.option_translations t where t.option_id=o.id and t.locale=l.locale and btrim(t.label)<>'')) then raise exception 'Missing reviewed option label'; end if;
    update meqyro.quiz_versions set status='ARCHIVED' where quiz_id=(select quiz_id from meqyro.quiz_versions where id=vid) and id<>vid and status in ('APPROVED','PUBLISHED');
    update meqyro.quiz_versions set status='PUBLISHED',published_at=coalesce(published_at,now()) where id=vid;
  end $$;
do $$ declare vid uuid; begin
    select v.id into strict vid from meqyro.quiz_versions v join meqyro.quizzes q on q.id=v.quiz_id where q.slug='decisiondna' and v.version='v1.1.0';
    if (select count(*) from meqyro.questions where quiz_version_id=vid and active) <> 4 then raise exception 'Incomplete reviewed bank decisiondna'; end if;
    if (select scoring_version from meqyro.quiz_versions where id=vid) <> 'v1' then raise exception 'Unexpected scoring version'; end if;
    if exists(select 1 from meqyro.questions q cross join (values ('pt'),('en'),('es'),('fr')) l(locale)
      where q.quiz_version_id=vid and q.active and not exists(select 1 from meqyro.question_translations t where t.question_id=q.id and t.locale=l.locale and btrim(t.prompt)<>'')) then raise exception 'Missing reviewed prompt'; end if;
    if exists(select 1 from meqyro.questions q where q.quiz_version_id=vid and q.active and q.kind<>'LIKERT' and (select count(*) from meqyro.options o where o.question_id=q.id)<>4) then raise exception 'Incomplete reviewed options'; end if;
    if exists(select 1 from meqyro.questions q join meqyro.options o on o.question_id=q.id cross join (values ('pt'),('en'),('es'),('fr')) l(locale)
      where q.quiz_version_id=vid and q.active and not exists(select 1 from meqyro.option_translations t where t.option_id=o.id and t.locale=l.locale and btrim(t.label)<>'')) then raise exception 'Missing reviewed option label'; end if;
    update meqyro.quiz_versions set status='ARCHIVED' where quiz_id=(select quiz_id from meqyro.quiz_versions where id=vid) and id<>vid and status in ('APPROVED','PUBLISHED');
    update meqyro.quiz_versions set status='PUBLISHED',published_at=coalesce(published_at,now()) where id=vid;
  end $$;
do $$ declare vid uuid; begin
    select v.id into strict vid from meqyro.quiz_versions v join meqyro.quizzes q on q.id=v.quiz_id where q.slug='moneydna' and v.version='v3.0.0';
    if (select count(*) from meqyro.questions where quiz_version_id=vid and active) <> 20 then raise exception 'Incomplete reviewed bank moneydna'; end if;
    if (select scoring_version from meqyro.quiz_versions where id=vid) <> 'behavioral-v2' then raise exception 'Unexpected scoring version'; end if;
    if exists(select 1 from meqyro.questions q cross join (values ('pt'),('en'),('es'),('fr')) l(locale)
      where q.quiz_version_id=vid and q.active and not exists(select 1 from meqyro.question_translations t where t.question_id=q.id and t.locale=l.locale and btrim(t.prompt)<>'')) then raise exception 'Missing reviewed prompt'; end if;
    if exists(select 1 from meqyro.questions q where q.quiz_version_id=vid and q.active and q.kind<>'LIKERT' and (select count(*) from meqyro.options o where o.question_id=q.id)<>4) then raise exception 'Incomplete reviewed options'; end if;
    if exists(select 1 from meqyro.questions q join meqyro.options o on o.question_id=q.id cross join (values ('pt'),('en'),('es'),('fr')) l(locale)
      where q.quiz_version_id=vid and q.active and not exists(select 1 from meqyro.option_translations t where t.option_id=o.id and t.locale=l.locale and btrim(t.label)<>'')) then raise exception 'Missing reviewed option label'; end if;
    update meqyro.quiz_versions set status='ARCHIVED' where quiz_id=(select quiz_id from meqyro.quiz_versions where id=vid) and id<>vid and status in ('APPROVED','PUBLISHED');
    update meqyro.quiz_versions set status='PUBLISHED',published_at=coalesce(published_at,now()) where id=vid;
  end $$;
do $$ declare vid uuid; begin
    select v.id into strict vid from meqyro.quiz_versions v join meqyro.quizzes q on q.id=v.quiz_id where q.slug='coupledna' and v.version='v3.0.0';
    if (select count(*) from meqyro.questions where quiz_version_id=vid and active) <> 20 then raise exception 'Incomplete reviewed bank coupledna'; end if;
    if (select scoring_version from meqyro.quiz_versions where id=vid) <> 'behavioral-v2' then raise exception 'Unexpected scoring version'; end if;
    if exists(select 1 from meqyro.questions q cross join (values ('pt'),('en'),('es'),('fr')) l(locale)
      where q.quiz_version_id=vid and q.active and not exists(select 1 from meqyro.question_translations t where t.question_id=q.id and t.locale=l.locale and btrim(t.prompt)<>'')) then raise exception 'Missing reviewed prompt'; end if;
    if exists(select 1 from meqyro.questions q where q.quiz_version_id=vid and q.active and q.kind<>'LIKERT' and (select count(*) from meqyro.options o where o.question_id=q.id)<>4) then raise exception 'Incomplete reviewed options'; end if;
    if exists(select 1 from meqyro.questions q join meqyro.options o on o.question_id=q.id cross join (values ('pt'),('en'),('es'),('fr')) l(locale)
      where q.quiz_version_id=vid and q.active and not exists(select 1 from meqyro.option_translations t where t.option_id=o.id and t.locale=l.locale and btrim(t.label)<>'')) then raise exception 'Missing reviewed option label'; end if;
    update meqyro.quiz_versions set status='ARCHIVED' where quiz_id=(select quiz_id from meqyro.quiz_versions where id=vid) and id<>vid and status in ('APPROVED','PUBLISHED');
    update meqyro.quiz_versions set status='PUBLISHED',published_at=coalesce(published_at,now()) where id=vid;
  end $$;
commit;
