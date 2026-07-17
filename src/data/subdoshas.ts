import type { DoshaId } from "./doshas";

export type SubdoshaId =
  | "prana"
  | "udana"
  | "vyana"
  | "samana"
  | "apana"
  | "alochaka"
  | "brajaka"
  | "sadhaka"
  | "ranjaka"
  | "pachaka"
  | "bodhaka"
  | "avalambaka"
  | "shleshaka"
  | "tarpaka"
  | "kledaka";

export interface Subdosha {
  id: SubdoshaId;
  doshaId: DoshaId;
  name: string;
  area: string;
  fn: string;
}

export const SUBDOSHAS: Record<SubdoshaId, Subdosha> = {
  prana: {
    id: "prana",
    doshaId: "vata",
    name: "Prana",
    area: "Cabeza, pecho, corazón, pulmones",
    fn: "Inhalación, recepción de energía y vida",
  },
  udana: {
    id: "udana",
    doshaId: "vata",
    name: "Udana",
    area: "Garganta, cuerdas vocales, cabeza",
    fn: "Habla, expresión, esfuerzo, crecimiento",
  },
  vyana: {
    id: "vyana",
    doshaId: "vata",
    name: "Vyana",
    area: "Todo el cuerpo, sistema circulatorio, nervioso",
    fn: "Circulación, movimiento y distribución",
  },
  samana: {
    id: "samana",
    doshaId: "vata",
    name: "Samana",
    area: "Estómago, intestino delgado, bazo, páncreas",
    fn: "Digestión, absorción y asimilación",
  },
  apana: {
    id: "apana",
    doshaId: "vata",
    name: "Apana",
    area: "Colon, recto, vejiga, órganos reproductivos",
    fn: "Eliminación, expulsión y reproducción",
  },
  alochaka: {
    id: "alochaka",
    doshaId: "pitta",
    name: "Alochaka",
    area: "Ojos, visión",
    fn: "Percepción visual, comprensión de formas y colores",
  },
  brajaka: {
    id: "brajaka",
    doshaId: "pitta",
    name: "Brajaka",
    area: "Piel, complexión, tejido cutáneo",
    fn: "Color, brillo, tez y protección de la piel",
  },
  sadhaka: {
    id: "sadhaka",
    doshaId: "pitta",
    name: "Sadhaka",
    area: "Corazón, mente, intelecto, sistema nervioso",
    fn: "Inteligencia, claridad mental, voluntad y alegría",
  },
  ranjaka: {
    id: "ranjaka",
    doshaId: "pitta",
    name: "Ranjaka",
    area: "Hígado, sangre, vesícula biliar",
    fn: "Coloración de la sangre, metabolismo del hierro y nutrientes",
  },
  pachaka: {
    id: "pachaka",
    doshaId: "pitta",
    name: "Pachaka",
    area: "Estómago, intestino delgado",
    fn: "Digestión, metabolismo y transformación de los alimentos",
  },
  bodhaka: {
    id: "bodhaka",
    doshaId: "kapha",
    name: "Bodhaka",
    area: "Lengua, sentido del gusto",
    fn: "Percepción del sabor, discriminación y apetito",
  },
  avalambaka: {
    id: "avalambaka",
    doshaId: "kapha",
    name: "Avalambaka",
    area: "Pecho, pulmones, costillas, diafragma",
    fn: "Soporte, estabilidad del corazón y los pulmones",
  },
  shleshaka: {
    id: "shleshaka",
    doshaId: "kapha",
    name: "Shleshaka",
    area: "Articulaciones, líquidos sinoviales, lubricación del cuerpo",
    fn: "Lubricación, cohesión y protección de las articulaciones",
  },
  tarpaka: {
    id: "tarpaka",
    doshaId: "kapha",
    name: "Tarpaka",
    area: "Cerebro, médula espinal, tejido nervioso",
    fn: "Nutrición del cerebro y los sentidos, estabilidad mental",
  },
  kledaka: {
    id: "kledaka",
    doshaId: "kapha",
    name: "Kledaka",
    area: "Estómago, líquidos gástricos",
    fn: "Humectación, formación de los jugos digestivos y ablandamiento",
  },
};

export const SUBDOSHA_ORDER: SubdoshaId[] = [
  "prana",
  "udana",
  "vyana",
  "samana",
  "apana",
  "alochaka",
  "brajaka",
  "sadhaka",
  "ranjaka",
  "pachaka",
  "bodhaka",
  "avalambaka",
  "shleshaka",
  "tarpaka",
  "kledaka",
];

export const SUBDOSHAS_BY_DOSHA: Record<DoshaId, SubdoshaId[]> = {
  vata: ["prana", "udana", "vyana", "samana", "apana"],
  pitta: ["alochaka", "brajaka", "sadhaka", "ranjaka", "pachaka"],
  kapha: ["bodhaka", "avalambaka", "shleshaka", "tarpaka", "kledaka"],
};

/** `/public/images/{id}.webp` — one area illustration per subdosha. */
export function subdoshaAreaImage(id: SubdoshaId): string {
  return `/images/${id}.webp`;
}
