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

const NOTE =
  "Every option is a good one. Pick the one that sounds like more fun — not the one a boss or a parent would clap for.";

export const TEMPERAMENT_QUESTIONS: Question[] = [
  {
    id: "t1",
    job: "temperament",
    prompt: "Where would you have the best time?",
    stem: "A surprise free Saturday. Nothing is due. Nobody is grading you.",
    note: NOTE,
    options: [
      {
        id: "NT",
        temperament: "NT",
        label:
          "A thread that actually gets somewhere — progress toward a future that's better than this one.",
      },
      {
        id: "SJ",
        temperament: "SJ",
        label:
          "The good things staying good. The shape that already holds, kept that way.",
      },
      {
        id: "NF",
        temperament: "NF",
        label:
          "Something that means something — connection that was actually real.",
      },
      {
        id: "SP",
        temperament: "SP",
        label:
          "Something actually happening. Motion, now, in the room, with your hands or your presence.",
      },
    ],
  },
  {
    id: "t2",
    job: "temperament",
    prompt: "Which sounds like the better time?",
    stem: "You're with people you like. No agenda. What's the sweet spot?",
    note: NOTE,
    options: [
      {
        id: "NT",
        temperament: "NT",
        label:
          "The click when a better way forward is found — and you can actually use it.",
      },
      {
        id: "SJ",
        temperament: "SJ",
        label: "Everyone knowing how this goes, and it actually holding.",
      },
      {
        id: "NF",
        temperament: "NF",
        label:
          "A real exchange that leaves people closer, like it mattered we were here.",
      },
      {
        id: "SP",
        temperament: "SP",
        label: "Doing it together, not just talking about it. Things moving.",
      },
    ],
  },
  {
    id: "t3",
    job: "temperament",
    prompt: "Which would you enjoy receiving?",
    stem: "If life quietly gave you more of only one thing, which would feel like a gift?",
    note: NOTE,
    options: [
      {
        id: "NT",
        temperament: "NT",
        label: "Progress — things actually moving toward a future that's better.",
      },
      {
        id: "SJ",
        temperament: "SJ",
        label: "Stability — the good things staying good, on purpose.",
      },
      {
        id: "NF",
        temperament: "NF",
        label: "Meaning — connection, and a sense that it matters.",
      },
      {
        id: "SP",
        temperament: "SP",
        label: "Motion — the feeling of things getting going, today.",
      },
    ],
  },
  {
    id: "t4",
    job: "temperament",
    prompt: "Which absence would actually bother you?",
    stem: "The other three can still be good. Which missing one makes them feel like the wrong prize?",
    note: "Still no wrong answer. Which hole would you not want.",
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
    prompt: "Which life sounds like more fun to be inside?",
    stem: "Two good lives. Which would you rather wake up in?",
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
    "One future, made to work. Vision and focus, then results that land.",
    "Many possibilities, made to make sense to me. Alternatives, then my own conclusions.",
  ],
  NF: [
    "One future, made to move people. Vision and focus, then the room comes with you.",
    "Many possibilities, made to stay true. Alternatives, then alignment with self and others.",
  ],
  SJ: [
    "What has held, made to work. Reliability, then results that land.",
    "What has held, made to hold people together. Reliability, then the room comes with you.",
  ],
  SP: [
    "What's happening, made to make sense to me. Motion, then my own conclusions.",
    "What's happening, made to stay true. Motion, then alignment with self and others.",
  ],
};

const SPLIT_STEM: Record<
  TemperamentId,
  { prompt: string; stem: string; a: Option; b: Option }
