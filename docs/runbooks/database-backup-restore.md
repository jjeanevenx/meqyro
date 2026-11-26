# Runbook: Backup, Restore e Disaster Recovery de Dados

**Versão:** 1.1

**Revisão:** 26/11/2026

**Estado:** procedimento documentado; restauração ainda não comprovada no candidato atual.

---

## 1. Estratégia de Backup

Antes da abertura de vendas, registrar no painel do projeto `meqyro-prod` (`tmsdnerpaiqukxfpkmyo`): plano contratado, backups disponíveis, retenção efetiva, último backup concluído e estado do PITR. Não há evidência registrada que permita afirmar retenção de 30 dias ou PITR habilitado nesse projeto.

Backups e retenção dependem do plano; PITR é um adicional dos planos pagos. Para projetos Free, a Supabase recomenda exportações regulares e cópia fora do provedor. Conferir a [documentação oficial de backups](https://supabase.com/docs/guides/platform/backups) e a configuração contratada antes de prometer recuperação.

Definir responsável, frequência, retenção e armazenamento privado criptografado, além de RPO (perda máxima de dados) e RTO (tempo máximo de recuperação). Um arquivo exportado ou um indicador de backup concluído não comprova restauração.

---

## 2. Procedimento de Backup Manual (Logical Dump)

Para exportar o schema privado `meqyro` antes de migrações críticas ou manutenções, usar `pg_dump` compatível com a versão do servidor. Configurar a conexão nomeada `meqyro_backup_source` e a autenticação em arquivos locais protegidos (`pg_service.conf`/`pgpass`); não colocar senha na linha de comando, no chat ou no repositório. Confirmar o projeto de origem antes de executar.

```bash
# Estrutura e dados do schema da aplicação; destino privado fora do Git.
pg_dump --dbname=service=meqyro_backup_source --schema=meqyro --format=custom --file="<diretorio-privado>/meqyro-backup.dump"

# Inspecionar o índice do arquivo, sem imprimir os dados dos usuários.
pg_restore --list "<diretorio-privado>/meqyro-backup.dump"
```

Exigir código de saída zero e registrar horário UTC, versões das ferramentas, tamanho, checksum e inventário de tabelas/RLS/policies/grants/functions/triggers/migrations e contagens de registros. Contagens usadas para comparação devem corresponder ao mesmo snapshot ou considerar escritas ocorridas durante a exportação.

Este dump cobre apenas `meqyro`: não é backup completo do projeto Supabase. Inventariar dependências em outros schemas, papéis/extensões, Storage e seus objetos, Auth, funções Edge e configurações externas. Credenciais devem ser recuperadas do gerenciador autorizado, separadamente do dump. Não enviar o arquivo de dados para Git, CI pública, chat ou suporte.

---

## 3. Procedimento de Restauração (Restore Drill)

O ensaio deve usar **um banco isolado, vazio e identificado**, com as dependências exigidas pelo dump. Nunca usar `meqyro-prod` ou o HML compartilhado como destino de ensaio. Antes de restaurar, comparar host, projeto e banco resolvidos com a origem e interromper se forem iguais ou se o destino contiver dados. A conexão `meqyro_restore_drill` deve apontar exclusivamente para esse destino.

```bash
# Somente após verificar identidade e ausência de dados no destino isolado.
# Sem --clean: não excluir estruturas existentes para fazer o ensaio passar.
pg_restore --dbname=service=meqyro_restore_drill --exit-on-error --single-transaction "<diretorio-privado>/meqyro-backup.dump"
```

Manter o destino sem credenciais Stripe/SMTP, sem agendadores ativos e sem comunicação externa durante o ensaio. Inspecionar no índice do dump funções/triggers que possam produzir efeitos externos antes da restauração; não disponibilizar esse banco à aplicação pública.

Após restauração sem erros:

1. Comparar inventário, contagens consistentes, constraints, índices, funções, triggers, policies, grants e RLS com a origem. O número de tabelas deriva do snapshot; não usar o valor histórico fixo de 26 como prova de integridade.
2. Conferir pedidos, grants, sessões e resultados históricos, preservando seus vínculos e estados. Confirmar que anon/authenticated não obtiveram acesso direto ao schema privado.
3. Executar smoke e cenários de recuperação no ambiente isolado com adaptadores de teste; não enviar mensagens, cobrar ou reproduzir webhooks reais.
4. Registrar duração, perda de dados observada, evidências sanitizadas, desvios e aprovação do responsável. Comparar com RPO/RTO definidos.

Restauração sobre Production exige um plano de incidente separado, backup do estado atual, interrupção coordenada das escritas, revisão do impacto e autorização explícita antes da troca. Este runbook não autoriza substituir ou apagar dados de Production.
