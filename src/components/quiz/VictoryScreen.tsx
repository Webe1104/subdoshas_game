"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { IconFlame } from "@tabler/icons-react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Confetti } from "@/components/ui/Confetti";

interface Props {
  xpTotal: number;
  streak: number;
  onRestart: () => void;
  onBackToLessons: () => void;
}

export function VictoryScreen({ xpTotal, streak, onRestart, onBackToLessons }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 overflow-hidden px-6 text-center"
      style={{
        background:
          "radial-gradient(circle at 50% 15%, var(--color-gold-400), transparent 60%), linear-gradient(160deg, var(--color-vata-500), var(--color-pitta-500) 50%, var(--color-kapha-500))",
      }}
    >
      <Confetti />

      <motion.div
        initial={{ scale: 0, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
        className="relative z-10"
      >
        <Image src="/images/ganesha.gif" alt="Ganesha" width={220} height={220} unoptimized priority />
      </motion.div>

      <motion.h1
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.3 }}
        className="relative z-10 text-6xl font-black text-white drop-shadow-lg sm:text-7xl"
      >
        ¡GANASTE!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 text-xl font-semibold text-white/90"
      >
        Sos un experto en subdoshas
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="relative z-10 flex gap-10 rounded-3xl bg-white/15 px-8 py-4 backdrop-blur-sm"
      >
        <div className="flex flex-col items-center gap-1">
          <AnimatedCounter value={xpTotal} prefix="" />
          <span className="text-xs font-medium text-white/80">XP total</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="flex items-center gap-1 text-2xl font-black text-white">
            <IconFlame size={22} />
            {streak}
          </span>
          <span className="text-xs font-medium text-white/80">racha</span>
        </div>
      </motion.div>

      <motion.button
        type="button"
        onClick={onBackToLessons}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        className="relative z-10 mt-2 rounded-full border-2 border-white/70 px-8 py-2.5 font-bold text-white transition-colors hover:bg-white/10"
      >
        Volver a lecciones
      </motion.button>

      <motion.button
        type="button"
        onClick={onRestart}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0, scale: [1, 1.06, 1] }}
        transition={{
          opacity: { delay: 0.9 },
          y: { delay: 0.9 },
          scale: { duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 1.3 },
        }}
        className="relative z-10 rounded-full bg-white px-8 py-3 font-bold text-[var(--color-pitta-600)] shadow-xl"
      >
        Volver a empezar
      </motion.button>
    </div>
  );
}
