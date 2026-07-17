"use client";

import { SUBDOSHAS, type SubdoshaId } from "@/data/subdoshas";
import type { FunctionToSubdoshaQuestion as Q } from "@/lib/quiz/types";
import { QuestionOptionButton } from "../QuestionOptionButton";

interface Props {
  question: Q;
  onCorrect: (subdoshaIds: SubdoshaId[]) => void;
  onMiss: (subdoshaIds: SubdoshaId[]) => void;
}

export function FunctionToSubdoshaQuestion({ question, onCorrect, onMiss }: Props) {
  const subdosha = SUBDOSHAS[question.subdoshaId];
  const doshaColor = `var(--color-${subdosha.doshaId}-500)`;

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-center text-lg text-[var(--foreground)]/70">¿Qué subdosha cumple esta función?</p>
      <blockquote className="max-w-md rounded-2xl bg-black/5 p-5 text-center text-xl font-semibold dark:bg-white/5">
        “{subdosha.fn}”
      </blockquote>

      <div className="grid w-full max-w-md grid-cols-1 gap-3 sm:grid-cols-2">
        {question.optionIds.map((id) => (
          <QuestionOptionButton
            key={id}
            isCorrectAnswer={id === question.subdoshaId}
            accentColor={doshaColor}
            onCorrectClick={() => onCorrect([question.subdoshaId])}
            onWrongClick={() => onMiss([question.subdoshaId])}
          >
            {SUBDOSHAS[id].name}
          </QuestionOptionButton>
        ))}
      </div>
    </div>
  );
}
