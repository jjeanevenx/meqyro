# Correções e preparação de produção — 18/11/2026

As correções de código estão implementadas e validadas localmente. A estrutura de produção foi provisionada. **Vendas e publicação de Production ainda não estão liberadas.**

## Correções implementadas

- Fulfillment repetido retoma a ativação depois do commit do pagamento, preservando os efeitos únicos de atribuição e analytics.
- Marcador persistido `activation_completed_at` permite que o cron recupere pedidos FULFILLED com dependências de convite incompletas, inclusive ativações já iniciadas. Falhas individuais são registradas e movidas atrás das demais no lote seguinte.
- Ativação valida o vínculo com o pedido FULFILLED, usa o código/expiração realmente persistidos em concorrência, propaga falhas de grants/convite/consentimento e preserva autorização retirada. Slots expirados, cancelados ou revogados não são reabertos.
- Erros de consulta dos vínculos CoupleDNA não são interpretados como ausência de compra. A tela de resultado apresenta texto genérico localizado, uma tentativa de recarga da mesma sessão e acesso à recuperação por email, sem expor exceções internas.
- O hook de evidências não sobrescreve mais o arquivo histórico após erro de setup, execução parcial ou testes pulados. Novas evidências exigem um caminho explícito e todos os casos aprovados. A evidência histórica foi recuperada da versão em Git, contendo 34 casos; não é apresentada como aceite atual. As alterações não commitadas que existiam antes do hook esvaziá-la no turno anterior não puderam ser reconstruídas.
- O teste do seed valida o SQL sem reescrever o arquivo versionado. A formatação foi corrigida; arquivos gerados de Playwright/Next e metadados protegidos de agentes ficam fora da checagem de formatação do produto.
- A checagem de Production lista configurações ausentes/inválidas antes de iniciar o build, sem mostrar valores. O smoke exige banco conectado. A CI passa a incluir a branch development. O cron autenticado está configurado em `vercel.json`, a cada cinco minutos.

## Validação do checkout original

| Verificação                                   | Resultado                                                                                  |
| --------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Suíte completa com integração obrigatória     | **440/440 testes, 66 arquivos, zero falhas e zero skips**                                  |
| Regressões de recuperação de compra           | PASS, incluindo banco real, repetição e cron                                               |
| Preservação de consentimento revogado e prazo | PASS                                                                                       |
| TypeScript e ESLint                           | PASS                                                                                       |
| Prettier                                      | PASS                                                                                       |
| Build Next.js                                 | PASS                                                                                       |
| Smoke com banco conectado                     | PASS                                                                                       |
| Resultado indisponível em pt/en/es/fr         | Texto, links e recarga conferidos no navegador                                             |
| Tela de recuperação a 390 × 844               | Sem corte/overflow observado; captura externa                                              |
| Console do fluxo de recuperação               | Sem erros ou avisos retornados                                                             |
| Bundle cliente                                | 26 arquivos JS; nenhum segredo configurado ou padrão de gabarito identificado na varredura |

O fluxo de navegador foi: resultado indisponível → Tentar novamente mantendo a mesma sessão → Acessar meus relatórios. Não foram enviadas mensagens externas. Browser plugin específico indisponível; foi usado o conector Playwright então disponível, sem instalar dependências. Não se declara uma matriz completa de browsers/dispositivos.

As primeiras execuções encontraram a incompatibilidade do callback de hook do Vitest, corrigida, e TIMEOUTs causados pelo relógio local do WSL. Foi medido desvio de aproximadamente três minutos; após autorização explícita, `systemd-timesyncd` foi pausado, o horário alinhado e a suíte repetida sem alterar prazos, pontuação ou assertions. O `finally` restaurou o serviço e a leitura posterior confirmou `active`.

Ferramentas instaladas foram executadas diretamente porque o pnpm instalado tentava buscar a versão fixada e falhava no registry. Nenhuma dependência foi atualizada. O build precisou execução fora do sandbox para gravar diretórios gerados pelo Next.

## Candidato integrado

