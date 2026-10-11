# Validação de e-mail Hostinger

Remetente configurado: `Meqyro <admin@meqyro.com.br>`. Transporte: Nodemailer 10.0.16, SMTP com TLS na porta 465. Credenciais permanecem exclusivamente no servidor e na Supabase Function.

## Resultado local

- Typecheck, lint e build concluídos com sucesso.
- 307 testes passaram em 49 arquivos: 234 unitários, 34 do fluxo de homologação dos sete quizzes e 39 das demais integrações. Nenhum teste foi ignorado. A execução geral ficou sem progresso; a suíte foi concluída em grupos com um worker de threads, sem alterar os testes para contornar falhas.
- Pagamento simulado, relatório, envio com SMTP simulado, recuperação, reembolso e pacotes validados nos quatro idiomas. Testes específicos verificaram configuração TLS, autenticação, anexo UTF-8, bloqueio de envio concorrente e tratamento de falhas sem expor credenciais.
- Migração de reserva aplicada ao banco local.
- Supabase Edge Runtime iniciou a função com o import Nodemailer e retornou 401 para POST sem autenticação. Nenhum envio externo foi realizado.

## Ambiente remoto

As cinco variáveis SMTP, incluindo `SMTP_PASSWORD` como Secret, constam no Vercel Preview. O usuário confirmou a configuração na Supabase. As 18 migrações do schema foram aplicadas no projeto `zfdipjfgzkaqcbudfzub`, incluindo a reserva SMTP e as restrições Stripe. O seed foi carregado com os sete quizzes e traduções nos quatro idiomas. A função `deliver-report` foi publicada e está ACTIVE (versão 1).

A migração de compradores foi aplicada somente depois de verificar zero sessões/pedidos/grants, com uma guarda que aborta se existirem dados. A migração histórica de comércio foi aplicada juntamente com restrições Stripe, preservando os arquivos históricos.

Permanece pendente o novo deployment Preview e o recebimento real após compra Stripe em modo teste. A presença das credenciais não confirma autenticação SMTP nem entrega na caixa de entrada.

Configuração detalhada: [hostinger-email.md](../runbooks/hostinger-email.md).
