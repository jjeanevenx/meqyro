# Cobertura de templates de e-mail — 2026-11-01

## Achados

- O resultado salvo usa um único serviço para os sete testes. O commit `454ec8b` já enviava texto e HTML.
- O alias fixo de homologação ainda apontava para `1d949d4`, anterior ao template. Foi atualizado para o deployment do commit `454ec8b`; a publicação seguinte também deve atualizar explicitamente esse alias após READY.
- A função Supabase `deliver-report` versão 2 enviava o relatório como texto no corpo e HTML apenas no anexo.
- Recuperação, privacidade, confirmação de compra, reembolso, acesso a relatórios e mensagens CoupleDNA não tinham corpo HTML.

## Correção

O template visual agora é compartilhado entre o resultado salvo, todos os envios transacionais do Next.js e a função de entrega de relatório. O corpo dos relatórios pagos usa uma apresentação curta, com identificação do teste, pedido e botão de acesso; a versão em texto e o anexo completo são preservados.

Não foram alteradas as regras de consentimento, destinatário, pagamento, autorização, reserva ou idempotência.

## Validação automatizada

- Resultado salvo e recuperação: sete testes × quatro idiomas, via serviço SMTP real com transporte simulado.
- Relatório pago: sete testes × quatro idiomas, executando o handler da Edge Function com dependências simuladas, incluindo requisitos de CoupleDNA.
- Demais seis tipos de mensagem: quatro idiomas.
- Mensagem MIME gerada pelo Nodemailer: alternativa texto/HTML no corpo e anexo HTML separado.
- Escape de conteúdo e URLs; ausência de links de ação com protocolo inseguro.

Aceitação SMTP não comprova recebimento ou renderização em uma caixa real. A validação visual final deve usar o endereço fixo atualizado de HML e uma nova mensagem; mensagens recebidas anteriormente não mudam.
