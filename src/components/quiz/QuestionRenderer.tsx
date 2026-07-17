"use client";

import type { SubdoshaId } from "@/data/subdoshas";
import type { Question } from "@/lib/quiz/types";
import { DoshaSubdoshasSelectQuestion } from "./questions/DoshaSubdoshasSelectQuestion";
import { AreaToSubdoshaImageQuestion } from "./questions/AreaToSubdoshaImageQuestion";
import { FunctionToSubdoshaQuestion } from "./questions/FunctionToSubdoshaQuestion";
import { SubdoshaToDoshaQuestion } from "./questions/SubdoshaToDoshaQuestion";
import { TrueFalseQuestion } from "./questions/TrueFalseQuestion";
import { MatchingPairsQuestion } from "./questions/MatchingPairsQuestion";
import { RelateSubdoshaTripleQuestion } from "./questions/RelateSubdoshaTripleQuestion";
import { SortToDoshaBulkQuestion } from "./questions/SortToDoshaBulkQuestion";

interface Props {
  question: Question;
  onCorrect: (subdoshaIds: SubdoshaId[]) => void;
  onMiss: (subdoshaIds: SubdoshaId[]) => void;
}

export function QuestionRenderer({ question, onCorrect, onMiss }: Props) {
  switch (question.type) {
    case "dosha-subdoshas-select":
      return <DoshaSubdoshasSelectQuestion question={question} onCorrect={onCorrect} onMiss={onMiss} />;
    case "area-to-subdosha-image":
      return <AreaToSubdoshaImageQuestion question={question} onCorrect={onCorrect} onMiss={onMiss} />;
    case "function-to-subdosha":
      return <FunctionToSubdoshaQuestion question={question} onCorrect={onCorrect} onMiss={onMiss} />;
    case "subdosha-to-dosha":
      return <SubdoshaToDoshaQuestion question={question} onCorrect={onCorrect} onMiss={onMiss} />;
    case "true-false":
      return <TrueFalseQuestion question={question} onCorrect={onCorrect} onMiss={onMiss} />;
    case "matching-pairs":
      return <MatchingPairsQuestion question={question} onCorrect={onCorrect} onMiss={onMiss} />;
    case "relate-subdosha-triple":
      return <RelateSubdoshaTripleQuestion question={question} onCorrect={onCorrect} onMiss={onMiss} />;
    case "sort-to-dosha-bulk":
      return <SortToDoshaBulkQuestion question={question} onCorrect={onCorrect} onMiss={onMiss} />;
    default:
      return null;
  }
}
