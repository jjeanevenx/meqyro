# Personality Map — scoring v1.0

## Escopo

Perfil descritivo inspirado nas cinco grandes dimensões. Não diagnostica condição psicológica, não determina capacidade e não deve ser usado para seleção de pessoas.

## Blueprint

- 40 afirmações;
- 5 dimensões, 8 itens por dimensão;
- 4 itens diretos e 4 reversos por dimensão;
- escala Likert de 1 a 5.

Dimensões: abertura, conscienciosidade, extroversão, amabilidade e estabilidade emocional.

## Cálculo

```text
direct = resposta
reverse = 6 - resposta
dimension_mean = média dos 8 itens já orientados
dimension_score = arredondar(25 × (dimension_mean - 1))
```

O score por dimensão varia de 0 a 100. Não há score geral. O resultado usa faixas descritivas:

- 0–34: tendência menor;
- 35–65: tendência intermediária;
- 66–100: tendência maior.

Evitar rótulos “baixo”, “ruim”, “instável” ou deterministas. A interpretação deve mostrar vantagens, contextos e possíveis tensões de cada tendência.

## Validade e respostas incompletas

- Exigir as 40 respostas para concluir na v1.
- Alertar, sem invalidar automaticamente, se 36 ou mais respostas forem iguais.
- Registrar tempo extremamente curto como sinal de qualidade, sem alterar score ou bloquear.
- Não aplicar normas populacionais ou percentis até estudo metodológico documentado.

## Fixtures de referência

| Fixture                    | Respostas             | Resultado esperado    |
| -------------------------- | --------------------- | --------------------- |
| `all-neutral`              | todas 3               | cinco dimensões = 50  |
| `all-strong-after-reverse` | diretas 5, reversas 1 | cinco dimensões = 100 |
| `all-weak-after-reverse`   | diretas 1, reversas 5 | cinco dimensões = 0   |
| `mixed-midpoint`           | média orientada 3,5   | dimensão = 63         |

Mudanças em chave reversa, mapeamento de dimensão, fórmula ou faixa incrementam `scoring_version`.
