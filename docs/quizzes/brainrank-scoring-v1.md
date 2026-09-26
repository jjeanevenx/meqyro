# BrainRank — scoring v1.0

## Escopo

O BrainRank mede desempenho **dentro deste conjunto de 24 desafios**. Não estima QI e não compara com população geral.

## Blueprint

| Dimensão                  | Itens | Peso total |
| ------------------------- | ----: | ---------: |
| Reconhecimento de padrões |     4 |          4 |
| Raciocínio lógico         |     4 |          4 |
| Raciocínio numérico       |     4 |          4 |
| Atenção                   |     4 |          4 |
| Resolução de problemas    |     4 |          4 |
| Velocidade                |     4 |          4 |

Cada item possui uma única resposta correta e peso 1. A versão 1.0 não aplica bônus por velocidade nem penalidade por erro; isso evita premiar pressa e facilita explicação e reprodução.

## Cálculo

```text
raw_correct = soma de respostas corretas, 0..24
overall_score = arredondar(1000 × raw_correct / 24)
dimension_score = arredondar(100 × corretas_na_dimensão / 4)
strongest_dimension = maior dimension_score
```

Desempate de dimensão forte:

1. maior número de acertos nos itens de dificuldade alta;
2. menor mediana de tempo entre respostas corretas, descartando tempos abaixo de 2 s;
3. ordem estável do blueprint.

Tempo é descritivo, não altera o score v1.0. Uma sessão somente pontua depois de 24 respostas válidas. Respostas não reconhecidas tornam a sessão inválida para conclusão.

## Dados congelados no resultado

- `quiz_version=1.0`;
- `scoring_version=1.0`;
- IDs e versões dos 24 itens;
- respostas normalizadas;
- scores geral e por dimensão;
- regra de desempate aplicada;
- duração total e por item, separadas do score.

## Fixtures de referência

| Fixture           | Acertos | Geral | Dimensões                        | Mais forte                          |
| ----------------- | ------: | ----: | -------------------------------- | ----------------------------------- |
| `all-correct`     |      24 |  1000 | todas 100                        | padrões por ordem estável           |
| `none-correct`    |       0 |     0 | todas 0                          | padrões por ordem estável           |
| `balanced-half`   |      12 |   500 | todas 50                         | padrões por ordem estável           |
| `patterns-strong` |      16 |   667 | padrões 100; demais 60           | padrões                             |
| `tie-hard-items`  |      18 |   750 | padrões 75; lógica 75; demais 75 | dimensão com mais difíceis corretas |

As fixtures finais devem referenciar IDs reais das questões quando o banco de itens for aprovado.

## Conteúdo e qualidade

- Balancear dificuldade planejada: 8 fáceis, 10 médias, 6 difíceis.
- Evitar dependência cultural e vocabulário raro.
- Toda questão exige justificativa editorial da resposta.
- Questões visuais precisam de alternativa textual acessível equivalente.
- Mudança de resposta correta, peso, dimensão ou interpretação incrementa `scoring_version`.
