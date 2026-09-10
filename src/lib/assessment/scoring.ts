import {
  FUNCTION_IDS,
  FUNCTIONS,
  TEMPERAMENTS,
  type FunctionId,
  type TemperamentId,
} from "./functions";
import type { Answer, Option, Question } from "./questions";
import {
  emptyScores,
  leadingFunctions,
  leadingTemperament,
  type Scores,
} from "./state";
import { TYPES, TYPE_CODES, type TypeCode } from "./types";

export type { Scores } from "./state";
export { emptyScores, leadingFunctions, leadingTemperament };

const STACK_WEIGHTS = [8, 5, 3, 2, 0.4, 0.25, 0.15, 0.1];

export function applyOption(scores: Scores, option: Option): Scores {
  const next: Scores = {
    functions: { ...scores.functions },
    temperament: { ...scores.temperament },
    hero: { ...scores.hero },
    parent: { ...scores.parent },
    child: { ...scores.child },
    inferior: { ...scores.inferior },
  };

  for (const [key, value] of Object.entries(option.scores)) {
    if (value == null) continue;
    if (key in next.temperament) {
      next.temperament[key as TemperamentId] += value;
    } else if (key in next.functions) {
      next.functions[key as FunctionId] += value;
    }
  }

  if (option.hero) next.hero[option.hero] += 2;
  if (option.parent) next.parent[option.parent] += 2;
  if (option.child) next.child[option.child] += 2;
  if (option.inferior) next.inferior[option.inferior] += 2;

  return next;
}

export function scoreAnswers(
  answers: Answer[],
  resolve: (questionId: string) => Question | undefined,
): Scores {
  let scores = emptyScores();
  for (const answer of answers) {
    const q = resolve(answer.questionId);
    const option = q?.options.find((o) => o.id === answer.optionId);
    if (!option) continue;
    scores = applyOption(scores, option);
  }
  return scores;
}

export type TypeScore = {
  code: TypeCode;
  total: number;
  temperament: TemperamentId;
};

function typeTotal(code: TypeCode, scores: Scores): number {
  const type = TYPES[code];
  let total = 0;
  type.stack.forEach((fn, i) => {
    total += (scores.functions[fn] ?? 0) * STACK_WEIGHTS[i];
  });
  const hero = type.stack[0];
  const parent = type.stack[1];
  const child = type.stack[2];
  const inferior = type.stack[3];
  total += scores.hero[hero] * 4;
  total += scores.parent[parent] * 3.5;
  total += scores.child[child] * 2;
  total += scores.inferior[inferior] * 2;
  // Reward hero≠parent (the INTJ vs ENTJ split)
  total += scores.hero[hero] - scores.hero[parent] * 0.4;
  total += scores.parent[parent] - scores.parent[hero] * 0.4;
  total += scores.temperament[type.temperament] * 1.2;
  return total;
}

export function rankTypes(scores: Scores): TypeScore[] {
  const t = leadingTemperament(scores);
  const [first, second] = (
    ["NT", "NF", "SJ", "SP"] as TemperamentId[]
  )
    .map((id) => [id, scores.temperament[id]] as const)
    .sort((a, b) => b[1] - a[1]);
  const confident = first[1] - second[1] >= 3;

  const pool = confident
    ? TYPE_CODES.filter((c) => TYPES[c].temperament === t)
    : TYPE_CODES.slice();

  return pool
    .map((code) => ({
      code,
      total: typeTotal(code, scores),
      temperament: TYPES[code].temperament,
    }))
    .sort((a, b) => b.total - a.total);
}

export type AssessmentResult = {
  type: TypeCode;
  temperament: TemperamentId;
  stack: FunctionId[];
  runnersUp: TypeScore[];
  scores: Scores;
  confidence: "high" | "medium" | "low";
};

export function finalize(scores: Scores): AssessmentResult {
  const ranked = rankTypes(scores);
  const winner = ranked[0];
  const margin = ranked.length > 1 ? winner.total - ranked[1].total : winner.total;
  const tMargin = (() => {
    const vals = (["NT", "NF", "SJ", "SP"] as TemperamentId[])
      .map((id) => scores.temperament[id])
      .sort((a, b) => b - a);
    return vals[0] - vals[1];
  })();

  let confidence: AssessmentResult["confidence"] = "medium";
  if (margin > 8 && tMargin >= 3) confidence = "high";
  if (margin < 3 || tMargin < 2) confidence = "low";

  return {
    type: winner.code,
    temperament: TYPES[winner.code].temperament,
    stack: [...TYPES[winner.code].stack],
    runnersUp: ranked.slice(1, 3),
    scores,
    confidence,
  };
}

export function functionSummary(scores: Scores) {
  return FUNCTION_IDS.map((id) => ({
    id,
    name: FUNCTIONS[id].name,
    value: scores.functions[id],
  })).sort((a, b) => b.value - a.value);
}

export function temperamentSummary(scores: Scores) {
  return (["NT", "NF", "SJ", "SP"] as TemperamentId[]).map((id) => ({
    id,
    name: TEMPERAMENTS[id].name,
    want: TEMPERAMENTS[id].want,
    value: scores.temperament[id],
  }));
}
