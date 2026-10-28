-- BrainRank 1.2: add a varied story bank; preserve historical attempts and results.
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
do $$ declare v record; qid uuid; oid uuid; begin
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
-- Execution plan v2: no historical answer, question key or result changes.
create or replace function meqyro.brainrank_question_clock(
  p_session_id uuid, p_question_id uuid, p_submit boolean default false,
  p_option_id uuid default null, p_timeout boolean default false
) returns jsonb language plpgsql security invoker set search_path = '' as $$
declare
  s meqyro.quiz_sessions%rowtype;
  q meqyro.quiz_session_questions%rowtype;
  a meqyro.answers%rowtype;
  received_at timestamptz := clock_timestamp();
  elapsed integer;
  expired boolean;
  next_position integer;
  cue text;
begin
  select * into strict s from meqyro.quiz_sessions where id = p_session_id for update;
  if s.status not in ('CREATED','IN_PROGRESS') or s.expires_at <= received_at then
    raise exception 'Inactive session';
  end if;
  select * into strict q from meqyro.quiz_session_questions
    where session_id = p_session_id and question_id = p_question_id;
  if q.time_limit_seconds is null then raise exception 'Untimed question'; end if;
  select * into a from meqyro.answers where session_id = p_session_id and question_id = p_question_id;
  if found then
    return jsonb_build_object('answerStatus', a.answer_status, 'currentPosition', s.current_position,
      'questionStartedAt', q.question_started_at, 'questionExpiresAt', q.question_expires_at,
      'timeLimitSeconds', q.time_limit_seconds, 'serverNow', clock_timestamp(), 'answered', true);
  end if;
  if q.position <> s.current_position then raise exception 'Unexpected question'; end if;
  -- Identify cycles by their persisted positions, never by a particular story ID.
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
  if cue is not null and not (cue = any(coalesce(s.memory_exposures, array[]::text[]))) then
    raise exception 'Memory cue required';
  end if;
  if q.question_started_at is null then
    if p_submit then raise exception 'Question not started'; end if;
    q.question_started_at := clock_timestamp();
    q.question_expires_at := q.question_started_at + make_interval(secs => q.time_limit_seconds);
    update meqyro.quiz_session_questions set question_started_at = q.question_started_at,
      question_expires_at = q.question_expires_at where session_id = p_session_id and question_id = p_question_id;
  end if;
  if p_submit then
    expired := received_at >= q.question_expires_at;
    if p_timeout and not expired then raise exception 'Deadline not reached'; end if;
    if not expired and not exists (select 1 from meqyro.options where id = p_option_id and question_id = p_question_id) then
      raise exception 'Invalid option';
    end if;
    elapsed := case when expired then q.time_limit_seconds * 1000 else
      greatest(0, floor(extract(epoch from (received_at - q.question_started_at)) * 1000)::integer) end;
    insert into meqyro.answers(session_id, question_id, option_id, duration_ms, answer_status, answered_at)
      values(p_session_id, p_question_id, case when expired then null else p_option_id end,
        elapsed, case when expired then 'TIMEOUT' else 'ANSWERED' end, received_at);
    select least(q.position + 1, max(position)) into next_position
      from meqyro.quiz_session_questions where session_id = p_session_id;
    update meqyro.quiz_sessions set current_position = next_position, updated_at = clock_timestamp()
      where id = p_session_id;
    return jsonb_build_object('answerStatus', case when expired then 'TIMEOUT' else 'ANSWERED' end,
      'currentPosition', next_position, 'answered', true);
  end if;
  return jsonb_build_object('questionStartedAt', q.question_started_at,
    'questionExpiresAt', q.question_expires_at, 'timeLimitSeconds', q.time_limit_seconds,
    'serverNow', clock_timestamp(), 'answered', false);
end;
$$;
revoke all on function meqyro.brainrank_question_clock(uuid,uuid,boolean,uuid,boolean) from public, anon, authenticated;
grant execute on function meqyro.brainrank_question_clock(uuid,uuid,boolean,uuid,boolean) to service_role;

update meqyro.quiz_versions set status='ARCHIVED'
where quiz_id=(select id from meqyro.quizzes where slug='brainrank') and version in ('1.0','1.1');
