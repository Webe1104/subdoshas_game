"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { IconLock, IconCheck } from "@tabler/icons-react";
import type { DoshaId } from "@/data/doshas";

export type LessonNodeStatus = "locked" | "current" | "done";

interface Props {
  href: string;
  title: string;
  doshaId?: DoshaId;
  status: LessonNodeStatus;
}

const NODE_IMAGE: Record<DoshaId, string> = {
  vata: "/images/vata.svg",
  pitta: "/images/pitta.svg",
  kapha: "/images/kapha.svg",
};

export function LessonNode({ href, title, doshaId, status }: Props) {
  const imageSrc = doshaId ? NODE_IMAGE[doshaId] : "/images/loto.webp";

  const bubble = (
    <motion.div
      whileHover={status !== "locked" ? { scale: 1.08 } : undefined}
      whileTap={status !== "locked" ? { scale: 0.94 } : undefined}
      animate={status === "current" ? { scale: [1, 1.07, 1] } : undefined}
      transition={status === "current" ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" } : undefined}
      className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg ring-2 ring-black/5"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- local trusted SVG/WebP, next/image blocks SVG by default */}
      <img
        src={imageSrc}
        alt={title}
        width={80}
        height={80}
        className={`h-full w-full rounded-full object-contain p-0.5 transition-all ${
          status === "locked" ? "opacity-30 grayscale" : ""
        }`}
      />
      {status === "locked" && (
        <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--foreground)] text-white">
          <IconLock size={13} />
        </span>
      )}
      {status === "done" && (
        <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-kapha-500)] text-white">
          <IconCheck size={15} />
        </span>
      )}
    </motion.div>
  );

  return (
    <div className="flex flex-col items-center gap-2">
      {status === "locked" ? bubble : <Link href={href}>{bubble}</Link>}
      <span className="max-w-[6.5rem] text-center text-xs font-medium text-[var(--foreground)]/60">{title}</span>
    </div>
  );
}
