"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { IconStar, IconStarFilled, IconFlame } from "@tabler/icons-react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

interface Props {
  title: string;
  xpEarned: number;
  totalCorrect: number;
  totalAnswered: number;
  streak: number;
  nextHref: string;
  nextLabel: string;
}

export function LessonResultsScreen({
  title,
  xpEarned,
  totalCorrect,
  totalAnswered,
  streak,
  nextHref,
  nextLabel,
}: Props) {
  const accuracy = totalAnswered === 0 ? 1 : totalCorrect / totalAnswered;
  const stars = accuracy >= 0.95 ? 3 : accuracy >= 0.75 ? 2 : 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-6 text-center"
    >
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            initial={{ rotate: -20, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ delay: 0.1 * i, type: "spring", stiffness: 220 }}
          >
            {i < stars ? (
              <IconStarFilled size={40} className="text-[var(--color-gold-500)]" />
            ) : (
              <IconStar size={40} className="text-black/20 dark:text-white/20" />
            )}
          </motion.span>
        ))}
      </div>

      <h2 className="text-2xl font-black">¡Lección completa!</h2>
      <p className="text-[var(--foreground)]/60">{title}</p>

      <div className="flex gap-8">
        <div className="flex flex-col items-center gap-1">
          <AnimatedCounter value={xpEarned} />
          <span className="text-xs text-[var(--foreground)]/50">XP ganado</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="flex items-center gap-1 text-2xl font-black text-orange-500">
            <IconFlame size={22} />
            {streak}
          </span>
          <span className="text-xs text-[var(--foreground)]/50">racha</span>
        </div>
      </div>

      <Link
        href={nextHref}
        className="mt-4 rounded-full bg-[var(--color-gold-500)] px-8 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105"
      >
        {nextLabel}
      </Link>
    </motion.div>
  );
}
