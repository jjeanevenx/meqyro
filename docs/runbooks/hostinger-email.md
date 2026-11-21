# E-mail pela Hostinger

O servidor Next.js envia mensagens transacionais por SMTP. A Supabase Function `deliver-report` envia uma apresentação HTML com botão de acesso, o relatório pago completo na alternativa de texto e como anexo PDF, após validar pagamento, acesso e destinatário. O template visual compartilhado está em `src/lib/email/branded-template.ts`; incluir esse arquivo ao publicar a Function.

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

## Aliases de relatório por idioma — 19/11/2026

A caixa `admin@meqyro.com.br` permanece como usuário de autenticação SMTP. Após atingir o limite da caixa, o usuário escolheu reutilizar `hello`, `ola` e `salut`. O domínio é `meqyro.com.br`.

| Idioma | Variável        | Alias usado                |
| ------ | --------------- | -------------------------- |
| pt     | `EMAIL_FROM_PT` | `relatorios@meqyro.com.br` |
| en     | `EMAIL_FROM_EN` | `hello@meqyro.com.br`      |
| es     | `EMAIL_FROM_ES` | `ola@meqyro.com.br`        |
| fr     | `EMAIL_FROM_FR` | `salut@meqyro.com.br`      |

A criação de `reports` recebeu HTTP 409, `ERR_ALIAS_ACC_QUOTA_REACHED`, após a criação de `relatorios`. A releitura retornou cinco aliases ativos: `hello`, `noreply`, `ola`, `relatorios` e `salut`, todos vinculados à caixa principal. Nenhum alias existente foi excluído e nenhum plano foi alterado. `ola` foi reutilizado para espanhol ao adotar os três aliases existentes; o usuário pode mudar esse mapeamento por configuração.

O servidor Next.js e a função `deliver-report` compartilham `src/lib/email/sender.ts`, que seleciona a variável por idioma e usa `EMAIL_FROM` como fallback para idioma desconhecido ou valor ausente. A autenticação SMTP não muda. Configure as quatro variáveis também nos secrets de Edge Functions do Supabase; inclua `sender.ts` junto de `branded-template.ts` ao publicar a função. As variáveis de remetente são Config na Vercel e não devem receber prefixo `NEXT_PUBLIC_`.

O arquivo `vercel-production/email-aliases.env` contém as quatro configurações SMTP básicas (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `EMAIL_FROM`) e os quatro remetentes por idioma para importação, sem senhas. A existência do alias e os testes com SMTP simulado não comprovam que a Hostinger aceite o endereço como remetente real; validar o envio antes do release.

Estado confirmado em 19/11: os quatro remetentes foram cadastrados e relidos como Config/Production no projeto Vercel `meqyro`. A função `deliver-report` foi publicada como v6 em `meqyro-prod`, relida com os mesmos arquivos locais e recebeu HTTP 401 no probe sem autenticação. Após as importações pelo usuário, a listagem retorna a revisão v8 ACTIVE, com o mesmo hash do bundle validado. A releitura da Vercel confirmou todas as variáveis de Production esperadas presentes, sem ler os secrets. O aplicativo Next.js ainda precisa do deployment do candidato para usar a nova seleção.

A credencial disponível na CLI recebeu 403 na consulta de secrets e recusa de privilégios na tentativa de importar o arquivo com os quatro remetentes. Depois disso, o usuário confirmou a importação pelo painel e enviou captura com `REPORT_DELIVERY_SECRET`, `SMTP_PASSWORD` e os quatro remetentes. Os prefixos de SHA-256 visíveis dos quatro remetentes correspondem aos valores combinados. Como a captura não mostrava `SMTP_USER`, o arquivo foi complementado com as quatro configurações SMTP básicas. O usuário então confirmou a conclusão dessa importação também. Essa última confirmação é do usuário; o acesso automatizado aos secrets não foi restabelecido. Nenhum segredo privado foi extraído ou comparado entre provedores.

Validação do código: TypeScript, ESLint e build Next.js passaram, assim como 527 testes unitários em 61 arquivos. A execução completa foi interrompida após falhas de conexão com o banco local em testes de integração; não se declara a suíte completa aprovada nesta etapa. Nenhum email real foi enviado e nenhum alias existente foi removido.

## Publicação e teste

