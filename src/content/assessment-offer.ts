import type { Locale } from "@/lib/i18n/config";

// Describe existing deliverables; do not imply validated IQ or relationship quality.
export const assessmentOffer: Record<
  Locale,
  {
    title: string;
    free: string;
    premium: string;
    example: string;
    exampleNote: string;
    scenarios: string;
    outcomes: Record<"brainrank" | "moneydna" | "coupledna", string>;
  }
> = {
  pt: {
    title: "O que você leva desta experiência",
    free: "Grátis: resumo do seu resultado na tela, sem cadastro ou cartão.",
    premium:
      "Opcional: relatório pago com explicações e sugestões práticas. O preço é mostrado antes de comprar.",
    example: "Veja uma situação do teste",
    exampleNote:
      "Exemplo de conteúdo. Nenhuma resposta é enviada aqui. Escolha o que faria na vida real; não há resposta certa ou errada.",
    scenarios: "20 situações do cotidiano",
    outcomes: {
      brainrank:
        "Explore como você lida com lógica, padrões e atenção em 24 desafios. Receba uma leitura do seu desempenho neste teste, sem rótulos de inteligência.",
      moneydna:
        "Explore suas prioridades ao gastar, guardar e planejar em 20 situações reais. Receba uma leitura dos padrões das suas escolhas, sem julgamento financeiro.",
      coupledna:
        "Explore comunicação, conflitos e planos em 20 situações reais. Comece individualmente; a comparação a dois exige conclusão, consentimento de ambos e pagamento confirmado.",
    },
  },
  en: {
    title: "What you take away",
    free: "Free: an on-screen result summary, without an account or card.",
    premium:
      "Optional: a paid report with explanations and practical suggestions. See the price before you buy.",
    example: "Preview a situation from the assessment",
    exampleNote:
      "Content example. No answer is submitted here. Choose what you would do in real life; there is no right or wrong answer.",
    scenarios: "20 everyday situations",
    outcomes: {
      brainrank:
        "Explore logic, patterns, and attention through 24 challenges. Get a reading of your performance on this assessment, without intelligence labels.",
      moneydna:
        "Explore your spending, saving, and planning priorities through 20 real-life situations. Get a reading of your choices without financial judgment.",
      coupledna:
        "Explore communication, conflict, and plans through 20 real-life situations. Start individually; a joint comparison requires completion, both participants’ consent, and confirmed payment.",
    },
  },
  es: {
    title: "Qué te llevas de esta experiencia",
    free: "Gratis: resumen del resultado en pantalla, sin cuenta ni tarjeta.",
    premium:
      "Opcional: informe de pago con explicaciones y sugerencias prácticas. Verás el precio antes de comprar.",
    example: "Conoce una situación del test",
    exampleNote:
      "Ejemplo de contenido. No se envía ninguna respuesta aquí. Elige lo que harías en la vida real; no hay respuestas correctas o incorrectas.",
    scenarios: "20 situaciones cotidianas",
    outcomes: {
      brainrank:
        "Explora lógica, patrones y atención en 24 retos. Recibe una lectura de tu desempeño en este test, sin etiquetas de inteligencia.",
      moneydna:
        "Explora tus prioridades al gastar, ahorrar y planificar en 20 situaciones reales. Recibe una lectura de tus elecciones sin juicios financieros.",
      coupledna:
        "Explora comunicación, conflictos y planes en 20 situaciones reales. Comienza individualmente; la comparación requiere que ambos terminen, den su consentimiento y se confirme el pago.",
    },
  },
  fr: {
    title: "Ce que cette expérience vous apporte",
    free: "Gratuit : un résumé du résultat à l’écran, sans compte ni carte bancaire.",
    premium:
      "Facultatif : un rapport payant avec des explications et des suggestions pratiques. Le prix est affiché avant l’achat.",
    example: "Découvrez une situation du questionnaire",
    exampleNote:
      "Exemple de contenu. Aucune réponse n’est envoyée ici. Choisissez ce que vous feriez au quotidien ; il n’y a pas de bonne ou de mauvaise réponse.",
    scenarios: "20 situations du quotidien",
    outcomes: {
      brainrank:
        "Explorez logique, motifs et attention à travers 24 défis. Découvrez votre performance à ce questionnaire, sans étiquette d’intelligence.",
      moneydna:
        "Explorez vos priorités de dépenses, d’épargne et de planification à travers 20 situations réelles, sans jugement financier.",
      coupledna:
        "Explorez communication, conflits et projets dans 20 situations réelles. Commencez individuellement ; la comparaison exige la participation complète, le consentement des deux personnes et un paiement confirmé.",
    },
  },
};
