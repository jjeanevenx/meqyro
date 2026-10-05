import type { Locale } from "./config";

const coupleFlowCopy = {
  pt: {
    title: "Construam a comparação juntos",
    accessConditions: "Comparação após pagamento, conclusão dos dois testes e autorização de ambos",
    consent:
      "Autorizo compartilhar a comparação com a pessoa que aceitar meu convite. Posso retirar essa autorização aqui.",
    invite: "Criar convite",
    withdraw: "Retirar autorização",
    allow: "Autorizar comparação",
    refresh: "Atualizar andamento",
    link: "Copie este link e envie para a outra pessoa:",
    error: "Não foi possível atualizar. Tente novamente.",
    paid: "Compra confirmada. O download e o e-mail da comparação ficam disponíveis quando os dois concluírem e autorizarem o compartilhamento.",
    states: {
      NO_INVITE: "Convide a outra pessoa para responder ao mesmo teste.",
      WAITING_PARTNER: "Aguardando a outra pessoa aceitar o convite.",
      WAITING_RESULTS: "Aguardando os dois concluírem o teste.",
      CONSENT_REQUIRED: "Os dois precisam autorizar o compartilhamento para acessar a comparação.",
      PAYMENT_REQUIRED:
        "Os dois resultados estão prontos. Uma compra libera a comparação para ambos.",
      READY: "A comparação de vocês está pronta abaixo.",
      EXPIRED: "Este convite expirou. Crie um novo convite.",
    },
  },
  en: {
    title: "Build your comparison together",
    accessConditions: "Comparison after payment, both completed assessments and both permissions",
    consent:
      "I allow the comparison to be shared with the person who accepts my invitation. I can withdraw permission here.",
    invite: "Create invitation",
    withdraw: "Withdraw permission",
    allow: "Allow comparison",
    refresh: "Refresh progress",
    link: "Copy this link and send it to your partner:",
    error: "Unable to update. Please retry.",
    paid: "Purchase confirmed. Download and email become available when both people complete the test and allow sharing.",
    states: {
      NO_INVITE: "Invite your partner to answer the same assessment.",
      WAITING_PARTNER: "Waiting for your partner to accept.",
      WAITING_RESULTS: "Waiting for both assessments to be completed.",
      CONSENT_REQUIRED: "Both people must allow sharing to access the comparison.",
      PAYMENT_REQUIRED: "Both results are ready. One purchase unlocks the comparison for both.",
      READY: "Your comparison is ready below.",
      EXPIRED: "This invitation expired. Create a new invitation.",
    },
  },
  es: {
    title: "Construyan la comparación juntos",
    accessConditions: "Comparación tras el pago, los dos tests completados y ambas autorizaciones",
    consent:
      "Autorizo compartir la comparación con quien acepte mi invitación. Puedo retirar la autorización aquí.",
    invite: "Crear invitación",
    withdraw: "Retirar autorización",
    allow: "Autorizar comparación",
    refresh: "Actualizar progreso",
    link: "Copia este enlace y envíalo a la otra persona:",
    error: "No se pudo actualizar. Inténtalo de nuevo.",
    paid: "Compra confirmada. La descarga y el correo estarán disponibles cuando ambos completen el test y autoricen compartir.",
    states: {
      NO_INVITE: "Invita a la otra persona a responder el mismo test.",
      WAITING_PARTNER: "Esperando que la otra persona acepte.",
      WAITING_RESULTS: "Esperando que ambos completen el test.",
      CONSENT_REQUIRED: "Ambas personas deben autorizar compartir la comparación.",
      PAYMENT_REQUIRED:
        "Ambos resultados están listos. Una compra libera la comparación para ambos.",
      READY: "La comparación está lista abajo.",
      EXPIRED: "La invitación expiró. Crea una nueva.",
    },
  },
  fr: {
    title: "Construisez votre comparaison ensemble",
    accessConditions:
      "Comparaison après paiement, les deux tests terminés et les deux autorisations",
    consent:
      "J'autorise le partage de la comparaison avec la personne qui accepte mon invitation. Je peux retirer cette autorisation ici.",
    invite: "Créer une invitation",
    withdraw: "Retirer l'autorisation",
    allow: "Autoriser la comparaison",
    refresh: "Actualiser",
    link: "Copiez ce lien et envoyez-le à l'autre personne :",
    error: "Impossible de mettre à jour. Réessayez.",
    paid: "Achat confirmé. Le téléchargement et l'e-mail seront disponibles après les deux tests et les autorisations de partage.",
    states: {
      NO_INVITE: "Invitez l'autre personne à répondre au même test.",
      WAITING_PARTNER: "En attente de l'acceptation de l'invitation.",
      WAITING_RESULTS: "En attente de la fin des deux tests.",
      CONSENT_REQUIRED: "Les deux personnes doivent autoriser le partage.",
      PAYMENT_REQUIRED:
        "Les deux résultats sont prêts. Un achat débloque la comparaison pour les deux.",
      READY: "Votre comparaison est prête ci-dessous.",
      EXPIRED: "Cette invitation a expiré. Créez-en une nouvelle.",
    },
  },
};
const coupleInviteCopy = {
  pt: [
    "Convite para o CoupleDNA",
    "Ao participar, você autoriza compartilhar a comparação das suas respostas com a pessoa que enviou este convite. O relatório será liberado após os dois concluírem e uma compra for confirmada. Você pode retirar essa autorização na página do resultado.",
    "Autorizar comparação e começar",
  ],
  en: [
    "CoupleDNA invitation",
    "By joining, you allow your answer comparison to be shared with the person who invited you. The report requires both assessments and one confirmed purchase. You can withdraw permission on your result page.",
    "Allow comparison and start",
  ],
  es: [
    "Invitación a CoupleDNA",
    "Al participar, autorizas compartir la comparación con quien te invitó. El informe requiere ambos tests y una compra confirmada. Puedes retirar la autorización en tu resultado.",
    "Autorizar comparación y empezar",
  ],
  fr: [
    "Invitation CoupleDNA",
    "En participant, vous autorisez le partage de la comparaison avec la personne qui vous invite. Le rapport nécessite les deux tests et un achat confirmé. Vous pouvez retirer cette autorisation sur votre résultat.",
    "Autoriser la comparaison et commencer",
  ],
} as const;

