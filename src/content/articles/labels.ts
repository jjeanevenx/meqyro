import type { Locale } from "@/lib/i18n/config";

type BlogLabels = {
  title: string;
  description: string;
  subtitle: string;
  back: string;
  readMore: string;
  minRead: string;
  takeaways: string;
  contents: string;
  related: string;
  sources: string;
  author: string;
  updated: string;
  test: string;
  ctaTitle: string;
  ctaDescription: string;
};

export const BLOG_LABELS: Record<Locale, BlogLabels> = {
  pt: {
    title: "Blog de autoconhecimento: mente, dinheiro e relacionamentos",
    description:
      "Guias de raciocínio lógico, comportamento financeiro e comunicação no casal. Explore seus hábitos e conheça os testes BrainRank, MoneyDNA e CoupleDNA.",
    subtitle:
      "Ideias para entender seus hábitos, fazer perguntas melhores e dar o próximo passo no autoconhecimento.",
    back: "Voltar ao blog",
    readMore: "Ler artigo completo",
    minRead: "min de leitura",
    takeaways: "O que levar desta leitura",
    contents: "Neste artigo",
    related: "Continue a leitura",
    sources: "Referências para aprofundar",
    author: "Equipe editorial Meqyro",
    updated: "Atualizado em",
    test: "Conhecer o teste",
    ctaTitle: "Leve a reflexão para a prática",
    ctaDescription:
      "Conheça o teste relacionado e confira os detalhes e as condições do relatório completo.",
  },
  en: {
    title: "Articles & Self-Discovery Guides",
    description: "Explore guides on reasoning, personality and decision-making with Meqyro.",
    subtitle: "Practical perspectives on how we think, decide and connect.",
    back: "Back to articles",
    readMore: "Read full article",
    minRead: "min read",
    takeaways: "Key takeaways",
    contents: "In this article",
    related: "Keep reading",
    sources: "Further reading",
    author: "Meqyro editorial team",
    updated: "Updated on",
    test: "Explore the assessment",
    ctaTitle: "Put your reflection into practice",
    ctaDescription:
      "Explore the related assessment and check the details and terms of its full report.",
  },
  es: {
    title: "Artículos y guías de autoconocimiento",
    description: "Explora guías sobre razonamiento, personalidad y toma de decisiones con Meqyro.",
    subtitle: "Ideas prácticas para entender cómo pensamos, decidimos y nos relacionamos.",
    back: "Volver a los artículos",
    readMore: "Leer artículo completo",
    minRead: "min de lectura",
    takeaways: "Ideas principales",
    contents: "En este artículo",
    related: "Sigue leyendo",
    sources: "Lecturas adicionales",
    author: "Equipo editorial Meqyro",
    updated: "Actualizado el",
    test: "Conocer la evaluación",
    ctaTitle: "Lleva la reflexión a la práctica",
    ctaDescription:
      "Conoce la evaluación relacionada y consulta los detalles y las condiciones del informe completo.",
  },
  fr: {
    title: "Articles et guides de connaissance de soi",
    description:
      "Découvrez des guides sur le raisonnement, la personnalité et la prise de décision avec Meqyro.",
    subtitle:
      "Des repères pratiques pour comprendre notre façon de penser, de décider et de communiquer.",
    back: "Retour aux articles",
    readMore: "Lire l’article complet",
    minRead: "min de lecture",
    takeaways: "Points à retenir",
    contents: "Dans cet article",
    related: "Poursuivre la lecture",
    sources: "Pour approfondir",
    author: "Équipe éditoriale Meqyro",
    updated: "Mis à jour le",
    test: "Découvrir l’évaluation",
    ctaTitle: "Passez de la réflexion à la pratique",
    ctaDescription:
      "Découvrez l’évaluation associée et consultez les détails et les conditions du rapport complet.",
  },
};
