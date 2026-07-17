export type Rng = () => number;

export const defaultRng: Rng = Math.random;

export function shuffle<T>(items: T[], rng: Rng = defaultRng): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function sample<T>(items: T[], count: number, rng: Rng = defaultRng): T[] {
  return shuffle(items, rng).slice(0, Math.min(count, items.length));
}

/** Picks `count` items from `pool` that are not in `exclude`. */
export function pickDistractors<T>(pool: T[], exclude: T[], count: number, rng: Rng = defaultRng): T[] {
  const excludeSet = new Set(exclude);
  const candidates = pool.filter((item) => !excludeSet.has(item));
  return sample(candidates, count, rng);
}

export function randomId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