export type Dictionary = {
  coupleFlow: typeof coupleFlowCopy.pt;
  coupleInviteStart: readonly [string, string, string];
  includedPurchasesTitle: string;
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
    unlockCompleteAnalysis: string;
    viewUnlockedReport: string;
    preparingCheckout: string;
    oneTimePayment: string;
    instantAccess: string;
    moneyBackGuarantee: string;
    securePayment: string;
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
    coupleFlow: coupleFlowCopy.pt,
    coupleInviteStart: coupleInviteCopy.pt,
    includedPurchasesTitle: "Quizzes incluídos na sua compra",
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
      unlockPremium: "Desbloquear meu relatório completo",
      unlockCompleteAnalysis: "Obter minha análise completa",
      viewUnlockedReport: "Ver meu relatório completo",
      preparingCheckout: "Preparando checkout seguro...",
      oneTimePayment: "pagamento único",
      instantAccess: "Acesso após confirmação do pagamento",
      moneyBackGuarantee: "Garantia incondicional de 7 dias",
      securePayment: "Ambiente de pagamento seguro e criptografado",
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
      immediateAccess: "Download e resultado por e-mail após confirmação",
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
    coupleFlow: coupleFlowCopy.en,
    coupleInviteStart: coupleInviteCopy.en,
    includedPurchasesTitle: "Assessments included in your purchase",
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
      unlockPremium: "Unlock My Full Report",
      unlockCompleteAnalysis: "Get My Complete Analysis",
      viewUnlockedReport: "View My Full Report",
      preparingCheckout: "Preparing secure checkout...",
      oneTimePayment: "one-time payment",
      instantAccess: "Access after payment confirmation",
      moneyBackGuarantee: "7-day money-back guarantee",
      securePayment: "Encrypted and secure checkout",
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
      immediateAccess: "Download and result by email upon confirmation",
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
    coupleFlow: coupleFlowCopy.es,
    coupleInviteStart: coupleInviteCopy.es,
    includedPurchasesTitle: "Tests incluidos en tu compra",
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
        "Acepto los Términos de Uso y Política de Privacidad y autorizo el envío de mis resultados por correo.",
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
      unlockPremium: "Desbloquear mi informe completo",
      unlockCompleteAnalysis: "Obtener mi análisis completo",
      viewUnlockedReport: "Ver mi informe completo",
      preparingCheckout: "Preparando pago seguro...",
      oneTimePayment: "pago único",
      instantAccess: "Acceso tras confirmar el pago",
      moneyBackGuarantee: "Garantía de reembolso de 7 días",
      securePayment: "Proceso de pago cifrado y seguro",
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
      immediateAccess: "Descarga y resultado por correo tras la confirmación",
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
    coupleFlow: coupleFlowCopy.fr,
    coupleInviteStart: coupleInviteCopy.fr,
    includedPurchasesTitle: "Tests inclus dans votre achat",
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
      unlockPremium: "Débloquer mon rapport complet",
      unlockCompleteAnalysis: "Obtenir mon analyse complète",
      viewUnlockedReport: "Voir mon rapport complet",
      preparingCheckout: "Préparation du paiement sécurisé...",
      oneTimePayment: "paiement unique",
      instantAccess: "Accès après confirmation du paiement",
      moneyBackGuarantee: "Garantie satisfait ou remboursé 7 jours",
      securePayment: "Paiement chiffré et sécurisé",
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
      immediateAccess: "Téléchargement et résultat par e-mail après confirmation",
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
