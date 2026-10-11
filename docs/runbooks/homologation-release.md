# Execução da homologação

Supabase informado: `zfdipjfgzkaqcbudfzub`. Hosting: Vercel. Domínios: `meqyro.com` e `meqyro.com.br`. Nenhum deployment remoto foi realizado nesta entrega.

## Pendências de acesso

O conector Supabase atual negou acesso às consultas do projeto informado. O usuário confirmou que ainda não existe projeto Vercel; a equipe conectada é `JJE-APPS`. O checkout local está sem remote Git. Para criar o projeto, conectar um repositório com o candidato publicado ou autenticar a CLI para envio do código local. Conectar também uma conta autorizada ao Supabase. Não enviar chaves pelo chat.

## Preparar o ambiente

1. Confirmar que o banco é destinado à homologação, conferir histórico de migrations e fazer backup. Aplicar somente migrations pendentes, em ordem; não resetar nem editar migrations existentes. Investigar convites ativos duplicados antes dos novos índices, preservando participantes e consentimentos. Não aplicar seed cegamente sobre dados existentes.
2. Configurar variáveis de Preview conforme `.env.example`: URL HTTPS estável do ambiente, Supabase público e segredos de servidor, Stripe TEST, webhook, segurança de tokens, administração, reconciliação e entrega. Nunca colocar segredo em `NEXT_PUBLIC_*`.
3. Configurar na Supabase Function o SMTP Hostinger conforme `hostinger-email.md` e `REPORT_DELIVERY_SECRET` de pelo menos 32 caracteres, igual ao servidor. Aplicar também a migração de reserva SMTP. Publicar `deliver-report` no projeto correto e verificar autenticação própria, destinatário, grant e prevenção de envios simultâneos por pedido/sessão.
4. Registrar webhook Stripe TEST assinado apontando para o deployment. Conferir que a proteção do Preview permite essa chamada sem remover indiscriminadamente a proteção das demais rotas.
5. Executar tipagem, lint, formatação, testes com `REQUIRE_INTEGRATION_DB=true`, build e smoke. Publicar Preview vinculado ao projeto correto e registrar commit/deployment e CI. Usar a URL HTTPS do próprio ambiente antes do build para convites, e-mails e recuperação.
6. Testar reconciliação pela rota autenticada do ambiente; conferir suporte de agendamento no Preview e plano antes de depender de execução automática.

As migrations recentes de comprador/entrega e correção da fila são `20261004223516_buyer_entitlements_couple_delivery.sql` e `20261005023718_report_queue_latest_entitlement.sql`. Conferir RLS e grants com `docs/audits/homologation-release-security-query.sql` e exposição do schema `meqyro` no Data API.

## Aceite remoto

- [ ] Sete quizzes × quatro idiomas: conclusão, resultado parcial, compra TEST, relatório, download, recebimento em caixa postal e recuperação.
- [ ] BrainRank e FocusStyle: três lembranças dentro dos totais de 24/20; observação breve neutra e recarga sem prolongamento do estímulo.
- [ ] Stripe: sucesso, recusa, cancelamento, duplicação, confirmação antecipada e reembolso; testar BR/US/EU/GB independentemente do idioma.
- [ ] Pacotes: concluir outro teste após a compra, reconhecer acesso e entregar cada relatório sem duplicação.
- [ ] CoupleDNA em dois navegadores: convite, ambos os consentimentos, pagamento antes/depois da conclusão do parceiro, comparação e retirada de autorização.
- [ ] Celular e desktop: perguntas, progresso, checkout e relatório sem cortes ou rolagem horizontal.
- [ ] Revisão humana dos textos e promessas comerciais; nenhum diagnóstico clínico ou acesso vitalício.
- [ ] Operação: logs sem dados sensíveis, falha/reenvio de e-mail, reconciliação e rollback de deployment.

Uma compra habilita a comparação para os dois participantes; e-mail ao comprador. O relatório bilateral exige ambos os testes concluídos e autorizações ativas. Retirar autorização bloqueia comparação online, mas não recolhe anexos já enviados. Cookies não atravessam automaticamente os dois domínios: testar recuperação ao mudar de domínio.

Somente após aceite preparar abertura de vendas. Rollback de deployment não reverte banco; correções exigem novas migrations, sem reset ou exclusão de dados.
