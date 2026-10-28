import type { Locale } from "@/lib/i18n/config";

const text = (
  pt: string,
  en: string,
  es: string,
  fr: string,
): Readonly<Record<Locale, string>> => ({ pt, en, es, fr });

/** BrainRank 1.2: three distinct stories are drawn and pinned to each attempt. */
export const brainRankMemoryPool = [
  {
    key: "MEMORY_04",
    cue: text(
      "Marina chegou a Aurora na terça-feira. Ficou no Hotel Central e visitou o museu à tarde.",
      "Marina arrived in Aurora on Tuesday. She stayed at the Central Hotel and visited the museum that afternoon.",
      "Marina llegó a Aurora el martes. Se alojó en el Hotel Central y visitó el museo por la tarde.",
      "Marina est arrivée à Aurora mardi. Elle a séjourné à l’hôtel Central et visité le musée l’après-midi.",
    ),
    prompt: text(
      "Em qual hotel Marina ficou?",
      "Which hotel did Marina stay at?",
      "¿En qué hotel se alojó Marina?",
      "Dans quel hôtel Marina a-t-elle séjourné ?",
    ),
    options: [
      text("Central", "Central", "Central", "Central"),
      text("Aurora", "Aurora", "Aurora", "Aurora"),
      text("Horizonte", "Horizon", "Horizonte", "Horizon"),
      text("Imperial", "Imperial", "Imperial", "Impérial"),
    ],
    correct: 0,
  },
  {
    key: "MEMORY_05",
    cue: text(
      "Na biblioteca, Rafael guardou um livro de viagens na prateleira azul. A devolução ficou marcada para sexta-feira.",
      "At the library, Rafael put a travel book on the blue shelf. Its return was scheduled for Friday.",
      "En la biblioteca, Rafael dejó un libro de viajes en la estantería azul. La devolución quedó fijada para el viernes.",
      "À la bibliothèque, Rafael a rangé un livre de voyage sur l’étagère bleue. Le retour était prévu vendredi.",
    ),
    prompt: text(
      "De que cor era a prateleira usada por Rafael?",
      "What colour was the shelf Rafael used?",
      "¿De qué color era la estantería que usó Rafael?",
      "De quelle couleur était l’étagère utilisée par Rafael ?",
    ),
    options: [
      text("Verde", "Green", "Verde", "Verte"),
      text("Azul", "Blue", "Azul", "Bleue"),
      text("Branca", "White", "Blanca", "Blanche"),
      text("Amarela", "Yellow", "Amarilla", "Jaune"),
    ],
    correct: 1,
  },
  {
    key: "MEMORY_06",
    cue: text(
      "Clara recebeu uma caixa de cerâmica pela manhã. Deixou a caixa na sala e combinou a retirada para quarta-feira.",
      "Clara received a box of pottery in the morning. She left it in the living room and arranged collection for Wednesday.",
      "Clara recibió una caja de cerámica por la mañana. La dejó en la sala y acordó recogerla el miércoles.",
      "Clara a reçu une boîte de céramiques le matin. Elle l’a laissée au salon et prévu son retrait mercredi.",
    ),
    prompt: text(
      "Para qual dia Clara combinou a retirada?",
      "Which day did Clara arrange collection for?",
      "¿Para qué día acordó Clara la recogida?",
      "Quel jour Clara avait-elle prévu pour le retrait ?",
    ),
    options: [
      text("Segunda-feira", "Monday", "Lunes", "Lundi"),
      text("Sexta-feira", "Friday", "Viernes", "Vendredi"),
      text("Quarta-feira", "Wednesday", "Miércoles", "Mercredi"),
      text("Sábado", "Saturday", "Sábado", "Samedi"),
    ],
    correct: 2,
  },
  {
    key: "MEMORY_07",
    cue: text(
      "Diego pegou o ônibus 42 para visitar a irmã. Levou uma mochila cinza e desceu perto da praça.",
      "Diego took bus 42 to visit his sister. He carried a grey backpack and got off near the square.",
      "Diego tomó el autobús 42 para visitar a su hermana. Llevaba una mochila gris y bajó cerca de la plaza.",
      "Diego a pris le bus 42 pour rendre visite à sa sœur. Il portait un sac gris et est descendu près de la place.",
    ),
    prompt: text(
      "Qual ônibus Diego pegou?",
      "Which bus did Diego take?",
      "¿Qué autobús tomó Diego?",
      "Quel bus Diego a-t-il pris ?",
    ),
    options: [
      text("24", "24", "24", "24"),
      text("32", "32", "32", "32"),
      text("48", "48", "48", "48"),
      text("42", "42", "42", "42"),
    ],
    correct: 3,
  },
  {
    key: "MEMORY_08",
    cue: text(
      "Luiza plantou manjericão em um vaso amarelo na varanda. Regou a planta depois do almoço.",
      "Luiza planted basil in a yellow pot on the balcony. She watered it after lunch.",
      "Luiza plantó albahaca en una maceta amarilla en el balcón. La regó después de comer.",
      "Luiza a planté du basilic dans un pot jaune sur le balcon. Elle l’a arrosé après le déjeuner.",
    ),
    prompt: text(
      "O que Luiza plantou?",
      "What did Luiza plant?",
      "¿Qué plantó Luiza?",
      "Qu’a planté Luiza ?",
    ),
    options: [
      text("Manjericão", "Basil", "Albahaca", "Basilic"),
      text("Hortelã", "Mint", "Menta", "Menthe"),
      text("Alecrim", "Rosemary", "Romero", "Romarin"),
      text("Salsa", "Parsley", "Perejil", "Persil"),
    ],
    correct: 0,
  },
  {
    key: "MEMORY_09",
    cue: text(
      "Na oficina de desenho, Bruno sentou na mesa 6. Usou papel bege e levou os desenhos para casa em uma pasta.",
      "At the drawing workshop, Bruno sat at table 6. He used beige paper and took his drawings home in a folder.",
      "En el taller de dibujo, Bruno se sentó en la mesa 6. Usó papel beige y llevó los dibujos a casa en una carpeta.",
      "À l’atelier de dessin, Bruno s’est assis à la table 6. Il a utilisé du papier beige et emporté ses dessins dans une pochette.",
    ),
    prompt: text(
      "Em qual mesa Bruno sentou?",
      "Which table did Bruno sit at?",
      "¿En qué mesa se sentó Bruno?",
      "À quelle table Bruno s’est-il assis ?",
    ),
    options: [
      text("Mesa 3", "Table 3", "Mesa 3", "Table 3"),
      text("Mesa 6", "Table 6", "Mesa 6", "Table 6"),
      text("Mesa 8", "Table 8", "Mesa 8", "Table 8"),
      text("Mesa 9", "Table 9", "Mesa 9", "Table 9"),
    ],
    correct: 1,
  },
  {
    key: "MEMORY_10",
    cue: text(
      "Sofia encontrou Pedro no Café Jardim às três da tarde. Pediu chá de limão e sentou perto da janela.",
      "Sofia met Pedro at Garden Café at three in the afternoon. She ordered lemon tea and sat near the window.",
      "Sofía se encontró con Pedro en el Café Jardín a las tres de la tarde. Pidió té de limón y se sentó junto a la ventana.",
      "Sofia a retrouvé Pedro au Café du Jardin à quinze heures. Elle a commandé un thé au citron et s’est assise près de la fenêtre.",
    ),
    prompt: text(
      "O que Sofia pediu no café?",
      "What did Sofia order at the café?",
      "¿Qué pidió Sofía en el café?",
      "Qu’a commandé Sofia au café ?",
    ),
    options: [
      text("Café", "Coffee", "Café", "Café"),
      text("Suco de laranja", "Orange juice", "Zumo de naranja", "Jus d’orange"),
      text("Chá de limão", "Lemon tea", "Té de limón", "Thé au citron"),
      text("Chocolate quente", "Hot chocolate", "Chocolate caliente", "Chocolat chaud"),
    ],
    correct: 2,
  },
  {
    key: "MEMORY_11",
    cue: text(
      "Na exposição, Helena viu fotografias na sala Norte. Comprou um cartão-postal e saiu pela porta do jardim.",
      "At the exhibition, Helena saw photographs in the North room. She bought a postcard and left through the garden door.",
      "En la exposición, Helena vio fotografías en la sala Norte. Compró una postal y salió por la puerta del jardín.",
      "À l’exposition, Helena a vu des photographies dans la salle Nord. Elle a acheté une carte postale et est sortie par la porte du jardin.",
    ),
    prompt: text(
      "Em qual sala estavam as fotografias?",
      "Which room held the photographs?",
      "¿En qué sala estaban las fotografías?",
      "Dans quelle salle étaient les photographies ?",
    ),
    options: [
      text("Sul", "South", "Sur", "Sud"),
      text("Leste", "East", "Este", "Est"),
      text("Oeste", "West", "Oeste", "Ouest"),
      text("Norte", "North", "Norte", "Nord"),
    ],
    correct: 3,
  },
  {
    key: "MEMORY_12",
    cue: text(
      "Miguel organizou um piquenique no domingo. Levou uma toalha vermelha e encontrou os amigos perto do lago.",
      "Miguel organised a picnic on Sunday. He brought a red blanket and met his friends near the lake.",
      "Miguel organizó un pícnic el domingo. Llevó una manta roja y se reunió con sus amigos junto al lago.",
      "Miguel a organisé un pique-nique dimanche. Il a apporté une nappe rouge et retrouvé ses amis près du lac.",
    ),
    prompt: text(
      "Onde Miguel encontrou os amigos?",
      "Where did Miguel meet his friends?",
      "¿Dónde se reunió Miguel con sus amigos?",
      "Où Miguel a-t-il retrouvé ses amis ?",
    ),
    options: [
      text("Perto do lago", "Near the lake", "Junto al lago", "Près du lac"),
      text("Perto da ponte", "Near the bridge", "Junto al puente", "Près du pont"),
      text("Na entrada", "At the entrance", "En la entrada", "À l’entrée"),
      text("No jardim", "In the garden", "En el jardín", "Dans le jardin"),
    ],
    correct: 0,
  },
  {
    key: "MEMORY_13",
    cue: text(
      "Beatriz foi ao cinema com a prima. A sessão começou às seis da tarde e elas ficaram na fileira D.",
      "Beatriz went to the cinema with her cousin. The screening began at six in the evening and they sat in row D.",
      "Beatriz fue al cine con su prima. La sesión empezó a las seis de la tarde y se sentaron en la fila D.",
      "Beatriz est allée au cinéma avec sa cousine. La séance a commencé à dix-huit heures et elles étaient au rang D.",
    ),
    prompt: text(
      "Em qual fileira Beatriz ficou?",
      "Which row did Beatriz sit in?",
      "¿En qué fila se sentó Beatriz?",
      "À quel rang Beatriz était-elle assise ?",
    ),
    options: [
      text("B", "B", "B", "B"),
      text("D", "D", "D", "D"),
      text("F", "F", "F", "F"),
      text("H", "H", "H", "H"),
    ],
    correct: 1,
  },
  {
    key: "MEMORY_14",
    cue: text(
      "Lucas deixou uma encomenda na portaria do prédio. A caixa tinha uma fita laranja e deveria ser entregue a Camila.",
      "Lucas left a parcel at the building reception. The box had orange tape and was addressed to Camila.",
      "Lucas dejó un paquete en la recepción del edificio. La caja tenía cinta naranja y era para Camila.",
      "Lucas a laissé un colis à l’accueil de l’immeuble. La boîte avait un ruban orange et était destinée à Camila.",
    ),
    prompt: text(
      "Para quem era a encomenda?",
      "Who was the parcel for?",
      "¿Para quién era el paquete?",
      "À qui était destiné le colis ?",
    ),
    options: [
      text("Marina", "Marina", "Marina", "Marina"),
      text("Clara", "Clara", "Clara", "Clara"),
      text("Camila", "Camila", "Camila", "Camila"),
      text("Sofia", "Sofia", "Sofía", "Sofia"),
    ],
    correct: 2,
  },
  {
    key: "MEMORY_15",
    cue: text(
      "Teresa marcou uma caminhada para sábado de manhã. Combinou encontrar Nuno na ponte e levar água.",
      "Teresa planned a walk for Saturday morning. She arranged to meet Nuno at the bridge and bring water.",
      "Teresa organizó un paseo para el sábado por la mañana. Quedó con Nuno en el puente y acordó llevar agua.",
      "Teresa a prévu une promenade samedi matin. Elle devait retrouver Nuno au pont et apporter de l’eau.",
    ),
    prompt: text(
      "Para quando Teresa marcou a caminhada?",
      "When did Teresa plan the walk?",
      "¿Para cuándo organizó Teresa el paseo?",
      "Quand Teresa avait-elle prévu la promenade ?",
    ),
    options: [
      text("Sexta de manhã", "Friday morning", "Viernes por la mañana", "Vendredi matin"),
      text("Sábado à tarde", "Saturday afternoon", "Sábado por la tarde", "Samedi après-midi"),
      text("Domingo de manhã", "Sunday morning", "Domingo por la mañana", "Dimanche matin"),
      text("Sábado de manhã", "Saturday morning", "Sábado por la mañana", "Samedi matin"),
    ],
    correct: 3,
  },
] as const;
