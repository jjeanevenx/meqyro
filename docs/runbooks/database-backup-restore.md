# Runbook: Backup, Restore e Disaster Recovery de Dados

**Versão:** 1.0  
**Data:** 26/09/2026

---

## 1. Estratégia de Backup

O banco de dados PostgreSQL opera na infraestrutura gerenciada Supabase com:
- **Snapshots diários automatizados** com retenção de 30 dias.
- **Point-in-Time Recovery (PITR)** habilitado com intervalo de WALs de até 7 dias.

---

## 2. Procedimento de Backup Manual (Logical Dump)

Para exportar o schema privado `meqyro` antes de migrações críticas ou manutenções:

```bash
# Dump apenas do schema meqyro (estrutura e dados)
pg_dump -h [HOST] -U postgres -d postgres -n meqyro -Fc -f meqyro_backup_$(date +%Y%m%d_%H%M%S).dump

# Dump apenas de definições (schema only)
pg_dump -h [HOST] -U postgres -d postgres -n meqyro --schema-only -f meqyro_schema.sql
```

---

## 3. Procedimento de Restauração (Restore Drill)

Em caso de corrupção ou perda acidental de dados:

```bash
# 1. Parar serviços Next.js para evitar escritas concorrentes
# 2. Restaurar o dump do schema meqyro em banco de homologação ou produção
pg_restore -h [HOST] -U postgres -d postgres --clean --if-exists meqyro_backup_YYYYMMDD.dump

# 3. Notificar o PostgREST para recarregar o schema cache
psql -h [HOST] -U postgres -d postgres -c "NOTIFY pgrst, 'reload schema';"

# 4. Validar integridade das 26 tabelas com RLS:
psql -h [HOST] -U postgres -d postgres -c "SELECT count(*) FROM pg_tables WHERE schemaname = 'meqyro' AND rowsecurity = true;"
# Esperado: 26 tabelas com rowsecurity = true
```
