"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { SUBDOSHAS, type SubdoshaId } from "@/data/subdoshas";
import type { MatchingPairsQuestion as Q } from "@/lib/quiz/types";

// Matches memoria.webp's native aspect ratio (420x229) so the card-back always shows
// completely, edge-to-edge, never cropped. To still leave room for long "función"
// text, the grid goes single-column on small screens (see the className below) so
// each card is wide enough that this ratio still yields a tall-enough card.
const CARD_ASPECT = "420 / 229";

interface CardData {
  key: string;
  subdoshaId: SubdoshaId;
  kind: "name" | "fn";
  label: string;
}

interface Props {
  question: Q;
  onCorrect: (subdoshaIds: SubdoshaId[]) => void;
  onMiss: (subdoshaIds: SubdoshaId[]) => void;
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function MatchingPairsQuestion({ question, onCorrect }: Props) {
  const [cards] = useState<CardData[]>(() =>
    shuffleArray(
      question.subdoshaIds.flatMap((id) => [
        { key: `${id}-name`, subdoshaId: id, kind: "name" as const, label: SUBDOSHAS[id].name },
        { key: `${id}-fn`, subdoshaId: id, kind: "fn" as const, label: SUBDOSHAS[id].fn },
      ])
    )
  );
  const [matched, setMatched] = useState<Set<SubdoshaId>>(new Set());
  const [selected, setSelected] = useState<string[]>([]);
  const [wrongPair, setWrongPair] = useState<string[]>([]);

  function handleCardClick(card: CardData) {
    if (matched.has(card.subdoshaId) || selected.includes(card.key) || selected.length === 2) return;
    const nextSelected = [...selected, card.key];
    setSelected(nextSelected);

    if (nextSelected.length === 2) {
      const first = cards.find((c) => c.key === nextSelected[0]);
      const second = cards.find((c) => c.key === nextSelected[1]);
      if (first && second && first.subdoshaId === second.subdoshaId && first.kind !== second.kind) {
        window.setTimeout(() => {
          setMatched((prev) => {
            const next = new Set(prev).add(first.subdoshaId);
            if (next.size === question.subdoshaIds.length) {
              window.setTimeout(() => onCorrect(question.subdoshaIds), 300);
            }
            return next;
          });
          setSelected([]);
        }, 350);
      } else {
        setWrongPair(nextSelected);
        window.setTimeout(() => {
          setWrongPair([]);
          setSelected([]);
        }, 600);
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-center text-lg text-[var(--foreground)]/70">Emparejá cada subdosha con su función</p>
      <div className="grid w-full max-w-md grid-cols-1 gap-4 sm:max-w-3xl sm:grid-cols-2 sm:gap-5">
        {cards.map((card) => {
          const isMatched = matched.has(card.subdoshaId);
          const isSelected = selected.includes(card.key);
          const isWrong = wrongPair.includes(card.key);
          const flipped = isMatched || isSelected || isWrong;
          const doshaColor = `var(--color-${SUBDOSHAS[card.subdoshaId].doshaId}-500)`;

          return (
            <motion.button
              key={card.key}
              type="button"
              onClick={() => handleCardClick(card)}
              disabled={isMatched}
              animate={isWrong ? { x: [0, -6, 6, -6, 6, 0] } : undefined}
              transition={{ duration: 0.4 }}
              className="relative w-full min-w-0 rounded-2xl"
              style={{ aspectRatio: CARD_ASPECT, perspective: 800, minWidth: 200 }}
            >
              <motion.div
                className="relative h-full w-full"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
              >
                {/* Back face: the card-back artwork, filling the whole card. */}
                <div
                  className="absolute inset-0 overflow-hidden rounded-2xl shadow-sm"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <Image src="/images/memoria.webp" alt="" fill sizes="260px" className="object-cover" />
                </div>

                {/* Front face: name or función, revealed on flip. */}
                <div
                  className={`absolute inset-0 flex items-center justify-center overflow-hidden rounded-2xl border-2 p-3 text-center text-sm font-semibold sm:text-base ${
                    isMatched
                      ? "border-transparent text-white"
                      : isWrong
                        ? "border-red-400 bg-red-50 dark:bg-red-950/30"
                        : "border-[var(--color-gold-500)] bg-[var(--color-gold-400)]/20"
                  }`}
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    backgroundColor: isMatched ? doshaColor : undefined,
                  }}
                >
                  <span className="line-clamp-6 break-words">{card.label}</span>
                </div>
              </motion.div>
            </motion.button>
          );
        })}
      </div>
      <p className="text-sm text-[var(--foreground)]/50">
        {matched.size} / {question.subdoshaIds.length} parejas
      </p>
    </div>
  );
}
