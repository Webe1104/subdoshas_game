"use client";

import { SUBDOSHAS, type SubdoshaId } from "@/data/subdoshas";
import type { TrueFalseQuestion as Q } from "@/lib/quiz/types";
import { QuestionOptionButton } from "../QuestionOptionButton";

interface Props {
  question: Q;
  onCorrect: (subdoshaIds: SubdoshaId[]) => void;
  onMiss: (subdoshaIds: SubdoshaId[]) => void;
}

export function TrueFalseQuestion({ question, onCorrect, onMiss }: Props) {
  const subdosha = SUBDOSHAS[question.subdoshaId];
  const fieldLabel = question.field === "area" ? "área" : "función";

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-center text-lg text-[var(--foreground)]/70">
        ¿Es correcta esta {fieldLabel} de <strong>{subdosha.name}</strong>?
      </p>
      <blockquote className="max-w-md rounded-2xl bg-black/5 p-5 text-center text-xl font-semibold dark:bg-white/5">
        “{question.statement}”
      </blockquote>

      <div className="grid w-full max-w-sm grid-cols-2 gap-3">
        <QuestionOptionButton
          isCorrectAnswer={question.isTrue}
          accentColor="var(--color-kapha-500)"
          onCorrectClick={() => onCorrect([question.subdoshaId])}
          onWrongClick={() => onMiss([question.subdoshaId])}
          className="text-center text-lg font-bold"
        >
          Verdadero
        </QuestionOptionButton>
        <QuestionOptionButton
          isCorrectAnswer={!question.isTrue}
          accentColor="var(--color-pitta-500)"
          onCorrectClick={() => onCorrect([question.subdoshaId])}
          onWrongClick={() => onMiss([question.subdoshaId])}
          className="text-center text-lg font-bold"
        >
          Falso
        </QuestionOptionButton>
      </div>
    </div>
  );
}