Atualização de 20/11, candidato `5b06652`: CI completa aprovada com 611 testes em 78 arquivos, build e smoke. O Preview estável já aponta para `dpl_GNwHCAY7A5Dirsw8Nzc6mNFqWu4b`, versão `223bff0e750a`. Quatro conclusões reais MoneyDNA e os logs de entrada da Hostinger confirmaram entrega dos remetentes pt/en/es/fr, todos sem spam. Isso valida o SMTP do servidor Next.js para resultado salvo; não comprova anexos premium enviados pela Edge Function.

O primeiro pedido Stripe TEST dessa revalidação foi confirmado e liberou acesso premium, mas a entrega do anexo recebeu 401 da função HML antes de reservar o envio. Sincronizar `REPORT_DELIVERY_SECRET` apenas entre **Vercel Preview** e **Supabase meqyro-hml**, gerar um novo Preview e repetir a entrega do pedido existente, sem cobrar novamente. Não alterar Production para corrigir essa divergência de HML. Conferir `report_deliveries.sent_at`, log de entrega e recebimento do anexo antes de concluir o aceite.

Em 21/11, essa divergência foi resolvida no Preview `dpl_FpN4oi7yJL57d86tkZbMEUp7xAcb`: função HTTP 200, ledger com envio confirmado e retentativa sem reenvio. A Hostinger registrou entrega às 03:22:12 UTC, porém **classificada como spam**. Validar cabeçalhos de autenticação, PDF e link antes de concluir entregabilidade. MX, SPF, DKIM e DMARC estão presentes na zona; não alterar registros ou liberar filtros sem evidência da causa. O webhook TEST continua pendente e não deve ser considerado comprovado pela reconciliação do pedido.

A inspeção posterior dessa mensagem confirmou **SPF/DKIM/DMARC pass** e `X-Spam: Yes`. O anexo recebido foi validado: quatro páginas A4, conteúdo completo, acentos legíveis e nenhuma sobreposição ou corte confirmado. A classificação do filtro continua pendente; não foi tratada como falha de DNS nem corrigida com alteração de políticas sem evidência. A recuperação pelo link em outro navegador aguarda o login Vercel no Edge, exigido apenas pela proteção da homologação.

Em 20/11/2026, os quatro remetentes por idioma foram salvos também no Supabase **meqyro-hml** (`zfdipjfgzkaqcbudfzub`) e relidos com os digests esperados. A função HML foi atualizada para o mesmo bundle de seleção de remetente já validado em Production. As configurações SMTP básicas e os dois secrets privados de HML foram preservados. Os quatro remetentes também estão cadastrados como Config/Preview na Vercel. A execução direcionada de SMTP, função de entrega e fallbacks passou com 93 testes em três arquivos. O envio SMTP externo continua pendente.

1. Confirmar que a caixa existe e que as configurações SMTP do hPanel correspondem ao servidor acima. Conferir SPF, DKIM e DMARC do domínio no painel Hostinger.
2. Aplicar as migrações pendentes, incluindo `20261011010059_smtp_report_delivery_claim.sql`. A migração reserva atomicamente cada envio e concede execução apenas a `service_role`.
3. Publicar novamente `deliver-report` e gerar um novo deployment Preview na Vercel. Alterar variáveis não atualiza deployments existentes. Após READY, conferir que `meqyro-git-development-meqyro.vercel.app` aponta para o novo deployment; um Preview publicado apenas em uma URL única não garante a atualização desse alias.
4. Fazer uma compra Stripe em modo teste com destinatário autorizado. Conferir recebimento, pasta de spam, texto completo e acentos no anexo HTML; conferir também recuperação de sessão e convite CoupleDNA.
5. Repetir o webhook e verificar que um relatório já registrado como enviado não é reenviado. Simular falha SMTP e verificar recuperação pela reconciliação.

O transporte exige TLS na porta 465 e valida o certificado. A reserva de envio dura cinco minutos e bloqueia tentativas simultâneas. SMTP não oferece chave de idempotência: uma interrupção depois da aceitação pelo servidor, antes do registro no banco, pode causar duplicação numa retentativa. Verificar o ledger e os logs antes de reenviar manualmente nesses casos. Aceitação SMTP não confirma entrega na caixa de entrada.

`RESEND_API_KEY` deixou de ser necessária. Não registrar senhas em arquivos versionados, logs ou mensagens.
