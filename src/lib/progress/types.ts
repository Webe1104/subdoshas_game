import type { SubdoshaId } from "@/data/subdoshas";

export interface StreakState {
  count: number;
  lastActiveDateISO: string | null;
}

export interface CompletedLesson {
  bestScore: number;
  completedAt: string;
}

export interface ProgressState {
  version: 1;
  xp: number;
  streak: StreakState;
  /** How many lessons from the start of LESSON_ORDER are unlocked. */
  unlockedCount: number;
  completedLessons: Record<string, CompletedLesson>;
  /** Correct-answer counter per subdosha, capped at MASTERY_CAP. */
  mastery: Partial<Record<SubdoshaId, number>>;
}
