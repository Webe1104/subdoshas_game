"use client";

import { motion } from "framer-motion";

export function ProgressBar({ ratio }: { ratio: number }) {
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
      <motion.div
        className="h-full rounded-full"
        style={{ background: "linear-gradient(to right, var(--color-gold-400), var(--color-gold-500))" }}
        initial={false}
        animate={{ width: `${Math.round(ratio * 100)}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      />
    </div>
  );
}
