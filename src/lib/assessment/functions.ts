export const FUNCTION_IDS = [
  "Ni",
  "Ne",
  "Se",
  "Si",
  "Te",
  "Ti",
  "Fe",
  "Fi",
] as const;

export type FunctionId = (typeof FUNCTION_IDS)[number];

export const TEMPERAMENT_IDS = ["NT", "NF", "SJ", "SP"] as const;
export type TemperamentId = (typeof TEMPERAMENT_IDS)[number];

export type FunctionDef = {
  id: FunctionId;
  name: string;
  short: string;
  want: string;
  blurb: string;
  complementary: FunctionId;
  axis: FunctionId;
};

/**
 * Building blocks — source of truth is the product model, not CS Joseph copy.
 * CS Joseph informs stack *mechanics* (order, roles). These names and
 * meanings win wherever the two differ.
 */
export const FUNCTIONS: Record<FunctionId, FunctionDef> = {
  Ni: {
    id: "Ni",
    name: "Vision and Focus",
    short: "Vision and Focus in the Future",
    want: "One path that will matter, held with focus.",
    blurb:
      "Seeing where this is going, choosing the path, and staying with it.",
    complementary: "Ne",
    axis: "Se",
  },
  Ne: {
    id: "Ne",
    name: "Alternatives and New Ideas",
    short: "Alternatives and New Ideas",
    want: "More than one good possibility, kept alive.",
    blurb:
      "Opening new ideas and alternatives. Complements vision — and competes with it for focus.",
    complementary: "Ni",
    axis: "Si",
  },
  Se: {
    id: "Se",
    name: "Getting Things Going",
    short: "Getting Things Going / Moving",
    want: "Motion in the present. Something actually happening.",
    blurb: "Starting movement. Making the room, the work, the day go.",
    complementary: "Si",
    axis: "Ni",
  },
  Si: {
    id: "Si",
    name: "Consistency and Reliability",
    short: "Consistency and Reliability (Stability)",
    want: "The good thing staying good, now and next time.",
    blurb: "Keeping what works, reliably. Stability you can count on.",
    complementary: "Se",
    axis: "Ne",
  },
  Te: {
    id: "Te",
    name: "Effectiveness",
    short: "Effectiveness / Efficiency / Results",
    want: "It works. Results land. The method is proven.",
    blurb:
      "Getting effective results — including by using what already works, and what others have already figured out.",
    complementary: "Ti",
    axis: "Fi",
  },
  Ti: {
    id: "Ti",
    name: "My Own Conclusions",
    short: "My Own Conclusions",
    want: "I reached this. It holds up in my own logic.",
    blurb:
      "Coming to an answer yourself, rather than taking it on because an expert or a result-sheet said so.",
    complementary: "Te",
    axis: "Fe",
  },
  Fe: {
    id: "Fe",
    name: "Social Persuasion",
    short: "Social Persuasion",
    want: "People naturally come with you.",
    blurb:
      "When you say it, the room goes with it — organically, not by pushing.",
    complementary: "Fi",
    axis: "Ti",
  },
  Fi: {
    id: "Fi",
    name: "Alignment",
    short: "Alignment with Self and Others",
    want: "It sits right with me, and with the people it touches.",
    blurb:
      "Alignment with yourself, in the context of alignment with others. Not either/or.",
    complementary: "Fe",
    axis: "Te",
  },
};

export const TEMPERAMENTS: Record<
  TemperamentId,
  {
    id: TemperamentId;
    name: string;
    want: string;
    blurb: string;
    types: readonly string[];
  }
> = {
  NT: {
    id: "NT",
    name: "Progress",
    want: "Progress toward the future",
    blurb:
      "You light up when things are actually moving toward a future that's better than this one.",
    types: ["INTJ", "ENTJ", "INTP", "ENTP"],
  },
  NF: {
    id: "NF",
    name: "Meaning",
    want: "Meaning and connection",
    blurb:
      "You light up when it means something — and when people actually connect.",
    types: ["INFJ", "ENFJ", "INFP", "ENFP"],
  },
  SJ: {
    id: "SJ",
    name: "Stability",
    want: "Stability and consistency, now and always",
    blurb:
      "You light up when the good things stay good — reliably, on purpose.",
    types: ["ISTJ", "ESTJ", "ISFJ", "ESFJ"],
  },
  SP: {
    id: "SP",
    name: "Motion",
    want: "Getting things moving in the present",
    blurb:
      "You light up when something is actually happening — action, now, live.",
    types: ["ISTP", "ESTP", "ISFP", "ESFP"],
  },
};

export const ROLE_LABELS = [
  {
    index: 1,
    key: "hero" as const,
    name: "Happy place",
    brief:
      "What you prefer. Relaxed, satisfying, energized. You can stay here.",
  },
  {
    index: 2,
    key: "parent" as const,
    name: "Make sure",
    brief: "What you make sure happens. You keep this true.",
  },
  {
    index: 3,
    key: "child" as const,
    name: "Relief",
    brief:
      "The break from the first two. Easy, almost play. A relief — not a job.",
  },
  {
    index: 4,
    key: "inferior" as const,
    name: "Burst",
    brief:
      "You can do this for a while. Then the energy runs out. Not forever.",
  },
  {
    index: 5,
    key: "nemesis" as const,
    name: "Fifth",
    brief: "Available, but it costs more than the top four.",
  },
  {
    index: 6,
    key: "critic" as const,
    name: "Sixth",
    brief: "You can visit. You would not want to live here.",
  },
  {
    index: 7,
    key: "trickster" as const,
    name: "Seventh",
    brief: "Slippery. Easy to misread, hard to sustain.",
  },
  {
    index: 8,
    key: "demon" as const,
    name: "Least preferred",
    brief: "Last in line. The least natural to keep going for long.",
  },
];
