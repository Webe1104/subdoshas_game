"use client";

import Image from "next/image";
import { SUBDOSHAS, subdoshaAreaImage, type SubdoshaId } from "@/data/subdoshas";
import type { AreaToSubdoshaImageQuestion as Q } from "@/lib/quiz/types";
import { QuestionOptionButton } from "../QuestionOptionButton";

interface Props {
  question: Q;
  onCorrect: (subdoshaIds: SubdoshaId[]) => void;
  onMiss: (subdoshaIds: SubdoshaId[]) => void;
}

export function AreaToSubdoshaImageQuestion({ question, onCorrect, onMiss }: Props) {
  const subdosha = SUBDOSHAS[question.subdoshaId];
  const doshaColor = `var(--color-${subdosha.doshaId}-500)`;

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-center text-lg text-[var(--foreground)]/70">¿Dónde vive...</p>
      <h2 className="text-3xl font-black" style={{ color: doshaColor }}>
        {subdosha.name}
      </h2>
      <p className="text-center text-sm text-[var(--foreground)]/50">Elegí la imagen del área correcta</p>

      <div className="grid w-full max-w-2xl grid-cols-2 gap-4">
        {question.optionIds.map((id) => (
          <QuestionOptionButton
            key={id}
            isCorrectAnswer={id === question.subdoshaId}
            accentColor={doshaColor}
            onCorrectClick={() => onCorrect([question.subdoshaId])}
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
        ))}
      </div>
    </div>
  );
}
