import { scenario, type ScenarioDefinition } from "./behavioral-scenario";

// Additional independent financial dilemmas; no correctness or investment-risk inference.
export const additionalMoneyScenarios: readonly ScenarioDefinition[] = [
  scenario(
    "MD2_21",
    21,
    "BUILDER",
    {
      pt: [
        "Você pode pagar um curso profissional ou manter esse dinheiro disponível para o próximo mês. Qual seria sua prioridade?",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        "Dar espaço a uma experiência significativa no presente.",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
      ],
      en: [
        "You can pay for professional training or keep the money available next month. What would you prioritise?",
        "Keep the money to preserve my cushion for unexpected costs.",
        "Compare costs, timing and impact before allocating the money.",
        "Make room for a meaningful experience in the present.",
        "Split the margin between a current need and a future goal.",
      ],
      es: [
        "Puedes pagar formación profesional o conservar el dinero para el mes próximo. ¿Qué priorizarías?",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
        "Dar espacio a una experiencia significativa en el presente.",
        "Repartir el margen entre una necesidad actual y una meta futura.",
      ],
      fr: [
        "Vous pouvez financer une formation ou garder cette somme pour le mois prochain. Quelle priorité choisir ?",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
        "Faire une place à une expérience significative dans le présent.",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
      ],
    },
    [
      {
        GUARDIAN: 1,
      },
      {
        STRATEGIST: 1,
      },
      {
        ADVENTURER: 1,
      },
      {
        BALANCER: 1,
      },
    ],
    "EASY",
  ),
  scenario(
    "MD2_22",
    22,
    "BUILDER",
    {
      pt: [
        "Uma ferramenta pode melhorar seu trabalho, mas seu benefício só aparecerá em alguns meses. Como você decidiria usar essa verba?",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        "Dar espaço a uma experiência significativa no presente.",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
      ],
      en: [
        "A tool may improve your work, but its benefits will take months. How would you decide how to use the funds?",
        "Compare costs, timing and impact before allocating the money.",
        "Make room for a meaningful experience in the present.",
        "Split the margin between a current need and a future goal.",
        "Use the money for a step in a long-term project.",
      ],
      es: [
        "Una herramienta puede mejorar tu trabajo, pero su beneficio tardará meses. ¿Cómo decidirías usar ese dinero?",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
        "Dar espacio a una experiencia significativa en el presente.",
        "Repartir el margen entre una necesidad actual y una meta futura.",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
      ],
      fr: [
        "Un outil peut améliorer votre travail, mais ses bénéfices prendront des mois. Comment utiliser cette somme ?",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
        "Faire une place à une expérience significative dans le présent.",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
        "Consacrer la somme à une étape d’un projet à long terme.",
      ],
    },
    [
      {
        STRATEGIST: 1,
      },
      {
        ADVENTURER: 1,
      },
      {
        BALANCER: 1,
      },
      {
        BUILDER: 1,
      },
    ],
    "EASY",
  ),
  scenario(
    "MD2_23",
    23,
    "BUILDER",
    {
      pt: [
        "Seu projeto pessoal precisa de materiais e compete com uma viagem curta. O orçamento cobre apenas uma escolha. O que pesa mais?",
        "Dar espaço a uma experiência significativa no presente.",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
      ],
      en: [
        "Your personal project needs materials and competes with a short trip. The budget covers only one. What matters most?",
        "Make room for a meaningful experience in the present.",
        "Split the margin between a current need and a future goal.",
        "Use the money for a step in a long-term project.",
        "Keep the money to preserve my cushion for unexpected costs.",
      ],
      es: [
        "Tu proyecto necesita materiales y compite con un viaje corto. El presupuesto solo cubre uno. ¿Qué pesa más?",
        "Dar espacio a una experiencia significativa en el presente.",
        "Repartir el margen entre una necesidad actual y una meta futura.",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
      ],
      fr: [
        "Votre projet nécessite du matériel et concurrence un court voyage. Le budget ne couvre qu’un choix. Quelle priorité ?",
        "Faire une place à une expérience significative dans le présent.",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
        "Consacrer la somme à une étape d’un projet à long terme.",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
      ],
    },
    [
      {
        ADVENTURER: 1,
      },
      {
        BALANCER: 1,
      },
      {
        BUILDER: 1,
      },
      {
        GUARDIAN: 1,
      },
    ],
    "EASY",
  ),
  scenario(
    "MD2_24",
    24,
    "BUILDER",
    {
      pt: [
        "Você termina de pagar uma dívida e libera uma parcela mensal. Que prioridade daria a esse dinheiro a partir de agora?",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
      ],
      en: [
        "You finish repaying a debt and free up a monthly payment. What priority would you give that money now?",
        "Split the margin between a current need and a future goal.",
        "Use the money for a step in a long-term project.",
        "Keep the money to preserve my cushion for unexpected costs.",
        "Compare costs, timing and impact before allocating the money.",
      ],
      es: [
        "Terminas de pagar una deuda y liberas una cuota mensual. ¿Qué prioridad darías ahora a ese dinero?",
        "Repartir el margen entre una necesidad actual y una meta futura.",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
      ],
      fr: [
        "Vous finissez de rembourser une dette et libérez une mensualité. Quelle priorité donner à cet argent ?",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
        "Consacrer la somme à une étape d’un projet à long terme.",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
      ],
    },
    [
      {
        BALANCER: 1,
      },
      {
        BUILDER: 1,
      },
      {
        GUARDIAN: 1,
      },
      {
        STRATEGIST: 1,
      },
    ],
    "MEDIUM",
  ),
  scenario(
    "MD2_25",
    25,
    "BUILDER",
    {
      pt: [
        "Você vende um equipamento que não usa e pode financiar uma primeira etapa de um projeto. Como alocaria esse valor?",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        "Dar espaço a uma experiência significativa no presente.",
      ],
      en: [
        "You sell unused equipment and could fund the first stage of a project. How would you allocate the proceeds?",
        "Use the money for a step in a long-term project.",
        "Keep the money to preserve my cushion for unexpected costs.",
        "Compare costs, timing and impact before allocating the money.",
        "Make room for a meaningful experience in the present.",
      ],
      es: [
        "Vendes un equipo que no usas y podrías financiar una etapa de un proyecto. ¿Cómo distribuirías ese importe?",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
        "Dar espacio a una experiencia significativa en el presente.",
      ],
      fr: [
        "Vous vendez un équipement inutilisé et pourriez financer une étape d’un projet. Comment répartir cette somme ?",
        "Consacrer la somme à une étape d’un projet à long terme.",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
        "Faire une place à une expérience significative dans le présent.",
      ],
    },
    [
      {
        BUILDER: 1,
      },
      {
        GUARDIAN: 1,
      },
      {
        STRATEGIST: 1,
      },
      {
        ADVENTURER: 1,
      },
    ],
    "MEDIUM",
  ),
  scenario(
    "MD2_26",
    26,
    "BUILDER",
    {
      pt: [
        "Uma atividade extra gera renda, mas exige comprar materiais antes de começar. Qual prioridade guiaria sua decisão financeira?",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        "Dar espaço a uma experiência significativa no presente.",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
      ],
      en: [
        "A side activity could earn money but requires buying materials first. What priority would guide your financial decision?",
        "Compare costs, timing and impact before allocating the money.",
        "Make room for a meaningful experience in the present.",
        "Split the margin between a current need and a future goal.",
        "Keep the money to preserve my cushion for unexpected costs.",
      ],
      es: [
        "Una actividad extra puede generar ingresos, pero exige comprar materiales antes. ¿Qué prioridad guiaría tu decisión?",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
        "Dar espacio a una experiencia significativa en el presente.",
        "Repartir el margen entre una necesidad actual y una meta futura.",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
      ],
      fr: [
        "Une activité complémentaire peut rapporter mais nécessite du matériel au départ. Quelle priorité guiderait votre décision ?",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
        "Faire une place à une expérience significative dans le présent.",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
      ],
    },
    [
      {
        STRATEGIST: 1,
      },
      {
        ADVENTURER: 1,
      },
      {
        BALANCER: 1,
      },
      {
        GUARDIAN: 1,
      },
    ],
    "MEDIUM",
  ),
  scenario(
    "MD2_27",
    27,
    "BUILDER",
    {
      pt: [
        "Você recebe um reembolso e pensa em tirar uma ideia do papel. Há também necessidades adiadas. Como escolheria o destino do valor?",
        "Dar espaço a uma experiência significativa no presente.",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
      ],
      en: [
        "You receive a refund and consider starting an idea, while other needs have been postponed. How would you allocate it?",
        "Make room for a meaningful experience in the present.",
        "Split the margin between a current need and a future goal.",
        "Use the money for a step in a long-term project.",
        "Compare costs, timing and impact before allocating the money.",
      ],
      es: [
        "Recibes un reembolso y piensas iniciar una idea, pero hay necesidades aplazadas. ¿Cómo decidirías su destino?",
        "Dar espacio a una experiencia significativa en el presente.",
        "Repartir el margen entre una necesidad actual y una meta futura.",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
      ],
      fr: [
        "Vous recevez un remboursement et envisagez de lancer une idée, avec d’autres besoins reportés. Comment l’affecter ?",
        "Faire une place à une expérience significative dans le présent.",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
        "Consacrer la somme à une étape d’un projet à long terme.",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
      ],
    },
    [
      {
        ADVENTURER: 1,
      },
      {
        BALANCER: 1,
      },
      {
        BUILDER: 1,
      },
      {
        STRATEGIST: 1,
      },
    ],
    "HARD",
  ),
  scenario(
    "MD2_28",
    28,
    "BUILDER",
    {
      pt: [
        "Uma certificação exige pagamentos ao longo de seis meses, sem garantia de retorno. Qual prioridade financeira adotaria?",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        "Dar espaço a uma experiência significativa no presente.",
      ],
      en: [
        "A qualification requires payments over six months with no guaranteed return. What financial priority would you adopt?",
        "Split the margin between a current need and a future goal.",
        "Use the money for a step in a long-term project.",
        "Keep the money to preserve my cushion for unexpected costs.",
        "Make room for a meaningful experience in the present.",
      ],
      es: [
        "Una certificación exige pagos durante seis meses sin retorno garantizado. ¿Qué prioridad financiera adoptarías?",
        "Repartir el margen entre una necesidad actual y una meta futura.",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
        "Dar espacio a una experiencia significativa en el presente.",
      ],
      fr: [
        "Une certification demande six mois de paiements sans retour garanti. Quelle priorité financière adopter ?",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
        "Consacrer la somme à une étape d’un projet à long terme.",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
        "Faire une place à une expérience significative dans le présent.",
      ],
    },
    [
      {
        BALANCER: 1,
      },
      {
        BUILDER: 1,
      },
      {
        GUARDIAN: 1,
      },
      {
        ADVENTURER: 1,
      },
    ],
    "HARD",
  ),
  scenario(
    "MD2_29",
    29,
    "BUILDER",
    {
      pt: [
        "Uma parceria propõe dividir custos para criar um produto. Você tem uma pequena quantia livre. O que orientaria sua escolha?",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
      ],
      en: [
        "A partnership proposes sharing costs to create a product. You have a small amount available. What would guide your choice?",
        "Use the money for a step in a long-term project.",
        "Keep the money to preserve my cushion for unexpected costs.",
        "Compare costs, timing and impact before allocating the money.",
        "Split the margin between a current need and a future goal.",
      ],
      es: [
        "Una colaboración propone compartir costes para crear un producto. Tienes algo de dinero libre. ¿Qué guiaría tu elección?",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
        "Repartir el margen entre una necesidad actual y una meta futura.",
      ],
      fr: [
        "Un partenariat propose de partager les frais d’un produit. Vous avez une petite marge. Qu’est-ce qui guiderait votre choix ?",
        "Consacrer la somme à une étape d’un projet à long terme.",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
      ],
    },
    [
      {
        BUILDER: 1,
      },
      {
        GUARDIAN: 1,
      },
      {
        STRATEGIST: 1,
      },
      {
        BALANCER: 1,
      },
    ],
    "HARD",
  ),
  scenario(
    "MD2_30",
    30,
    "BUILDER",
    {
      pt: [
        "Você pode melhorar seu espaço de trabalho ou reservar o valor para outras necessidades. Que uso consideraria primeiro?",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        "Dar espaço a uma experiência significativa no presente.",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
      ],
      en: [
        "You can improve your workspace or reserve the money for other needs. Which use would you consider first?",
        "Keep the money to preserve my cushion for unexpected costs.",
        "Compare costs, timing and impact before allocating the money.",
        "Make room for a meaningful experience in the present.",
        "Use the money for a step in a long-term project.",
      ],
      es: [
        "Puedes mejorar tu espacio de trabajo o reservar el dinero para otras necesidades. ¿Qué uso considerarías primero?",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
        "Dar espacio a una experiencia significativa en el presente.",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
      ],
      fr: [
        "Vous pouvez améliorer votre espace de travail ou garder la somme pour d’autres besoins. Quel usage considérer en premier ?",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
        "Faire une place à une expérience significative dans le présent.",
        "Consacrer la somme à une étape d’un projet à long terme.",
      ],
    },
    [
      {
        GUARDIAN: 1,
      },
      {
        STRATEGIST: 1,
      },
      {
        ADVENTURER: 1,
      },
      {
        BUILDER: 1,
      },
    ],
    "HARD",
  ),
  scenario(
    "MD2_31",
    31,
    "BUILDER",
    {
      pt: [
        "Um projeto pode avançar mais rápido com uma compra hoje, mas também pode continuar devagar sem ela. O que priorizaria?",
        "Dar espaço a uma experiência significativa no presente.",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
      ],
      en: [
        "A purchase today could speed up a project, which could also continue slowly without it. What would you prioritise?",
        "Make room for a meaningful experience in the present.",
        "Split the margin between a current need and a future goal.",
        "Keep the money to preserve my cushion for unexpected costs.",
        "Compare costs, timing and impact before allocating the money.",
      ],
      es: [
        "Una compra hoy aceleraría un proyecto que también puede seguir más despacio sin ella. ¿Qué priorizarías?",
        "Dar espacio a una experiencia significativa en el presente.",
        "Repartir el margen entre una necesidad actual y una meta futura.",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
      ],
      fr: [
        "Un achat accélérerait un projet qui peut aussi avancer lentement sans lui. Que privilégieriez-vous ?",
        "Faire une place à une expérience significative dans le présent.",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
      ],
    },
    [
      {
        ADVENTURER: 1,
      },
      {
        BALANCER: 1,
      },
      {
        GUARDIAN: 1,
      },
      {
        STRATEGIST: 1,
      },
    ],
    "HARD",
  ),
  scenario(
    "MD2_32",
    32,
    "BUILDER",
    {
      pt: [
        "Você tem verba para aprender uma habilidade nova, reformar um item ou manter a folga. Qual objetivo guiaria sua decisão?",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        "Dar espaço a uma experiência significativa no presente.",
      ],
      en: [
        "You have funds to learn a skill, refurbish an item or keep a cushion. Which goal would guide your decision?",
        "Split the margin between a current need and a future goal.",
        "Use the money for a step in a long-term project.",
        "Compare costs, timing and impact before allocating the money.",
        "Make room for a meaningful experience in the present.",
      ],
      es: [
        "Tienes dinero para aprender una habilidad, renovar algo o conservar margen. ¿Qué objetivo guiaría tu decisión?",
        "Repartir el margen entre una necesidad actual y una meta futura.",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
        "Dar espacio a una experiencia significativa en el presente.",
      ],
      fr: [
        "Vous avez de quoi apprendre une compétence, rénover un objet ou garder une marge. Quel objectif guiderait votre décision ?",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
        "Consacrer la somme à une étape d’un projet à long terme.",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
        "Faire une place à une expérience significative dans le présent.",
      ],
    },
    [
      {
        BALANCER: 1,
      },
      {
        BUILDER: 1,
      },
      {
        STRATEGIST: 1,
      },
      {
        ADVENTURER: 1,
      },
    ],
    "HARD",
  ),
  scenario(
    "MD2_33",
    33,
    "GUARDIAN",
    {
      pt: [
        "Sua renda varia a cada mês e surgiu uma despesa anual previsível. Como priorizaria o dinheiro que sobrou?",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        "Dar espaço a uma experiência significativa no presente.",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
      ],
      en: [
        "Your income varies monthly and a predictable annual bill is approaching. How would you prioritise the money left?",
        "Use the money for a step in a long-term project.",
        "Compare costs, timing and impact before allocating the money.",
        "Make room for a meaningful experience in the present.",
        "Split the margin between a current need and a future goal.",
      ],
      es: [
        "Tus ingresos varían cada mes y se acerca un gasto anual previsible. ¿Cómo priorizarías el dinero restante?",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
        "Dar espacio a una experiencia significativa en el presente.",
        "Repartir el margen entre una necesidad actual y una meta futura.",
      ],
      fr: [
        "Vos revenus varient et une facture annuelle prévisible approche. Comment affecter votre marge ?",
        "Consacrer la somme à une étape d’un projet à long terme.",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
        "Faire une place à une expérience significative dans le présent.",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
      ],
    },
    [
      {
        BUILDER: 1,
      },
      {
        STRATEGIST: 1,
      },
      {
        ADVENTURER: 1,
      },
      {
        BALANCER: 1,
      },
    ],
    "EASY",
  ),
  scenario(
    "MD2_34",
    34,
    "GUARDIAN",
    {
      pt: [
        "Uma manutenção doméstica pode ser feita agora ou adiada por alguns meses. Como decidiria o uso desse dinheiro?",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        "Dar espaço a uma experiência significativa no presente.",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
      ],
      en: [
        "Home maintenance can happen now or in a few months. How would you decide how to use that money?",
        "Keep the money to preserve my cushion for unexpected costs.",
        "Make room for a meaningful experience in the present.",
        "Split the margin between a current need and a future goal.",
        "Use the money for a step in a long-term project.",
      ],
      es: [
        "Un mantenimiento doméstico puede hacerse ahora o aplazarse unos meses. ¿Cómo decidirías usar ese dinero?",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
        "Dar espacio a una experiencia significativa en el presente.",
        "Repartir el margen entre una necesidad actual y una meta futura.",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
      ],
      fr: [
        "Un entretien du logement peut se faire maintenant ou dans quelques mois. Comment affecter cette somme ?",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
        "Faire une place à une expérience significative dans le présent.",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
        "Consacrer la somme à une étape d’un projet à long terme.",
      ],
    },
    [
      {
        GUARDIAN: 1,
      },
      {
        ADVENTURER: 1,
      },
      {
        BALANCER: 1,
      },
      {
        BUILDER: 1,
      },
    ],
    "EASY",
  ),
  scenario(
    "MD2_35",
    35,
    "GUARDIAN",
    {
      pt: [
        "Seu contrato de trabalho será renovado em breve e você recebeu um valor extra. Qual destino consideraria primeiro?",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
      ],
      en: [
        "Your work contract is due for renewal and you received extra money. Which use would you consider first?",
        "Compare costs, timing and impact before allocating the money.",
        "Split the margin between a current need and a future goal.",
        "Use the money for a step in a long-term project.",
        "Keep the money to preserve my cushion for unexpected costs.",
      ],
      es: [
        "Tu contrato laboral se renovará pronto y recibiste un extra. ¿Qué destino considerarías primero?",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
        "Repartir el margen entre una necesidad actual y una meta futura.",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
      ],
      fr: [
        "Votre contrat de travail arrive à renouvellement et vous recevez un supplément. Quel usage considérer en premier ?",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
        "Consacrer la somme à une étape d’un projet à long terme.",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
      ],
    },
    [
      {
        STRATEGIST: 1,
      },
      {
        BALANCER: 1,
      },
      {
        BUILDER: 1,
      },
      {
        GUARDIAN: 1,
      },
    ],
    "EASY",
  ),
  scenario(
    "MD2_36",
    36,
    "GUARDIAN",
    {
      pt: [
        "Um eletrodoméstico antigo ainda funciona, mas pode precisar de reparo. Há uma pequena folga no orçamento. Como a usaria?",
        "Dar espaço a uma experiência significativa no presente.",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
      ],
      en: [
        "An old appliance still works but may need repairs. Your budget has a little room. How would you use it?",
        "Make room for a meaningful experience in the present.",
        "Use the money for a step in a long-term project.",
        "Keep the money to preserve my cushion for unexpected costs.",
        "Compare costs, timing and impact before allocating the money.",
      ],
      es: [
        "Un electrodoméstico antiguo funciona, pero puede necesitar reparación. Tienes algo de margen. ¿Cómo lo usarías?",
        "Dar espacio a una experiencia significativa en el presente.",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
      ],
      fr: [
        "Un appareil ancien fonctionne encore mais pourrait nécessiter une réparation. Comment utiliser une petite marge ?",
        "Faire une place à une expérience significative dans le présent.",
        "Consacrer la somme à une étape d’un projet à long terme.",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
      ],
    },
    [
      {
        ADVENTURER: 1,
      },
      {
        BUILDER: 1,
      },
      {
        GUARDIAN: 1,
      },
      {
        STRATEGIST: 1,
      },
    ],
    "MEDIUM",
  ),
  scenario(
    "MD2_37",
    37,
    "GUARDIAN",
    {
      pt: [
        "Você vai mudar de casa e os custos finais ainda não estão claros. Qual prioridade daria ao dinheiro disponível?",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        "Dar espaço a uma experiência significativa no presente.",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
      ],
      en: [
        "You are moving home and final costs are unclear. What priority would you give the available money?",
        "Keep the money to preserve my cushion for unexpected costs.",
        "Compare costs, timing and impact before allocating the money.",
        "Make room for a meaningful experience in the present.",
        "Split the margin between a current need and a future goal.",
      ],
      es: [
        "Vas a mudarte y los costes finales no están claros. ¿Qué prioridad darías al dinero disponible?",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
        "Dar espacio a una experiencia significativa en el presente.",
        "Repartir el margen entre una necesidad actual y una meta futura.",
      ],
      fr: [
        "Vous déménagez et les frais finaux restent incertains. Quelle priorité donner à l’argent disponible ?",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
        "Faire une place à une expérience significative dans le présent.",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
      ],
    },
    [
      {
        GUARDIAN: 1,
      },
      {
        STRATEGIST: 1,
      },
      {
        ADVENTURER: 1,
      },
      {
        BALANCER: 1,
      },
    ],
    "MEDIUM",
  ),
  scenario(
    "MD2_38",
    38,
    "GUARDIAN",
    {
      pt: [
        "Uma despesa de transporte caiu e liberou um valor recorrente. Como decidiria o destino dessa nova margem?",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        "Dar espaço a uma experiência significativa no presente.",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
      ],
      en: [
        "Transport costs fell, freeing a recurring amount. How would you decide what to do with this new margin?",
        "Compare costs, timing and impact before allocating the money.",
        "Make room for a meaningful experience in the present.",
        "Split the margin between a current need and a future goal.",
        "Use the money for a step in a long-term project.",
      ],
      es: [
        "Bajó un gasto de transporte y liberó una cantidad recurrente. ¿Cómo decidirías usar ese nuevo margen?",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
        "Dar espacio a una experiencia significativa en el presente.",
        "Repartir el margen entre una necesidad actual y una meta futura.",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
      ],
      fr: [
        "Les frais de transport baissent et libèrent une somme régulière. Comment affecter cette nouvelle marge ?",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
        "Faire une place à une expérience significative dans le présent.",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
        "Consacrer la somme à une étape d’un projet à long terme.",
      ],
    },
    [
      {
        STRATEGIST: 1,
      },
      {
        ADVENTURER: 1,
      },
      {
        BALANCER: 1,
      },
      {
        BUILDER: 1,
      },
    ],
    "MEDIUM",
  ),
  scenario(
    "MD2_39",
    39,
    "GUARDIAN",
    {
      pt: [
        "Você está perto de atingir sua reserva planejada e recebeu um convite pago. Qual prioridade guiaria a escolha?",
        "Dar espaço a uma experiência significativa no presente.",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
      ],
      en: [
        "You are close to your planned savings cushion and receive a paid invitation. Which priority would guide your choice?",
        "Make room for a meaningful experience in the present.",
        "Split the margin between a current need and a future goal.",
        "Use the money for a step in a long-term project.",
        "Keep the money to preserve my cushion for unexpected costs.",
      ],
      es: [
        "Estás cerca de tu reserva prevista y recibes una invitación de pago. ¿Qué prioridad guiaría tu elección?",
        "Dar espacio a una experiencia significativa en el presente.",
        "Repartir el margen entre una necesidad actual y una meta futura.",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
      ],
      fr: [
        "Vous approchez de votre réserve prévue et recevez une invitation payante. Quelle priorité guiderait votre choix ?",
        "Faire une place à une expérience significative dans le présent.",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
        "Consacrer la somme à une étape d’un projet à long terme.",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
      ],
    },
    [
      {
        ADVENTURER: 1,
      },
      {
        BALANCER: 1,
      },
      {
        BUILDER: 1,
      },
      {
        GUARDIAN: 1,
      },
    ],
    "HARD",
  ),
  scenario(
    "MD2_40",
    40,
    "GUARDIAN",
    {
      pt: [
        "Uma franquia de seguro pode aumentar no próximo ano. Hoje existe uma pequena quantia livre. Como decidiria usá-la?",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
      ],
      en: [
        "An insurance deductible may increase next year. You have a small amount free today. How would you use it?",
        "Split the margin between a current need and a future goal.",
        "Use the money for a step in a long-term project.",
        "Keep the money to preserve my cushion for unexpected costs.",
        "Compare costs, timing and impact before allocating the money.",
      ],
      es: [
        "La franquicia de un seguro puede subir el próximo año. Hoy tienes algo de dinero libre. ¿Cómo lo usarías?",
        "Repartir el margen entre una necesidad actual y una meta futura.",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
      ],
      fr: [
        "Une franchise d’assurance pourrait augmenter l’an prochain. Comment utiliser une petite somme disponible aujourd’hui ?",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
        "Consacrer la somme à une étape d’un projet à long terme.",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
      ],
    },
    [
      {
        BALANCER: 1,
      },
      {
        BUILDER: 1,
      },
      {
        GUARDIAN: 1,
      },
      {
        STRATEGIST: 1,
      },
    ],
    "HARD",
  ),
  scenario(
    "MD2_41",
    41,
    "GUARDIAN",
    {
      pt: [
        "Seu trabalho autônomo teve um mês bom, mas o próximo ainda não tem contratos. Qual uso daria à diferença?",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        "Dar espaço a uma experiência significativa no presente.",
      ],
      en: [
        "Your freelance work had a good month, but next month has no contracts yet. How would you use the difference?",
        "Use the money for a step in a long-term project.",
        "Keep the money to preserve my cushion for unexpected costs.",
        "Compare costs, timing and impact before allocating the money.",
        "Make room for a meaningful experience in the present.",
      ],
      es: [
        "Tu trabajo autónomo tuvo un buen mes, pero el siguiente aún no tiene contratos. ¿Cómo usarías la diferencia?",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
        "Dar espacio a una experiencia significativa en el presente.",
      ],
      fr: [
        "Votre activité indépendante a bien marché ce mois-ci, sans contrat pour le suivant. Comment utiliser l’écart ?",
        "Consacrer la somme à une étape d’un projet à long terme.",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
        "Faire une place à une expérience significative dans le présent.",
      ],
    },
    [
      {
        BUILDER: 1,
      },
      {
        GUARDIAN: 1,
      },
      {
        STRATEGIST: 1,
      },
      {
        ADVENTURER: 1,
      },
    ],
    "HARD",
  ),
  scenario(
    "MD2_42",
    42,
    "GUARDIAN",
    {
      pt: [
        "Uma conta foi menor do que o previsto e sua rotina segue estável. Como escolheria o destino da economia?",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        "Dar espaço a uma experiência significativa no presente.",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
      ],
      en: [
        "A bill was lower than expected and your routine is stable. How would you allocate the savings?",
        "Compare costs, timing and impact before allocating the money.",
        "Make room for a meaningful experience in the present.",
        "Split the margin between a current need and a future goal.",
        "Keep the money to preserve my cushion for unexpected costs.",
      ],
      es: [
        "Una factura fue menor de lo previsto y tu rutina sigue estable. ¿Cómo destinarías el ahorro?",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
        "Dar espacio a una experiencia significativa en el presente.",
        "Repartir el margen entre una necesidad actual y una meta futura.",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
      ],
      fr: [
        "Une facture est inférieure aux prévisions et votre routine reste stable. Comment affecter cette économie ?",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
        "Faire une place à une expérience significative dans le présent.",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
      ],
    },
    [
      {
        STRATEGIST: 1,
      },
      {
        ADVENTURER: 1,
      },
      {
        BALANCER: 1,
      },
      {
        GUARDIAN: 1,
      },
    ],
    "HARD",
  ),
  scenario(
    "MD2_43",
    43,
    "GUARDIAN",
    {
      pt: [
        "Você planeja uma pausa no trabalho dentro de alguns meses. Qual prioridade financeira adotaria com o saldo atual?",
        "Dar espaço a uma experiência significativa no presente.",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
      ],
      en: [
        "You plan a work break in a few months. What financial priority would you adopt for your current balance?",
        "Make room for a meaningful experience in the present.",
        "Split the margin between a current need and a future goal.",
        "Use the money for a step in a long-term project.",
        "Compare costs, timing and impact before allocating the money.",
      ],
      es: [
        "Planeas una pausa laboral dentro de unos meses. ¿Qué prioridad financiera adoptarías con el saldo actual?",
        "Dar espacio a una experiencia significativa en el presente.",
        "Repartir el margen entre una necesidad actual y una meta futura.",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
      ],
      fr: [
        "Vous prévoyez une pause professionnelle dans quelques mois. Quelle priorité donner à votre solde actuel ?",
        "Faire une place à une expérience significative dans le présent.",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
        "Consacrer la somme à une étape d’un projet à long terme.",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
      ],
    },
    [
      {
        ADVENTURER: 1,
      },
      {
        BALANCER: 1,
      },
      {
        BUILDER: 1,
      },
      {
        STRATEGIST: 1,
      },
    ],
    "HARD",
  ),
  scenario(
    "MD2_44",
    44,
    "GUARDIAN",
    {
      pt: [
        "O custo de vida aumentou e você ainda tem alguma folga mensal. Como decidiria o que fazer com essa margem?",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        "Dar espaço a uma experiência significativa no presente.",
      ],
      en: [
        "Living costs rose and you still have some monthly room. How would you decide what to do with it?",
        "Split the margin between a current need and a future goal.",
        "Use the money for a step in a long-term project.",
        "Keep the money to preserve my cushion for unexpected costs.",
        "Make room for a meaningful experience in the present.",
      ],
      es: [
        "Subió el coste de vida y aún conservas algo de margen mensual. ¿Cómo decidirías qué hacer con él?",
        "Repartir el margen entre una necesidad actual y una meta futura.",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
        "Dar espacio a una experiencia significativa en el presente.",
      ],
      fr: [
        "Le coût de la vie augmente et il vous reste une marge mensuelle. Comment décider de son usage ?",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
        "Consacrer la somme à une étape d’un projet à long terme.",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
        "Faire une place à une expérience significative dans le présent.",
      ],
    },
    [
      {
        BALANCER: 1,
      },
      {
        BUILDER: 1,
      },
      {
        GUARDIAN: 1,
      },
      {
        ADVENTURER: 1,
      },
    ],
    "HARD",
  ),
  scenario(
    "MD2_45",
    45,
    "STRATEGIST",
    {
      pt: [
        "Dois planos de internet têm taxas e prazos diferentes. Como definiria sua prioridade financeira?",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        "Dar espaço a uma experiência significativa no presente.",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
      ],
      en: [
        "Two internet plans have different fees and terms. How would you set your financial priority?",
        "Use the money for a step in a long-term project.",
        "Keep the money to preserve my cushion for unexpected costs.",
        "Make room for a meaningful experience in the present.",
        "Split the margin between a current need and a future goal.",
      ],
      es: [
        "Dos planes de internet tienen cuotas y plazos distintos. ¿Cómo definirías tu prioridad financiera?",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
        "Dar espacio a una experiencia significativa en el presente.",
        "Repartir el margen entre una necesidad actual y una meta futura.",
      ],
      fr: [
        "Deux forfaits internet ont des frais et des durées différents. Comment définir votre priorité financière ?",
        "Consacrer la somme à une étape d’un projet à long terme.",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
        "Faire une place à une expérience significative dans le présent.",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
      ],
    },
    [
      {
        BUILDER: 1,
      },
      {
        GUARDIAN: 1,
      },
      {
        ADVENTURER: 1,
      },
      {
        BALANCER: 1,
      },
    ],
    "EASY",
  ),
  scenario(
    "MD2_46",
    46,
    "STRATEGIST",
    {
      pt: [
        "Uma compra parcelada tem custo total maior que o pagamento à vista. Como definiria sua prioridade financeira?",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
      ],
      en: [
        "An instalment purchase costs more overall than paying upfront. How would you set your financial priority?",
        "Keep the money to preserve my cushion for unexpected costs.",
        "Compare costs, timing and impact before allocating the money.",
        "Split the margin between a current need and a future goal.",
        "Use the money for a step in a long-term project.",
      ],
      es: [
        "Una compra a plazos cuesta más en total que al contado. ¿Cómo definirías tu prioridad financiera?",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
        "Repartir el margen entre una necesidad actual y una meta futura.",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
      ],
      fr: [
        "Un achat échelonné coûte plus cher au total que le paiement comptant. Comment définir votre priorité financière ?",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
        "Consacrer la somme à une étape d’un projet à long terme.",
      ],
    },
    [
      {
        GUARDIAN: 1,
      },
      {
        STRATEGIST: 1,
      },
      {
        BALANCER: 1,
      },
      {
        BUILDER: 1,
      },
    ],
    "EASY",
  ),
  scenario(
    "MD2_47",
    47,
    "STRATEGIST",
    {
      pt: [
        "Você recebe duas propostas de trabalho com benefícios diferentes. Como definiria sua prioridade financeira?",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        "Dar espaço a uma experiência significativa no presente.",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
      ],
      en: [
        "You receive two job offers with different benefits. How would you set your financial priority?",
        "Compare costs, timing and impact before allocating the money.",
        "Make room for a meaningful experience in the present.",
        "Use the money for a step in a long-term project.",
        "Keep the money to preserve my cushion for unexpected costs.",
      ],
      es: [
        "Recibes dos ofertas laborales con prestaciones diferentes. ¿Cómo definirías tu prioridad financiera?",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
        "Dar espacio a una experiencia significativa en el presente.",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
      ],
      fr: [
        "Vous recevez deux offres d’emploi aux avantages différents. Comment définir votre priorité financière ?",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
        "Faire une place à une expérience significative dans le présent.",
        "Consacrer la somme à une étape d’un projet à long terme.",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
      ],
    },
    [
      {
        STRATEGIST: 1,
      },
      {
        ADVENTURER: 1,
      },
      {
        BUILDER: 1,
      },
      {
        GUARDIAN: 1,
      },
    ],
    "EASY",
  ),
  scenario(
    "MD2_48",
    48,
    "STRATEGIST",
    {
      pt: [
        "Um desconto por volume exige comprar mais do que você usa no mês. Como definiria sua prioridade financeira?",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        "Dar espaço a uma experiência significativa no presente.",
      ],
      en: [
        "A bulk discount requires buying more than you use in a month. How would you set your financial priority?",
        "Split the margin between a current need and a future goal.",
        "Keep the money to preserve my cushion for unexpected costs.",
        "Compare costs, timing and impact before allocating the money.",
        "Make room for a meaningful experience in the present.",
      ],
      es: [
        "Un descuento por volumen exige comprar más de lo que usas al mes. ¿Cómo definirías tu prioridad financiera?",
        "Repartir el margen entre una necesidad actual y una meta futura.",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
        "Dar espacio a una experiencia significativa en el presente.",
      ],
      fr: [
        "Une remise en volume exige d’acheter plus que votre usage mensuel. Comment définir votre priorité financière ?",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
        "Faire une place à une expérience significative dans le présent.",
      ],
    },
    [
      {
        BALANCER: 1,
      },
      {
        GUARDIAN: 1,
      },
      {
        STRATEGIST: 1,
      },
      {
        ADVENTURER: 1,
      },
    ],
    "MEDIUM",
  ),
  scenario(
    "MD2_49",
    49,
    "STRATEGIST",
    {
      pt: [
        "Uma mensalidade baixa esconde uma taxa de adesão elevada. Como definiria sua prioridade financeira?",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        "Dar espaço a uma experiência significativa no presente.",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
      ],
      en: [
        "A low monthly fee comes with a high joining charge. How would you set your financial priority?",
        "Use the money for a step in a long-term project.",
        "Compare costs, timing and impact before allocating the money.",
        "Make room for a meaningful experience in the present.",
        "Split the margin between a current need and a future goal.",
      ],
      es: [
        "Una cuota mensual baja incluye un alta elevada. ¿Cómo definirías tu prioridad financiera?",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
        "Dar espacio a una experiencia significativa en el presente.",
        "Repartir el margen entre una necesidad actual y una meta futura.",
      ],
      fr: [
        "Une mensualité faible s’accompagne de frais d’adhésion élevés. Comment définir votre priorité financière ?",
        "Consacrer la somme à une étape d’un projet à long terme.",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
        "Faire une place à une expérience significative dans le présent.",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
      ],
    },
    [
      {
        BUILDER: 1,
      },
      {
        STRATEGIST: 1,
      },
      {
        ADVENTURER: 1,
      },
      {
        BALANCER: 1,
      },
    ],
    "MEDIUM",
  ),
  scenario(
    "MD2_50",
    50,
    "STRATEGIST",
    {
      pt: [
        "Um serviço novo promete economizar tempo mas exige contrato anual. Como definiria sua prioridade financeira?",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        "Dar espaço a uma experiência significativa no presente.",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
      ],
      en: [
        "A new service promises time savings but needs an annual contract. How would you set your financial priority?",
        "Keep the money to preserve my cushion for unexpected costs.",
        "Make room for a meaningful experience in the present.",
        "Split the margin between a current need and a future goal.",
        "Use the money for a step in a long-term project.",
      ],
      es: [
        "Un servicio promete ahorrar tiempo, pero exige contrato anual. ¿Cómo definirías tu prioridad financiera?",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
        "Dar espacio a una experiencia significativa en el presente.",
        "Repartir el margen entre una necesidad actual y una meta futura.",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
      ],
      fr: [
        "Un nouveau service promet du temps gagné mais exige un contrat annuel. Comment définir votre priorité financière ?",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
        "Faire une place à une expérience significative dans le présent.",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
        "Consacrer la somme à une étape d’un projet à long terme.",
      ],
    },
    [
      {
        GUARDIAN: 1,
      },
      {
        ADVENTURER: 1,
      },
      {
        BALANCER: 1,
      },
      {
        BUILDER: 1,
      },
    ],
    "MEDIUM",
  ),
  scenario(
    "MD2_51",
    51,
    "STRATEGIST",
    {
      pt: [
        "Você pode alugar ou comprar um equipamento de uso ocasional. Como definiria sua prioridade financeira?",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
      ],
      en: [
        "You can rent or buy equipment you only use occasionally. How would you set your financial priority?",
        "Compare costs, timing and impact before allocating the money.",
        "Split the margin between a current need and a future goal.",
        "Use the money for a step in a long-term project.",
        "Keep the money to preserve my cushion for unexpected costs.",
      ],
      es: [
        "Puedes alquilar o comprar un equipo de uso ocasional. ¿Cómo definirías tu prioridad financiera?",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
        "Repartir el margen entre una necesidad actual y una meta futura.",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
      ],
      fr: [
        "Vous pouvez louer ou acheter un équipement utilisé occasionnellement. Comment définir votre priorité financière ?",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
        "Consacrer la somme à une étape d’un projet à long terme.",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
      ],
    },
    [
      {
        STRATEGIST: 1,
      },
      {
        BALANCER: 1,
      },
      {
        BUILDER: 1,
      },
      {
        GUARDIAN: 1,
      },
    ],
    "HARD",
  ),
  scenario(
    "MD2_52",
    52,
    "STRATEGIST",
    {
      pt: [
        "Uma escola oferece bolsa parcial mas exige custos de deslocamento. Como definiria sua prioridade financeira?",
        "Dar espaço a uma experiência significativa no presente.",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
      ],
      en: [
        "A school offers a partial scholarship with travel costs. How would you set your financial priority?",
        "Make room for a meaningful experience in the present.",
        "Use the money for a step in a long-term project.",
        "Keep the money to preserve my cushion for unexpected costs.",
        "Compare costs, timing and impact before allocating the money.",
      ],
      es: [
        "Una escuela ofrece beca parcial, pero exige gastos de transporte. ¿Cómo definirías tu prioridad financiera?",
        "Dar espacio a una experiencia significativa en el presente.",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
      ],
      fr: [
        "Une école offre une bourse partielle mais implique des frais de trajet. Comment définir votre priorité financière ?",
        "Faire une place à une expérience significative dans le présent.",
        "Consacrer la somme à une étape d’un projet à long terme.",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
      ],
    },
    [
      {
        ADVENTURER: 1,
      },
      {
        BUILDER: 1,
      },
      {
        GUARDIAN: 1,
      },
      {
        STRATEGIST: 1,
      },
    ],
    "HARD",
  ),
  scenario(
    "MD2_53",
    53,
    "STRATEGIST",
    {
      pt: [
        "Trocar de banco reduz tarifas mas exige reorganizar os pagamentos. Como definiria sua prioridade financeira?",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        "Dar espaço a uma experiência significativa no presente.",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
      ],
      en: [
        "Changing banks lowers fees but requires reorganising payments. How would you set your financial priority?",
        "Keep the money to preserve my cushion for unexpected costs.",
        "Compare costs, timing and impact before allocating the money.",
        "Make room for a meaningful experience in the present.",
        "Split the margin between a current need and a future goal.",
      ],
      es: [
        "Cambiar de banco reduce comisiones, pero exige reorganizar pagos. ¿Cómo definirías tu prioridad financiera?",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
        "Dar espacio a una experiencia significativa en el presente.",
        "Repartir el margen entre una necesidad actual y una meta futura.",
      ],
      fr: [
        "Changer de banque réduit les frais mais exige de réorganiser les paiements. Comment définir votre priorité financière ?",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
        "Faire une place à une expérience significative dans le présent.",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
      ],
    },
    [
      {
        GUARDIAN: 1,
      },
      {
        STRATEGIST: 1,
      },
      {
        ADVENTURER: 1,
      },
      {
        BALANCER: 1,
      },
    ],
    "HARD",
  ),
  scenario(
    "MD2_54",
    54,
    "STRATEGIST",
    {
      pt: [
        "Um pacote de férias inclui atividades que você talvez não use. Como definiria sua prioridade financeira?",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        "Dar espaço a uma experiência significativa no presente.",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
      ],
      en: [
        "A holiday package includes activities you may not use. How would you set your financial priority?",
        "Compare costs, timing and impact before allocating the money.",
        "Make room for a meaningful experience in the present.",
        "Split the margin between a current need and a future goal.",
        "Use the money for a step in a long-term project.",
      ],
      es: [
        "Un paquete de vacaciones incluye actividades que quizá no uses. ¿Cómo definirías tu prioridad financiera?",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
        "Dar espacio a una experiencia significativa en el presente.",
        "Repartir el margen entre una necesidad actual y una meta futura.",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
      ],
      fr: [
        "Un forfait vacances inclut des activités que vous n’utiliserez peut-être pas. Comment définir votre priorité financière ?",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
        "Faire une place à une expérience significative dans le présent.",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
        "Consacrer la somme à une étape d’un projet à long terme.",
      ],
    },
    [
      {
        STRATEGIST: 1,
      },
      {
        ADVENTURER: 1,
      },
      {
        BALANCER: 1,
      },
      {
        BUILDER: 1,
      },
    ],
    "HARD",
  ),
  scenario(
    "MD2_55",
    55,
    "STRATEGIST",
    {
      pt: [
        "Uma assinatura oferece desconto se você antecipar um ano inteiro. Como definiria sua prioridade financeira?",
        "Dar espaço a uma experiência significativa no presente.",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
      ],
      en: [
        "A subscription discounts a full year paid in advance. How would you set your financial priority?",
        "Make room for a meaningful experience in the present.",
        "Split the margin between a current need and a future goal.",
        "Use the money for a step in a long-term project.",
        "Keep the money to preserve my cushion for unexpected costs.",
      ],
      es: [
        "Una suscripción ofrece descuento al anticipar un año entero. ¿Cómo definirías tu prioridad financiera?",
        "Dar espacio a una experiencia significativa en el presente.",
        "Repartir el margen entre una necesidad actual y una meta futura.",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
      ],
      fr: [
        "Un abonnement réduit son prix si vous payez une année d’avance. Comment définir votre priorité financière ?",
        "Faire une place à une expérience significative dans le présent.",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
        "Consacrer la somme à une étape d’un projet à long terme.",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
      ],
    },
    [
      {
        ADVENTURER: 1,
      },
      {
        BALANCER: 1,
      },
      {
        BUILDER: 1,
      },
      {
        GUARDIAN: 1,
      },
    ],
    "HARD",
  ),
  scenario(
    "MD2_56",
    56,
    "STRATEGIST",
    {
      pt: [
        "Uma promoção termina hoje mas você ainda não comparou alternativas. Como definiria sua prioridade financeira?",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
      ],
      en: [
        "A promotion ends today but you have not compared alternatives. How would you set your financial priority?",
        "Split the margin between a current need and a future goal.",
        "Use the money for a step in a long-term project.",
        "Keep the money to preserve my cushion for unexpected costs.",
        "Compare costs, timing and impact before allocating the money.",
      ],
      es: [
        "Una promoción termina hoy, pero aún no comparaste alternativas. ¿Cómo definirías tu prioridad financiera?",
        "Repartir el margen entre una necesidad actual y una meta futura.",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
      ],
      fr: [
        "Une promotion finit aujourd’hui sans que vous ayez comparé les alternatives. Comment définir votre priorité financière ?",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
        "Consacrer la somme à une étape d’un projet à long terme.",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
      ],
    },
    [
      {
        BALANCER: 1,
      },
      {
        BUILDER: 1,
      },
      {
        GUARDIAN: 1,
      },
      {
        STRATEGIST: 1,
      },
    ],
    "HARD",
  ),
  scenario(
    "MD2_57",
    57,
    "ADVENTURER",
    {
      pt: [
        "Amigos propõem uma viagem curta fora dos seus planos. Como definiria sua prioridade financeira?",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
      ],
      en: [
        "Friends suggest a short trip outside your plans. How would you set your financial priority?",
        "Use the money for a step in a long-term project.",
        "Keep the money to preserve my cushion for unexpected costs.",
        "Compare costs, timing and impact before allocating the money.",
        "Split the margin between a current need and a future goal.",
      ],
      es: [
        "Amigos proponen un viaje corto fuera de tus planes. ¿Cómo definirías tu prioridad financiera?",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
        "Repartir el margen entre una necesidad actual y una meta futura.",
      ],
      fr: [
        "Des amis proposent un court voyage imprévu. Comment définir votre priorité financière ?",
        "Consacrer la somme à une étape d’un projet à long terme.",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
      ],
    },
    [
      {
        BUILDER: 1,
      },
      {
        GUARDIAN: 1,
      },
      {
        STRATEGIST: 1,
      },
      {
        BALANCER: 1,
      },
    ],
    "EASY",
  ),
  scenario(
    "MD2_58",
    58,
    "ADVENTURER",
    {
      pt: [
        "Um artista de que você gosta fará um único show na cidade. Como definiria sua prioridade financeira?",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        "Dar espaço a uma experiência significativa no presente.",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
      ],
      en: [
        "An artist you enjoy will perform one show in town. How would you set your financial priority?",
        "Keep the money to preserve my cushion for unexpected costs.",
        "Compare costs, timing and impact before allocating the money.",
        "Make room for a meaningful experience in the present.",
        "Use the money for a step in a long-term project.",
      ],
      es: [
        "Un artista que te gusta dará un único concierto en tu ciudad. ¿Cómo definirías tu prioridad financiera?",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
        "Dar espacio a una experiencia significativa en el presente.",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
      ],
      fr: [
        "Un artiste que vous aimez donne un seul concert en ville. Comment définir votre priorité financière ?",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
        "Faire une place à une expérience significative dans le présent.",
        "Consacrer la somme à une étape d’un projet à long terme.",
      ],
    },
    [
      {
        GUARDIAN: 1,
      },
      {
        STRATEGIST: 1,
      },
      {
        ADVENTURER: 1,
      },
      {
        BUILDER: 1,
      },
    ],
    "EASY",
  ),
  scenario(
    "MD2_59",
    59,
    "ADVENTURER",
    {
      pt: [
        "Uma aula experimental paga desperta sua curiosidade. Como definiria sua prioridade financeira?",
        "Dar espaço a uma experiência significativa no presente.",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
      ],
      en: [
        "A paid introductory class sparks your curiosity. How would you set your financial priority?",
        "Make room for a meaningful experience in the present.",
        "Split the margin between a current need and a future goal.",
        "Keep the money to preserve my cushion for unexpected costs.",
        "Compare costs, timing and impact before allocating the money.",
      ],
      es: [
        "Una clase de prueba de pago despierta tu curiosidad. ¿Cómo definirías tu prioridad financiera?",
        "Dar espacio a una experiencia significativa en el presente.",
        "Repartir el margen entre una necesidad actual y una meta futura.",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
      ],
      fr: [
        "Un cours d’essai payant éveille votre curiosité. Comment définir votre priorité financière ?",
        "Faire une place à une expérience significative dans le présent.",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
      ],
    },
    [
      {
        ADVENTURER: 1,
      },
      {
        BALANCER: 1,
      },
      {
        GUARDIAN: 1,
      },
      {
        STRATEGIST: 1,
      },
    ],
    "EASY",
  ),
  scenario(
    "MD2_60",
    60,
    "ADVENTURER",
    {
      pt: [
        "Uma experiência gastronômica custa o mesmo que sua folga semanal. Como definiria sua prioridade financeira?",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        "Dar espaço a uma experiência significativa no presente.",
      ],
      en: [
        "A dining experience costs your entire weekly spare budget. How would you set your financial priority?",
        "Split the margin between a current need and a future goal.",
        "Use the money for a step in a long-term project.",
        "Compare costs, timing and impact before allocating the money.",
        "Make room for a meaningful experience in the present.",
      ],
      es: [
        "Una experiencia gastronómica cuesta todo tu margen semanal. ¿Cómo definirías tu prioridad financiera?",
        "Repartir el margen entre una necesidad actual y una meta futura.",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
        "Dar espacio a una experiencia significativa en el presente.",
      ],
      fr: [
        "Une expérience gastronomique coûte toute votre marge hebdomadaire. Comment définir votre priorité financière ?",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
        "Consacrer la somme à une étape d’un projet à long terme.",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
        "Faire une place à une expérience significative dans le présent.",
      ],
    },
    [
      {
        BALANCER: 1,
      },
      {
        BUILDER: 1,
      },
      {
        STRATEGIST: 1,
      },
      {
        ADVENTURER: 1,
      },
    ],
    "MEDIUM",
  ),
  scenario(
    "MD2_61",
    61,
    "ADVENTURER",
    {
      pt: [
        "Surge uma vaga de última hora em um passeio de fim de semana. Como definiria sua prioridade financeira?",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        "Dar espaço a uma experiência significativa no presente.",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
      ],
      en: [
        "A last-minute place opens on a weekend outing. How would you set your financial priority?",
        "Use the money for a step in a long-term project.",
        "Keep the money to preserve my cushion for unexpected costs.",
        "Make room for a meaningful experience in the present.",
        "Split the margin between a current need and a future goal.",
      ],
      es: [
        "Surge una plaza de última hora para una excursión de fin de semana. ¿Cómo definirías tu prioridad financiera?",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
        "Dar espacio a una experiencia significativa en el presente.",
        "Repartir el margen entre una necesidad actual y una meta futura.",
      ],
      fr: [
        "Une place se libère au dernier moment pour une sortie de week-end. Comment définir votre priorité financière ?",
        "Consacrer la somme à une étape d’un projet à long terme.",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
        "Faire une place à une expérience significative dans le présent.",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
      ],
    },
    [
      {
        BUILDER: 1,
      },
      {
        GUARDIAN: 1,
      },
      {
        ADVENTURER: 1,
      },
      {
        BALANCER: 1,
      },
    ],
    "MEDIUM",
  ),
  scenario(
    "MD2_62",
    62,
    "ADVENTURER",
    {
      pt: [
        "Você encontra uma atividade nova durante uma viagem já paga. Como definiria sua prioridade financeira?",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
      ],
      en: [
        "You find a new activity during an already paid trip. How would you set your financial priority?",
        "Keep the money to preserve my cushion for unexpected costs.",
        "Compare costs, timing and impact before allocating the money.",
        "Split the margin between a current need and a future goal.",
        "Use the money for a step in a long-term project.",
      ],
      es: [
        "Encuentras una actividad nueva durante un viaje ya pagado. ¿Cómo definirías tu prioridad financiera?",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
        "Repartir el margen entre una necesidad actual y una meta futura.",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
      ],
      fr: [
        "Vous découvrez une activité nouvelle lors d’un voyage déjà payé. Comment définir votre priorité financière ?",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
        "Consacrer la somme à une étape d’un projet à long terme.",
      ],
    },
    [
      {
        GUARDIAN: 1,
      },
      {
        STRATEGIST: 1,
      },
      {
        BALANCER: 1,
      },
      {
        BUILDER: 1,
      },
    ],
    "MEDIUM",
  ),
  scenario(
    "MD2_63",
    63,
    "ADVENTURER",
    {
      pt: [
        "Um hobby novo exige uma pequena compra inicial. Como definiria sua prioridade financeira?",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        "Dar espaço a uma experiência significativa no presente.",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
      ],
      en: [
        "A new hobby needs a small initial purchase. How would you set your financial priority?",
        "Compare costs, timing and impact before allocating the money.",
        "Make room for a meaningful experience in the present.",
        "Use the money for a step in a long-term project.",
        "Keep the money to preserve my cushion for unexpected costs.",
      ],
      es: [
        "Un nuevo pasatiempo exige una pequeña compra inicial. ¿Cómo definirías tu prioridad financiera?",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
        "Dar espacio a una experiencia significativa en el presente.",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
      ],
      fr: [
        "Un nouveau loisir nécessite un petit achat initial. Comment définir votre priorité financière ?",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
        "Faire une place à une expérience significative dans le présent.",
        "Consacrer la somme à une étape d’un projet à long terme.",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
      ],
    },
    [
      {
        STRATEGIST: 1,
      },
      {
        ADVENTURER: 1,
      },
      {
        BUILDER: 1,
      },
      {
        GUARDIAN: 1,
      },
    ],
    "HARD",
  ),
  scenario(
    "MD2_64",
    64,
    "ADVENTURER",
    {
      pt: [
        "Uma festa especial compete com outro uso do seu dinheiro livre. Como definiria sua prioridade financeira?",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        "Dar espaço a uma experiência significativa no presente.",
      ],
      en: [
        "A special party competes with another use of your spare money. How would you set your financial priority?",
        "Split the margin between a current need and a future goal.",
        "Keep the money to preserve my cushion for unexpected costs.",
        "Compare costs, timing and impact before allocating the money.",
        "Make room for a meaningful experience in the present.",
      ],
      es: [
        "Una fiesta especial compite con otro uso de tu dinero libre. ¿Cómo definirías tu prioridad financiera?",
        "Repartir el margen entre una necesidad actual y una meta futura.",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
        "Dar espacio a una experiencia significativa en el presente.",
      ],
      fr: [
        "Une fête spéciale concurrence un autre usage de votre argent disponible. Comment définir votre priorité financière ?",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
        "Faire une place à une expérience significative dans le présent.",
      ],
    },
    [
      {
        BALANCER: 1,
      },
      {
        GUARDIAN: 1,
      },
      {
        STRATEGIST: 1,
      },
      {
        ADVENTURER: 1,
      },
    ],
    "HARD",
  ),
  scenario(
    "MD2_65",
    65,
    "ADVENTURER",
    {
      pt: [
        "Você quer comemorar uma conquista depois de um mês exigente. Como definiria sua prioridade financeira?",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        "Dar espaço a uma experiência significativa no presente.",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
      ],
      en: [
        "You want to celebrate an achievement after a demanding month. How would you set your financial priority?",
        "Use the money for a step in a long-term project.",
        "Compare costs, timing and impact before allocating the money.",
        "Make room for a meaningful experience in the present.",
        "Split the margin between a current need and a future goal.",
      ],
      es: [
        "Quieres celebrar un logro tras un mes exigente. ¿Cómo definirías tu prioridad financiera?",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
        "Dar espacio a una experiencia significativa en el presente.",
        "Repartir el margen entre una necesidad actual y una meta futura.",
      ],
      fr: [
        "Vous souhaitez célébrer une réussite après un mois exigeant. Comment définir votre priorité financière ?",
        "Consacrer la somme à une étape d’un projet à long terme.",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
        "Faire une place à une expérience significative dans le présent.",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
      ],
    },
    [
      {
        BUILDER: 1,
      },
      {
        STRATEGIST: 1,
      },
      {
        ADVENTURER: 1,
      },
      {
        BALANCER: 1,
      },
    ],
    "HARD",
  ),
  scenario(
    "MD2_66",
    66,
    "ADVENTURER",
    {
      pt: [
        "Uma visita a alguém querido exige uma passagem que não estava prevista. Como definiria sua prioridade financeira?",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        "Dar espaço a uma experiência significativa no presente.",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
      ],
      en: [
        "Visiting a loved one requires an unplanned ticket. How would you set your financial priority?",
        "Keep the money to preserve my cushion for unexpected costs.",
        "Make room for a meaningful experience in the present.",
        "Split the margin between a current need and a future goal.",
        "Use the money for a step in a long-term project.",
      ],
      es: [
        "Visitar a alguien querido exige un billete que no estaba previsto. ¿Cómo definirías tu prioridad financiera?",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
        "Dar espacio a una experiencia significativa en el presente.",
        "Repartir el margen entre una necesidad actual y una meta futura.",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
      ],
      fr: [
        "Rendre visite à un proche exige un billet imprévu. Comment définir votre priorité financière ?",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
        "Faire une place à une expérience significative dans le présent.",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
        "Consacrer la somme à une étape d’un projet à long terme.",
      ],
    },
    [
      {
        GUARDIAN: 1,
      },
      {
        ADVENTURER: 1,
      },
      {
        BALANCER: 1,
      },
      {
        BUILDER: 1,
      },
    ],
    "HARD",
  ),
  scenario(
    "MD2_67",
    67,
    "ADVENTURER",
    {
      pt: [
        "Um festival local oferece atividades que você nunca experimentou. Como definiria sua prioridade financeira?",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
      ],
      en: [
        "A local festival offers activities you have never tried. How would you set your financial priority?",
        "Compare costs, timing and impact before allocating the money.",
        "Split the margin between a current need and a future goal.",
        "Use the money for a step in a long-term project.",
        "Keep the money to preserve my cushion for unexpected costs.",
      ],
      es: [
        "Un festival local ofrece actividades que nunca probaste. ¿Cómo definirías tu prioridad financiera?",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
        "Repartir el margen entre una necesidad actual y una meta futura.",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
      ],
      fr: [
        "Un festival local propose des activités que vous n’avez jamais essayées. Comment définir votre priorité financière ?",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
        "Consacrer la somme à une étape d’un projet à long terme.",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
      ],
    },
    [
      {
        STRATEGIST: 1,
      },
      {
        BALANCER: 1,
      },
      {
        BUILDER: 1,
      },
      {
        GUARDIAN: 1,
      },
    ],
    "HARD",
  ),
  scenario(
    "MD2_68",
    68,
    "ADVENTURER",
    {
      pt: [
        "Você pode prolongar suas férias por um dia mediante um custo extra. Como definiria sua prioridade financeira?",
        "Dar espaço a uma experiência significativa no presente.",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
      ],
      en: [
        "You can extend your holiday by a day for an extra cost. How would you set your financial priority?",
        "Make room for a meaningful experience in the present.",
        "Use the money for a step in a long-term project.",
        "Keep the money to preserve my cushion for unexpected costs.",
        "Compare costs, timing and impact before allocating the money.",
      ],
      es: [
        "Puedes alargar tus vacaciones un día pagando un extra. ¿Cómo definirías tu prioridad financiera?",
        "Dar espacio a una experiencia significativa en el presente.",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
      ],
      fr: [
        "Vous pouvez prolonger vos vacances d’un jour pour un supplément. Comment définir votre priorité financière ?",
        "Faire une place à une expérience significative dans le présent.",
        "Consacrer la somme à une étape d’un projet à long terme.",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
      ],
    },
    [
      {
        ADVENTURER: 1,
      },
      {
        BUILDER: 1,
      },
      {
        GUARDIAN: 1,
      },
      {
        STRATEGIST: 1,
      },
    ],
    "HARD",
  ),
  scenario(
    "MD2_69",
    69,
    "BALANCER",
    {
      pt: [
        "Uma semana cansativa aumentou seus gastos com conveniência. Como definiria sua prioridade financeira?",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        "Dar espaço a uma experiência significativa no presente.",
      ],
      en: [
        "A tiring week increased your convenience spending. How would you set your financial priority?",
        "Use the money for a step in a long-term project.",
        "Keep the money to preserve my cushion for unexpected costs.",
        "Compare costs, timing and impact before allocating the money.",
        "Make room for a meaningful experience in the present.",
      ],
      es: [
        "Una semana agotadora aumentó tus gastos de comodidad. ¿Cómo definirías tu prioridad financiera?",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
        "Dar espacio a una experiencia significativa en el presente.",
      ],
      fr: [
        "Une semaine fatigante a augmenté vos dépenses de commodité. Comment définir votre priorité financière ?",
        "Consacrer la somme à une étape d’un projet à long terme.",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
        "Faire une place à une expérience significative dans le présent.",
      ],
    },
    [
      {
        BUILDER: 1,
      },
      {
        GUARDIAN: 1,
      },
      {
        STRATEGIST: 1,
      },
      {
        ADVENTURER: 1,
      },
    ],
    "EASY",
  ),
  scenario(
    "MD2_70",
    70,
    "BALANCER",
    {
      pt: [
        "Você quer ajudar alguém sem comprometer suas próprias contas. Como definiria sua prioridade financeira?",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        "Dar espaço a uma experiência significativa no presente.",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
      ],
      en: [
        "You want to help someone while keeping your bills covered. How would you set your financial priority?",
        "Compare costs, timing and impact before allocating the money.",
        "Make room for a meaningful experience in the present.",
        "Split the margin between a current need and a future goal.",
        "Keep the money to preserve my cushion for unexpected costs.",
      ],
      es: [
        "Quieres ayudar a alguien sin comprometer tus propias facturas. ¿Cómo definirías tu prioridad financiera?",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
        "Dar espacio a una experiencia significativa en el presente.",
        "Repartir el margen entre una necesidad actual y una meta futura.",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
      ],
      fr: [
        "Vous voulez aider quelqu’un en préservant vos propres factures. Comment définir votre priorité financière ?",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
        "Faire une place à une expérience significative dans le présent.",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
      ],
    },
    [
      {
        STRATEGIST: 1,
      },
      {
        ADVENTURER: 1,
      },
      {
        BALANCER: 1,
      },
      {
        GUARDIAN: 1,
      },
    ],
    "EASY",
  ),
  scenario(
    "MD2_71",
    71,
    "BALANCER",
    {
      pt: [
        "Seu orçamento permite um pequeno prazer mas também há uma meta futura. Como definiria sua prioridade financeira?",
        "Dar espaço a uma experiência significativa no presente.",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
      ],
      en: [
        "Your budget allows a small treat alongside a future goal. How would you set your financial priority?",
        "Make room for a meaningful experience in the present.",
        "Split the margin between a current need and a future goal.",
        "Use the money for a step in a long-term project.",
        "Compare costs, timing and impact before allocating the money.",
      ],
      es: [
        "Tu presupuesto permite un pequeño gusto, pero también hay una meta futura. ¿Cómo definirías tu prioridad financiera?",
        "Dar espacio a una experiencia significativa en el presente.",
        "Repartir el margen entre una necesidad actual y una meta futura.",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
      ],
      fr: [
        "Votre budget permet un petit plaisir mais vous avez aussi un objectif futur. Comment définir votre priorité financière ?",
        "Faire une place à une expérience significative dans le présent.",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
        "Consacrer la somme à une étape d’un projet à long terme.",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
      ],
    },
    [
      {
        ADVENTURER: 1,
      },
      {
        BALANCER: 1,
      },
      {
        BUILDER: 1,
      },
      {
        STRATEGIST: 1,
      },
    ],
    "EASY",
  ),
  scenario(
    "MD2_72",
    72,
    "BALANCER",
    {
      pt: [
        "Você percebe que reduziu tanto os gastos que abandonou atividades importantes. Como definiria sua prioridade financeira?",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        "Dar espaço a uma experiência significativa no presente.",
      ],
      en: [
        "You notice spending cuts made you drop meaningful activities. How would you set your financial priority?",
        "Split the margin between a current need and a future goal.",
        "Use the money for a step in a long-term project.",
        "Keep the money to preserve my cushion for unexpected costs.",
        "Make room for a meaningful experience in the present.",
      ],
      es: [
        "Notas que redujiste tanto el gasto que dejaste actividades importantes. ¿Cómo definirías tu prioridad financiera?",
        "Repartir el margen entre una necesidad actual y una meta futura.",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
        "Dar espacio a una experiencia significativa en el presente.",
      ],
      fr: [
        "Vous constatez que vos économies vous ont fait abandonner des activités importantes. Comment définir votre priorité financière ?",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
        "Consacrer la somme à une étape d’un projet à long terme.",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
        "Faire une place à une expérience significative dans le présent.",
      ],
    },
    [
      {
        BALANCER: 1,
      },
      {
        BUILDER: 1,
      },
      {
        GUARDIAN: 1,
      },
      {
        ADVENTURER: 1,
      },
    ],
    "MEDIUM",
  ),
  scenario(
    "MD2_73",
    73,
    "BALANCER",
    {
      pt: [
        "Um convite social recorrente pesa no orçamento do mês. Como definiria sua prioridade financeira?",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
      ],
      en: [
        "A recurring social invitation weighs on this month’s budget. How would you set your financial priority?",
        "Use the money for a step in a long-term project.",
        "Keep the money to preserve my cushion for unexpected costs.",
        "Compare costs, timing and impact before allocating the money.",
        "Split the margin between a current need and a future goal.",
      ],
      es: [
        "Una invitación social recurrente pesa en el presupuesto mensual. ¿Cómo definirías tu prioridad financiera?",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
        "Repartir el margen entre una necesidad actual y una meta futura.",
      ],
      fr: [
        "Une invitation sociale régulière pèse sur le budget du mois. Comment définir votre priorité financière ?",
        "Consacrer la somme à une étape d’un projet à long terme.",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
      ],
    },
    [
      {
        BUILDER: 1,
      },
      {
        GUARDIAN: 1,
      },
      {
        STRATEGIST: 1,
      },
      {
        BALANCER: 1,
      },
    ],
    "MEDIUM",
  ),
  scenario(
    "MD2_74",
    74,
    "BALANCER",
    {
      pt: [
        "Você precisa conciliar gastos de saúde cotidiana com lazer. Como definiria sua prioridade financeira?",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        "Dar espaço a uma experiência significativa no presente.",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
      ],
      en: [
        "You need to balance everyday health spending and leisure. How would you set your financial priority?",
        "Keep the money to preserve my cushion for unexpected costs.",
        "Compare costs, timing and impact before allocating the money.",
        "Make room for a meaningful experience in the present.",
        "Use the money for a step in a long-term project.",
      ],
      es: [
        "Necesitas conciliar gastos de salud cotidiana y ocio. ¿Cómo definirías tu prioridad financiera?",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
        "Dar espacio a una experiencia significativa en el presente.",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
      ],
      fr: [
        "Vous devez concilier dépenses de santé courantes et loisirs. Comment définir votre priorité financière ?",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
        "Faire une place à une expérience significative dans le présent.",
        "Consacrer la somme à une étape d’un projet à long terme.",
      ],
    },
    [
      {
        GUARDIAN: 1,
      },
      {
        STRATEGIST: 1,
      },
      {
        ADVENTURER: 1,
      },
      {
        BUILDER: 1,
      },
    ],
    "MEDIUM",
  ),
  scenario(
    "MD2_75",
    75,
    "BALANCER",
    {
      pt: [
        "Uma pessoa sugere cortar todo lazer para atingir uma meta mais rápido. Como definiria sua prioridade financeira?",
        "Dar espaço a uma experiência significativa no presente.",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
      ],
      en: [
        "Someone suggests cutting all leisure to reach a goal sooner. How would you set your financial priority?",
        "Make room for a meaningful experience in the present.",
        "Split the margin between a current need and a future goal.",
        "Keep the money to preserve my cushion for unexpected costs.",
        "Compare costs, timing and impact before allocating the money.",
      ],
      es: [
        "Alguien propone cortar todo ocio para alcanzar antes una meta. ¿Cómo definirías tu prioridad financiera?",
        "Dar espacio a una experiencia significativa en el presente.",
        "Repartir el margen entre una necesidad actual y una meta futura.",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
      ],
      fr: [
        "Quelqu’un propose de supprimer tous les loisirs pour atteindre un objectif plus vite. Comment définir votre priorité financière ?",
        "Faire une place à une expérience significative dans le présent.",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
      ],
    },
    [
      {
        ADVENTURER: 1,
      },
      {
        BALANCER: 1,
      },
      {
        GUARDIAN: 1,
      },
      {
        STRATEGIST: 1,
      },
    ],
    "HARD",
  ),
  scenario(
    "MD2_76",
    76,
    "BALANCER",
    {
      pt: [
        "Você conseguiu economizar mas sente falta de encontros com amigos. Como definiria sua prioridade financeira?",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        "Dar espaço a uma experiência significativa no presente.",
      ],
      en: [
        "You saved money but miss meeting friends. How would you set your financial priority?",
        "Split the margin between a current need and a future goal.",
        "Use the money for a step in a long-term project.",
        "Compare costs, timing and impact before allocating the money.",
        "Make room for a meaningful experience in the present.",
      ],
      es: [
        "Lograste ahorrar, pero echas de menos reunirte con amigos. ¿Cómo definirías tu prioridad financiera?",
        "Repartir el margen entre una necesidad actual y una meta futura.",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
        "Dar espacio a una experiencia significativa en el presente.",
      ],
      fr: [
        "Vous avez économisé mais les rencontres amicales vous manquent. Comment définir votre priorité financière ?",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
        "Consacrer la somme à une étape d’un projet à long terme.",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
        "Faire une place à une expérience significative dans le présent.",
      ],
    },
    [
      {
        BALANCER: 1,
      },
      {
        BUILDER: 1,
      },
      {
        STRATEGIST: 1,
      },
      {
        ADVENTURER: 1,
      },
    ],
    "HARD",
  ),
  scenario(
    "MD2_77",
    77,
    "BALANCER",
    {
      pt: [
        "Uma melhoria simples na rotina compete com a poupança do mês. Como definiria sua prioridade financeira?",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        "Dar espaço a uma experiência significativa no presente.",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
      ],
      en: [
        "A small daily-life improvement competes with this month’s savings. How would you set your financial priority?",
        "Use the money for a step in a long-term project.",
        "Keep the money to preserve my cushion for unexpected costs.",
        "Make room for a meaningful experience in the present.",
        "Split the margin between a current need and a future goal.",
      ],
      es: [
        "Una mejora sencilla de la rutina compite con el ahorro del mes. ¿Cómo definirías tu prioridad financiera?",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
        "Dar espacio a una experiencia significativa en el presente.",
        "Repartir el margen entre una necesidad actual y una meta futura.",
      ],
      fr: [
        "Une petite amélioration du quotidien concurrence l’épargne du mois. Comment définir votre priorité financière ?",
        "Consacrer la somme à une étape d’un projet à long terme.",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
        "Faire une place à une expérience significative dans le présent.",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
      ],
    },
    [
      {
        BUILDER: 1,
      },
      {
        GUARDIAN: 1,
      },
      {
        ADVENTURER: 1,
      },
      {
        BALANCER: 1,
      },
    ],
    "HARD",
  ),
  scenario(
    "MD2_78",
    78,
    "BALANCER",
    {
      pt: [
        "Você quer presentear alguém e também manter seu plano financeiro. Como definiria sua prioridade financeira?",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
      ],
      en: [
        "You want to give someone a gift while keeping your financial plan. How would you set your financial priority?",
        "Keep the money to preserve my cushion for unexpected costs.",
        "Compare costs, timing and impact before allocating the money.",
        "Split the margin between a current need and a future goal.",
        "Use the money for a step in a long-term project.",
      ],
      es: [
        "Quieres hacer un regalo y mantener tu plan financiero. ¿Cómo definirías tu prioridad financiera?",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
        "Repartir el margen entre una necesidad actual y una meta futura.",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
      ],
      fr: [
        "Vous souhaitez offrir un cadeau tout en préservant votre plan financier. Comment définir votre priorité financière ?",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
        "Consacrer la somme à une étape d’un projet à long terme.",
      ],
    },
    [
      {
        GUARDIAN: 1,
      },
      {
        STRATEGIST: 1,
      },
      {
        BALANCER: 1,
      },
      {
        BUILDER: 1,
      },
    ],
    "HARD",
  ),
  scenario(
    "MD2_79",
    79,
    "BALANCER",
    {
      pt: [
        "Seu orçamento ficou rígido e um pequeno imprevisto exige adaptação. Como definiria sua prioridade financeira?",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        "Dar espaço a uma experiência significativa no presente.",
        "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
      ],
      en: [
        "Your budget became rigid and a small surprise needs an adjustment. How would you set your financial priority?",
        "Compare costs, timing and impact before allocating the money.",
        "Make room for a meaningful experience in the present.",
        "Use the money for a step in a long-term project.",
        "Keep the money to preserve my cushion for unexpected costs.",
      ],
      es: [
        "Tu presupuesto se volvió rígido y un imprevisto exige adaptarlo. ¿Cómo definirías tu prioridad financiera?",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
        "Dar espacio a una experiencia significativa en el presente.",
        "Usar el dinero en una etapa de un proyecto a largo plazo.",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
      ],
      fr: [
        "Votre budget est devenu rigide et un petit imprévu exige un ajustement. Comment définir votre priorité financière ?",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
        "Faire une place à une expérience significative dans le présent.",
        "Consacrer la somme à une étape d’un projet à long terme.",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
      ],
    },
    [
      {
        STRATEGIST: 1,
      },
      {
        ADVENTURER: 1,
      },
      {
        BUILDER: 1,
      },
      {
        GUARDIAN: 1,
      },
    ],
    "HARD",
  ),
  scenario(
    "MD2_80",
    80,
    "BALANCER",
    {
      pt: [
        "Você tem renda estável e quer rever o espaço dado a metas e bem-estar. Como definiria sua prioridade financeira?",
        "Dividir a margem entre uma necessidade atual e uma meta futura.",
        "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        "Dar espaço a uma experiência significativa no presente.",
      ],
      en: [
        "Your income is stable and you want to review goals and wellbeing. How would you set your financial priority?",
        "Split the margin between a current need and a future goal.",
        "Keep the money to preserve my cushion for unexpected costs.",
        "Compare costs, timing and impact before allocating the money.",
        "Make room for a meaningful experience in the present.",
      ],
      es: [
        "Tienes ingresos estables y quieres revisar el espacio de metas y bienestar. ¿Cómo definirías tu prioridad financiera?",
        "Repartir el margen entre una necesidad actual y una meta futura.",
        "Conservar el dinero para mantener mi margen ante imprevistos.",
        "Comparar costes, plazos e impacto antes de asignar el dinero.",
        "Dar espacio a una experiencia significativa en el presente.",
      ],
      fr: [
        "Vos revenus sont stables et vous voulez revoir la place des objectifs et du bien-être. Comment définir votre priorité financière ?",
        "Répartir la marge entre un besoin actuel et un objectif futur.",
        "Garder l’argent pour préserver ma marge face aux imprévus.",
        "Comparer coûts, délais et effets avant d’affecter la somme.",
        "Faire une place à une expérience significative dans le présent.",
      ],
    },
    [
      {
        BALANCER: 1,
      },
      {
        GUARDIAN: 1,
      },
      {
        STRATEGIST: 1,
      },
      {
        ADVENTURER: 1,
      },
    ],
    "HARD",
  ),
];
