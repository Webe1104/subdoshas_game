"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SUBDOSHAS, subdoshaAreaImage, type SubdoshaId } from "@/data/subdoshas";
import type { RelateSubdoshaTripleQuestion as Q } from "@/lib/quiz/types";
import { QuestionOptionButton } from "../QuestionOptionButton";

interface Props {
  question: Q;
  onCorrect: (subdoshaIds: SubdoshaId[]) => void;
  onMiss: (subdoshaIds: SubdoshaId[]) => void;
}

export function RelateSubdoshaTripleQuestion({ question, onCorrect, onMiss }: Props) {
  const subdosha = SUBDOSHAS[question.subdoshaId];
  const doshaColor = `var(--color-${subdosha.doshaId}-500)`;
  const [areaDone, setAreaDone] = useState(false);
  const [fnDone, setFnDone] = useState(false);
  const completedRef = useRef(false);

  // Both option buttons delay calling onCorrectClick internally (for the
  // shake/sparks celebration), so checking "is the other one already done" inside
  // the click handler itself would read a stale closure if both are answered
  // around the same time. Watching the actual state instead avoids that.
  useEffect(() => {
    if (areaDone && fnDone && !completedRef.current) {
      completedRef.current = true;
      onCorrect([question.subdoshaId]);
    }
  }, [areaDone, fnDone, onCorrect, question.subdoshaId]);

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-center text-lg text-[var(--foreground)]/70">Relacioná con...</p>
      <h2 className="text-4xl font-black" style={{ color: doshaColor }}>
        {subdosha.name}
      </h2>

      <div className="w-full max-w-2xl">
        <p className="mb-3 text-center text-sm font-medium text-[var(--foreground)]/50">¿Dónde vive?</p>
        <div className="grid grid-cols-2 gap-3">
          {question.areaOptionIds.map((id) => {
            const isCorrectOption = id === question.subdoshaId;
            return (
              <QuestionOptionButton
                key={`area-${id}`}
                isCorrectAnswer={isCorrectOption}
                disabled={areaDone && !isCorrectOption}
                locked={areaDone && isCorrectOption}
                accentColor={doshaColor}
                onCorrectClick={() => setAreaDone(true)}
                onWrongClick={() => onMiss([question.subdoshaId])}
                className="flex flex-col items-center gap-2 !p-2"
              >
                <Image
                  src={subdoshaAreaImage(id)}
                  alt={SUBDOSHAS[id].area}
                  width={320}
                  height={292}
                  className="aspect-[320/292] w-full rounded-xl bg-white object-contain dark:bg-white/90"
                />
              </QuestionOptionButton>
            );
          })}
        </div>
      </div>

      <div className="w-full max-w-md">
        <p className="mb-3 text-center text-sm font-medium text-[var(--foreground)]/50">¿Cuál es su función?</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {question.fnOptionIds.map((id) => {
            const isCorrectOption = id === question.subdoshaId;
            return (
              <QuestionOptionButton
                key={`fn-${id}`}
                isCorrectAnswer={isCorrectOption}
                disabled={fnDone && !isCorrectOption}
                locked={fnDone && isCorrectOption}
                accentColor={doshaColor}
                onCorrectClick={() => setFnDone(true)}
                onWrongClick={() => onMiss([question.subdoshaId])}
              >
                {SUBDOSHAS[id].fn}
              </QuestionOptionButton>
            );
          })}
        </div>
      </div>
    </div>
  );
}
