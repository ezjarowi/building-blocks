import type { FunctionId, TemperamentId } from "./functions";
import { TYPES, TYPE_CODES, type TypeCode } from "./types";

/** Jungian axis: hero ↔ burst, parent ↔ child */
export const AXIS: Record<FunctionId, FunctionId> = {
  Ni: "Se",
  Se: "Ni",
  Ne: "Si",
  Si: "Ne",
  Te: "Fi",
  Fi: "Te",
  Ti: "Fe",
  Fe: "Ti",
};

/** Same function, flipped introverted ↔ extraverted */
export const FLIP: Record<FunctionId, FunctionId> = {
  Ni: "Ne",
  Ne: "Ni",
  Se: "Si",
  Si: "Se",
  Te: "Ti",
  Ti: "Te",
  Fe: "Fi",
  Fi: "Fe",
};

/** The only two legal working pairs inside each temperament. */
export const LEGAL_PAIRS: Record<
  TemperamentId,
  readonly [readonly [FunctionId, FunctionId], readonly [FunctionId, FunctionId]]
> = {
  NT: [
    ["Ni", "Te"],
    ["Ne", "Ti"],
  ],
  NF: [
    ["Ni", "Fe"],
    ["Ne", "Fi"],
  ],
  SJ: [
    ["Si", "Te"],
    ["Si", "Fe"],
  ],
  SP: [
    ["Se", "Ti"],
    ["Se", "Fi"],
  ],
};

export function stackFromHeroParent(
  hero: FunctionId,
  parent: FunctionId,
): FunctionId[] | null {
  if (hero === parent) return null;
  const child = AXIS[parent];
  const inferior = AXIS[hero];
  if (child === hero || inferior === parent) return null;
  const top: FunctionId[] = [hero, parent, child, inferior];
  const bottom = top.map((fn) => FLIP[fn]);
  return [...top, ...bottom];
}

export function typeFromHeroParent(
  hero: FunctionId,
  parent: FunctionId,
): TypeCode | null {
  const match = TYPE_CODES.find(
    (code) => TYPES[code].stack[0] === hero && TYPES[code].stack[1] === parent,
  );
  return match ?? null;
}

export function pairIndexContaining(
  temperament: TemperamentId,
  fn: FunctionId,
): 0 | 1 | null {
  const [a, b] = LEGAL_PAIRS[temperament];
  const inA = a.includes(fn);
  const inB = b.includes(fn);
  if (inA && !inB) return 0;
  if (inB && !inA) return 1;
  return null;
}

export function otherOfPair(
  pair: readonly [FunctionId, FunctionId],
  fn: FunctionId,
): FunctionId {
  return pair[0] === fn ? pair[1] : pair[0];
}
