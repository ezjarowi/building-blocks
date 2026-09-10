import { FUNCTIONS, type FunctionId, type TemperamentId } from "./functions";
import { LEGAL_PAIRS } from "./derive";

export type Answer = {
  questionId: string;
  optionId: string;
};

export type Option = {
  id: string;
  label: string;
  temperament?: TemperamentId;
  pairIndex?: 0 | 1;
  fn?: FunctionId;
};

export type Question = {
  id: string;
  stem: string;
  prompt: string;
  note: string;
  job:
    | "temperament"
    | "pair"
    | "hero"
    | "parent"
    | "child"
    | "burst"
    | "split";
  options: Option[];
};

const NOTE = "No wrong answers. Pick what's more fun — not what sounds impressive.";

export const TEMPERAMENT_QUESTIONS: Question[] = [
  {
    id: "t1",
    job: "temperament",
    prompt: "Where would you have the best time?",
    stem: "A free Saturday. Nothing due. Nobody grading you.",
    note: NOTE,
    options: [
      {
        id: "NT",
        temperament: "NT",
        label: "Getting somewhere — real progress.",
      },
      {
        id: "SJ",
        temperament: "SJ",
        label: "Keeping the good thing good.",
      },
      {
        id: "NF",
        temperament: "NF",
        label: "It actually meaning something.",
      },
      {
        id: "SP",
        temperament: "SP",
        label: "Getting something moving, today.",
      },
    ],
  },
  {
    id: "t2",
    job: "temperament",
    prompt: "Which sounds like the better time?",
    stem: "People you like. No agenda. The sweet spot is:",
    note: NOTE,
    options: [
      {
        id: "NT",
        temperament: "NT",
        label: "Finding a better way forward — and using it.",
      },
      {
        id: "SJ",
        temperament: "SJ",
        label: "Everyone knowing how this goes, and it holding.",
      },
      {
        id: "NF",
        temperament: "NF",
        label: "A real exchange. People closer.",
      },
      {
        id: "SP",
        temperament: "SP",
        label: "Doing it, not just talking.",
      },
    ],
  },
  {
    id: "t3",
    job: "temperament",
    prompt: "Which would feel like a gift?",
    stem: "Life gives you more of only one thing:",
    note: NOTE,
    options: [
      {
        id: "NT",
        temperament: "NT",
        label: "Progress — a future that's getting better.",
      },
      {
        id: "SJ",
        temperament: "SJ",
        label: "Stability — the good things stay good.",
      },
      {
        id: "NF",
        temperament: "NF",
        label: "Meaning — it matters, and people connect.",
      },
      {
        id: "SP",
        temperament: "SP",
        label: "Motion — things get going.",
      },
    ],
  },
  {
    id: "t4",
    job: "temperament",
    prompt: "Which hole would you not want?",
    stem: "The other three can still be good. Which missing one ruins it?",
    note: NOTE,
    options: [
      {
        id: "NT",
        temperament: "NT",
        label: "A life that never gets anywhere.",
      },
      {
        id: "SJ",
        temperament: "SJ",
        label: "A life that won't hold.",
      },
      {
        id: "NF",
        temperament: "NF",
        label: "A life that doesn't mean anything to the people in it.",
      },
      {
        id: "SP",
        temperament: "SP",
        label: "A life where nothing actually gets going.",
      },
    ],
  },
];

export function temperamentTiebreak(a: TemperamentId, b: TemperamentId): Question {
  const labels: Record<TemperamentId, string> = {
    NT: "A life that keeps getting somewhere.",
    SJ: "A life that stays solid.",
    NF: "A life that means something to the people in it.",
    SP: "A life where things actually get going.",
  };
  return {
    id: "t5",
    job: "temperament",
    prompt: "Which would you rather wake up in?",
    stem: "Two good lives.",
    note: NOTE,
    options: [
      { id: a, temperament: a, label: labels[a] },
      { id: b, temperament: b, label: labels[b] },
    ],
  };
}

const PAIR_AS_GOOD: Record<
  TemperamentId,
  [string, string]
> = {
  NT: [
    "One future, made to work.",
    "Many possibilities, made to make sense to me.",
  ],
  NF: [
    "One future, made to move people.",
    "Many possibilities, made to stay true.",
  ],
  SJ: [
    "What has held, made to work.",
    "What has held, made to hold people together.",
  ],
  SP: [
    "What's happening, made to make sense to me.",
    "What's happening, made to stay true.",
  ],
};

const SPLIT_STEM: Record<
  TemperamentId,
  { prompt: string; stem: string; a: Option; b: Option }
