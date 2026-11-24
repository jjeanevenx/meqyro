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

## Validação final

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

1. Consolidar as correções no candidato com o código compatível dos instrumentos revisados do preview (`aeb4d7b` ou sucessor), preservando o trabalho não commitado do checkout local `27b67f2`. Não publicar o checkout antigo sobre o catálogo v3.
2. Cadastrar os oito segredos próprios de Production na Vercel: SUPABASE_SECRET_KEY do projeto novo, TOKEN_SECURITY_SECRET, ADMIN_API_SECRET, CRON_SECRET, REPORT_DELIVERY_SECRET, STRIPE_SECRET_KEY LIVE, STRIPE_WEBHOOK_SECRET LIVE e SMTP_PASSWORD. Configurar na função Supabase o mesmo REPORT_DELIVERY_SECRET e a configuração SMTP correspondente. Não enviar valores pelo chat.
3. Conferir plano Vercel compatível com cron de cinco minutos, monitoramento, responsável por alertas, suporte e restauração de backup.
4. Repetir no candidato remoto o fluxo Stripe TEST hospedado → webhook → acesso → relatório → recebimento de email → recuperação em outro navegador, além do CoupleDNA bilateral e revogação.
5. Aprovar o candidato, ativar os instrumentos/preços revisados em transação, preparar e validar o deployment Production, então trocar DNS preservando email e conferir HTTPS/cookies/redirects. Cobrança real continua exigindo autorização específica.

O Supabase novo usa um bootstrap de schema e conteúdo DRAFT com histórico próprio. O schema-only não contém dados de usuários. Não reaplicar cegamente o seed ou as migrations históricas sobre esse baseline. As evidências SQL e a correspondência dos baselines precisam acompanhar o release.

## Evidências externas ao repositório

Pasta: `C:/Users/ingev/.codex/visualizations/2026/11/18/01a1ec3b-339d-74e1-a256-f75771e58f7f/`.

- `corrections-tests-stable.json`: suíte completa aprovada.
- `corrections-homologation-flow-stable.json`: 34 cenários locais persistidos com transportes controlados.
- `corrections-tests.json` e `corrections-tests-final.json`: execuções anteriores, preservadas com suas falhas.
- `corrections-result-recovery-mobile.png`: tela corrigida em 390 px.
- `production-schema-bootstrap.sql`: estrutura provisionada, sem INSERT/COPY de dados de usuário.
- `before-corrections/` e `before-corrections.patch`: referência do estado local anterior às correções.

Fontes: [limites de cron da Vercel](https://vercel.com/docs/schedules/cron-jobs/usage-and-pricing), [configuração de schemas do PostgREST](https://supabase.com/kb/troubleshooting/pgrst106-the-schema-must-be-one-of-the-following-error-when-querying-an-exposed-schema). Testes locais e metadados ACTIVE/READY não substituem aceite externo de vendas.