As correções e o trabalho funcional local foram integrados em um worktree gerenciado baseado em `aeb4d7b7cce9b1da2d81c59bb2f873f035ae9dbe`, preservando o diretório original e os instrumentos revisados v3. Branch local: `codex/production-recovery`. Diretório: `C:/Users/ingev/.codex/worktrees/production-recovery/meqyro`.

O candidato preserva a geração paginada de PDF da homologação e a dependência `pdf-lib` já fixada no lockfile. A instalação usou `pnpm install --frozen-lockfile --ignore-scripts`, sem alteração de versões ou lockfile. O atributo de Git fixa LF para evitar que o checkout do Windows altere a equivalência em bytes das migrations. Nenhuma migration histórica, questão, gabarito ou scoring mudou no diff.

A validação adicional identificou falhas no suporte de teste: o TextDecoder deste Node retornava controles para pontuação WinAnsi, e o transporte SMTP simulado codificava novamente anexos já em base64. A inspeção passou a usar a tabela Windows-1252 especificada e o transporte respeita a codificação informada pela função. As assertions de fidelidade foram mantidas; foi acrescentada uma regressão com bullets, aspas, acentos, euro e ligatura francesa. O smoke foi alinhado aos títulos atuais do blog.

A preparação do banco local de testes adicionou os sete instrumentos revisados, refinou o DRAFT BrainRank e os ativou apenas nesse ambiente. As versões anteriores e suas sessões foram preservadas. Isso não constitui ativação no novo Supabase Production, cujo catálogo continua DRAFT e inativo.

A suíte completa do candidato passou: **592/592 testes, 77 arquivos, zero falhas e zero skips**, com banco local obrigatório. A evidência dos 34 cenários foi gravada após aprovação integral. Build Next.js, smoke com banco conectado, TypeScript, ESLint e formatação também passaram. A varredura do bundle encontrou 26 arquivos JS, zero segredos configurados e zero padrões de gabarito. O serviço `systemd-timesyncd` foi restaurado e relido como `active` após a última execução.

## Produção provisionada

- Organização Supabase: `meqyro` / `hohuluqwdikcstawclnc`, confirmada pelo usuário.
- Projeto: `meqyro-prod` / `tmsdnerpaiqukxfpkmyo`, `us-east-1`, `ACTIVE_HEALTHY`. Custo informado para a criação: US$ 0/mês; não se garante ausência de custos futuros por mudança de plano ou uso.
- Estrutura: 32 tabelas com RLS; zero grants diretos de tabela para PUBLIC/anon/authenticated. Zero sessões e zero pedidos copiados.
- Conteúdo: sete instrumentos revisados, 239 perguntas, todos DRAFT; adicional de convite sem perguntas. Todos os quizzes e preços estão desativados até aceite e publicação do código correspondente.
- Advisors: 32 achados INFO de RLS sem policy, compatíveis com o modelo de acesso exclusivo pelo servidor; não foram retornados WARN/ERROR nessa leitura.
- Data API configurada para o schema privado. Probe com publishable key recebeu 401/42501 — permission denied for schema meqyro. Nenhum dado privado foi retornado.
- Edge Function `deliver-report` v1 está ACTIVE e executa autenticação própria por segredo dedicado. Probe sem segredo recebeu 401. Secrets SMTP/entrega ainda precisam de configuração e entrega externa ainda não foi testada.
- A migração de recuperação também foi aplicada e relida no Supabase HML (`zfdipjfgzkaqcbudfzub`). Ela não altera respostas ou resultados existentes.

Na Vercel, as três variáveis públicas de Production foram criadas e sua presença foi relida: NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Apontam para `https://meqyro.com` e o projeto novo. Também foi reaproveitada a configuração simples do remetente Hostinger já usado pelo projeto: SMTP_HOST, SMTP_PORT, SMTP_USER e EMAIL_FROM. Nenhuma senha ou segredo de Preview foi copiado.

