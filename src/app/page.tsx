"use client";

import { IconFlame, IconTrash } from "@tabler/icons-react";
import { LESSONS } from "@/data/lessons";
import { useProgress } from "@/common/hooks/useProgress";
import { LessonNode, type LessonNodeStatus } from "@/components/lesson-map/LessonNode";

const SLOT_HEIGHT = 168;
const BUBBLE_CENTER_Y = 40;
const X_PERCENT = [50, 22, 78];

function segmentPath(a: { x: number; y: number }, b: { x: number; y: number }): string {
  const midY = (a.y + b.y) / 2;
  return `M ${a.x} ${a.y} C ${a.x} ${midY} ${b.x} ${midY} ${b.x} ${b.y}`;
}

export default function Home() {
  const { state, hydrated, isUnlocked, resetProgress } = useProgress();

  function handleResetProgress() {
    if (window.confirm("¿Borrar todo tu progreso? Se pierden el XP, la racha y las lecciones completadas.")) {
      resetProgress();
    }
  }

  const points = LESSONS.map((_, i) => ({
    x: X_PERCENT[i % X_PERCENT.length],
    y: i * SLOT_HEIGHT + BUBBLE_CENTER_Y,
  }));
  const totalHeight = (LESSONS.length - 1) * SLOT_HEIGHT + BUBBLE_CENTER_Y * 2;

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-10 px-6 py-10">
      <header className="flex items-center justify-between rounded-2xl bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm dark:bg-black/40">
        <div>
          <p className="text-xs text-[var(--foreground)]/50">Subdoshas del Ayurveda</p>
          <p className="text-lg font-black">Aprendé jugando</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 font-bold text-orange-500">
            <IconFlame size={20} />
            {hydrated ? state.streak.count : 0}
          </span>
          <span className="font-bold text-[var(--color-gold-500)]">{hydrated ? state.xp : 0} XP</span>
        </div>
      </header>

      <div className="relative py-4" style={{ height: totalHeight }}>
        <svg
          className="pointer-events-none absolute inset-0"
          width="100%"
          height={totalHeight}
          viewBox={`0 0 100 ${totalHeight}`}
          preserveAspectRatio="none"
        >
          {points.slice(0, -1).map((point, i) => {
            const next = points[i + 1];
            const lesson = LESSONS[i];
            const walked = Boolean(state.completedLessons[lesson.id]);
            const color = walked ? `var(--color-${lesson.doshaId ?? "gold"}-500)` : "var(--foreground)";
            return (
              <path
                key={lesson.id}
                d={segmentPath(point, next)}
                fill="none"
                stroke={color}
                strokeOpacity={walked ? 0.85 : 0.15}
                strokeWidth={5}
                strokeLinecap="round"
                strokeDasharray={walked ? undefined : "1.5 6"}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>

        {LESSONS.map((lesson, i) => {
          const done = Boolean(state.completedLessons[lesson.id]);
          const unlocked = hydrated && isUnlocked(lesson.id);
          const status: LessonNodeStatus = done ? "done" : unlocked ? "current" : "locked";
          return (
            <div
              key={lesson.id}
              className="absolute top-0"
              style={{ left: `${X_PERCENT[i % X_PERCENT.length]}%`, top: i * SLOT_HEIGHT, transform: "translateX(-50%)" }}
            >
              <LessonNode
                href={`/lesson/${lesson.id}`}
                title={lesson.title}
                doshaId={lesson.doshaId}
                status={status}
              />
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleResetProgress}
        className="mx-auto flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-[var(--foreground)]/40 transition-colors hover:bg-red-500/10 hover:text-red-500"
      >
        <IconTrash size={14} />
        Borrar progreso
      </button>
    </div>
  );
}