> = {
  NT: {
    prompt: "Which would be more satisfying?",
    stem: "A decision is real. You rest when:",
    a: {
      id: "Te",
      fn: "Te",
      pairIndex: 0,
      label:
        "It works out there. Methods, results, what already paid for. The private why can wait if the thing lands.",
    },
    b: {
      id: "Ti",
      fn: "Ti",
      pairIndex: 1,
      label:
        "I reached this. My own conclusion holds. The board can wait if I can stand inside the answer.",
    },
  },
  NF: {
    prompt: "Which would feel better in your body?",
    stem: "The room is off. You actually need:",
    a: {
      id: "Fe",
      fn: "Fe",
      pairIndex: 0,
      label:
        "The room comes with you. The weather between people moves. Your private yes can wait.",
    },
    b: {
      id: "Fi",
      fn: "Fi",
      pairIndex: 1,
      label:
        "It sits right with me, and with the people it touches. The room can stay awkward if that stays true.",
    },
  },
  SJ: {
    prompt: "Which would you rather keep true?",
    stem: "Something good is already in place. The satisfying next move is:",
    a: {
      id: "Te",
      fn: "Te",
      pairIndex: 0,
      label: "Make sure it actually works. Results. Effectiveness. It lands.",
    },
    b: {
      id: "Fe",
      fn: "Fe",
      pairIndex: 1,
      label:
        "Make sure people naturally come with it. The room goes. That's the hold.",
    },
  },
  SP: {
    prompt: "Which would feel like the better time?",
    stem: "You're already in motion. The satisfying part is:",
    a: {
      id: "Ti",
      fn: "Ti",
      pairIndex: 0,
      label: "Getting to a conclusion that's actually yours, in the middle of the doing.",
    },
    b: {
      id: "Fi",
      fn: "Fi",
      pairIndex: 1,
      label:
        "It sitting right — with you, and with the people it touches — while it's happening.",
    },
  },
};

export function pairAsGoodQuestion(temperament: TemperamentId): Question {
  const [a, b] = PAIR_AS_GOOD[temperament];
  return {
    id: "p1",
    job: "pair",
    prompt: "Which is the actual engine, not a hobby?",
    stem: "Two good ways a life like this can run.",
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
    prompt: "Which couple would you rather live inside?",
    stem: "One more, same two engines, said slower.",
    note: NOTE,
    options: [
      {
        id: "0",
        pairIndex: 0,
        label: `${FUNCTIONS[left[0]].short} with ${FUNCTIONS[left[1]].short}.`,
      },
      {
        id: "1",
        pairIndex: 1,
        label: `${FUNCTIONS[right[0]].short} with ${FUNCTIONS[right[1]].short}.`,
      },
    ],
  };
}

export function heroQuestion(a: FunctionId, b: FunctionId): Question {
  return {
    id: "r-hero",
    job: "hero",
    prompt: "Which is the happy place? The one you could do for the joy of it.",
    stem: "Nobody needs you. Nothing is on fire. Where does the mind go and stay?",
    note: NOTE,
    options: [
      {
        id: a,
        fn: a,
        label: `${FUNCTIONS[a].short}. You could live in this. The other can wait.`,
      },
      {
        id: b,
        fn: b,
        label: `${FUNCTIONS[b].short}. You could live in this. The other can wait.`,
      },
    ],
  };
}

export function parentQuestion(a: FunctionId, b: FunctionId): Question {
  return {
    id: "r-parent",
    job: "parent",
    prompt: "Not which is more impressive. Which one would you make sure of.",
    stem: "You're away a month. Someone you like is covering. What do you most want still true when you get back — even if it means interrupting the fun of the other?",
    note: "Keep-true is not more grown. It's the hinge. The other one is allowed to be the fun.",
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
    prompt: "You may not pick the same one twice.",
    stem: "One is the room you'd live in when nothing is required. One is the hinge you'd restore so the day doesn't fall apart. Which is the room?",
    note: NOTE,
    options: [
      {
        id: a,
        fn: a,
        label: `${FUNCTIONS[a].name} is the room. ${FUNCTIONS[b].name} is the hinge.`,
      },
      {
        id: b,
        fn: b,
        label: `${FUNCTIONS[b].name} is the room. ${FUNCTIONS[a].name} is the hinge.`,
      },
    ],
  };
}

export function childQuestion(child: FunctionId, burst: FunctionId): Question {
  return {
    id: "c1",
    job: "child",
    prompt: "Which help would feel like a gift, not a loss?",
    stem: "A friend brings one piece so you don't have to carry it. You'd actually be glad — fond, not graded.",
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
    prompt: "Which one is a burst, not a home?",
    stem: "You have about two good hours of extra juice. You can go hard, then you're done — emptied, and that's fine.",
    note: NOTE,
    options: [
      {
        id: burst,
        fn: burst,
        label: `A burst of ${FUNCTIONS[burst].short.toLowerCase()} — then you don't want it for a while.`,
      },
      {
        id: child,
        fn: child,
        label: `A burst of ${FUNCTIONS[child].short.toLowerCase()} — then you don't want it for a while.`,
      },
    ],
  };
}

export function teHomeKill(hero: FunctionId, other: FunctionId): Question {
  return {
    id: "kill-te-home",
    job: "split",
    prompt: "Which would you still want?",
    stem: "A day with no outcome required. Nothing has to land. No one is watching. What's left?",
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
