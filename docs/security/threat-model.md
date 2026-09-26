# Threat model inicial

## Fronteiras e ativos

- Tokens de sessão, recuperação e grant nunca aparecem em URL, log ou analytics.
- Preço, produto, provedor e resultado premium são resolvidos no servidor.
- O browser usa apenas a chave publicável; a chave secreta fica em módulos `server-only`.
- O schema `meqyro` começa privado, sem grants para `anon` ou `authenticated`.

## Ameaças e controles

| Ameaça                  | Controle da fundação                                           | Próximo gate                                 |
| ----------------------- | -------------------------------------------------------------- | -------------------------------------------- |
| Enumeração de resultado | Token opaco de 256 bits, hash persistido e UUID sem autoridade | Testes E2E de acesso na Fase 3               |
| CSRF                    | Cookies SameSite=Lax; mutações futuras validarão Origin/Host   | Implementar helper antes da primeira mutação |
| Replay de webhook       | Eventos idempotentes, assinatura e chave única por provedor    | Golden tests na Fase 4                       |
| Manipulação de preço    | Tabela editorial e resolução integral no servidor              | Revalidar no checkout e webhook              |
| Vazamento premium       | Grant separado de pagamento; schema privado                    | Testes negativos de autorização              |
| Vazamento em logs       | Logger estruturado com redação de campos sensíveis             | Integrar coletor no staging                  |

## Risco residual

O ambiente de preview e os projetos remotos de Supabase/Vercel dependem de credenciais e owners externos. Nenhuma rota sensível deve ser publicada antes da revisão de RLS, secrets e headers da Fase 7.
