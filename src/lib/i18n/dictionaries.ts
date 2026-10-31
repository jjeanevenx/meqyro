import type { Locale } from "./config";

const authCopy = {
  pt: {
    login: "Entrar",
    account: "Minha conta",
    description: "Receba um link seguro por e-mail. Os testes continuam disponíveis sem conta.",
    email: "E-mail",
    send: "Enviar link de acesso",
    sent: "Confira seu e-mail e abra o link neste navegador.",
    error: "Não foi possível concluir. Tente novamente.",
    signOut: "Sair",
    reports: "Acessar meus relatórios",
  },
  en: {
    login: "Sign in",
    account: "My account",
    description: "Receive a secure link by email. Assessments remain available without an account.",
    email: "Email",
    send: "Send sign-in link",
    sent: "Check your email and open the link in this browser.",
    error: "Unable to complete your request. Please try again.",
    signOut: "Sign out",
    reports: "Access my reports",
  },
  es: {
    login: "Iniciar sesión",
    account: "Mi cuenta",
    description: "Recibe un enlace seguro por correo. Los tests siguen disponibles sin cuenta.",
    email: "Correo electrónico",
    send: "Enviar enlace de acceso",
    sent: "Revisa tu correo y abre el enlace en este navegador.",
    error: "No se pudo completar. Inténtalo de nuevo.",
    signOut: "Cerrar sesión",
    reports: "Acceder a mis informes",
  },
  fr: {
    login: "Se connecter",
    account: "Mon compte",
    description: "Recevez un lien sécurisé par e-mail. Les tests restent disponibles sans compte.",
    email: "E-mail",
    send: "Envoyer le lien de connexion",
    sent: "Consultez votre e-mail et ouvrez le lien dans ce navigateur.",
    error: "Impossible de terminer. Veuillez réessayer.",
    signOut: "Se déconnecter",
    reports: "Accéder à mes rapports",
  },
};

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
  auth: typeof authCopy.en;
  coupleFlow: typeof coupleFlowCopy.pt;
  coupleInviteStart: readonly [string, string, string];
  includedPurchasesTitle: string;
  nav: {
    menu: string;
    primary: string;
    home: string;
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
  questionTimer: { normal: string; low: string; critical: string; expired: string; policy: string };
  quizRunner: {
    scenarioHint: string;
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
    behavioralPreference: string;
    behavioralCaveat: string;
    behavioralCoupleCaveat: string;
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
    auth: authCopy.pt,
    coupleFlow: coupleFlowCopy.pt,
    coupleInviteStart: coupleInviteCopy.pt,
    includedPurchasesTitle: "Quizzes incluídos na sua compra",
    nav: {
      menu: "Menu",
      primary: "Navegação principal",
      home: "Página inicial Meqyro",
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
    questionTimer: {
      normal: "Tempo restante",
      low: "Pouco tempo",
      critical: "Tempo crítico",
      expired: "Tempo esgotado. Avançando…",
      policy:
        "O tempo continua ao sair da aba. Confirme antes do prazo; respostas recebidas depois serão registradas como expiradas.",
    },
    quizRunner: {
      scenarioHint:
        "Escolha o que mais se aproxima de como você agiria. Não há resposta certa; responda no seu ritmo.",
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
      behavioralPreference: "Preferência mais presente nesta tentativa",
      behavioralCaveat:
        "Índices descritivos das suas escolhas financeiras nesta tentativa, sem validação clínica. Os valores indicam a presença de cada prioridade nas situações em que ela estava disponível; maior não significa melhor. Empates não definem um perfil único. Não medem riqueza, conhecimento financeiro ou tolerância a investimentos.",
      behavioralCoupleCaveat:
        "Índices descritivos, sem validação clínica. Maior não significa melhor. No CoupleDNA, o eixo vai de reflexão individual a elaboração conjunta; diferenças não são incompatibilidade. Empates não definem um perfil único.",
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
    auth: authCopy.en,
    coupleFlow: coupleFlowCopy.en,
    coupleInviteStart: coupleInviteCopy.en,
    includedPurchasesTitle: "Assessments included in your purchase",
    nav: {
      discover: "Discover",
      menu: "Menu",
      primary: "Main navigation",
      home: "Meqyro home",
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
    questionTimer: {
      normal: "Time remaining",
      low: "Time running low",
      critical: "Critical time",
      expired: "Time expired. Continuing…",
      policy:
        "Time continues outside this tab. Confirm before the deadline; responses received later are recorded as expired.",
    },
    quizRunner: {
      questionProgress: "Question {current} of {total}",
      scenarioHint:
        "Choose what is closest to how you would act. There is no right answer; take your time.",
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
      behavioralPreference: "Most present preference in this attempt",
      behavioralCaveat:
        "Descriptive indices of your financial choices in this attempt, without clinical validation. Values indicate how often each priority was chosen when available; higher does not mean better. Ties do not define a single profile. They do not measure wealth, financial knowledge, or investment risk tolerance.",
      behavioralCoupleCaveat:
        "Descriptive indices without clinical validation. Higher does not mean better. In CoupleDNA, the axis runs from individual reflection to joint discussion; differences do not imply incompatibility. Ties do not define a single profile.",
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
    auth: authCopy.es,
    coupleFlow: coupleFlowCopy.es,
    coupleInviteStart: coupleInviteCopy.es,
    includedPurchasesTitle: "Tests incluidos en tu compra",
    nav: {
      discover: "Descubrir",
      menu: "Menú",
      primary: "Navegación principal",
      home: "Página de inicio Meqyro",
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
    questionTimer: {
      normal: "Tiempo restante",
      low: "Queda poco tiempo",
      critical: "Tiempo crítico",
      expired: "Tiempo agotado. Continuando…",
      policy:
        "El tiempo continúa fuera de esta pestaña. Confirma antes del límite; las respuestas recibidas después se registran como expiradas.",
    },
    quizRunner: {
      questionProgress: "Pregunta {current} de {total}",
      scenarioHint:
        "Elige lo más cercano a cómo actuarías. No hay respuesta correcta; responde a tu ritmo.",
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
      behavioralPreference: "Preferencia más presente en este intento",
      behavioralCaveat:
        "Índices descriptivos de tus elecciones financieras en este intento, sin validación clínica. Los valores indican la presencia de cada prioridad cuando estaba disponible; un valor mayor no significa mejor. Los empates no definen un perfil único. No miden riqueza, conocimientos financieros ni tolerancia al riesgo de inversión.",
      behavioralCoupleCaveat:
        "Índices descriptivos sin validación clínica. Un valor mayor no significa mejor. En CoupleDNA, el eje va de reflexión individual a elaboración conjunta; las diferencias no implican incompatibilidad. Los empates no definen un perfil único.",
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
    auth: authCopy.fr,
    coupleFlow: coupleFlowCopy.fr,
    coupleInviteStart: coupleInviteCopy.fr,
    includedPurchasesTitle: "Tests inclus dans votre achat",
    nav: {
      discover: "Découvrir",
      menu: "Menu",
      primary: "Navigation principale",
      home: "Accueil Meqyro",
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
    questionTimer: {
      normal: "Temps restant",
      low: "Peu de temps",
      critical: "Temps critique",
      expired: "Temps écoulé. Suite…",
      policy:
        "Le temps continue hors de cet onglet. Confirmez avant la limite ; les réponses reçues ensuite sont enregistrées comme expirées.",
    },
    quizRunner: {
      questionProgress: "Question {current} sur {total}",
      scenarioHint:
        "Choisissez ce qui correspond à votre réaction. Il n’y a pas de bonne réponse ; prenez votre temps.",
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
      behavioralPreference: "Préférence la plus présente dans cette tentative",
      behavioralCaveat:
        "Indices descriptifs de vos choix financiers pour cette tentative, sans validation clinique. Les valeurs indiquent la présence de chaque priorité lorsqu’elle était disponible ; plus élevé ne signifie pas meilleur. Une égalité ne définit pas un profil unique. Ils ne mesurent ni richesse, ni connaissances financières, ni tolérance au risque d’investissement.",
      behavioralCoupleCaveat:
        "Indices descriptifs sans validation clinique. Plus élevé ne signifie pas meilleur. Pour CoupleDNA, l’axe va de la réflexion individuelle à l’élaboration commune ; les différences ne signifient pas une incompatibilité. Une égalité ne définit pas un profil unique.",
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

export const attemptChoiceCopy: Record<
  Locale,
  {
    title: string;
    body: string;
    versions: string;
    resume: string;
    start: string;
    note: string;
  }
> = {
  pt: {
    title: "Você tem uma avaliação em andamento",
    body: "Continue de onde parou ou comece uma nova avaliação com o conteúdo atual.",
    versions: "Tentativa salva: {old}. Versão atual: {current}.",
    resume: "Continuar tentativa salva",
    start: "Começar nova avaliação",
    note: "A tentativa anterior não será apagada. Para voltar a ela neste navegador, salve o endereço de “Continuar tentativa salva”. Convites existentes continuam vinculados à tentativa original.",
  },
  en: {
    title: "You have an assessment in progress",
    body: "Continue where you left off or start a new assessment with the current content.",
    versions: "Saved attempt: {old}. Current version: {current}.",
    resume: "Continue saved attempt",
    start: "Start a new assessment",
    note: "Your previous attempt is kept. To return to it in this browser, save the Continue saved attempt link. Existing invitations remain linked to the original attempt.",
  },
  es: {
    title: "Tienes una evaluación en curso",
    body: "Continúa donde lo dejaste o comienza una nueva evaluación con el contenido actual.",
    versions: "Intento guardado: {old}. Versión actual: {current}.",
    resume: "Continuar intento guardado",
    start: "Comenzar una evaluación nueva",
    note: "El intento anterior se conserva. Para volver a él en este navegador, guarda el enlace Continuar intento guardado. Las invitaciones existentes siguen vinculadas al intento original.",
  },
  fr: {
    title: "Vous avez une évaluation en cours",
    body: "Reprenez votre progression ou commencez une nouvelle évaluation avec le contenu actuel.",
    versions: "Tentative enregistrée : {old}. Version actuelle : {current}.",
    resume: "Reprendre la tentative",
    start: "Commencer une nouvelle évaluation",
    note: "La tentative précédente est conservée. Pour y revenir dans ce navigateur, gardez le lien Reprendre la tentative. Les invitations existantes restent liées à la tentative initiale.",
  },
};

export const reportExampleCopy: Record<
  Locale,
  { title: string; note: string; link: string; action: string }
> = {
  pt: {
    title: "Exemplo fictício de relatório",
    note: "Demonstração completa com respostas inventadas. Não é o seu resultado nem uma comparação de casal. Seu relatório será gerado com as suas próprias respostas.",
    link: "Ver exemplo completo de relatório",
    action: "Sugestões para experimentar",
  },
  en: {
    title: "Fictional report example",
    note: "A complete demonstration with invented answers. This is not your result or a couple comparison. Your report will use your own answers.",
    link: "View a complete report example",
    action: "Suggestions to try",
  },
  es: {
    title: "Ejemplo ficticio de informe",
    note: "Demostración completa con respuestas inventadas. No es tu resultado ni una comparación de pareja. Tu informe usará tus propias respuestas.",
    link: "Ver ejemplo completo de informe",
    action: "Sugerencias para probar",
  },
  fr: {
    title: "Exemple fictif de rapport",
    note: "Démonstration complète avec des réponses inventées. Ce n’est ni votre résultat ni une comparaison de couple. Votre rapport utilisera vos propres réponses.",
    link: "Voir un exemple complet de rapport",
    action: "Suggestions à essayer",
  },
};
