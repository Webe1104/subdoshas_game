import { STORAGE_KEY } from "./constants";
import type { ProgressState } from "./types";

export function defaultProgress(): ProgressState {
  return {
    version: 1,
    xp: 0,
    streak: { count: 0, lastActiveDateISO: null },
    unlockedCount: 1,
    completedLessons: {},
    mastery: {},
  };
}

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return defaultProgress();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    if (parsed.version !== 1) return defaultProgress();
    return { ...defaultProgress(), ...parsed };
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(state: ProgressState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage no disponible (modo privado, cuota llena) — el progreso simplemente no persiste.
  }
}

export function clearProgress(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage no disponible — no hay nada que borrar.
  }
}
