"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DOSHA_ORDER, DOSHAS, type DoshaId } from "@/data/doshas";
import { SUBDOSHAS, type SubdoshaId } from "@/data/subdoshas";
import type { SortToDoshaBulkQuestion as Q } from "@/lib/quiz/types";

interface Props {
  question: Q;
  onCorrect: (subdoshaIds: SubdoshaId[]) => void;
  onMiss: (subdoshaIds: SubdoshaId[]) => void;
}

export function SortToDoshaBulkQuestion({ question, onCorrect, onMiss }: Props) {
  const [sorted, setSorted] = useState<Partial<Record<SubdoshaId, DoshaId>>>({});
  const [selected, setSelected] = useState<SubdoshaId | null>(null);
  const [shakeBasket, setShakeBasket] = useState<DoshaId | null>(null);

  const remaining = question.subdoshaIds.filter((id) => !(id in sorted));

  function handleBasketClick(doshaId: DoshaId) {
    if (!selected) return;
    if (SUBDOSHAS[selected].doshaId === doshaId) {
      const next = { ...sorted, [selected]: doshaId };
      setSorted(next);
      setSelected(null);
      if (Object.keys(next).length === question.subdoshaIds.length) {
        window.setTimeout(() => onCorrect(question.subdoshaIds), 300);
      }
    } else {
      setShakeBasket(doshaId);
      onMiss([selected]);
      window.setTimeout(() => setShakeBasket(null), 400);
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-center text-lg text-[var(--foreground)]/70">
        Elegí un subdosha y tocá el dosha al que pertenece
      </p>

      <div className="flex min-h-10 flex-wrap justify-center gap-2">
        {remaining.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setSelected(id)}
            className={`rounded-full border-2 px-3 py-1.5 text-sm font-semibold transition-colors ${
              selected === id
                ? "border-[var(--color-gold-500)] bg-[var(--color-gold-400)]/25"
                : "border-black/10 bg-white/70 dark:border-white/10 dark:bg-white/5"
            }`}
          >
            {SUBDOSHAS[id].name}
          </button>
        ))}
      </div>

      <div className="grid w-full max-w-lg grid-cols-3 gap-3">
        {DOSHA_ORDER.map((doshaId) => {
          const items = (Object.entries(sorted) as [SubdoshaId, DoshaId][]).filter(([, d]) => d === doshaId);
          return (
            <motion.button
              key={doshaId}
              type="button"
              onClick={() => handleBasketClick(doshaId)}
              animate={shakeBasket === doshaId ? { x: [0, -9, 9, -9, 9, 0] } : undefined}
              transition={{ duration: 0.4 }}
              disabled={!selected}
              className="flex min-h-32 flex-col items-center gap-2 rounded-2xl border-2 border-dashed p-3 disabled:opacity-60"
              style={{ borderColor: `var(--color-${doshaId}-500)` }}
            >
              <span className="font-bold" style={{ color: `var(--color-${doshaId}-500)` }}>
                {DOSHAS[doshaId].name}
              </span>
              <div className="flex flex-wrap justify-center gap-1">
                {items.map(([id]) => (
                  <span
                    key={id}
                    className="rounded-full px-2 py-0.5 text-xs font-semibold text-white"
                    style={{ backgroundColor: `var(--color-${doshaId}-500)` }}
                  >
                    {SUBDOSHAS[id].name}
                  </span>
                ))}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
