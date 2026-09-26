# Fase 6 — Conteúdo dos Sete Quizzes, Scoring & CoupleDNA Bilateral

**Data de validação:** 26/09/2026  
**Estado:** Concluído localmente; os sete quizzes editoriais da plataforma Meqyro estão plenamente modelados, versionados no banco, precificados por mercado/moeda regional e providos com seus respectivos motores de scoring, datasets multilíngues (PT, EN, ES, FR), rotas SSG pré-renderizadas e fluxo de consentimento bilateral com proteção de privacidade para o CoupleDNA.

## Catálogo dos 7 Quizzes Implementados

| #   | Quiz            | Slug              | Tipo de Questão   | Dimensões / Arquétipos Principais                                                |
| --- | --------------- | ----------------- | ----------------- | -------------------------------------------------------------------------------- |
| 1   | BrainRank       | `brainrank`       | Escolha Única     | Padrões, Lógica, Números, Atenção, Problemas, Velocidade                         |
| 2   | Personality Map | `personality-map` | Escala Likert     | Big Five: Abertura, Conscienciosidade, Extroversão, Amabilidade, Estabilidade    |
| 3   | CareerFit       | `careerfit`       | Escala Likert     | Âncoras: Técnico/Especialista, Gestão, Criatividade, Autonomia, Segurança, Causa |
| 4   | MoneyDNA        | `moneydna`        | Escala Likert     | Arquétipos: Construtor, Guardião, Estrategista, Aventureiro, Equilibrador        |
| 5   | FocusStyle      | `focusstyle`      | Escala Likert     | Estilos: Hiperfoco Imersivo, Modular Estruturado, Colaborativo, Sprint Reativo   |
| 6   | DecisionDNA     | `decisiondna`     | Cenários Práticos | Estilos Decisórios: Analítico, Intuitivo, Pragmático, Colaborativo               |
| 7   | CoupleDNA       | `coupledna`       | Escala Likert     | Comunicação, Valores de Vida, Gestão de Conflitos, Finanças, Planos Futuros      |

## Entregas de Engenharia

| Item                              | Estado    | Evidência                                                                                                                       |
| --------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------- |
| F6-01 Expansão do catálogo SQL    | Concluído | Migration `20260926050000_coupledna_bilateral.sql` com tabelas `couple_invites`, `couple_consents`, produtos e preços regionais |
| F6-02 Plugins de Scoring          | Concluído | `src/features/scoring/` com `careerfit.ts`, `moneydna.ts`, `focusstyle.ts`, `decisiondna.ts`, `coupledna.ts`                    |
| F6-03 Datasets Multilíngues       | Concluído | `src/content/quizzes/` com 100% de cobertura nos 4 idiomas (`pt`, `en`, `es`, `fr`)                                             |
| F6-04 CoupleDNA Bilateral         | Concluído | `couple-service.ts`, `POST /api/couple/invite` e `GET /api/couple/status/[code]` com trava estrita de privacidade               |
| F6-05 Trava Anti-Vazamento Couple | Concluído | Comparação retorna `bilateralUnlocked: false` até que ambos os participantes concluam e consintam                               |
| F6-06 Suporte no Engine           | Concluído | `session-service.ts` calcula score no servidor para todos os 7 slugs e gera relatórios parciais                                 |
| F6-07 SSG & Rotas Estáticas       | Concluído | 28 landings (7 quizzes × 4 idiomas) geradas via SSG com metadados únicos e JSON-LD Schema.org                                   |

## Validação executada

- **ESLint**: aprovado (zero erros e zero avisos).
- **TypeScript (`tsc --noEmit`)**: aprovado (zero erros de tipo).
- **Vitest**: 16 arquivos e 55 testes aprovados (`tests/unit/quizzes-catalog.test.ts`, `tests/unit/couple-bilateral.test.ts`), cobrindo:
  - Precisão dos cálculos de scoring dos 7 produtos.
  - Carregamento de perguntas nos 4 idiomas.
  - Ciclo de vida completo do convite do CoupleDNA (criação, aceite, bloqueio unilateral e liberação bilateral).
  - Isolamento de acesso contra terceiros em comparações de casal.
- **Next.js Production Build**: aprovado (Next.js 16.3.6 Turbopack) gerando 82 rotas estáticas e dinâmicas.
- **Smoke Test (`pnpm smoke`)**:
  - `GET /api/health` -> `200`
  - `GET /pt`, `/en`, `/es`, `/fr` -> `200`
  - `GET /pt/quizzes/brainrank` -> `200`
  - `GET /en/quizzes/personality-map` -> `200`
  - `GET /pt/quizzes/careerfit` -> `200`
  - `GET /en/quizzes/moneydna` -> `200`
  - `GET /pt/quizzes/focusstyle` -> `200`
  - `GET /es/quizzes/decisiondna` -> `200`
  - `GET /pt/quizzes/coupledna` -> `200`
  - `GET /pt/legal/privacy` -> `200`
  - `GET /pt/legal/terms` -> `200`
  - `GET /pt/privacy/data-request` -> `200`
  - `GET /pt/unsubscribe` -> `200`
  - `GET /pt/checkout` -> `200`
  - `GET /pt/checkout/success` -> `200`
  - `GET /pt/checkout/pending` -> `200`
  - `GET /pt/checkout/failed` -> `200`
  - `GET /sitemap.xml` -> `200`
  - `GET /robots.txt` -> `200`

## Critérios de Aceite da Fase 6 (PLANO_DE_IMPLEMENTACAO_MEQYRO_V1.md)

1. _Checklist Definition of Done completo por quiz/locale:_ **Aprovado.** Todos os 7 quizzes possuem conteúdo nos 4 idiomas, scoring versionado server-side, amostras de dimensões e metadados SEO específicos.
2. _CoupleDNA e consentimento bilateral:_ **Aprovado.** A comparação conjugal é criptograficamente associada ao código de convite e exige o consentimento explícito e individual de ambos os parceiros na tabela `meqyro.couple_consents` antes de liberar as pontuações e métricas comparativas.
