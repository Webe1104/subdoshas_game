import type { LessonDefinition } from "@/lib/quiz/buildLesson";

export const LESSONS: LessonDefinition[] = [
  {
    id: "vata-1",
    doshaId: "vata",
    title: "Vata I — Fundamentos",
    steps: [
      "dosha-subdoshas-select",
      "area-to-subdosha-image",
      "area-to-subdosha-image",
      "function-to-subdosha",
      "function-to-subdosha",
      "function-to-subdosha",
    ],
  },
  {
    id: "vata-2",
    doshaId: "vata",
    title: "Vata II — Refuerzo",
    steps: ["subdosha-to-dosha", "true-false", "true-false", "matching-pairs", "relate-subdosha-triple"],
  },
  {
    id: "pitta-1",
    doshaId: "pitta",
    title: "Pitta I — Fundamentos",
    steps: [
      "dosha-subdoshas-select",
      "area-to-subdosha-image",
      "area-to-subdosha-image",
      "function-to-subdosha",
      "function-to-subdosha",
      "function-to-subdosha",
    ],
  },
  {
    id: "pitta-2",
    doshaId: "pitta",
    title: "Pitta II — Refuerzo",
    steps: ["subdosha-to-dosha", "true-false", "true-false", "matching-pairs", "relate-subdosha-triple"],
  },
  {
    id: "kapha-1",
    doshaId: "kapha",
    title: "Kapha I — Fundamentos",
    steps: [
      "dosha-subdoshas-select",
      "area-to-subdosha-image",
      "area-to-subdosha-image",
      "function-to-subdosha",
      "function-to-subdosha",
      "function-to-subdosha",
    ],
  },
  {
    id: "kapha-2",
    doshaId: "kapha",
    title: "Kapha II — Refuerzo",
    steps: ["subdosha-to-dosha", "true-false", "true-false", "matching-pairs", "relate-subdosha-triple"],
  },
  {
    id: "repaso-final",
    title: "Repaso final — los 15 subdoshas",
    steps: [
      "sort-to-dosha-bulk",
      "relate-subdosha-triple",
      "relate-subdosha-triple",
      "function-to-subdosha",
      "area-to-subdosha-image",
      "subdosha-to-dosha",
      "matching-pairs",
      "matching-pairs",
      "relate-subdosha-triple",
      "relate-subdosha-triple",
      "relate-subdosha-triple",
      "relate-subdosha-triple",
      "true-false",
      "true-false",
    ],
  },
];

export const LESSON_ORDER: string[] = LESSONS.map((l) => l.id);

export function getLesson(lessonId: string): LessonDefinition | undefined {
  return LESSONS.find((l) => l.id === lessonId);
}
