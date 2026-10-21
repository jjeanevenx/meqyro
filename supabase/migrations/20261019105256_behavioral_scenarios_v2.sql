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
