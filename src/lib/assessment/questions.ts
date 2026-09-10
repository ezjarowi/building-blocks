import type { FunctionId, TemperamentId } from "./functions";
import { FUNCTIONS } from "./functions";
import {
  leadingFunctions,
  leadingTemperament,
  type Scores,
} from "./state";

export type ScoreMap = Partial<
  Record<FunctionId | TemperamentId, number>
>;

export type Option = {
  id: string;
  label: string;
  scores: ScoreMap;
  hero?: FunctionId;
  parent?: FunctionId;
  child?: FunctionId;
  inferior?: FunctionId;
};

export type Question = {
  id: string;
  stem: string;
  prompt: string;
  note?: string;
  options: Option[];
};

export type Answer = {
  questionId: string;
  optionId: string;
};

const NOTE =
  "Every option is a good one. Pick the one that sounds like more fun — not the one a boss or a parent would clap for.";

function wyr(
  id: string,
  stem: string,
  a: Option,
  b: Option,
  prompt = "Would you rather…",
): Question {
  return { id, stem, prompt, note: NOTE, options: [a, b] };
}

function four(
  id: string,
  stem: string,
  options: Option[],
  prompt = "Where would you have the best time?",
): Question {
  return { id, stem, prompt, note: NOTE, options };
}

const TEMPERAMENT_PHASE: Question[] = [
  four(
    "t1",
    "A surprise free Saturday just opened up. Nothing is due. Nobody is grading you.",
    [
      {
        id: "nt",
        label:
          "Following a thread until I can see the one direction that's actually going somewhere.",
        scores: { NT: 3, Ni: 1 },
      },
      {
        id: "sj",
        label:
          "Settling into a rhythm that already works, and making it even more solid.",
        scores: { SJ: 3, Si: 1 },
      },
      {
        id: "nf",
        label:
          "Being with people — or a project — where it actually means something.",
        scores: { NF: 3, Fi: 0.5, Fe: 0.5 },
      },
      {
        id: "sp",
        label:
          "Getting something moving today. Hands on. Energy in the room. Things happening.",
        scores: { SP: 3, Se: 1 },
      },
    ],
  ),
  four(
    "t2",
    "You're with people you like. No agenda, no performance. What's the sweet spot?",
    [
      {
        id: "nt",
        label:
          "The click when a better way forward comes into focus, and we can actually use it.",
        scores: { NT: 3, Te: 0.5, Ni: 0.5 },
      },
      {
        id: "sj",
        label:
          "Everyone knowing how this goes, and it actually holding — same good thing, next time too.",
        scores: { SJ: 3, Si: 1 },
      },
      {
        id: "nf",
        label:
          "A real exchange that leaves people feeling closer, like it mattered that we were here.",
        scores: { NF: 3, Fe: 0.5, Fi: 0.5 },
      },
      {
        id: "sp",
        label:
          "Doing something together, not just talking about it. Motion. Now.",
        scores: { SP: 3, Se: 1 },
      },
    ],
    "Which sounds like the best time?",
  ),
  four(
    "t3",
    "If life quietly gave you more of only one thing, which would feel like a gift?",
    [
      {
        id: "nt",
        label: "Progress — things actually moving toward a future that's better.",
        scores: { NT: 3 },
      },
      {
        id: "sj",
        label: "Stability — the good things staying good, on purpose.",
        scores: { SJ: 3 },
      },
      {
        id: "nf",
        label: "Meaning — connection, and a sense that it matters.",
        scores: { NF: 3 },
      },
      {
        id: "sp",
        label: "Motion — the feeling of things getting going, today.",
        scores: { SP: 3 },
      },
    ],
    "Which would you enjoy receiving?",
  ),
  four(
    "t4",
    "A long afternoon, yours. Which one would you look forward to?",
    [
      {
        id: "nt",
        label:
          "Locked onto a future worth building, with the extra paths set aside so the one that matters can breathe.",
        scores: { NT: 3, Ni: 1 },
      },
      {
        id: "sj",
        label:
          "Making sure tomorrow will feel as steady as today. The reliable version of a good thing.",
        scores: { SJ: 3, Si: 1 },
      },
      {
        id: "nf",
        label:
          "Inside something that makes people — including you — feel understood.",
        scores: { NF: 3 },
      },
      {
        id: "sp",
        label: "In the middle of it. Live. Something is happening, and you're in it.",
        scores: { SP: 3, Se: 1 },
      },
    ],
    "Which afternoon would you pick for yourself?",
  ),
];

const TIEBREAK: Question = four(
  "t5",
  "Last one on this. Two good lives. Which would you rather wake up in?",
  [
    {
      id: "nt",
      label: "A life that keeps getting somewhere.",
      scores: { NT: 4 },
    },
    {
      id: "sj",
      label: "A life that stays solid.",
      scores: { SJ: 4 },
    },
    {
      id: "nf",
      label: "A life that means something to the people in it.",
      scores: { NF: 4 },
    },
    {
      id: "sp",
      label: "A life where things actually get going.",
      scores: { SP: 4 },
    },
  ],
  "Which life sounds like more fun to be inside?",
);

