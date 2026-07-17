import type { DoshaId } from "@/data/doshas";
import type { SubdoshaId } from "@/data/subdoshas";

export type QuestionType =
  | "dosha-subdoshas-select"
  | "area-to-subdosha-image"
  | "function-to-subdosha"
  | "subdosha-to-dosha"
  | "true-false"
  | "matching-pairs"
  | "relate-subdosha-triple"
  | "sort-to-dosha-bulk";

interface QuestionBase {
  id: string;
}

export interface DoshaSubdoshasSelectQuestion extends QuestionBase {
  type: "dosha-subdoshas-select";
  doshaId: DoshaId;
  correctIds: SubdoshaId[];
  optionIds: SubdoshaId[];
}

export interface AreaToSubdoshaImageQuestion extends QuestionBase {
  type: "area-to-subdosha-image";
  subdoshaId: SubdoshaId;
  optionIds: SubdoshaId[];
}

export interface FunctionToSubdoshaQuestion extends QuestionBase {
  type: "function-to-subdosha";
  subdoshaId: SubdoshaId;
  optionIds: SubdoshaId[];
}

export interface SubdoshaToDoshaQuestion extends QuestionBase {
  type: "subdosha-to-dosha";
  subdoshaId: SubdoshaId;
}

export interface TrueFalseQuestion extends QuestionBase {
  type: "true-false";
  subdoshaId: SubdoshaId;
  field: "area" | "fn";
  statement: string;
  isTrue: boolean;
}

export interface MatchingPairsQuestion extends QuestionBase {
  type: "matching-pairs";
  subdoshaIds: SubdoshaId[];
}

export interface RelateSubdoshaTripleQuestion extends QuestionBase {
  type: "relate-subdosha-triple";
  subdoshaId: SubdoshaId;
  areaOptionIds: SubdoshaId[];
  fnOptionIds: SubdoshaId[];
}

export interface SortToDoshaBulkQuestion extends QuestionBase {
  type: "sort-to-dosha-bulk";
  subdoshaIds: SubdoshaId[];
}

export type Question =
  | DoshaSubdoshasSelectQuestion
  | AreaToSubdoshaImageQuestion
  | FunctionToSubdoshaQuestion
  | SubdoshaToDoshaQuestion
  | TrueFalseQuestion
  | MatchingPairsQuestion
  | RelateSubdoshaTripleQuestion
  | SortToDoshaBulkQuestion;

/** Which subdoshas a question is "about", used for mastery tracking and spaced repetition. */
export function questionSubdoshaIds(q: Question): SubdoshaId[] {
  switch (q.type) {
    case "dosha-subdoshas-select":
      return q.correctIds;
    case "area-to-subdosha-image":
    case "function-to-subdosha":
    case "subdosha-to-dosha":
    case "true-false":
    case "relate-subdosha-triple":
      return [q.subdoshaId];
    case "matching-pairs":
    case "sort-to-dosha-bulk":
      return q.subdoshaIds;
  }
}
