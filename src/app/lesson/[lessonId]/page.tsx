"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { IconX } from "@tabler/icons-react";
import { getLesson, LESSON_ORDER } from "@/data/lessons";
import type { LessonDefinition } from "@/lib/quiz/buildLesson";
import type { SubdoshaId } from "@/data/subdoshas";
import { useLessonSession } from "@/common/hooks/useLessonSession";
import { useProgress } from "@/common/hooks/useProgress";
import { QuestionRenderer } from "@/components/quiz/QuestionRenderer";
import { ProgressBar } from "@/components/quiz/ProgressBar";
import { LessonResultsScreen } from "@/components/quiz/LessonResultsScreen";
import { VictoryScreen } from "@/components/quiz/VictoryScreen";
import { XP_PER_CORRECT, XP_LESSON_BONUS } from "@/lib/progress/constants";

export default function LessonPage() {
  const params = useParams<{ lessonId: string }>();
  const lesson = getLesson(params.lessonId);

  if (!lesson) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-lg font-bold">Lección no encontrada</p>
        <Link href="/" className="text-[var(--color-gold-500)] underline">
          Volver al mapa
        </Link>
      </div>
    );
  }

  return <LessonRunner lesson={lesson} />;
}

function LessonRunner({ lesson }: { lesson: LessonDefinition }) {
  const router = useRouter();
  const session = useLessonSession(lesson);
  const progress = useProgress();
  const completedRef = useRef(false);
  const nextLessonId = LESSON_ORDER[LESSON_ORDER.indexOf(lesson.id) + 1];

  // The question queue is randomized (shuffle/sample), so it must never be part of the
  // server-rendered HTML — building it during SSR would produce a different random
  // order than the client and trigger a hydration mismatch. Render nothing until mounted.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (session.isComplete && !completedRef.current && progress.hydrated) {
      completedRef.current = true;
      const score = session.totalAnswered === 0 ? 1 : session.totalCorrect / session.totalAnswered;
      progress.completeLesson(lesson.id, score);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.isComplete, progress.hydrated]);

  function handleCorrect(subdoshaIds: SubdoshaId[]) {
    if (subdoshaIds.length === 0) {
      progress.addXp(XP_PER_CORRECT);
    } else {
      subdoshaIds.forEach((id) => progress.recordCorrectAnswer(id));
    }
    session.advance();
  }

  function handleMiss(subdoshaIds: SubdoshaId[]) {
    session.recordMiss(subdoshaIds);
  }

  if (!mounted) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-10 w-10 rounded-full border-4 border-[var(--color-gold-400)] border-t-transparent"
        />
      </div>
    );
  }

  if (session.isComplete) {
    if (!nextLessonId) {
      return (
        <VictoryScreen
          xpTotal={progress.state.xp}
          streak={progress.state.streak.count}
          onRestart={() => {
            progress.resetProgress();
            router.push("/");
          }}
        />
      );
    }
    return (
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-10">
        <LessonResultsScreen
          title={lesson.title}
          xpEarned={session.totalCorrect * XP_PER_CORRECT + XP_LESSON_BONUS}
          totalCorrect={session.totalCorrect}
          totalAnswered={session.totalAnswered}
          streak={progress.state.streak.count}
          nextHref={`/lesson/${nextLessonId}`}
          nextLabel="Siguiente lección"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-8">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => router.push("/")}
          aria-label="Salir de la lección"
          className="text-[var(--foreground)]/50 transition-colors hover:text-[var(--foreground)]"
        >
          <IconX size={22} />
        </button>
        <ProgressBar ratio={session.progressRatio} />
      </div>

      <AnimatePresence mode="wait">
        {session.current && (
          <motion.div
            key={session.current.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
            className="flex flex-1 items-center justify-center"
          >
            <QuestionRenderer question={session.current} onCorrect={handleCorrect} onMiss={handleMiss} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