> = {
  NT: {
    prompt: "Which is more satisfying?",
    stem: "A real decision. You rest when:",
    a: {
      id: "Te",
      fn: "Te",
      pairIndex: 0,
      label: "It works out there. Results land.",
    },
    b: {
      id: "Ti",
      fn: "Ti",
      pairIndex: 1,
      label: "I reached this. The conclusion is mine.",
    },
  },
  NF: {
    prompt: "Which do you actually need?",
    stem: "The room is off.",
    a: {
      id: "Fe",
      fn: "Fe",
      pairIndex: 0,
      label: "People come with you. The room moves.",
    },
    b: {
      id: "Fi",
      fn: "Fi",
      pairIndex: 1,
      label: "It sits right with me, and with the people it touches.",
    },
  },
  SJ: {
    prompt: "Which would you rather keep true?",
    stem: "Something good is already in place.",
    a: {
      id: "Te",
      fn: "Te",
      pairIndex: 0,
      label: "It actually works. It lands.",
    },
    b: {
      id: "Fe",
      fn: "Fe",
      pairIndex: 1,
      label: "People naturally come with it.",
    },
  },
  SP: {
    prompt: "Which is the better time?",
    stem: "You're already in motion.",
    a: {
      id: "Ti",
      fn: "Ti",
      pairIndex: 0,
      label: "Getting to a conclusion that's mine.",
    },
    b: {
      id: "Fi",
      fn: "Fi",
      pairIndex: 1,
      label: "It sitting right — with me, and with them.",
    },
  },
};

export function pairAsGoodQuestion(temperament: TemperamentId): Question {
  const [a, b] = PAIR_AS_GOOD[temperament];
  return {
    id: "p1",
    job: "pair",
    prompt: "Which engine?",
    stem: "Two good ways this can run.",
    note: NOTE,
    options: [
      { id: "0", pairIndex: 0, label: a },
      { id: "1", pairIndex: 1, label: b },
    ],
  };
}

export function pairSplitQuestion(temperament: TemperamentId): Question {
  const split = SPLIT_STEM[temperament];
  return {
    id: "p2",
    job: "pair",
    prompt: split.prompt,
    stem: split.stem,
    note: NOTE,
    options: [split.a, split.b],
  };
}

export function pairRepairQuestion(temperament: TemperamentId): Question {
  const [left, right] = LEGAL_PAIRS[temperament];
  return {
    id: "p3",
    job: "pair",
    prompt: "Which pair would you rather live in?",
    stem: "Same two engines, said slower.",
    note: NOTE,
    options: [
      {
        id: "0",
        pairIndex: 0,
        label: `${FUNCTIONS[left[0]].name} + ${FUNCTIONS[left[1]].name}`,
      },
      {
        id: "1",
        pairIndex: 1,
        label: `${FUNCTIONS[right[0]].name} + ${FUNCTIONS[right[1]].name}`,
      },
    ],
  };
}

export function heroQuestion(a: FunctionId, b: FunctionId): Question {
  return {
    id: "r-hero",
    job: "hero",
    prompt: "Which is home?",
    stem: "Nobody needs you. Where do you stay?",
    note: NOTE,
    options: [
      { id: a, fn: a, label: FUNCTIONS[a].want },
      { id: b, fn: b, label: FUNCTIONS[b].want },
    ],
  };
}

export function parentQuestion(a: FunctionId, b: FunctionId): Question {
  return {
    id: "r-parent",
    job: "parent",
    prompt: "Which would you make sure of?",
    stem: "You're away a month. What still has to be true when you get back?",
    note: "This isn't the more grown answer. It's just the hinge.",
    options: [
      { id: a, fn: a, label: FUNCTIONS[a].want },
      { id: b, fn: b, label: FUNCTIONS[b].want },
    ],
  };
}

export function splitQuestion(a: FunctionId, b: FunctionId): Question {
  return {
    id: "r-split",
    job: "split",
    prompt: "You can't pick the same one twice.",
    stem: "One is home. One is the hinge. Which is home?",
    note: NOTE,
    options: [
      {
        id: a,
        fn: a,
        label: `${FUNCTIONS[a].name} is home. ${FUNCTIONS[b].name} is the hinge.`,
      },
      {
        id: b,
        fn: b,
        label: `${FUNCTIONS[b].name} is home. ${FUNCTIONS[a].name} is the hinge.`,
      },
    ],
  };
}

export function childQuestion(child: FunctionId, burst: FunctionId): Question {
  return {
    id: "c1",
    job: "child",
    prompt: "Which help is a gift?",
    stem: "A friend handles one piece. You'd actually be glad.",
    note: NOTE,
    options: [
      { id: child, fn: child, label: FUNCTIONS[child].short },
      { id: burst, fn: burst, label: FUNCTIONS[burst].short },
    ],
  };
}

export function burstQuestion(child: FunctionId, burst: FunctionId): Question {
  return {
    id: "b1",
    job: "burst",
    prompt: "Which is a burst — not home?",
    stem: "Two good hours. Then you're empty. That's fine.",
    note: NOTE,
    options: [
      { id: burst, fn: burst, label: FUNCTIONS[burst].want },
      { id: child, fn: child, label: FUNCTIONS[child].want },
    ],
  };
}

export function teHomeKill(hero: FunctionId, other: FunctionId): Question {
  return {
    id: "kill-te-home",
    job: "split",
    prompt: "What's left?",
    stem: "Nothing has to land. No one is watching.",
    note: NOTE,
    options: [
      {
        id: other,
        fn: other,
        label: FUNCTIONS[other].want,
      },
      {
        id: hero,
        fn: hero,
        label: FUNCTIONS[hero].want,
      },
    ],
  };
}