Os domínios `meqyro.com`, `meqyro.com.br`, `www.meqyro.com` e `www.meqyro.com.br` estão vinculados ao projeto `meqyro`, equipe MEQYRO, com propriedade verificada. `meqyro.com` é o principal; os demais têm redirect 308 configurado para ele. Isso não comprova que DNS/SSL já atendem pela Vercel.

DNS atual consultado na Hostinger: ambos os apex apontam para `2.57.91.91`; www é CNAME para o respectivo apex. A Vercel recomenda, para esse projeto, os endereços IPv4 `216.198.79.1` e `64.29.17.1`, e CNAME `c5d5bcc74405e2f8.vercel-dns-017.com.`. Reconsultar imediatamente antes da troca, pois esses valores são específicos e podem mudar. Não houve alteração de zona, nameservers, MX, SPF, DKIM ou DMARC.

## O que ainda depende de configuração/aceite

1. Publicar e validar o candidato integrado em homologação protegida, preservando o código revisado de `aeb4d7b`. As correções estão na branch local `codex/production-recovery`, sem push ou deployment novo neste turno. Não publicar o checkout antigo sobre o catálogo v3.
2. A releitura de 19/11 confirmou os oito segredos de Production presentes na Vercel. O usuário confirmou no painel Supabase `REPORT_DELIVERY_SECRET`, `SMTP_PASSWORD`, os quatro remetentes por idioma e, em seguida, a importação das configurações SMTP básicas pelo arquivo complementado. Ainda falta validar autenticação e entrega SMTP reais e correspondência dos secrets entre provedores. Não enviar valores pelo chat.
3. Resolver a incompatibilidade entre o plano Vercel Hobby confirmado no painel e o cron de cinco minutos do candidato; conferir monitoramento, responsável por alertas, suporte e restauração de backup. Nenhum upgrade foi realizado.
4. Repetir no candidato remoto o fluxo Stripe TEST hospedado → webhook → acesso → relatório → recebimento de email → recuperação em outro navegador, além do CoupleDNA bilateral e revogação.
5. Aprovar o candidato, ativar os instrumentos/preços revisados em transação, preparar e validar o deployment Production, então trocar DNS preservando email e conferir HTTPS/cookies/redirects. Cobrança real continua exigindo autorização específica.

O Supabase novo usa um bootstrap de schema e conteúdo DRAFT com histórico próprio. O schema-only não contém dados de usuários. Não reaplicar cegamente o seed ou as migrations históricas sobre esse baseline. As evidências SQL e a correspondência dos baselines precisam acompanhar o release.

## Configuração Stripe Production em andamento

O usuário solicitou configurar Stripe Production e confirmou **J2E Solutions** como a conta a utilizar. A instalação da integração Stripe foi confirmada, mas a CLI ainda não tinha credenciais live e o painel autenticado apresentava somente a área restrita de teste. Ao selecionar a conta de produção, o Stripe exibiu “Crie sua conta real para sair da área restrita”. O usuário informou que concluirá a ativação diretamente no painel; a aba foi mantida para essa etapa.

O fluxo de autorização também mostrou **J2E Solutions** em Production, com seleção desabilitada e a mensagem “Você precisa verificar sua empresa para autorizar esta conta”. Portanto, a disponibilidade da conta live depende da verificação empresarial no Stripe; a conexão do sandbox não comprova essa habilitação. A autorização auxiliar não foi aprovada e sua aba foi fechada.

Nenhum destino live, chave live, cobrança ou mudança de DNS foi criado nesta etapa. A Vercel ainda apresentava `STRIPE_SECRET_KEY` e `STRIPE_WEBHOOK_SECRET` somente em Preview. O destino, versão de API e os seis eventos estão preparados em `stripe-production-desired-configuration.json`, fora do repositório, e o runbook de pagamentos foi atualizado. A aplicação usa preços inline do servidor, sem dependência de IDs fixos de catálogo Stripe.

A revisão automática recusou a criação de um executor com todos os recursos Stripe por ampliar o acesso além da configuração solicitada. Esse executor não foi criado. A tentativa de conexão auxiliar foi removida e a verificação foi limitada à interface do painel. A instalação oficial Stripe foi preservada.

