import {
  TEMPERAMENT_IDS,
  TEMPERAMENTS,
  type FunctionId,
  type TemperamentId,
} from "./functions";
import {
  AXIS,
  LEGAL_PAIRS,
  otherOfPair,
  pairIndexContaining,
  stackFromHeroParent,
  typeFromHeroParent,
} from "./derive";
import {
  TEMPERAMENT_QUESTIONS,
  burstQuestion,
  childQuestion,
  heroQuestion,
  pairAsGoodQuestion,
  pairRepairQuestion,
  pairSplitQuestion,
  parentQuestion,
  splitQuestion,
  teHomeKill,
  temperamentTiebreak,
  type Option,
  type Question,
} from "./questions";
import { TYPES, type TypeCode } from "./types";

export type Hypothesis = {
  asked: string[];
  temperamentVotes: Record<TemperamentId, number>;
  temperament: TemperamentId | null;
  pairVotes: [number, number];
  pair: readonly [FunctionId, FunctionId] | null;
  heroPick: FunctionId | null;
  parentPick: FunctionId | null;
  hero: FunctionId | null;
  parent: FunctionId | null;
  child: FunctionId | null;
  inferior: FunctionId | null;
  childPick: FunctionId | null;
  burstPick: FunctionId | null;
  status: "open" | "hypothesized" | "confirmed";
  swapped: boolean;
  type: TypeCode | null;
  stack: FunctionId[] | null;
};

export function emptyHypothesis(): Hypothesis {
  return {
    asked: [],
    temperamentVotes: { NT: 0, NF: 0, SJ: 0, SP: 0 },
    temperament: null,
    pairVotes: [0, 0],
    pair: null,
    heroPick: null,
    parentPick: null,
    hero: null,
    parent: null,
    child: null,
    inferior: null,
    childPick: null,
    burstPick: null,
    status: "open",
    swapped: false,
    type: null,
    stack: null,
  };
}

function clone(h: Hypothesis): Hypothesis {
  return {
    ...h,
    asked: [...h.asked],
    temperamentVotes: { ...h.temperamentVotes },
    pairVotes: [...h.pairVotes],
    pair: h.pair ? [...h.pair] : null,
    stack: h.stack ? [...h.stack] : null,
  };
}

function has(h: Hypothesis, id: string) {
  return h.asked.includes(id);
}

function rankedTemperaments(h: Hypothesis): TemperamentId[] {
  return TEMPERAMENT_IDS.slice().sort(
    (a, b) => h.temperamentVotes[b] - h.temperamentVotes[a],
  );
}

function lockTemperament(h: Hypothesis) {
  if (h.temperament) return;
  const [first, second] = rankedTemperaments(h);
  const a = h.temperamentVotes[first];
  const b = h.temperamentVotes[second];
  const askedT = h.asked.filter((id) => id.startsWith("t")).length;
  if (askedT < 3) return;
  if (a === askedT) {
    h.temperament = first;
    return;
  }
  if (askedT >= 4 && a >= 3 && a > b) {
    h.temperament = first;
    return;
  }
  if (askedT >= 5) {
    h.temperament = first;
  }
}

function lockPair(h: Hypothesis) {
  if (h.pair || !h.temperament) return;
  const [x, y] = h.pairVotes;
  const askedP = h.asked.filter((id) => id.startsWith("p")).length;
  if (askedP >= 2 && x !== y) {
    h.pair = LEGAL_PAIRS[h.temperament][x > y ? 0 : 1];
  } else if (askedP >= 3) {
    h.pair = LEGAL_PAIRS[h.temperament][x >= y ? 0 : 1];
  }
}

function hypothesize(h: Hypothesis) {
  if (!h.pair || !h.heroPick || !h.parentPick) return;
  if (h.heroPick === h.parentPick) return;
  if (!h.pair.includes(h.heroPick) || !h.pair.includes(h.parentPick)) return;
  h.hero = h.heroPick;
  h.parent = h.parentPick;
  h.child = AXIS[h.parent];
  h.inferior = AXIS[h.hero];
  h.stack = stackFromHeroParent(h.hero, h.parent);
  h.type = typeFromHeroParent(h.hero, h.parent);
  if (h.type && h.stack) h.status = "hypothesized";
}

function confirm(h: Hypothesis) {
  if (h.status !== "hypothesized") return;
  if (!h.childPick || !h.burstPick || !h.child || !h.inferior) return;
  if (h.childPick === h.child && h.burstPick === h.inferior) {
    h.status = "confirmed";
    return;
  }
  if (h.childPick === h.inferior && h.burstPick === h.child && h.hero && h.parent) {
    const newHero = h.parent;
    const newParent = h.hero;
    h.hero = newHero;
    h.parent = newParent;
    h.heroPick = newHero;
    h.parentPick = newParent;
    h.child = AXIS[newParent];
    h.inferior = AXIS[newHero];
    h.stack = stackFromHeroParent(newHero, newParent);
    h.type = typeFromHeroParent(newHero, newParent);
    h.swapped = true;
    if (h.type && h.stack) h.status = "confirmed";
  }
}

