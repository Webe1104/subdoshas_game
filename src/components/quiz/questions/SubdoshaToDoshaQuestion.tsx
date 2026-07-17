"use client";

import { DOSHA_ORDER, DOSHAS } from "@/data/doshas";
import { SUBDOSHAS, type SubdoshaId } from "@/data/subdoshas";
import type { SubdoshaToDoshaQuestion as Q } from "@/lib/quiz/types";
import { QuestionOptionButton } from "../QuestionOptionButton";

interface Props {
  question: Q;
  onCorrect: (subdoshaIds: SubdoshaId[]) => void;
  onMiss: (subdoshaIds: SubdoshaId[]) => void;
}

export function SubdoshaToDoshaQuestion({ question, onCorrect, onMiss }: Props) {
  const subdosha = SUBDOSHAS[question.subdoshaId];

  return (
    <div className="flex flex-col items-center gap-8">
      <p className="text-center text-lg text-[var(--foreground)]/70">¿De qué dosha es...</p>
      <h2 className="text-3xl font-black text-[var(--foreground)]">{subdosha.name}</h2>

      <div className="grid w-full max-w-sm grid-cols-1 gap-3">
        {DOSHA_ORDER.map((doshaId) => (
          <QuestionOptionButton
            key={doshaId}
            isCorrectAnswer={doshaId === subdosha.doshaId}
            accentColor={`var(--color-${doshaId}-500)`}
            onCorrectClick={() => onCorrect([question.subdoshaId])}
            onWrongClick={() => onMiss([question.subdoshaId])}
            className="text-center text-lg font-bold"
          >
            {DOSHAS[doshaId].name}
          </QuestionOptionButton>
        ))}
      </div>
    </div>
  );
}