Na retomada de 18/11, o painel principal de J2E Solutions mostrava tipo de empresa, dados pessoais e dados da empresa concluídos. Foi salva a categoria **Outros produtos digitais** com a descrição da venda avulsa de relatórios exploratórios e educativos da Meqyro. O Stripe marcou Produtos ou serviços como concluído e avançou para Dados públicos (66,7% da etapa empresarial). O telefone de suporte foi pré-preenchido a partir dos dados pessoais; o Stripe informa que aparecerá nos extratos e, pela opção atual, nos recibos e faturas. Foi solicitada confirmação específica antes de salvar essa divulgação. Identidade, banco, segurança e revisão final continuam pendentes no onboarding.

A releitura da Vercel ainda mostrou as duas variáveis Stripe somente em Preview. O DNS de `meqyro.com` continuava em `2.57.91.91`, com `misconfigured=true` para a Vercel. O destino live não deve receber eventos antes de o domínio servir a aplicação Production correta. Não houve troca de DNS ou cobrança.

Após autorização explícita do usuário para usar o telefone pré-preenchido, o contato foi salvo com a opção de exibição em recibos/faturas. A descrição no extrato e sua versão curta foram salvas como **MEQYRO**. O Stripe marcou a etapa de dados empresariais como concluída e abriu a verificação de identidade com documento com foto e selfie. Banco, proteção da conta e revisão/envio final ainda constavam pendentes. A aba foi mantida para que o usuário conclua essas etapas diretamente no Stripe. Dados pessoais e bancários não foram copiados para este relatório; nenhuma chave live ou destino de webhook foi criado nessa retomada.

Na conferência seguinte, o Stripe já marcava identidade, banco, proteção da conta e extras como concluídos. A revisão final permanecia em andamento, com a tela Editar pessoa aberta. O usuário informou que concluirá essa revisão e o envio final no próprio Stripe. O formulário pessoal foi preservado, sem alterações ou envio pelo agente. A liberação do modo live ainda não foi confirmada.

Após o usuário informar a conclusão, foi confirmado o painel live da conta J2E Solutions (URL sem `/test` e chave publicável live). Foram preparados dois rascunhos: chave **Meqyro Production - Vercel**, com Checkout Sessions em escrita e Charges and Refunds/Payment Intents em leitura; e destino **Meqyro Production**, snapshot da própria conta, API `2026-08-26.dahlia`, com os seis eventos do handler e URL `https://meqyro.com/api/webhooks/stripe`. O usuário autorizou explicitamente criar esses recursos e salvar seus segredos somente em Production na Vercel, mantendo o destino desativado até validar domínio e deployment.

A emissão da chave exigiu autenticação adicional. Após o usuário concluir a verificação por email, a chave **Meqyro Production - Vercel** foi criada na conta live `acct_1UJ5Rq6r3o8eejkY`. A revisão confirmou três permissões explícitas: Checkout Sessions com escrita, Charges and Refunds com leitura e Payment Intents com leitura. Nenhuma permissão de escrita para reembolsos, repasses ou transferências foi solicitada.

O destino **Meqyro Production**, ID `we_1UdJbC6r3o8eejkYtFTCY84Y`, foi criado e imediatamente **desativado** na interface. A releitura confirmou esse estado, o endpoint principal, o formato snapshot, a API `2026-08-26.dahlia` e os seis eventos exatos do runbook. Não houve entregas de eventos nessa conferência.

Os valores foram transferidos pela sessão de interface diretamente aos campos Secret da Vercel, sem gravação em arquivos ou exposição no chat. `STRIPE_SECRET_KEY` e `STRIPE_WEBHOOK_SECRET` foram salvos somente em **Production** no projeto `meqyro`; a confirmação de sucesso e a releitura dos metadados pelo conector validaram os dois registros Secret/Production. Os registros Secret/Preview existentes foram preservados. As capturas externas `stripe-production-vercel-secrets-saved.png` e `stripe-production-webhook-disabled.png` registram o resultado sem revelar os valores.

