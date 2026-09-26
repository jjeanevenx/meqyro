import type { Locale } from "./config";

export type Dictionary = {
  nav: {
    discover: string;
    about: string;
    language: string;
    market: string;
    catalog: string;
    articles: string;
  };
  hero: {
    title: string;
    body: string;
    cta: string;
    note: string;
  };
  common: {
    back: string;
    continue: string;
    start: string;
    finish: string;
    previous: string;
    next: string;
    loading: string;
    error: string;
    retry: string;
    submit: string;
    cancel: string;
    question: string;
    of: string;
    copyLink: string;
    linkCopied: string;
    viewResult: string;
  };
  quizRunner: {
    questionProgress: string;
    finishQuiz: string;
    saving: string;
    calculatingScore: string;
    initError: string;
    sessionExpired: string;
    selectOptionToContinue: string;
    saveError: string;
  };
  leadCapture: {
    title: string;
    subtitle: string;
    emailPlaceholder: string;
    transactionalConsent: string;
    promotionalConsent: string;
    submitButton: string;
    submitting: string;
  };
  resultView: {
    freeTitle: string;
    overallScore: string;
    strongestDimension: string;
    allDimensions: string;
    unlockPremium: string;
    premiumUnlocked: string;
    disclaimer: string;
    shareTitle: string;
    noResultFound: string;
    startQuizCta: string;
  };
  checkout: {
    title: string;
    summary: string;
    immediateAccess: string;
    securePayment: string;
    payNow: string;
    processing: string;
    successTitle: string;
    successSubtitle: string;
    pendingTitle: string;
    pendingSubtitle: string;
    failedTitle: string;
    failedSubtitle: string;
    tryAgain: string;
  };
  privacy: {
    dataRequestTitle: string;
    dataRequestSubtitle: string;
    exportOption: string;
    deleteOption: string;
    rectifyOption: string;
    sendRequest: string;
    unsubscribeTitle: string;
    unsubscribeSuccess: string;
    unsubscribeButton: string;
  };
  quizzes: Record<
    string,
    {
      name: string;
      category: string;
      tagline: string;
      duration: string;
    }
  >;
  brainrank: {
    label: string;
    featuredLabel: string;
    title: string;
    body: string;
    duration: string;
    free: string;
    cta: string;
    disclaimer: string;
    exploreAll: string;
  };
  dimensions: string[];
};

