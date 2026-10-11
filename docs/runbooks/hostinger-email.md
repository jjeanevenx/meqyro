# E-mail pela Hostinger

O servidor Next.js envia mensagens transacionais por SMTP. A Supabase Function `deliver-report` envia o relatório pago completo no texto e como anexo HTML, após validar pagamento, acesso e destinatário.

## Configuração

Cadastrar as variáveis abaixo na Vercel, ambiente **Preview**, e em Supabase → projeto `zfdipjfgzkaqcbudfzub` → Edge Functions → Secrets:

| Variável        | Valor                                             |
| --------------- | ------------------------------------------------- |
| `SMTP_HOST`     | `smtp.hostinger.com`                              |
| `SMTP_PORT`     | `465`                                             |
| `SMTP_USER`     | `admin@meqyro.com.br`                             |
| `SMTP_PASSWORD` | Senha da caixa de e-mail, cadastrada privadamente |
| `EMAIL_FROM`    | `Meqyro <admin@meqyro.com.br>`                    |

Na Vercel, usar **Secret** para `SMTP_PASSWORD` e **Config** para os demais campos. Não usar prefixo `NEXT_PUBLIC_`. A senha é da caixa postal; não é a senha de acesso ao painel Hostinger.

Manter `REPORT_DELIVERY_SECRET` igual na Vercel e na Function, com pelo menos 32 caracteres. O Supabase fornece suas próprias variáveis `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` à Function.

## Publicação e teste

1. Confirmar que a caixa existe e que as configurações SMTP do hPanel correspondem ao servidor acima. Conferir SPF, DKIM e DMARC do domínio no painel Hostinger.
2. Aplicar as migrações pendentes, incluindo `20261011010059_smtp_report_delivery_claim.sql`. A migração reserva atomicamente cada envio e concede execução apenas a `service_role`.
3. Publicar novamente `deliver-report` e gerar um novo deployment Preview na Vercel. Alterar variáveis não atualiza deployments existentes.
4. Fazer uma compra Stripe em modo teste com destinatário autorizado. Conferir recebimento, pasta de spam, texto completo e acentos no anexo HTML; conferir também recuperação de sessão e convite CoupleDNA.
5. Repetir o webhook e verificar que um relatório já registrado como enviado não é reenviado. Simular falha SMTP e verificar recuperação pela reconciliação.

O transporte exige TLS na porta 465 e valida o certificado. A reserva de envio dura cinco minutos e bloqueia tentativas simultâneas. SMTP não oferece chave de idempotência: uma interrupção depois da aceitação pelo servidor, antes do registro no banco, pode causar duplicação numa retentativa. Verificar o ledger e os logs antes de reenviar manualmente nesses casos. Aceitação SMTP não confirma entrega na caixa de entrada.

`RESEND_API_KEY` deixou de ser necessária. Não registrar senhas em arquivos versionados, logs ou mensagens.
