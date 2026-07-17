import { DOSHA_ORDER, type DoshaId } from "@/data/doshas";
import { SUBDOSHA_ORDER, SUBDOSHAS_BY_DOSHA, type SubdoshaId } from "@/data/subdoshas";
import { defaultRng, shuffle, type Rng } from "./random";
import type { Question, QuestionType } from "./types";
import {
  generateDoshaSubdoshasSelect,
  generateAreaToSubdoshaImage,
  generateFunctionToSubdosha,
  generateSubdoshaToDosha,
  generateTrueFalse,
  generateMatchingPairs,
  generateRelateSubdoshaTriple,
  generateSortToDoshaBulk,
} from "./generators";

export interface LessonDefinition {
  id: string;
  /** undefined = mixed/review lesson drawing from all 15 subdoshas. */
  doshaId?: DoshaId;
  title: string;
  steps: QuestionType[];
}

function pickDosha(doshaId: DoshaId | undefined, rng: Rng): DoshaId {
  return doshaId ?? DOSHA_ORDER[Math.floor(rng() * DOSHA_ORDER.length)];
}

export function buildLesson(lesson: LessonDefinition, rng: Rng = defaultRng): Question[] {
  const scope: SubdoshaId[] = lesson.doshaId ? SUBDOSHAS_BY_DOSHA[lesson.doshaId] : SUBDOSHA_ORDER;
  // Shuffled per build, so replaying the same lesson asks about subdoshas in a
  // different order (and, once the cursor wraps, in a different grouping) each time.
  const subjectSequence = shuffle(scope, rng);

  let subjectCursor = 0;
  const nextSubject = (): SubdoshaId => {
    if (subjectCursor >= subjectSequence.length) subjectCursor = 0;
    const id = subjectSequence[subjectCursor];
    subjectCursor += 1;
    return id;
  };

  return lesson.steps.map((type): Question => {
    switch (type) {
      case "dosha-subdoshas-select":
        return generateDoshaSubdoshasSelect(pickDosha(lesson.doshaId, rng), rng);
      case "area-to-subdosha-image":
        return generateAreaToSubdoshaImage(nextSubject(), rng);
      case "function-to-subdosha":
        return generateFunctionToSubdosha(nextSubject(), rng);
      case "subdosha-to-dosha":
        return generateSubdoshaToDosha(nextSubject());
      case "true-false":
        return generateTrueFalse(nextSubject(), rng);
      case "matching-pairs":
        return generateMatchingPairs(scope, rng);
      case "relate-subdosha-triple":
        return generateRelateSubdoshaTriple(nextSubject(), rng);
      case "sort-to-dosha-bulk":
        return generateSortToDoshaBulk(rng);
    }
  });
}
