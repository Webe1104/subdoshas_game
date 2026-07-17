"use client";

import { motion } from "framer-motion";
import { IconCheck } from "@tabler/icons-react";
import { useState, type ReactNode } from "react";

interface QuestionOptionButtonProps {
  isCorrectAnswer: boolean;
  onCorrectClick: () => void;
  onWrongClick?: () => void;
  disabled?: boolean;
  /** Already found correct (multi-select questions) — stays highlighted and unclickable. */
  locked?: boolean;
  accentColor?: string;
  children: ReactNode;
  className?: string;
}

const CORRECT_COLOR = "var(--color-kapha-500)";
const SPARK_COUNT = 10;
const SPARK_COLORS = ["#facc15", "#fb923c", "#4ade80", "#38bdf8", "#f472b6", "#facc15"];
/** How long the "correct!" celebration shows before the parent is told to advance. */
const CORRECT_HOLD_MS = 850;

function Sparks() {
  return (
    <span className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-visible">
      {Array.from({ length: SPARK_COUNT }).map((_, i) => {
        const angle = (i / SPARK_COUNT) * Math.PI * 2;
        const distance = 30 + (i % 3) * 12;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;
        return (
          <motion.span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: SPARK_COLORS[i % SPARK_COLORS.length] }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1.2 }}
            animate={{ x: dx, y: dy, opacity: 0, scale: 0.2 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          />
        );
      })}
    </span>
  );
}

export function QuestionOptionButton({
  isCorrectAnswer,
  onCorrectClick,
  onWrongClick,
  disabled,
  locked,
  accentColor = "var(--color-gold-500)",
  children,
  className = "",
}: QuestionOptionButtonProps) {
  const [shakeKey, setShakeKey] = useState(0);
  const [flashWrong, setFlashWrong] = useState(false);
  const [justCorrect, setJustCorrect] = useState(false);

  function handleClick() {
    if (disabled || locked || justCorrect) return;
    if (isCorrectAnswer) {
      setJustCorrect(true);
      window.setTimeout(onCorrectClick, CORRECT_HOLD_MS);
      return;
    }
    setShakeKey((k) => k + 1);
    setFlashWrong(true);
    window.setTimeout(() => setFlashWrong(false), 350);
    onWrongClick?.();
  }

  const showCorrect = locked || justCorrect;
  const fillColor = locked ? accentColor : CORRECT_COLOR;

  return (
    <motion.button
      key={shakeKey}
      type="button"
      onClick={handleClick}
      disabled={disabled}
      animate={shakeKey > 0 ? { x: [0, -9, 9, -9, 9, 0] } : justCorrect ? { scale: [1, 1.05, 1] } : undefined}
      transition={{ duration: shakeKey > 0 ? 0.4 : 0.35 }}
      whileTap={{ scale: 0.96 }}
      className={`relative w-full overflow-visible rounded-2xl border-2 px-4 py-3 text-left font-medium transition-colors disabled:opacity-50 ${
        showCorrect
          ? "border-transparent text-white"
          : flashWrong
            ? "border-red-400 bg-red-50 dark:bg-red-950/30"
            : "border-black/10 bg-white/70 hover:border-black/20 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20"
      } ${className}`}
      style={showCorrect ? { backgroundColor: fillColor } : undefined}
    >
      <span className="flex items-center justify-between gap-2">
        <span>{children}</span>
        {showCorrect && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <IconCheck size={18} className="shrink-0" />
          </motion.span>
        )}
      </span>
      {justCorrect && !locked && <Sparks />}
    </motion.button>
  );
}
