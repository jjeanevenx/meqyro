# Resultado pago e exercícios de memória

Implementado em 02/10/2026; validado no Supabase local. Publicação e envio real em produção pendentes.

## Entrega ao comprador

- Relatório com indicadores das respostas, explicações humanas e ações práticas, sem percentis populacionais inventados.
- Após pagamento confirmado e fulfillment: download de HTML independente, sem scripts ou arquivos externos. Pode ser guardado offline ou impresso em PDF pelo navegador. Inclui uma declaração digital de conclusão.
- A Supabase Function `deliver-report` envia o resultado completo no corpo e anexa o mesmo HTML. Hostinger SMTP é o provedor de envio dentro da função.
- Destinatário e pagamento são consultados no banco. A função autentica a chamada com segredo exclusivo de servidor de pelo menos 32 caracteres. Não envia para pedidos pendentes ou sem grant.
- O envio confirmado é persistido no pedido, com idempotência no provedor. A reconciliação repete entregas pendentes em lotes de cinco, priorizando pedidos não tentados e respeitando cinco minutos entre tentativas. Monitorar `paid_report_retry_failed`.
- Acesso online mantém o prazo existente de 24 meses a partir do grant. O arquivo baixado permanece com o comprador. Removida a promessa de acesso vitalício.

## Distribuição das perguntas

Atualização de 04/10/2026: BrainRank mantém 24 perguntas no total, sendo 21 de raciocínio e três de lembrança (posições 8, 16 e 24). FocusStyle mantém 20 no total, sendo 17 de perfil e três de lembrança (posições 7, 14 e 20). Os exercícios substituem perguntas, sem aumentar o total.

Antes de cada bloco, a interface convida apenas a observar uma sequência, frase ou associação. A exibição dura seis segundos (o texto mais longo, oito), sem botão para prolongá-la, sem anunciar a lembrança futura e sem instruções sobre anotações. Depois, segue automaticamente. O registro acontece no início da apresentação para que recarregar não reinicie a exibição; erros de rede ocultam o estímulo ao terminar o prazo e permitem repetir somente a gravação. Não é possível impedir capturas de tela ou anotações externas.

Memória mantém pontuação separada, de zero a três acertos. O BrainRank normaliza os indicadores pelo número real de itens de cada dimensão e o índice geral pelos 21 itens de raciocínio. Sessões antigas de 24 itens de raciocínio continuam compatíveis; sessões anteriormente atribuídas com 27/23 perguntas conservam seus itens. Os exercícios não constituem avaliação clínica.

## Publicação e aceite

1. Aplicar as migrações versionadas no projeto correto, incluindo `20261002120759_delayed_memory_exercises.sql`, `20261002123610_report_delivery_retry.sql` e `20261004215319_neutral_memory_observations.sql`. A última atualiza os estímulos para linguagem neutra nas versões aprovadas/publicadas. Novas versões devem usar o seed atualizado.
2. Configurar `REPORT_DELIVERY_SECRET` no servidor Next.js e o URL do Supabase correto. Nunca expor esse segredo com prefixo `NEXT_PUBLIC_`.
3. Nos secrets da função, configurar o mesmo `REPORT_DELIVERY_SECRET`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` e `EMAIL_FROM` (ver configuração em `hostinger-email.md`). O ambiente Supabase fornece `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`.
4. Com CLI autenticado e projeto confirmado:

```powershell
pnpm supabase secrets set --env-file <arquivo-seguro-de-segredos> --project-ref <projeto>
pnpm supabase functions deploy deliver-report --project-ref <projeto> --no-verify-jwt
```

O handler verifica o segredo dedicado antes de ler o corpo; esta função de servidor não aceita autenticação de usuário. Não reutilizar ou expor esse segredo.

5. Agendar a execução autenticada de `/api/cron/reconcile` no hosting para assegurar retentativas.
6. Em homologação, realizar compra controlada, conferir bloqueio antes do webhook, download, recebimento real e acentos no anexo; repetir webhook sem duplicação; simular falha e recuperação; reembolsar e confirmar bloqueio.

Segredos não devem ser versionados. Não houve publicação em produção, cobrança real ou envio externo nesta implementação.

## Evidências e limites

Integração com banco local validou os dois quizzes, três confirmações de estímulo, pontuações separadas, autenticação, pagamento pendente, download, expiração de acesso e reembolso. O handler real da função foi testado com banco/provedor simulados: autenticação, destinatário do pedido, anexo UTF-8 e prevenção de reenvio. O runtime local compilou e retornou 401 para chamada sem autenticação.

Revisão editorial dos demais produtos/idiomas, configuração externa e recebimento real permanecem critérios de abertura de vendas do plano geral.

## Entregas por comprador e participante

O ledger `report_deliveries` registra cada par pedido/sessão e é a referência de idempotência; timestamps antigos no pedido permanecem por compatibilidade. A fila retoma testes concluídos depois da compra e espera conclusão/autorização de ambos para CoupleDNA. As orientações específicas estão implementadas nos quatro idiomas. Aplicar migrations pendentes de comprador/entrega e seleção do grant mais recente conforme histórico remoto, sem alterar migrations existentes.
