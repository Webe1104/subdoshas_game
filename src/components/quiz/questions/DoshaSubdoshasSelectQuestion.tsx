"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DOSHAS } from "@/data/doshas";
import { SUBDOSHAS, type SubdoshaId } from "@/data/subdoshas";
import type { DoshaSubdoshasSelectQuestion as Q } from "@/lib/quiz/types";
import { QuestionOptionButton } from "../QuestionOptionButton";

interface Props {
  question: Q;
  onCorrect: (subdoshaIds: SubdoshaId[]) => void;
  onMiss: (subdoshaIds: SubdoshaId[]) => void;
}

export function DoshaSubdoshasSelectQuestion({ question, onCorrect }: Props) {
  const dosha = DOSHAS[question.doshaId];
  const [found, setFound] = useState<Set<SubdoshaId>>(new Set());

  function handleFound(id: SubdoshaId) {
    setFound((prev) => {
      const next = new Set(prev).add(id);
      if (next.size === question.correctIds.length) {
        window.setTimeout(() => onCorrect(question.correctIds), 350);
      }
      return next;
    });
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <p className="text-center text-lg text-[var(--foreground)]/70">
        Tocá los <strong>5 subdoshas</strong> que pertenecen a este dosha
      </p>

      <motion.h2
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-5xl font-black tracking-wide"
        style={{ color: `var(--color-${dosha.id}-500)` }}
      >
        {dosha.name}
      </motion.h2>

      <div className="grid w-full max-w-md grid-cols-2 gap-3 sm:grid-cols-3">
        {question.optionIds.map((id) => (
          <QuestionOptionButton
            key={id}
            isCorrectAnswer={question.correctIds.includes(id)}
            locked={found.has(id)}
            accentColor={`var(--color-${dosha.id}-500)`}
            onCorrectClick={() => handleFound(id)}
          >
            {SUBDOSHAS[id].name}
          </QuestionOptionButton>
        ))}
      </div>

      <p className="text-sm text-[var(--foreground)]/50">
        {found.size} / {question.correctIds.length} encontrados
      </p>
    </div>
  );
}