A Vercel informa que um novo deployment é necessário para incorporar os segredos. O webhook permanece desativado até validar deployment, DNS e HTTPS. A configuração live não comprova aceitação de todos os métodos/moedas, compra real, webhook recebido ou entrega de relatório. O plano Vercel exibido é Hobby, incompatível com o cron de cinco minutos do candidato. Não foram realizadas cobranças, mudanças de DNS, upgrade de plano ou deployment Production.

## Remetentes por idioma — atualização de 19/11/2026

O usuário optou por reutilizar os aliases existentes após a Hostinger recusar a criação de um sexto alias. Mapeamento configurado: pt → `relatorios@meqyro.com.br`, en → `hello@meqyro.com.br`, es → `ola@meqyro.com.br`, fr → `salut@meqyro.com.br`. Nenhum alias foi excluído e nenhum plano foi alterado. O login SMTP continua na caixa `admin@meqyro.com.br`.

As variáveis `EMAIL_FROM_PT`, `EMAIL_FROM_EN`, `EMAIL_FROM_ES` e `EMAIL_FROM_FR` foram salvas e relidas como Config/Production na Vercel. O resolvedor compartilhado pelo servidor e pela função usa `EMAIL_FROM` como fallback. A função `deliver-report` v6 está ACTIVE no Supabase Production; a releitura confirmou os arquivos e um POST sem autenticação recebeu 401. O deployment do aplicativo Next.js ainda está pendente.

A importação das quatro variáveis no Supabase foi autorizada, mas a credencial da CLI recebeu 403 na consulta e recusa de privilégios na gravação. O usuário então confirmou a importação pelo painel e forneceu captura com os quatro nomes e os secrets de entrega e SMTP. Os prefixos de SHA-256 dos quatro remetentes conferem com os valores esperados. A captura não exibe as configurações SMTP básicas, incluindo `SMTP_USER`, obrigatório no handler. O arquivo `vercel-production/email-aliases.env` foi complementado com `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER` e `EMAIL_FROM`, todos sem senhas, para concluir essa parte sem substituir os secrets privados.

O usuário confirmou depois a conclusão da importação complementada no Supabase. Essa configuração foi registrada como informada pelo usuário; a leitura automatizada de secrets continua sem acesso. Não houve envio de email real nem validação das credenciais privadas.

TypeScript, ESLint e build passaram. A suíte unitária passou com 527 testes em 61 arquivos. A tentativa de executar a suíte completa encontrou falhas de conexão com o banco local em testes de integração e foi interrompida; a evidência anterior de 592 testes não é uma nova execução desta alteração. A primeira tentativa de build foi bloqueada pelo sandbox ao criar diretórios em `.next`; a repetição autorizada fora dele passou. Nenhuma mensagem foi enviada para testar o SMTP real.

## Evidências externas ao repositório

### Aceite incremental de 20/11/2026

