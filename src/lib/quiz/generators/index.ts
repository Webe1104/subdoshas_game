import { SUBDOSHAS, SUBDOSHA_ORDER, SUBDOSHAS_BY_DOSHA, type SubdoshaId } from "@/data/subdoshas";
import type { DoshaId } from "@/data/doshas";
import { shuffle, sample, pickDistractors, randomId, defaultRng, type Rng } from "../random";
import type { Question } from "../types";

function pickOne<T>(items: T[], rng: Rng): T {
  return items[Math.floor(rng() * items.length)];
}

export function generateDoshaSubdoshasSelect(doshaId: DoshaId, rng: Rng = defaultRng): Question {
  const correctIds = SUBDOSHAS_BY_DOSHA[doshaId];
  const pool = SUBDOSHA_ORDER.filter((id) => SUBDOSHAS[id].doshaId !== doshaId);
  const distractors = pickDistractors(pool, [], 4, rng);
  return {
    id: randomId("dsel"),
    type: "dosha-subdoshas-select",
    doshaId,
    correctIds,
    optionIds: shuffle([...correctIds, ...distractors], rng),
  };
}

export function generateAreaToSubdoshaImage(subdoshaId: SubdoshaId, rng: Rng = defaultRng): Question {
  const distractors = pickDistractors(SUBDOSHA_ORDER, [subdoshaId], 3, rng);
  return {
    id: randomId("area"),
    type: "area-to-subdosha-image",
    subdoshaId,
    optionIds: shuffle([subdoshaId, ...distractors], rng),
  };
}

export function generateFunctionToSubdosha(subdoshaId: SubdoshaId, rng: Rng = defaultRng): Question {
  const distractors = pickDistractors(SUBDOSHA_ORDER, [subdoshaId], 3, rng);
  return {
    id: randomId("fn"),
    type: "function-to-subdosha",
    subdoshaId,
    optionIds: shuffle([subdoshaId, ...distractors], rng),
  };
}

export function generateSubdoshaToDosha(subdoshaId: SubdoshaId): Question {
  return { id: randomId("s2d"), type: "subdosha-to-dosha", subdoshaId };
}

export function generateTrueFalse(subdoshaId: SubdoshaId, rng: Rng = defaultRng): Question {
  const field: "area" | "fn" = rng() < 0.5 ? "area" : "fn";
  const isTrue = rng() < 0.5;
  const statement = isTrue
    ? SUBDOSHAS[subdoshaId][field]
    : SUBDOSHAS[pickOne(SUBDOSHA_ORDER.filter((id) => id !== subdoshaId), rng)][field];
  return { id: randomId("tf"), type: "true-false", subdoshaId, field, statement, isTrue };
}

export function generateMatchingPairs(pool: SubdoshaId[], rng: Rng = defaultRng): Question {
  const subdoshaIds = sample(pool, Math.min(4, pool.length), rng);
  return { id: randomId("match"), type: "matching-pairs", subdoshaIds };
}

export function generateRelateSubdoshaTriple(subdoshaId: SubdoshaId, rng: Rng = defaultRng): Question {
  return {
    id: randomId("triple"),
    type: "relate-subdosha-triple",
    subdoshaId,
    areaOptionIds: shuffle([subdoshaId, ...pickDistractors(SUBDOSHA_ORDER, [subdoshaId], 3, rng)], rng),
    fnOptionIds: shuffle([subdoshaId, ...pickDistractors(SUBDOSHA_ORDER, [subdoshaId], 3, rng)], rng),
  };
}

export function generateSortToDoshaBulk(rng: Rng = defaultRng, count = 9): Question {
  const subdoshaIds = sample(SUBDOSHA_ORDER, count, rng);
  return { id: randomId("sort"), type: "sort-to-dosha-bulk", subdoshaIds };
}

/**
 * Generators that test a single subdosha and can stand in as a "refuerzo"
 * question when the session reinserts a missed subdosha further down the
 * queue (repetición espaciada) — always a different type than the one that
 * was just missed.
 */
export const SINGLE_SUBJECT_GENERATORS: Array<{
  type: Question["type"];
  generate: (subdoshaId: SubdoshaId, rng: Rng) => Question;
}> = [
  { type: "area-to-subdosha-image", generate: generateAreaToSubdoshaImage },
  { type: "function-to-subdosha", generate: generateFunctionToSubdosha },
  { type: "subdosha-to-dosha", generate: (id) => generateSubdoshaToDosha(id) },
  { type: "true-false", generate: generateTrueFalse },
  { type: "relate-subdosha-triple", generate: generateRelateSubdoshaTriple },
];

export function generateReinforcementQuestion(
  subdoshaId: SubdoshaId,
  excludeTypes: ReadonlySet<Question["type"]>,
  rng: Rng = defaultRng
): Question {
  const candidates = SINGLE_SUBJECT_GENERATORS.filter((g) => !excludeTypes.has(g.type));
  const chosen = pickOne(candidates.length > 0 ? candidates : SINGLE_SUBJECT_GENERATORS, rng);
  return chosen.generate(subdoshaId, rng);
}
