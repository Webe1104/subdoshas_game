export type DoshaId = "vata" | "pitta" | "kapha";

export interface Dosha {
  id: DoshaId;
  name: string;
  element: string;
  description: string;
}

export const DOSHAS: Record<DoshaId, Dosha> = {
  vata: {
    id: "vata",
    name: "Vata",
    element: "Aire y espacio",
    description: "El dosha del movimiento",
  },
  pitta: {
    id: "pitta",
    name: "Pitta",
    element: "Fuego y agua",
    description: "El dosha de la transformación",
  },
  kapha: {
    id: "kapha",
    name: "Kapha",
    element: "Tierra y agua",
    description: "El dosha de la estructura",
  },
};

export const DOSHA_ORDER: DoshaId[] = ["vata", "pitta", "kapha"];
