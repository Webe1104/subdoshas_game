"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type { SubdoshaId } from "@/data/subdoshas";
import { buildLesson, type LessonDefinition } from "@/lib/quiz/buildLesson";
import { generateReinforcementQuestion } from "@/lib/quiz/generators";
import { questionSubdoshaIds, type Question } from "@/lib/quiz/types";

interface UseLessonSessionResult {
  current: Question | null;
  progressRatio: number;
  totalCorrect: number;
  totalAnswered: number;
  isComplete: boolean;
  /** Call once the current question has been fully satisfied (e.g. the correct option was picked). Moves to the next question. */
  advance: () => void;
  /**
   * Call on every wrong click, passing the subdosha(s) the question was about.
   * Does NOT advance — the current question stays so the player can retry — but
   * schedules a reinforcement question about that subdosha a few slots ahead
   * (repetición espaciada), using a type not already used for that subdosha
   * elsewhere in the queue (so the same question never effectively repeats).
   */
  recordMiss: (subdoshaIds: SubdoshaId[]) => void;
}

function buildUsedTypesMap(questions: Question[]): Map<SubdoshaId, Set<Question["type"]>> {
  const map = new Map<SubdoshaId, Set<Question["type"]>>();
  for (const q of questions) {
    for (const subject of questionSubdoshaIds(q)) {
      const set = map.get(subject) ?? new Set<Question["type"]>();
      set.add(q.type);
      map.set(subject, set);
    }
  }
  return map;
}

export function useLessonSession(lesson: LessonDefinition): UseLessonSessionResult {
  const initialQueue = useMemo(() => buildLesson(lesson), [lesson]);
  const [queue, setQueue] = useState<Question[]>(initialQueue);
  const [completedCount, setCompletedCount] = useState(0);
  const [missCount, setMissCount] = useState(0);
  const [extraCount, setExtraCount] = useState(0);
  const initialLength = useRef(initialQueue.length);
  const usedTypesBySubject = useRef(buildUsedTypesMap(initialQueue));

  const current = queue[0] ?? null;

  const advance = useCallback(() => {
    setCompletedCount((n) => n + 1);
    setQueue((q) => q.slice(1));
  }, []);

  const recordMiss = useCallback((subdoshaIds: SubdoshaId[]) => {
    setMissCount((n) => n + 1);
    const subject = subdoshaIds[0];
    if (!subject) return;
    setQueue((q) => {
      if (q.length === 0) return q;
      const [head, ...rest] = q;
      const excluded = new Set(usedTypesBySubject.current.get(subject) ?? []);
      excluded.add(head.type);
      const reinforcement = generateReinforcementQuestion(subject, excluded);
      excluded.add(reinforcement.type);
      usedTypesBySubject.current.set(subject, excluded);
      const insertAt = Math.min(rest.length, 2 + Math.floor(Math.random() * 3));
      const nextRest = [...rest];
      nextRest.splice(insertAt, 0, reinforcement);
      return [head, ...nextRest];
    });
    setExtraCount((n) => n + 1);
  }, []);

  const isComplete = queue.length === 0;
  const totalPlanned = initialLength.current + extraCount;
  const progressRatio = totalPlanned === 0 ? 1 : Math.min(1, completedCount / totalPlanned);

  return {
    current,
    progressRatio,
    totalCorrect: completedCount,
    totalAnswered: completedCount + missCount,
    isComplete,
    advance,
    recordMiss,
  };
}
