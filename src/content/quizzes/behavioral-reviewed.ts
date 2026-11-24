import { moneyDnaScenarios } from "./moneydna-v2";
import { coupleDnaScenarios } from "./coupledna-v2";
import { localized } from "./reviewed-likert";
import type { ScenarioDefinition } from "./behavioral-scenario";

/** A reviewed fixed-length instrument replaces the generic 80-item expansion.
 * New keys keep historical evidence and translations immutable.
 * The existing exposure-normalised formula and equal option signals are unchanged. */
function rekey(
  items: readonly ScenarioDefinition[],
  prefix: "MD3" | "CD3",
): readonly ScenarioDefinition[] {
  return items.map((q) => {
    const stableKey = `${prefix}_${String(q.position).padStart(2, "0")}`;
    return {
      ...q,
      stableKey,
      options: q.options.map((o, index) => ({ ...o, stableKey: `${stableKey}_${index + 1}` })),
    };
  });
}

export const reviewedMoneyScenarios: readonly ScenarioDefinition[] = rekey(
  moneyDnaScenarios,
  "MD3",
).map((q) => {
  if (q.position === 7)
    return {
      ...q,
      options: q.options.map((o, index) =>
        index === 1
          ? {
              ...o,
              label: localized([
                "Quitaria agora para destinar as próximas parcelas a um projeto.",
                "I would repay now so future instalment amounts can go towards a project.",
                "Pagaría ahora para destinar las próximas cuotas a un proyecto.",
                "Je solderais maintenant pour consacrer les prochaines mensualités à un projet.",
              ]),
            }
          : o,
      ),
    };
  // Lending reflects generosity and obligations, not preference for present experiences.
  // Replace that construct-confounded item with an actual present-versus-future choice.
  if (q.position === 10)
    return {
      ...q,
      prompt: localized([
        "Há ingressos para um evento que você gostaria de conhecer. A compra cabe no orçamento, mas reduz a margem que guardaria neste mês. O que faria?",
        "Tickets are available for an event you would like to experience. You can afford them, but buying would reduce what you save this month. What would you do?",
        "Hay entradas para un evento que te gustaría conocer. Puedes pagarlas, pero comprar reduce lo que ahorrarías este mes. ¿Qué harías?",
        "Des billets sont disponibles pour un événement que vous aimeriez découvrir. L’achat est abordable mais réduit votre épargne du mois. Que faites-vous ?",
      ]),
      options: q.options.map((o, index) => ({
        ...o,
        label: [
          localized([
            "Escolheria um ingresso mais simples e guardaria parte do valor.",
            "I would choose a cheaper ticket and save part of the money.",
            "Elegiría una entrada más económica y ahorraría parte del dinero.",
            "Je choisirais un billet moins cher et épargnerais une partie de la somme.",
          ]),
          localized([
            "Deixaria o evento para outra ocasião e manteria o valor guardado.",
            "I would skip this event and keep the money saved.",
            "Dejaría el evento para otra ocasión y mantendría el dinero ahorrado.",
            "Je reporterais cette sortie pour conserver la somme épargnée.",
          ]),
          localized([
            "Compararia o custo completo da saída com meus compromissos do mês.",
            "I would compare the full cost of going with my commitments this month.",
            "Compararía el coste completo de la salida con mis compromisos del mes.",
            "Je comparerais le coût total de la sortie à mes engagements du mois.",
          ]),
          localized([
            "Compraria o ingresso para aproveitar essa experiência agora.",
            "I would buy a ticket to enjoy this experience now.",
            "Compraría la entrada para disfrutar de esta experiencia ahora.",
            "J’achèterais le billet pour profiter de cette expérience maintenant.",
          ]),
        ][index],
      })),
    };
  if (q.position === 12)
    return {
      ...q,
      options: q.options.map((o, index) =>
        index === 3
          ? {
              ...o,
              label: localized([
                "Proporia uma etapa remota inicial, preservando tempo livre e limitando o gasto.",
                "I would propose an initial remote stage to preserve free time and limit costs.",
                "Propondría una primera etapa a distancia para conservar tiempo libre y limitar el gasto.",
                "Je proposerais une première étape à distance pour préserver du temps libre et limiter le coût.",
              ]),
            }
          : o,
      ),
    };
  if (q.position === 17)
    return {
      ...q,
      prompt: localized([
        "Uma despesa essencial foi paga com a reserva. Ainda há margem para o mês, mas você precisa rever quanto destinar a um projeto pessoal. Como reorganizaria seus próximos aportes?",
        "An essential expense has been paid from your savings. This month’s needs are covered, but you need to review contributions to a personal project. How would you reorganise them?",
        "Has pagado un gasto esencial con la reserva. Las necesidades del mes están cubiertas, pero debes revisar lo que destinas a un proyecto personal. ¿Cómo reorganizarías las próximas aportaciones?",
        "Une dépense essentielle a été réglée avec votre réserve. Les besoins du mois sont couverts, mais vous devez revoir les sommes consacrées à un projet personnel. Comment les réorganisez-vous ?",
      ]),
      options: q.options.map((o, index) =>
        index === 0
          ? {
              ...o,
              label: localized([
                "Priorizaria recompor a reserva antes de retomar os aportes ao projeto.",
                "I would prioritise rebuilding savings before resuming project contributions.",
                "Priorizaría reponer la reserva antes de volver a aportar al proyecto.",
                "Je privilégierais la reconstitution de la réserve avant de reprendre les versements au projet.",
              ]),
            }
          : index === 2
            ? {
                ...o,
                label: localized([
                  "Recalcularia prazos e valores de reserva e projeto antes de distribuir a sobra.",
                  "I would recalculate savings and project timelines and amounts before allocating the surplus.",
                  "Recalcularía plazos y cantidades de la reserva y del proyecto antes de repartir lo que sobra.",
                  "Je recalculerais les délais et montants de la réserve et du projet avant de répartir le solde.",
                ]),
              }
            : o,
      ),
    };
  return q;
});

export const reviewedCoupleScenarios: readonly ScenarioDefinition[] = rekey(
  coupleDnaScenarios,
  "CD3",
);