export function apply(h: Hypothesis, question: Question, option: Option): Hypothesis {
  const next = clone(h);
  if (!next.asked.includes(question.id)) next.asked.push(question.id);

  if (option.temperament) {
    next.temperamentVotes[option.temperament] += 1;
    lockTemperament(next);
  }

  if (option.pairIndex === 0 || option.pairIndex === 1) {
    next.pairVotes[option.pairIndex] += 1;
    lockPair(next);
  } else if (option.fn && question.job === "pair" && next.temperament) {
    const idx = pairIndexContaining(next.temperament, option.fn);
    if (idx !== null) {
      next.pairVotes[idx] += 1;
      lockPair(next);
    }
  }

  if (question.job === "hero" && option.fn) {
    next.heroPick = option.fn;
  }

  if (question.job === "parent" && option.fn) {
    next.parentPick = option.fn;
  }

  if (question.job === "split" && option.fn && next.pair) {
    next.heroPick = option.fn;
    next.parentPick = otherOfPair(next.pair, option.fn);
  }

  if (question.job === "child" && option.fn) {
    next.childPick = option.fn;
  }

  if (question.job === "burst" && option.fn) {
    next.burstPick = option.fn;
  }

  hypothesize(next);
  confirm(next);
  return next;
}

export function nextQuestion(h: Hypothesis): Question | null {
  if (h.status === "confirmed") return null;
  if (h.asked.length >= 20) return null;

  if (!h.temperament) {
    const tCount = h.asked.filter((id) => id.startsWith("t")).length;
    if (tCount < 4) return TEMPERAMENT_QUESTIONS[tCount];
    if (!has(h, "t5")) {
      const [a, b] = rankedTemperaments(h);
      return temperamentTiebreak(a, b);
    }
  }

  if (h.temperament && !h.pair) {
    if (!has(h, "p1")) return pairAsGoodQuestion(h.temperament);
    if (!has(h, "p2")) return pairSplitQuestion(h.temperament);
    if (!has(h, "p3")) return pairRepairQuestion(h.temperament);
  }

  if (h.pair && !h.hero) {
    const [a, b] = h.pair;
    if (!has(h, "r-hero")) return heroQuestion(a, b);
    if (!has(h, "r-parent")) return parentQuestion(a, b);
    if (h.heroPick && h.parentPick && h.heroPick === h.parentPick && !has(h, "r-split")) {
      return splitQuestion(a, b);
    }
  }

  if (h.status === "hypothesized" && h.child && h.inferior) {
    if (!has(h, "c1")) return childQuestion(h.child, h.inferior);
    if (!has(h, "b1")) return burstQuestion(h.child, h.inferior);
    if (
      h.hero &&
      h.parent &&
      !has(h, "kill-te-home") &&
      (h.hero === "Te" || h.parent === "Te")
    ) {
      return teHomeKill(h.hero, h.parent);
    }
  }

  return null;
}

export function insightAfter(h: Hypothesis): { title: string; body: string } | null {
  const tJustLocked =
    h.temperament &&
    (h.asked.at(-1)?.startsWith("t") ?? false) &&
    !h.asked.some((id) => id.startsWith("p"));
  if (tJustLocked && h.temperament) {
    const def = TEMPERAMENTS[h.temperament];
    return {
      title: `You're lighting up around ${def.name}`,
      body: `${def.want}. Not a grade. A pull.`,
    };
  }

  const pairJustLocked =
    h.pair &&
    (h.asked.at(-1)?.startsWith("p") ?? false) &&
    !h.asked.some((id) => id.startsWith("r"));
  if (pairJustLocked && h.pair) {
    const [a, b] = h.pair;
    return {
      title: "A working pair is showing",
      body: `${FUNCTIONS_SAFE(a)} with ${FUNCTIONS_SAFE(b)}. Next: which is home, which you make sure of.`,
    };
  }

  return null;
}

function FUNCTIONS_SAFE(id: FunctionId) {
  const names: Record<FunctionId, string> = {
    Ni: "Vision and Focus",
    Ne: "Alternatives and New Ideas",
    Se: "Getting Things Going",
    Si: "Consistency and Reliability",
    Te: "Effectiveness",
    Ti: "My Own Conclusions",
    Fe: "Social Persuasion",
    Fi: "Alignment",
  };
  return names[id];
}

export type AssessmentResult = {
  type: TypeCode;
  temperament: TemperamentId;
  stack: FunctionId[];
  runnersUp: { code: TypeCode; total: number; temperament: TemperamentId }[];
  confidence: "high" | "medium" | "low";
  swapped: boolean;
};

export function finalize(h: Hypothesis): AssessmentResult | null {
  let hero = h.hero;
  let parent = h.parent;
  if ((!hero || !parent) && h.pair && h.heroPick) {
    hero = h.heroPick;
    parent = otherOfPair(h.pair, h.heroPick);
  }
  if (!hero || !parent) return null;
  const type = typeFromHeroParent(hero, parent);
  const stack = stackFromHeroParent(hero, parent);
  if (!type || !stack) return null;
  const swap = typeFromHeroParent(parent, hero);
  const runnersUp = swap
    ? [
        {
          code: swap,
          total: 0,
          temperament: TYPES[swap].temperament,
        },
      ]
    : [];

  let confidence: AssessmentResult["confidence"] = "medium";
  if (h.status === "confirmed") confidence = "high";
  if (!h.childPick || !h.burstPick) confidence = "low";

  return {
    type,
    temperament: TYPES[type].temperament,
    stack,
    runnersUp,
    confidence,
    swapped: h.swapped,
  };
}