const PAIR_PHASE: Question[] = [
  wyr(
    "p-ni-ne",
    "Three unstructured hours, just for you.",
    {
      id: "Ni",
      label:
        "Settling on the one picture of where this is going — and enjoying the focus that comes with it.",
      scores: { Ni: 3, Ne: -0.5 },
      hero: "Ni",
    },
    {
      id: "Ne",
      label:
        "Playing with a handful of new possibilities and seeing which ones spark, even if it means holding more than one.",
      scores: { Ne: 3, Ni: -0.5 },
      hero: "Ne",
    },
    "Where would you have the better time?",
  ),
  wyr(
    "p-te-ti",
    "A puzzle you actually care about. Nobody is watching.",
    {
      id: "Te",
      label:
        "Finding what already works — methods, results, people who've done it — and putting that to use so it lands.",
      scores: { Te: 3, Ti: -0.5 },
      hero: "Te",
    },
    {
      id: "Ti",
      label:
        "Sitting with it until I can honestly say I reached this on my own. My conclusion, my logic.",
      scores: { Ti: 3, Te: -0.5 },
      hero: "Ti",
    },
    "Which would be more satisfying?",
  ),
  wyr(
    "p-fi-fe",
    "You're in a room of people you like. Something needs a next step.",
    {
      id: "Fi",
      label:
        "Making sure it sits right with me — and still sits right with the people it touches.",
      scores: { Fi: 3, Fe: -0.5 },
      hero: "Fi",
    },
    {
      id: "Fe",
      label:
        "Saying the thing that makes the room naturally go, “Yeah — let's.” Not pushing. Just… they come with you.",
      scores: { Fe: 3, Fi: -0.5 },
      hero: "Fe",
    },
    "Which would feel like the better time?",
  ),
  wyr(
    "p-se-si",
    "A good project, already yours.",
    {
      id: "Se",
      label: "Getting it going. Movement. Now. The feeling of it actually starting.",
      scores: { Se: 3, Si: -0.5 },
      hero: "Se",
    },
    {
      id: "Si",
      label:
        "Keeping it consistent. The same good thing, done in a way you can count on next time too.",
      scores: { Si: 3, Se: -0.5 },
      hero: "Si",
    },
    "Which part would you enjoy more?",
  ),
  wyr(
    "p-ni-se",
    "A day that could go either way, and both ways are good.",
    {
      id: "Ni",
      label:
        "Holding the future in focus — the one path — until the next move is obvious.",
      scores: { Ni: 2, Se: -0.25 },
    },
    {
      id: "Se",
      label: "Stepping in and getting something moving, then seeing what that opens.",
      scores: { Se: 2, Ni: -0.25 },
    },
    "Which would you rather spend the day in?",
  ),
  wyr(
    "p-te-fi",
    "Something you care about is mid-stream.",
    {
      id: "Te",
      label: "Making sure it actually works. Results. Effectiveness. It lands.",
      scores: { Te: 2 },
      parent: "Te",
    },
    {
      id: "Fi",
      label:
        "Making sure it still aligns — with me, and with the people it touches.",
      scores: { Fi: 2 },
      parent: "Fi",
    },
    "Which would you rather keep true?",
  ),
  wyr(
    "p-ne-si",
    "A familiar thing could stay as it is, or open up.",
    {
      id: "Ne",
      label: "Trying a new angle. Fresh alternatives. What else could this be?",
      scores: { Ne: 2 },
    },
    {
      id: "Si",
      label: "Keeping the version that already works, reliably, so it stays good.",
      scores: { Si: 2 },
    },
    "Which sounds like more fun from the inside?",
  ),
  wyr(
    "p-ti-fe",
    "A decision is sitting on the table. Both paths are decent.",
    {
      id: "Ti",
      label: "I want to reach my own conclusion before I go with anyone else's.",
      scores: { Ti: 2 },
    },
    {
      id: "Fe",
      label:
        "I want to say it in a way the people in the room will naturally come with.",
      scores: { Fe: 2 },
    },
    "Which would feel better in your body?",
  ),
];