export const dictionaries: Record<Locale, Dictionary> = {
  pt: {
    nav: {
      discover: "Descobrir",
      about: "Como funciona",
      language: "Idioma",
      market: "Mercado",
      catalog: "Catálogo",
      articles: "Artigos",
    },
    hero: {
      title: "Descubra mais sobre você.",
      body: "Experiências rápidas que transformam curiosidade em clareza sobre como você pensa, decide e se relaciona.",
      cta: "Começar a descobrir",
      note: "Sem cadastro obrigatório",
    },
    common: {
      back: "Voltar",
      continue: "Continuar",
      start: "Iniciar",
      finish: "Concluir",
      previous: "Anterior",
      next: "Próxima",
      loading: "Carregando...",
      error: "Ocorreu um erro",
      retry: "Tentar novamente",
      submit: "Enviar",
      cancel: "Cancelar",
      question: "Pergunta",
      of: "de",
      copyLink: "Copiar link",
      linkCopied: "Link copiado!",
      viewResult: "Ver Resultado",
    },
    quizRunner: {
      questionProgress: "Pergunta {current} de {total}",
      finishQuiz: "Concluir Teste e Ver Resultado",
      saving: "Salvando...",
      calculatingScore: "Calculando sua pontuação no servidor...",
      initError: "Não foi possível carregar as perguntas do quiz.",
      sessionExpired: "Sua sessão expirou. Deseja reiniciar?",
      selectOptionToContinue: "Selecione uma opção para continuar.",
      saveError: "Não foi possível salvar sua resposta. Tente novamente.",
    },
    leadCapture: {
      title: "Salve seu resultado",
      subtitle:
        "Informe seu e-mail para receber o link seguro do seu relatório e não perder seu progresso.",
      emailPlaceholder: "seu.email@exemplo.com",
      transactionalConsent:
        "Concordo com os Termos de Uso e Política de Privacidade e autorizo o envio do meu resultado por e-mail.",
      promotionalConsent:
        "Desejo receber novidades, novos testes e conteúdos exclusivos por e-mail (opcional).",
      submitButton: "Ver Meu Resultado",
      submitting: "Salvando...",
    },
    resultView: {
      freeTitle: "Resultado Preliminar Gratuito",
      overallScore: "Pontuação Geral",
      strongestDimension: "Dimensão em Destaque",
      allDimensions: "Mapeamento das Dimensões",
      unlockPremium: "Desbloquear Relatório Completo",
      premiumUnlocked: "Acesso Premium Desbloqueado",
      disclaimer:
        "Este teste destina-se ao autoconhecimento e reflexão pessoal, sem caráter diagnóstico, clínico ou financeiro.",
      shareTitle: "Compartilhe seu resultado",
      noResultFound: "Nenhum resultado recente encontrado",
      startQuizCta: "Iniciar Desafio",
    },
    checkout: {
      title: "Finalizar Compra",
      summary: "Resumo do Pedido",
      immediateAccess: "Acesso imediato e vitalício após confirmação",
      securePayment: "Ambiente criptografado e seguro",
      payNow: "Pagar Agora",
      processing: "Processando pagamento...",
      successTitle: "Pagamento Confirmado!",
      successSubtitle: "Seu relatório analítico foi desbloqueado com sucesso.",
      pendingTitle: "Pagamento em Processamento",
      pendingSubtitle: "Aguardando confirmação da instituição financeira para liberar o acesso.",
      failedTitle: "Pagamento Não Concluído",
      failedSubtitle: "Houve um problema ao processar seu pagamento. Tente novamente.",
      tryAgain: "Tentar Novamente",
    },
    privacy: {
      dataRequestTitle: "Exercício de Direitos de Privacidade",
      dataRequestSubtitle:
        "Solicite acesso, exportação ou exclusão dos seus dados pessoais (LGPD / GDPR).",
      exportOption: "Exportar meus dados (Portabilidade)",
      deleteOption: "Excluir meus dados pessoais",
      rectifyOption: "Retificar dados incorretos",
      sendRequest: "Enviar Solicitação",
      unsubscribeTitle: "Cancelamento de Novidades",
      unsubscribeSuccess: "Você foi descadastrado da nossa lista promocional com sucesso.",
      unsubscribeButton: "Confirmar Cancelamento",
    },
    quizzes: {
      brainrank: {
        name: "BrainRank",
        category: "Cognitivo",
        tagline: "Descubra como você raciocina e resolve problemas complexos.",
        duration: "7–10 min",
      },
      "personality-map": {
        name: "Personality Map",
        category: "Personalidade",
        tagline: "Mapeie seus traços dominantes segundo o modelo Big Five.",
        duration: "8–12 min",
      },
      careerfit: {
        name: "CareerFit",
        category: "Carreira",
        tagline: "Identifique suas âncoras de carreira e motivações profissionais.",
        duration: "6–9 min",
      },
      moneydna: {
        name: "MoneyDNA",
        category: "Finanças",
        tagline: "Descubra seu arquétipo comportamental em relação ao dinheiro.",
        duration: "5–8 min",
      },
      focusstyle: {
        name: "FocusStyle",
        category: "Produtividade",
        tagline: "Compreenda seu estilo natural de atenção, foco e execução.",
        duration: "5–7 min",
      },
      decisiondna: {
        name: "DecisionDNA",
        category: "Decisão",
        tagline: "Analise seus padrões estratégicos de tomada de decisão sob pressão.",
        duration: "6–8 min",
      },
      coupledna: {
        name: "CoupleDNA",
        category: "Relacionamentos",
        tagline: "Avalie sinergias, comunicação e harmonia em casal com consentimento mútuo.",
        duration: "7–10 min",
      },
    },
    brainrank: {
      label: "BrainRank",
      featuredLabel: "Experiência em destaque",
      title: "Descubra como você raciocina.",
      body: "24 desafios para mapear sua lógica, atenção, memória de trabalho e velocidade de raciocínio.",
      duration: "7–10 min",
      free: "Resultado gratuito incluído",
      cta: "Iniciar Desafio Cognitivo",
      disclaimer: "Não se trata de teste clínico de QI.",
      exploreAll: "Explorar todas as experiências",
    },
    dimensions: ["Padrões", "Lógica", "Números", "Atenção", "Problemas", "Velocidade"],
  },

  en: {
    nav: {
      discover: "Discover",
      about: "How it works",
      language: "Language",
      market: "Market",
      catalog: "Catalog",
      articles: "Articles",
    },
    hero: {
      title: "Discover more about you.",
      body: "Short experiences that turn curiosity into clarity about how you think, decide, and connect.",
      cta: "Start discovering",
      note: "No account required",
    },
    common: {
      back: "Back",
      continue: "Continue",
      start: "Start",
      finish: "Finish",
      previous: "Previous",
      next: "Next",
      loading: "Loading...",
      error: "An error occurred",
      retry: "Try again",
      submit: "Submit",
      cancel: "Cancel",
      question: "Question",
      of: "of",
      copyLink: "Copy link",
      linkCopied: "Link copied!",
      viewResult: "View Result",
    },
    quizRunner: {
      questionProgress: "Question {current} of {total}",
      finishQuiz: "Complete Quiz & View Results",
      saving: "Saving...",
      calculatingScore: "Calculating score on server...",
      initError: "Unable to load quiz questions.",
      sessionExpired: "Your session has expired. Would you like to restart?",
      selectOptionToContinue: "Please select an option to continue.",
      saveError: "Could not save your answer. Please try again.",
    },
    leadCapture: {
      title: "Save your results",
      subtitle:
        "Enter your email to receive a secure link to your report so you never lose your progress.",
      emailPlaceholder: "your.email@example.com",
      transactionalConsent:
        "I agree to the Terms of Service and Privacy Policy and authorize sending my results via email.",
      promotionalConsent:
        "I would like to receive product updates, new quizzes and exclusive insights (optional).",
      submitButton: "View My Results",
      submitting: "Saving...",
    },
    resultView: {
      freeTitle: "Free Preliminary Result",
      overallScore: "Overall Score",
      strongestDimension: "Highlighted Dimension",
      allDimensions: "Dimension Overview",
      unlockPremium: "Unlock Full Report",
      premiumUnlocked: "Premium Access Unlocked",
      disclaimer:
        "This assessment is intended solely for personal reflection and self-discovery. It does not constitute clinical, diagnostic or financial advice.",
      shareTitle: "Share your results",
      noResultFound: "No recent results found",
      startQuizCta: "Start Challenge",
    },
    checkout: {
      title: "Complete Checkout",
      summary: "Order Summary",
      immediateAccess: "Instant lifetime access upon confirmation",
      securePayment: "Encrypted and secure checkout",
      payNow: "Pay Now",
      processing: "Processing payment...",
      successTitle: "Payment Confirmed!",
      successSubtitle: "Your comprehensive report has been successfully unlocked.",
      pendingTitle: "Payment Processing",
      pendingSubtitle: "Awaiting confirmation from your financial institution to release access.",
      failedTitle: "Payment Failed",
      failedSubtitle: "There was an issue processing your payment. Please try again.",
      tryAgain: "Try Again",
    },
    privacy: {
      dataRequestTitle: "Exercise Privacy Rights",
      dataRequestSubtitle:
        "Request access, export, or deletion of your personal data (GDPR / CCPA / LGPD).",
      exportOption: "Export my data (Data Portability)",
      deleteOption: "Delete my personal data",
      rectifyOption: "Rectify inaccurate data",
      sendRequest: "Submit Request",
      unsubscribeTitle: "Unsubscribe from Marketing",
      unsubscribeSuccess: "You have been successfully removed from our promotional list.",
      unsubscribeButton: "Confirm Unsubscribe",
    },
    quizzes: {
      brainrank: {
        name: "BrainRank",
        category: "Cognitive",
        tagline: "Discover your cognitive reasoning architecture and analytical patterns.",
        duration: "7–10 min",
      },
      "personality-map": {
        name: "Personality Map",
        category: "Personality",
        tagline: "Map your dominant behavioral traits using the scientific Big Five model.",
        duration: "8–12 min",
      },
      careerfit: {
        name: "CareerFit",
        category: "Career",
        tagline: "Identify your core career anchors and workplace motivators.",
        duration: "6–9 min",
      },
      moneydna: {
        name: "MoneyDNA",
        category: "Finance",
        tagline: "Reveal your behavioral archetype in financial decision-making.",
        duration: "5–8 min",
      },
      focusstyle: {
        name: "FocusStyle",
        category: "Productivity",
        tagline: "Understand your natural flow state, attention mode, and focus patterns.",
        duration: "5–7 min",
      },
      decisiondna: {
        name: "DecisionDNA",
        category: "Decision",
        tagline: "Analyze your strategic decision-making tendencies under ambiguous scenarios.",
        duration: "6–8 min",
      },
      coupledna: {
        name: "CoupleDNA",
        category: "Relationships",
        tagline: "Assess mutual harmony, communication styles, and values with bilateral consent.",
        duration: "7–10 min",
      },
    },
    brainrank: {
      label: "BrainRank",
      featuredLabel: "Featured experience",
      title: "Discover how you think and reason.",
      body: "24 short challenges mapping your logic, focus, spatial reasoning, and mental speed.",
      duration: "7–10 min",
      free: "Free preliminary score included",
      cta: "Start Cognitive Challenge",
      disclaimer: "Not a clinical diagnostic IQ test.",
      exploreAll: "Explore all experiences",
    },
    dimensions: ["Patterns", "Logic", "Numbers", "Attention", "Problems", "Speed"],
  },

  es: {
    nav: {
      discover: "Descubrir",
      about: "Cómo funciona",
      language: "Idioma",
      market: "Mercado",
      catalog: "Catálogo",
      articles: "Artículos",
    },
    hero: {
      title: "Descubre más sobre ti.",
      body: "Experiencias breves que convierten la curiosidad en claridad sobre cómo piensas, decides y conectas.",
      cta: "Empezar a descubrir",
      note: "Sin registro obligatorio",
    },
    common: {
      back: "Volver",
      continue: "Continuar",
      start: "Comenzar",
      finish: "Finalizar",
      previous: "Anterior",
      next: "Siguiente",
      loading: "Cargando...",
      error: "Ocurrió un error",
      retry: "Reintentar",
      submit: "Enviar",
      cancel: "Cancelar",
      question: "Pregunta",
      of: "de",
      copyLink: "Copiar enlace",
      linkCopied: "¡Enlace copiado!",
      viewResult: "Ver Resultado",
    },
    quizRunner: {
      questionProgress: "Pregunta {current} de {total}",
      finishQuiz: "Completar Test y Ver Resultados",
      saving: "Guardando...",
      calculatingScore: "Calculando puntuación en el servidor...",
      initError: "No se pudieron cargar las preguntas del cuestionario.",
      sessionExpired: "Tu sesión ha caducado. ¿Deseas reiniciar?",
      selectOptionToContinue: "Selecciona una opción para continuar.",
      saveError: "No se pudo guardar tu respuesta. Inténtalo de nuevo.",
    },
    leadCapture: {
      title: "Guarda tu resultado",
      subtitle:
        "Introduce tu correo para recibir el enlace seguro a tu informe y no perder tu progreso.",
      emailPlaceholder: "tu.correo@ejemplo.com",
      transactionalConsent:
        "Acepto los Térmos de Uso y Política de Privacidad y autorizo el envío de mis resultados por correo.",
      promotionalConsent:
        "Deseo recibir novedades, nuevos tests y reflexiones exclusivas por correo (opcional).",
      submitButton: "Ver Mi Resultado",
      submitting: "Guardando...",
    },
    resultView: {
      freeTitle: "Resultado Preliminar Gratuito",
      overallScore: "Puntuación General",
      strongestDimension: "Dimensión Destacada",
      allDimensions: "Mapeo de Dimensiones",
      unlockPremium: "Desbloquear Informe Completo",
      premiumUnlocked: "Acceso Premium Desbloqueado",
      disclaimer:
        "Esta evaluación está destinada exclusivamente al autoconocimiento y reflexión personal, sin carácter clínico o financiero.",
      shareTitle: "Comparte tu resultado",
      noResultFound: "No se encontraron resultados recientes",
      startQuizCta: "Comenzar Desafío",
    },
    checkout: {
      title: "Finalizar Compra",
      summary: "Resumen del Pedido",
      immediateAccess: "Acceso inmediato e ilimitado tras la confirmación",
      securePayment: "Proceso de pago cifrado y seguro",
      payNow: "Pagar Ahora",
      processing: "Procesando pago...",
      successTitle: "¡Pago Confirmado!",
      successSubtitle: "Tu informe analítico ha sido desbloqueado con éxito.",
      pendingTitle: "Pago en Proceso",
      pendingSubtitle: "Esperando confirmación de la entidad bancaria para liberar el acceso.",
      failedTitle: "Pago Fallido",
      failedSubtitle: "Hubo un problema al procesar el pago. Por favor, inténtalo de nuevo.",
      tryAgain: "Intentar de Nuevo",
    },
    privacy: {
      dataRequestTitle: "Ejercicio de Derechos de Privacidad",
      dataRequestSubtitle:
        "Solicita el acceso, exportación o eliminación de tus datos personales (RGPD / LGPD).",
      exportOption: "Exportar mis datos (Portabilidad)",
      deleteOption: "Eliminar mis datos personales",
      rectifyOption: "Rectificar datos inexactos",
      sendRequest: "Enviar Solicitud",
      unsubscribeTitle: "Baja de Comunicaciones",
      unsubscribeSuccess: "Te has dado de baja de nuestras comunicaciones promocionales con éxito.",
      unsubscribeButton: "Confirmar Baja",
    },
    quizzes: {
      brainrank: {
        name: "BrainRank",
        category: "Cognitivo",
        tagline: "Descubre cómo razonas y resuelves problemas complejos.",
        duration: "7–10 min",
      },
      "personality-map": {
        name: "Personality Map",
        category: "Personalidad",
        tagline: "Mapea tus rasgos dominantes según el modelo científico Big Five.",
        duration: "8–12 min",
      },
      careerfit: {
        name: "CareerFit",
        category: "Carrera",
        tagline: "Identifica tus anclas profesionales y motivaciones laborales.",
        duration: "6–9 min",
      },
      moneydna: {
        name: "MoneyDNA",
        category: "Finanzas",
        tagline: "Descubre tu arquetipo de comportamiento en relación al dinero.",
        duration: "5–8 min",
      },
      focusstyle: {
        name: "FocusStyle",
        category: "Productividad",
        tagline: "Comprende tu estilo natural de atención, enfoque y ejecución.",
        duration: "5–7 min",
      },
      decisiondna: {
        name: "DecisionDNA",
        category: "Decisión",
        tagline: "Analiza tus patrones estratégicos de toma de decisiones bajo presión.",
        duration: "6–8 min",
      },
      coupledna: {
        name: "CoupleDNA",
        category: "Relaciones",
        tagline: "Evalúa la sinergia, comunicación y armonía de pareja con consentimiento mutuo.",
        duration: "7–10 min",
      },
    },
    brainrank: {
      label: "BrainRank",
      featuredLabel: "Experiencia destacada",
      title: "Descubre cómo razonas y piensas.",
      body: "24 retos rápidos para evaluar tu lógica, atención, memoria de trabajo y agilidad mental.",
      duration: "7–10 min",
      free: "Resultado preliminar gratuito",
      cta: "Comenzar Reto Cognitivo",
      disclaimer: "No es una prueba clínica de CI.",
      exploreAll: "Explorar todas las experiencias",
    },
    dimensions: ["Patrones", "Lógica", "Números", "Atención", "Problemas", "Velocidad"],
  },

  fr: {
    nav: {
      discover: "Découvrir",
      about: "Comment ça marche",
      language: "Langue",
      market: "Marché",
      catalog: "Catalogue",
      articles: "Articles",
    },
    hero: {
      title: "Découvrez-en davantage sur vous.",
      body: "Des expériences courtes qui transforment la curiosité en clarté sur votre façon de penser, décider et créer des liens.",
      cta: "Commencer à découvrir",
      note: "Aucun compte requis",
    },
    common: {
      back: "Retour",
      continue: "Continuer",
      start: "Commencer",
      finish: "Terminer",
      previous: "Précédent",
      next: "Suivant",
      loading: "Chargement...",
      error: "Une erreur est survenue",
      retry: "Réessayer",
      submit: "Envoyer",
      cancel: "Annuler",
      question: "Question",
      of: "sur",
      copyLink: "Copier le lien",
      linkCopied: "Lien copié !",
      viewResult: "Voir le Résultat",
    },
    quizRunner: {
      questionProgress: "Question {current} sur {total}",
      finishQuiz: "Terminer le Quiz et Voir le Résultat",
      saving: "Enregistrement...",
      calculatingScore: "Calcul du score sur le serveur...",
      initError: "Impossible de charger les questions du quiz.",
      sessionExpired: "Votre session a expiré. Souhaitez-vous redémarrer ?",
      selectOptionToContinue: "Veuillez sélectionner une option pour continuer.",
      saveError: "Impossible d'enregistrer votre réponse. Veuillez réessayer.",
    },
    leadCapture: {
      title: "Enregistrez votre résultat",
      subtitle:
        "Indiquez votre adresse e-mail pour recevoir le lien sécurisé vers votre rapport et conserver votre progression.",
      emailPlaceholder: "votre.email@exemple.com",
      transactionalConsent:
        "J'accepte les Conditions d'utilisation et la Politique de confidentialité et j'autorise l'envoi de mes résultats par e-mail.",
      promotionalConsent:
        "Je souhaite recevoir des nouveautés, de nouveaux tests et des contenus exclusifs par e-mail (facultatif).",
      submitButton: "Voir Mon Résultat",
      submitting: "Enregistrement...",
    },
    resultView: {
      freeTitle: "Résultat Préliminaire Gratuit",
      overallScore: "Score Global",
      strongestDimension: "Dimension Principale",
      allDimensions: "Aperçu des Dimensions",
      unlockPremium: "Débloquer le Rapport Complet",
      premiumUnlocked: "Accès Premium Débloqué",
      disclaimer:
        "Ce test est destiné uniquement à la réflexion personnelle et au développement personnel. Il ne constitue aucunement un avis clinique ou financier.",
      shareTitle: "Partagez votre résultat",
      noResultFound: "Aucun résultat récent trouvé",
      startQuizCta: "Démarrer le Défi",
    },
    checkout: {
      title: "Finaliser la Commande",
      summary: "Récapitulatif de la Commande",
      immediateAccess: "Accès immédiat et illimité dès confirmation",
      securePayment: "Paiement chiffré et sécurisé",
      payNow: "Payer Maintenant",
      processing: "Traitement du paiement...",
      successTitle: "Paiement Confirmé !",
      successSubtitle: "Votre rapport complet a été débloqué avec succès.",
      pendingTitle: "Paiement en Cours",
      pendingSubtitle:
        "En attente de la confirmation de votre établissement bancaire pour débloquer l'accès.",
      failedTitle: "Échec du Paiement",
      failedSubtitle: "Un problème est survenu lors du paiement. Veuillez réessayer.",
      tryAgain: "Réessayer",
    },
    privacy: {
      dataRequestTitle: "Exercice des Droits de Confidentialité",
      dataRequestSubtitle:
        "Demandez l'accès, l'exportation ou la suppression de vos données personnelles (RGPD / LGPD).",
      exportOption: "Exporter mes données (Portabilité)",
      deleteOption: "Supprimer mes données personnelles",
      rectifyOption: "Rectifier des données inexactes",
      sendRequest: "Envoyer la Demande",
      unsubscribeTitle: "Désabonnement des Nouveautés",
      unsubscribeSuccess:
        "Vous avez été désabonné(e) avec succès de notre liste de diffusion promotionnelle.",
      unsubscribeButton: "Confirmer le Désabonnement",
    },
    quizzes: {
      brainrank: {
        name: "BrainRank",
        category: "Cognitif",
        tagline: "Découvrez votre façon de raisonner et de résoudre des problèmes complexes.",
        duration: "7–10 min",
      },
      "personality-map": {
        name: "Personality Map",
        category: "Personnalité",
        tagline: "Cartographiez vos traits dominants selon le modèle scientifique des Big Five.",
        duration: "8–12 min",
      },
      careerfit: {
        name: "CareerFit",
        category: "Carrière",
        tagline: "Identifiez vos ancres professionnelles et vos moteurs au travail.",
        duration: "6–9 min",
      },
      moneydna: {
        name: "MoneyDNA",
        category: "Finances",
        tagline:
          "Révélez votre archétype comportemental face à l'argent et aux décisions financières.",
        duration: "5–8 min",
      },
      focusstyle: {
        name: "FocusStyle",
        category: "Productivité",
        tagline: "Comprenez votre style naturel d'attention, de concentration et d'exécution.",
        duration: "5–7 min",
      },
      decisiondna: {
        name: "DecisionDNA",
        category: "Décision",
        tagline:
          "Analysez vos stratégies de prise de décision face à l'incertitude et la pression.",
        duration: "6–8 min",
      },
      coupledna: {
        name: "CoupleDNA",
        category: "Relations",
        tagline:
          "Évaluez la synergie, la communication et l'harmonie de votre couple avec consentement mutuel.",
        duration: "7–10 min",
      },
    },
    brainrank: {
      label: "BrainRank",
      featuredLabel: "Expérience à la une",
      title: "Découvrez votre façon de raisonner.",
      body: "24 défis pour révéler vos schémas de logique, d'attention et de résolution de problèmes.",
      duration: "7–10 min",
      free: "Résultat préliminaire gratuit inclus",
      cta: "Démarrer le Défi Cognitif",
      disclaimer: "Ce test n'est pas un diagnostic clinique de QI.",
      exploreAll: "Explorer toutes les expériences",
    },
    dimensions: ["Schémas", "Logique", "Nombres", "Attention", "Problèmes", "Vitesse"],
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.pt;
}
