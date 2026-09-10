import {
  FUNCTIONS,
  TEMPERAMENTS,
  type FunctionId,
  type TemperamentId,
} from "./functions";

export const TYPE_CODES = [
  "INTJ",
  "ENTJ",
  "INTP",
  "ENTP",
  "INFJ",
  "ENFJ",
  "INFP",
  "ENFP",
  "ISTJ",
  "ESTJ",
  "ISFJ",
  "ESFJ",
  "ISTP",
  "ESTP",
  "ISFP",
  "ESFP",
] as const;

export type TypeCode = (typeof TYPE_CODES)[number];

export type TypeDef = {
  code: TypeCode;
  temperament: TemperamentId;
  stack: readonly [
    FunctionId,
    FunctionId,
    FunctionId,
    FunctionId,
    FunctionId,
    FunctionId,
    FunctionId,
    FunctionId,
  ];
};

/**
 * 16 legal stacks. Positions:
 * 1 Hero, 2 Parent, 3 Child, 4 Inferior (burst),
 * 5 Nemesis, 6 Critic, 7 Trickster, 8 Demon.
 *
 * Bottom 4 are the complementary-attitude mirror of the top 4.
 */
export const TYPES: Record<TypeCode, TypeDef> = {
  INTJ: {
    code: "INTJ",
    temperament: "NT",
    stack: ["Ni", "Te", "Fi", "Se", "Ne", "Ti", "Fe", "Si"],
  },
  ENTJ: {
    code: "ENTJ",
    temperament: "NT",
    stack: ["Te", "Ni", "Se", "Fi", "Ti", "Ne", "Si", "Fe"],
  },
  INTP: {
    code: "INTP",
    temperament: "NT",
    stack: ["Ti", "Ne", "Si", "Fe", "Te", "Ni", "Se", "Fi"],
  },
  ENTP: {
    code: "ENTP",
    temperament: "NT",
    stack: ["Ne", "Ti", "Fe", "Si", "Ni", "Te", "Fi", "Se"],
  },
  INFJ: {
    code: "INFJ",
    temperament: "NF",
    stack: ["Ni", "Fe", "Ti", "Se", "Ne", "Fi", "Te", "Si"],
  },
  ENFJ: {
    code: "ENFJ",
    temperament: "NF",
    stack: ["Fe", "Ni", "Se", "Ti", "Fi", "Ne", "Si", "Te"],
  },
  INFP: {
    code: "INFP",
    temperament: "NF",
    stack: ["Fi", "Ne", "Si", "Te", "Fe", "Ni", "Se", "Ti"],
  },
  ENFP: {
    code: "ENFP",
    temperament: "NF",
    stack: ["Ne", "Fi", "Te", "Si", "Ni", "Fe", "Ti", "Se"],
  },
  ISTJ: {
    code: "ISTJ",
    temperament: "SJ",
    stack: ["Si", "Te", "Fi", "Ne", "Se", "Ti", "Fe", "Ni"],
  },
  ESTJ: {
    code: "ESTJ",
    temperament: "SJ",
    stack: ["Te", "Si", "Ne", "Fi", "Ti", "Se", "Ni", "Fe"],
  },
  ISFJ: {
    code: "ISFJ",
    temperament: "SJ",
    stack: ["Si", "Fe", "Ti", "Ne", "Se", "Fi", "Te", "Ni"],
  },
  ESFJ: {
    code: "ESFJ",
    temperament: "SJ",
    stack: ["Fe", "Si", "Ne", "Ti", "Fi", "Se", "Ni", "Te"],
  },
  ISTP: {
    code: "ISTP",
    temperament: "SP",
    stack: ["Ti", "Se", "Ni", "Fe", "Te", "Si", "Ne", "Fi"],
  },
  ESTP: {
    code: "ESTP",
    temperament: "SP",
    stack: ["Se", "Ti", "Fe", "Ni", "Si", "Te", "Fi", "Ne"],
  },
  ISFP: {
    code: "ISFP",
    temperament: "SP",
    stack: ["Fi", "Se", "Ni", "Te", "Fe", "Si", "Ne", "Ti"],
  },
  ESFP: {
    code: "ESFP",
    temperament: "SP",
    stack: ["Se", "Fi", "Te", "Ni", "Si", "Fe", "Ti", "Ne"],
  },
};

export function stackOf(code: TypeCode) {
  return TYPES[code].stack;
}

export function temperamentOf(code: TypeCode) {
  return TYPES[code].temperament;
}

export function workingLoop(code: TypeCode) {
  const [hero, parent] = TYPES[code].stack;
  return {
    a: hero,
    b: parent,
    label: `${FUNCTIONS[hero].name} × ${FUNCTIONS[parent].name}`,
    kind: "working" as const,
    note: "The first two. They run together: the happy place, and what you make sure happens.",
  };
}

export function complementaryLoop(code: TypeCode) {
  const hero = TYPES[code].stack[0];
  const pair = FUNCTIONS[hero].complementary;
  return {
    a: hero,
    b: pair,
    label: `${FUNCTIONS[hero].name} × ${FUNCTIONS[pair].name}`,
    kind: "complementary" as const,
    note: "Two sides of the same coin. They compete for focus, and they raise each other. Not opposites — complementary.",
  };
}

export function axisLoop(code: TypeCode) {
  const hero = TYPES[code].stack[0];
  const parent = TYPES[code].stack[1];
  const inferior = TYPES[code].stack[3];
  return {
    a: hero,
    b: inferior,
    via: parent,
    label: `${FUNCTIONS[hero].name} × ${FUNCTIONS[inferior].name}`,
    kind: "axis" as const,
    note: `${FUNCTIONS[hero].name} leads into ${FUNCTIONS[inferior].name} — typically after ${FUNCTIONS[parent].name} has vetted it.`,
  };
}


