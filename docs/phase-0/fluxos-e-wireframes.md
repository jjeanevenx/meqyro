# Fluxos e wireframes — BrainRank PT-BR

## Princípios

- Uma decisão principal por tela.
- Começar em segundos, sem conta.
- Explicar duração, valor gratuito e uso de dados antes do início.
- Não usar urgência falsa, promessa científica ou bloqueio surpresa.
- Alvos de toque de no mínimo 44 × 44 px e conteúdo funcional em 360 px.

## Fluxo principal

```text
Landing
  → Iniciar
  → Questões 1–24
  → Revisão de incompletas (se houver)
  → Processamento do score
  → E-mail de entrega + consentimento opcional
  → Resultado gratuito
  → Paywall
  → Checkout InfinitePay
  → Retorno pendente
  → Confirmação server-to-server
  → Relatório premium
  → Cross-sell / compartilhar
```

## Estados alternativos obrigatórios

| Momento   | Estado                 | Resposta do produto                                    |
| --------- | ---------------------- | ------------------------------------------------------ |
| Quiz      | offline/erro ao salvar | manter resposta local, informar e tentar novamente     |
| Quiz      | retorno posterior      | restaurar progresso via cookie seguro                  |
| Conclusão | questão sem resposta   | listar quantidade e levar à primeira pendência         |
| E-mail    | inválido/duplicado     | erro inline ou vinculação idempotente                  |
| Checkout  | cancelado              | preservar resultado e oferecer tentar novamente        |
| Retorno   | webhook atrasado       | tela pendente com consulta limitada e e-mail posterior |
| Pagamento | falhou                 | mensagem neutra e nova tentativa sem duplicar pedido   |
| Acesso    | token expirado         | recuperação por e-mail sem revelar existência de conta |

## Wireframes de conteúdo

### 1. Landing

```text
MEQYRO                                      PT · BR

BrainRank
Descubra como você raciocina sob diferentes desafios.

24 desafios · 7–10 min · resultado básico grátis

[ Começar o desafio ]

Sem cadastro. Não é um teste clínico de QI.

O que você vai descobrir
Padrões · lógica · números · atenção · problemas · velocidade
```

### 2. Questão objetiva

```text
←                         7 de 24
────────────●────────────────────

Qual figura completa a sequência?

[ alternativa visual A ]
[ alternativa visual B ]
[ alternativa visual C ]
[ alternativa visual D ]

                 [ Continuar ]
```

Seleção e avanço são ações separadas para evitar toque acidental. O foco vai ao título da nova questão e a mudança é anunciada ao leitor de tela.

### 3. Captura de e-mail

```text
Seu resultado está pronto

Onde devemos salvar seu resultado?
[ seuemail@exemplo.com                       ]

□ Quero receber novos testes e ofertas da Meqyro.

[ Ver meu resultado gratuito ]

Usaremos seu e-mail para entregar e recuperar este resultado.
```

### 4. Resultado gratuito

```text
Seu BrainRank

782 / 1000

Seu ponto mais forte
Reconhecimento de padrões

Você identifica relações visuais com consistência,
especialmente quando a regra muda entre etapas.

[ Ver minha análise completa — R$ 12,90 ]

Inclui 6 dimensões, respostas explicadas e pontos a desenvolver.
```

### 5. Retorno de checkout

```text
Confirmando seu pagamento…

Isso normalmente leva alguns segundos.
Você pode fechar esta página; enviaremos o acesso por e-mail.

[ Tentar atualizar ]
```

O botão consulta o nosso servidor; nenhum parâmetro de retorno muda o acesso.

### 6. Premium

```text
Seu relatório BrainRank
782 / 1000

Padrões                  86  ████████░░
Lógica                   78  ███████░░░
Números                  72  ███████░░░
Atenção                  81  ████████░░
Problemas                76  ███████░░░
Velocidade               69  ██████░░░░

[ Ver análise ]
```

## Teste de protótipo

Roteiro com 5 participantes-alvo:

1. “Você viu este link no Instagram. Descubra o que receberá e comece.”
2. Responder três questões e voltar uma.
3. Explicar com as próprias palavras por que o e-mail é pedido.
4. Dizer o que é gratuito e o que custa R$ 12,90.
5. Após simulação de pagamento, localizar o relatório.

Sinais de aceite:

- 5/5 iniciam sem ajuda em até 20 segundos;
- 5/5 distinguem resultado gratuito de relatório premium;
- 4/5 entendem que marketing é opcional;
- 5/5 não interpretam BrainRank como diagnóstico/QI clínico;
- nenhum erro crítico de navegação, foco ou leitura em 360 px.
