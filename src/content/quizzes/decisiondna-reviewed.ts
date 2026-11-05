import type { DecisionDnaScenarioDef } from "./decisiondna";
import { localized } from "./reviewed-likert";

/** Four everyday contexts; these describe choices in this attempt, not a fixed personality. */
export const reviewedDecisionScenarios: readonly DecisionDnaScenarioDef[] = [
  {
    stableKey: "DD_SCEN_01",
    position: 1,
    prompt: localized([
      "Você precisa escolher um curso de curta duração entre duas opções que cabem no seu orçamento. Como tende a decidir?",
      "You need to choose a short course from two options within your budget. How do you tend to decide?",
      "Necesitas elegir un curso breve entre dos opciones que caben en tu presupuesto. ¿Cómo sueles decidir?",
      "Vous devez choisir une formation courte parmi deux options dans votre budget. Comment avez-vous tendance à décider ?",
    ]),
    options: [
      {
        stableKey: "DD_01_A",
        style: "ANALYTICAL",
        label: localized([
          "Comparo conteúdo, duração e avaliações usando os mesmos critérios.",
          "I compare content, length and reviews using the same criteria.",
          "Comparo contenido, duración y reseñas con los mismos criterios.",
          "Je compare le contenu, la durée et les avis selon les mêmes critères.",
        ]),
      },
      {
        stableKey: "DD_01_B",
        style: "INTUITIVE",
        label: localized([
          "Escolho o que mais desperta meu interesse ao conhecer a proposta.",
          "I choose the one that sparks my interest when I read the description.",
          "Elijo el que más despierta mi interés al conocer la propuesta.",
          "Je choisis celui qui éveille le plus mon intérêt en découvrant sa présentation.",
        ]),
      },
      {
        stableKey: "DD_01_C",
        style: "PRAGMATIC",
        label: localized([
          "Escolho o que posso começar logo e aplicar numa necessidade atual.",
          "I choose the one I can start soon and use for a current need.",
          "Elijo el que puedo empezar pronto y aplicar a una necesidad actual.",
          "Je choisis celui que je peux commencer rapidement pour répondre à un besoin actuel.",
        ]),
      },
      {
        stableKey: "DD_01_D",
        style: "COLLABORATIVE",
        label: localized([
          "Converso com alguém que conhece meus objetivos antes de escolher.",
          "I discuss it with someone who knows my goals before choosing.",
          "Lo hablo con alguien que conoce mis objetivos antes de elegir.",
          "J’en parle avec une personne qui connaît mes objectifs avant de choisir.",
        ]),
      },
    ],
  },
  {
    stableKey: "DD_SCEN_02",
    position: 2,
    prompt: localized([
      "O trajeto que você planejou para um compromisso está interrompido. Há tempo para mudar de rota. Qual seria seu primeiro passo?",
      "Your planned route to an appointment is blocked. There is time to change routes. What would you do first?",
      "La ruta prevista para una cita está cortada. Hay tiempo para cambiar de camino. ¿Qué harías primero?",
      "Votre itinéraire prévu pour un rendez-vous est bloqué. Vous avez le temps de changer de trajet. Que faites-vous d’abord ?",
    ]),
    options: [
      {
        stableKey: "DD_02_A",
        style: "PRAGMATIC",
        label: localized([
          "Sigo por uma alternativa conhecida que já permite avançar.",
          "I take a familiar alternative that lets me make progress now.",
          "Tomo una alternativa conocida que ya me permite avanzar.",
          "J’emprunte une solution connue qui me permet d’avancer immédiatement.",
        ]),
      },
      {
        stableKey: "DD_02_B",
        style: "ANALYTICAL",
        label: localized([
          "Comparo o tempo estimado e a distância das rotas disponíveis.",
          "I compare estimated times and distances for the available routes.",
          "Comparo el tiempo estimado y la distancia de las rutas disponibles.",
          "Je compare les durées estimées et les distances des trajets possibles.",
        ]),
      },
      {
        stableKey: "DD_02_C",
        style: "INTUITIVE",
        label: localized([
          "Escolho o caminho que me parece mais promissor pela experiência na região.",
          "I choose the route that feels most promising based on my experience of the area.",
          "Elijo el camino que me parece más prometedor por mi experiencia en la zona.",
          "Je choisis le trajet qui me semble le plus prometteur d’après mon expérience du quartier.",
        ]),
      },
      {
        stableKey: "DD_02_D",
        style: "COLLABORATIVE",
        label: localized([
          "Peço uma sugestão a alguém que conhece os caminhos próximos.",
          "I ask someone familiar with nearby routes for a suggestion.",
          "Pido una sugerencia a alguien que conoce los caminos cercanos.",
          "Je demande conseil à une personne qui connaît les trajets à proximité.",
        ]),
      },
    ],
  },
  {
    stableKey: "DD_SCEN_03",
    position: 3,
    prompt: localized([
      "Você ganhou uma tarde livre e considera duas atividades que gostaria de fazer. Como escolheria?",
      "You unexpectedly have a free afternoon and are considering two activities you would enjoy. How would you choose?",
      "Tienes una tarde libre inesperada y consideras dos actividades que te apetecen. ¿Cómo elegirías?",
      "Vous disposez d’un après-midi libre imprévu et hésitez entre deux activités qui vous plaisent. Comment choisissez-vous ?",
    ]),
    options: [
      {
        stableKey: "DD_03_A",
        style: "ANALYTICAL",
        label: localized([
          "Comparo o tempo, o custo e o que cada atividade pode me oferecer.",
          "I compare time, cost and what each activity could offer me.",
          "Comparo el tiempo, el coste y lo que me puede aportar cada actividad.",
          "Je compare le temps, le coût et ce que chaque activité peut m’apporter.",
        ]),
      },
      {
        stableKey: "DD_03_B",
        style: "COLLABORATIVE",
        label: localized([
          "Troco ideias com uma pessoa próxima para pensar nas possibilidades.",
          "I exchange ideas with someone close to consider the possibilities.",
          "Intercambio ideas con alguien cercano para pensar en las posibilidades.",
          "J’échange avec un proche pour réfléchir aux possibilités.",
        ]),
      },
      {
        stableKey: "DD_03_C",
        style: "PRAGMATIC",
        label: localized([
          "Escolho a atividade mais fácil de organizar com o que já tenho disponível.",
          "I choose the activity easiest to arrange with what I already have available.",
          "Elijo la actividad más fácil de organizar con lo que ya tengo disponible.",
          "Je choisis l’activité la plus facile à organiser avec ce dont je dispose déjà.",
        ]),
      },
      {
        stableKey: "DD_03_D",
        style: "INTUITIVE",
        label: localized([
          "Sigo a vontade que mais me atrai naquele momento.",
          "I follow whichever appeals to me most at that moment.",
          "Sigo lo que más me atrae en ese momento.",
          "Je suis l’envie qui m’attire le plus sur le moment.",
        ]),
      },
    ],
  },
  {
    stableKey: "DD_SCEN_04",
    position: 4,
    prompt: localized([
      "Você vai escolher um aparelho de uso frequente entre modelos de preço parecido. Qual abordagem mais combina com você?",
      "You are choosing an appliance you will use often from similarly priced models. Which approach fits you best?",
      "Vas a elegir un aparato de uso frecuente entre modelos de precio parecido. ¿Qué enfoque encaja más contigo?",
      "Vous choisissez un appareil que vous utiliserez souvent parmi des modèles de prix proches. Quelle approche vous correspond le mieux ?",
    ]),
    options: [
      {
        stableKey: "DD_04_A",
        style: "COLLABORATIVE",
        label: localized([
          "Peço a opinião de pessoas que usam os modelos que estou considerando.",
          "I ask people who use the models I am considering for their opinions.",
          "Pido la opinión de personas que usan los modelos que estoy considerando.",
          "Je demande l’avis de personnes qui utilisent les modèles envisagés.",
        ]),
      },
      {
        stableKey: "DD_04_B",
        style: "PRAGMATIC",
        label: localized([
          "Escolho um modelo disponível que atende às funções de que preciso agora.",
          "I choose an available model that performs the functions I need now.",
          "Elijo un modelo disponible que cumple las funciones que necesito ahora.",
          "Je choisis un modèle disponible qui remplit les fonctions dont j’ai besoin maintenant.",
        ]),
      },
      {
        stableKey: "DD_04_C",
        style: "ANALYTICAL",
        label: localized([
          "Comparo consumo, garantia e desempenho em uma lista de critérios.",
          "I compare energy use, warranty and performance against a list of criteria.",
          "Comparo consumo, garantía y rendimiento con una lista de criterios.",
          "Je compare la consommation, la garantie et les performances selon une liste de critères.",
        ]),
      },
      {
        stableKey: "DD_04_D",
        style: "INTUITIVE",
        label: localized([
          "Escolho o modelo que me transmite melhor impressão ao experimentá-lo.",
          "I choose the model that gives me the best impression when I try it.",
          "Elijo el modelo que me da mejor impresión al probarlo.",
          "Je choisis le modèle qui me fait la meilleure impression lorsque je l’essaie.",
        ]),
      },
    ],
  },
];
