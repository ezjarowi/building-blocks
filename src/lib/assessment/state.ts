import {
  FUNCTION_IDS,
  TEMPERAMENT_IDS,
  type FunctionId,
  type TemperamentId,
} from "./functions";

export type Scores = {
  functions: Record<FunctionId, number>;
  temperament: Record<TemperamentId, number>;
  hero: Record<FunctionId, number>;
  parent: Record<FunctionId, number>;
  child: Record<FunctionId, number>;
  inferior: Record<FunctionId, number>;
};

export function emptyScores(): Scores {
  const zeroF = () =>
    Object.fromEntries(FUNCTION_IDS.map((id) => [id, 0])) as Record<
      FunctionId,
      number
    >;
  const zeroT = () =>
    Object.fromEntries(TEMPERAMENT_IDS.map((id) => [id, 0])) as Record<
      TemperamentId,
      number
    >;
  return {
    functions: zeroF(),
    temperament: zeroT(),
    hero: zeroF(),
    parent: zeroF(),
    child: zeroF(),
    inferior: zeroF(),
  };
}

export function leadingTemperament(scores: Scores): TemperamentId {
  return TEMPERAMENT_IDS.slice().sort(
    (a, b) => scores.temperament[b] - scores.temperament[a],
  )[0];
}

export function leadingFunctions(scores: Scores, n = 4): FunctionId[] {
  return FUNCTION_IDS.slice()
    .sort((a, b) => scores.functions[b] - scores.functions[a])
    .slice(0, n);
}

export function topTwoTemperaments(scores: Scores): [TemperamentId, TemperamentId] {
  const sorted = TEMPERAMENT_IDS.slice().sort(
    (a, b) => scores.temperament[b] - scores.temperament[a],
  );
  return [sorted[0], sorted[1]];
}
