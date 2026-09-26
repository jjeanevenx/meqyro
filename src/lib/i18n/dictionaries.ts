import type { Locale } from "./config";

type Dictionary = {
  nav: { discover: string; about: string; language: string; market: string };
  hero: { title: string; body: string; cta: string; note: string };
  brainrank: {
    label: string;
    title: string;
    body: string;
    duration: string;
    free: string;
    cta: string;
    disclaimer: string;
  };
  dimensions: string[];
};

const dictionaries: Record<Locale, Dictionary> = {
  pt: {
    nav: { discover: "Descobrir", about: "Como funciona", language: "Idioma", market: "Mercado" },
    hero: {
      title: "Descubra mais sobre você.",
      body: "Experiências rápidas que transformam curiosidade em clareza sobre como você pensa, decide e se relaciona.",
      cta: "Começar a descobrir",
      note: "Sem cadastro obrigatório",
    },
    brainrank: {
      label: "BrainRank",
      title: "Descubra como você raciocina.",
      body: "24 desafios para revelar seus padrões de lógica, atenção e resolução de problemas.",
      duration: "7–10 min",
      free: "Resultado básico grátis",
      cta: "Começar o desafio",
      disclaimer: "Não é um teste clínico de QI.",
    },
    dimensions: ["Padrões", "Lógica", "Números", "Atenção", "Problemas", "Velocidade"],
  },
  en: {
    nav: { discover: "Discover", about: "How it works", language: "Language", market: "Market" },
    hero: {
      title: "Discover more about you.",
      body: "Short experiences that turn curiosity into clarity about how you think, decide, and connect.",
      cta: "Start discovering",
      note: "No account required",
    },
    brainrank: {
      label: "BrainRank",
      title: "Discover how you reason.",
      body: "24 challenges that reveal your patterns in logic, attention, and problem solving.",
      duration: "7–10 min",
      free: "Free basic result",
      cta: "Start the challenge",
      disclaimer: "This is not a clinical IQ test.",
    },
    dimensions: ["Patterns", "Logic", "Numbers", "Attention", "Problems", "Speed"],
  },
  es: {
    nav: { discover: "Descubrir", about: "Cómo funciona", language: "Idioma", market: "Mercado" },
    hero: {
      title: "Descubre más sobre ti.",
      body: "Experiencias breves que convierten la curiosidad en claridad sobre cómo piensas, decides y conectas.",
      cta: "Empezar a descubrir",
      note: "Sin registro obligatorio",
    },
    brainrank: {
      label: "BrainRank",
      title: "Descubre cómo razonas.",
      body: "24 desafíos para revelar tus patrones de lógica, atención y resolución de problemas.",
      duration: "7–10 min",
      free: "Resultado básico gratis",
      cta: "Empezar el desafío",
      disclaimer: "No es una prueba clínica de CI.",
    },
    dimensions: ["Patrones", "Lógica", "Números", "Atención", "Problemas", "Velocidad"],
  },
  fr: {
    nav: {
      discover: "Découvrir",
      about: "Comment ça marche",
      language: "Langue",
      market: "Marché",
    },
    hero: {
      title: "Découvrez-en davantage sur vous.",
      body: "Des expériences courtes qui transforment la curiosité en clarté sur votre façon de penser, décider et créer des liens.",
      cta: "Commencer à découvrir",
      note: "Aucun compte requis",
    },
    brainrank: {
      label: "BrainRank",
      title: "Découvrez votre façon de raisonner.",
      body: "24 défis pour révéler vos schémas de logique, d’attention et de résolution de problèmes.",
      duration: "7–10 min",
      free: "Résultat de base gratuit",
      cta: "Commencer le défi",
      disclaimer: "Ce n’est pas un test clinique de QI.",
    },
    dimensions: ["Schémas", "Logique", "Nombres", "Attention", "Problèmes", "Vitesse"],
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