A CI do commit `ce7b4ce` concluiu com sucesso na execução [44778666800](https://github.com/jjeanevenx/meqyro/actions/runs/44778666800): instalação, formatação, lint, tipos, replay integral das migrations e seed em banco vazio, **611 testes em 78 arquivos**, build e smoke. Essa evidência confirma a correção do bootstrap do catálogo e substitui a pendência do replay descrita abaixo.

O Preview protegido `https://meqyro-6j3248cvg-meqyro.vercel.app` publicou o código funcional de `11543e7` por meio do commit derivado `0a991ad`. Apenas o agendamento foi retirado desse derivado de homologação para permitir o build no Hobby; a configuração de cinco minutos permanece no candidato de produção. O PR é [#1](https://github.com/jjeanevenx/meqyro/pull/1), ainda draft. Nenhum deploy Production ou DNS foi alterado.

O fluxo real de MoneyDNA pt percorreu as 20 questões, concluiu no servidor, salvou o e-mail de teste sem opt-in de marketing e exibiu o resultado preliminar com oferta premium bloqueada. O log de entrada da Hostinger confirmou uma mensagem entregue à caixa de teste às 17:03:30 UTC, sem classificação como spam. Isso comprova SMTP real para esse envio, não recuperação em outro navegador nem entrega premium.

A revisão desse envio revelou que `sendResultDeliveryEmail` não encaminhava `locale` ao transporte e, portanto, usava o remetente padrão. A correção repassa o idioma sem alterar login SMTP, destinatário ou autorização. A regressão dos quatro idiomas falhou antes da correção e passou depois, conferindo remetente e HTML tanto para resultado salvo quanto recuperação. A aceitação externa dos quatro aliases ainda depende do Preview atualizado e de novos envios.

A primeira CI do commit `11543e7` falhou antes dos testes: no banco vazio, a migração histórica `20261019104646_brainrank_content_v11.sql` não encontrava o catálogo que até então era criado apenas pelo seed posterior. O Postgres recusou `questions.quiz_version_id = null` (23502). Foi adicionada uma dependência anterior, `20261019104645_ensure_catalog_before_content.sql`, que insere apenas identidades de quiz ausentes, inativas e com `ON CONFLICT DO NOTHING`. Nenhuma migração existente, versão, pergunta ou gabarito foi alterado. Um ensaio transacional com rollback no HML confirmou zero inserções e preservação integral dos registros existentes. A validação de replay completo depende da nova execução da CI; não se declara essa etapa aprovada antecipadamente.

Atualização de 20/11: os quatro aliases foram cadastrados e relidos no Supabase HML pelo painel autenticado, preservando SMTP e secrets privados existentes. A função `deliver-report` HML foi atualizada para o bundle compartilhado de remetentes; os valores Config/Preview da Vercel também foram cadastrados. A verificação direcionada passou com 93 testes em três arquivos. O snapshot `preview-source-manifest.json` exclui `.env`, credenciais e o diretório de importação. O upload por arquivos foi interrompido por falha de revisão automática causada pelo limite de uso da sessão, sem novo deployment concluído; a publicação será retomada por uma referência Git identificável. Nenhuma mensagem de teste ou cobrança real foi executada nessa etapa.

Pasta: `C:/Users/ingev/.codex/visualizations/2026/11/18/01a1ec3b-339d-74e1-a256-f75771e58f7f/`.

- `corrections-tests-stable.json`: suíte completa aprovada do checkout original.
- `candidate-tests-stable.json`: suíte final integrada, 592/592 aprovados.
- `candidate-homologation-flow-stable.json`: 34 cenários integrados aprovados, com transportes controlados.
- `candidate-tests.json` e `candidate-tests-final.json`: execuções anteriores, preservadas com suas falhas.
- `candidate-validation-manifest.json` e `candidate-integrated.patch`: resumo de verificação e diff completo do candidato.
- `candidate-client-bundle-check.json`: varredura do bundle integrado.
- `production-bootstrap-manifest.json`: correspondência entre os baselines provisionados e suas fontes.
- `corrections-homologation-flow-stable.json`: 34 cenários locais persistidos com transportes controlados.
- `corrections-tests.json` e `corrections-tests-final.json`: execuções anteriores, preservadas com suas falhas.
- `corrections-result-recovery-mobile.png`: tela corrigida em 390 px.
- `production-schema-bootstrap.sql`: estrutura provisionada, sem INSERT/COPY de dados de usuário.
- `before-corrections/` e `before-corrections.patch`: referência do estado local anterior às correções.

Fontes: [limites de cron da Vercel](https://vercel.com/docs/schedules/cron-jobs/usage-and-pricing), [configuração de schemas do PostgREST](https://supabase.com/kb/troubleshooting/pgrst106-the-schema-must-be-one-of-the-following-error-when-querying-an-exposed-schema), [tabela Windows-1252](https://encoding.spec.whatwg.org/index-windows-1252.txt). Testes locais e metadados ACTIVE/READY não substituem aceite externo de vendas.
