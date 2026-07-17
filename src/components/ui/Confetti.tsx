"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

const CONFETTI_COLORS = ["#facc15", "#fb923c", "#4ade80", "#38bdf8", "#f472b6", "#e8ac1c"];
const PIECE_COUNT = 36;

interface Piece {
  id: number;
  left: number;
  color: string;
  size: number;
  duration: number;
  delay: number;
  rotateStart: number;
  drift: number;
}

function makePieces(): Piece[] {
  return Array.from({ length: PIECE_COUNT }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    size: 6 + Math.random() * 6,
    duration: 3 + Math.random() * 2.5,
    delay: Math.random() * 3.5,
    rotateStart: Math.random() * 360,
    drift: (Math.random() - 0.5) * 80,
  }));
}

/** Continuous falling confetti rain, looping. Purely decorative — no library. */
export function Confetti() {
  const pieces = useMemo(makePieces, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((piece) => (
        <motion.span
          key={piece.id}
          className="absolute top-0 rounded-sm"
          style={{
            left: `${piece.left}%`,
            width: piece.size,
            height: piece.size * 0.4,
            backgroundColor: piece.color,
          }}
          initial={{ y: "-10vh", x: 0, rotate: piece.rotateStart, opacity: 0 }}
          animate={{ y: "110vh", x: piece.drift, rotate: piece.rotateStart + 360, opacity: [0, 1, 1, 0.8] }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