function rolePhase(scores: Scores): Question[] {
  const top = leadingFunctions(scores, 4);
  const a = top[0] ?? "Ni";
  const b = top[1] ?? "Te";
  const c = top[2] ?? "Fi";
  const d = top[3] ?? "Se";

  return [
    wyr(
      "r-hero",
      "Two good versions of a day. Both count. One is home.",
      {
        id: a,
        label: `Staying in ${FUNCTIONS[a].short.toLowerCase()} until the lights go out — and still wanting a little more.`,
        scores: { [a]: 2 },
        hero: a,
      },
      {
        id: b,
        label: `Staying in ${FUNCTIONS[b].short.toLowerCase()} until the lights go out — and still wanting a little more.`,
        scores: { [b]: 2 },
        hero: b,
      },
      "Which is the happy place? The one you could do for the joy of it.",
    ),
    wyr(
      "r-parent",
      "You're away for a month. Someone you like is covering. What do you most want to still be true when you get back?",
      {
        id: a,
        label: FUNCTIONS[a].want,
        scores: { [a]: 1 },
        parent: a,
      },
      {
        id: b,
        label: FUNCTIONS[b].want,
        scores: { [b]: 1 },
        parent: b,
      },
      "Not which is more impressive. Which one would you make sure of.",
    ),
    wyr(
      "r-child",
      "A friend offers to take one piece so you don't have to carry it. You'd actually be glad.",
      {
        id: c,
        label: FUNCTIONS[c].short,
        scores: { [c]: 1 },
        child: c,
      },
      {
        id: d,
        label: FUNCTIONS[d].short,
        scores: { [d]: 1 },
        child: d,
      },
      "Which help would feel like a gift, not a loss?",
    ),
    wyr(
      "r-burst",
      "You have about two good hours of extra juice. You can go hard, then you're done — and that's fine.",
      {
        id: d,
        label: `A burst of ${FUNCTIONS[d].short.toLowerCase()} — then a nap.`,
        scores: { [d]: 1 },
        inferior: d,
      },
      {
        id: c,
        label: `A burst of ${FUNCTIONS[c].short.toLowerCase()} — then a nap.`,
        scores: { [c]: 1 },
        inferior: c,
      },
      "Which one is a burst, not a home?",
    ),
  ];
}

export const MAX_QUESTIONS = 17;

export function temperamentTied(scores: Scores): boolean {
  const entries = (
    ["NT", "NF", "SJ", "SP"] as TemperamentId[]
  )
    .map((id) => [id, scores.temperament[id]] as const)
    .sort((x, y) => y[1] - x[1]);
  return entries[0][1] - entries[1][1] < 3;
}

export function getQuestion(
  answers: Answer[],
  scores: Scores,
): Question | null {
  const n = answers.length;
  if (n < 4) return TEMPERAMENT_PHASE[n];

  const needTie = temperamentTied(scores);
  const askedTie = answers.some((a) => a.questionId === "t5");

  if (n === 4 && needTie && !askedTie) return TIEBREAK;

  const pairOffset = answers.some((a) => a.questionId === "t5") ? 5 : 4;
  const pairIndex = n - pairOffset;
  if (pairIndex >= 0 && pairIndex < PAIR_PHASE.length) {
    return PAIR_PHASE[pairIndex];
  }

  const roleOffset = pairOffset + PAIR_PHASE.length;
  const roleIndex = n - roleOffset;
  const roles = rolePhase(scores);
  if (roleIndex >= 0 && roleIndex < roles.length) {
    return roles[roleIndex];
  }

  return null;
}

export function plannedLength(answers: Answer[], scores: Scores): number {
  const askedTie = answers.some((a) => a.questionId === "t5");
  const stillInTemperament = answers.every(
    (a) => a.questionId.startsWith("t") || a.questionId.length === 0,
  );
  const willAskTie =
    !askedTie && answers.length >= 4 && stillInTemperament && temperamentTied(scores);
  return 16 + (askedTie || willAskTie ? 1 : 0);
}

export function insightAfter(
  answers: Answer[],
  scores: Scores,
): { title: string; body: string } | null {
  const n = answers.length;
  if (n === 4 || (n === 5 && answers.some((a) => a.questionId === "t5"))) {
    const t = leadingTemperament(scores);
    const def = {
      NT: {
        title: "You're lighting up around Progress",
        body: "NT — progress toward the future. Not a grade. A pull.",
      },
      NF: {
        title: "You're lighting up around Meaning",
        body: "NF — meaning and connection. The thing that makes it matter.",
      },
      SJ: {
        title: "You're lighting up around Stability",
        body: "SJ — consistency and reliability. The good thing, kept good.",
      },
      SP: {
        title: "You're lighting up around Motion",
        body: "SP — getting things moving. Present-tense action.",
      },
    }[t];
    return def;
  }

  if (n === 8 || n === 9) {
    const [first] = leadingFunctions(scores, 1);
    if (!first) return null;
    return {
      title: `That sounds like ${FUNCTIONS[first].name}`,
      body: FUNCTIONS[first].blurb,
    };
  }

  if (n === 12 || n === 13) {
    const [a, b] = leadingFunctions(scores, 2);
    if (!a || !b) return null;
    return {
      title: "A pattern is settling",
      body: `Happy place leaning ${FUNCTIONS[a].name}. “Make sure” leaning ${FUNCTIONS[b].name}. We'll confirm in a few more.`,
    };
  }

  return null;
}
