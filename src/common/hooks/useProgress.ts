"use client";

import { useCallback, useEffect, useState } from "react";
import { LESSON_ORDER } from "@/data/lessons";
import type { SubdoshaId } from "@/data/subdoshas";
import { clearProgress, defaultProgress, loadProgress, saveProgress } from "@/lib/progress/storage";
import { MASTERY_CAP, XP_LESSON_BONUS, XP_PER_CORRECT } from "@/lib/progress/constants";
import { todayISO, daysBetween } from "@/lib/date";
import type { ProgressState } from "@/lib/progress/types";

export function useProgress() {
  const [state, setState] = useState<ProgressState>(defaultProgress);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadProgress());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveProgress(state);
  }, [state, hydrated]);

  const recordDailyStreak = useCallback(() => {
    setState((prev) => {
      const today = todayISO();
      if (prev.streak.lastActiveDateISO === today) return prev;
      const diff = prev.streak.lastActiveDateISO ? daysBetween(prev.streak.lastActiveDateISO, today) : null;
      const count = diff === 1 ? prev.streak.count + 1 : 1;
      return { ...prev, streak: { count, lastActiveDateISO: today } };
    });
  }, []);

  const addXp = useCallback((amount: number) => {
    setState((prev) => ({ ...prev, xp: prev.xp + amount }));
  }, []);

  const recordCorrectAnswer = useCallback((subdoshaId: SubdoshaId) => {
    setState((prev) => {
      const current = prev.mastery[subdoshaId] ?? 0;
      const mastery = { ...prev.mastery, [subdoshaId]: Math.min(MASTERY_CAP, current + 1) };
      return { ...prev, xp: prev.xp + XP_PER_CORRECT, mastery };
    });
  }, []);

  const completeLesson = useCallback(
    (lessonId: string, score: number) => {
      setState((prev) => {
        const index = LESSON_ORDER.indexOf(lessonId);
        const unlockedCount = index >= 0 ? Math.max(prev.unlockedCount, index + 2) : prev.unlockedCount;
        const prevBest = prev.completedLessons[lessonId]?.bestScore ?? 0;
        return {
          ...prev,
          xp: prev.xp + XP_LESSON_BONUS,
          unlockedCount: Math.min(unlockedCount, LESSON_ORDER.length),
          completedLessons: {
            ...prev.completedLessons,
            [lessonId]: { bestScore: Math.max(prevBest, score), completedAt: new Date().toISOString() },
          },
        };
      });
      recordDailyStreak();
    },
    [recordDailyStreak]
  );

  const isUnlocked = useCallback(
    (lessonId: string) => {
      const index = LESSON_ORDER.indexOf(lessonId);
      return index >= 0 && index < state.unlockedCount;
    },
    [state.unlockedCount]
  );

  const resetProgress = useCallback(() => {
    clearProgress();
    setState(defaultProgress());
  }, []);

  return {
    state,
    hydrated,
    addXp,
    recordCorrectAnswer,
    completeLesson,
    isUnlocked,
    recordDailyStreak,
    resetProgress,
  };
}
