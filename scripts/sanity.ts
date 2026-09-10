import { LEGAL_PAIRS } from "../src/lib/assessment/derive";
import { run } from "../src/lib/assessment/engine";
import type { Answer } from "../src/lib/assessment/questions";
import { TYPES, TYPE_CODES, type TypeCode } from "../src/lib/assessment/types";

function pickFor(code: TypeCode): (questionId: string, optionIds: string[]) => string {
  const t = TYPES[code];
  const hero = t.stack[0];
  const parent = t.stack[1];
  const child = t.stack[2];
  const inferior = t.stack[3];
  const pairIndex = LEGAL_PAIRS[t.temperament].findIndex(
    (pair) => pair.includes(hero) && pair.includes(parent),
  );
  const judging = [hero, parent].find((fn) =>
    ["Te", "Ti", "Fe", "Fi"].includes(fn),
  )!;

  return (questionId, optionIds) => {
    if (questionId.startsWith("t")) return t.temperament;
    if (questionId === "p1" || questionId === "p3") return String(pairIndex);
    if (questionId === "p2") return judging;
    if (questionId === "r-hero" || questionId === "r-split" || questionId === "kill-te-home") {
      return hero;
    }
    if (questionId === "r-parent") return parent;
    if (questionId === "c1") return child;
    if (questionId === "b1") return inferior;
    return optionIds[0];
  };
}

function walk(picker: (id: string, options: string[]) => string) {
  const answers: Answer[] = [];
  for (let i = 0; i < 20; i++) {
    const state = run(answers);
    if (state.done) return state;
    if (!state.next) return state;
    const optionId = picker(
      state.next.id,
      state.next.options.map((o) => o.id),
    );
    const option =
      state.next.options.find((o) => o.id === optionId) ?? state.next.options[0];
    answers.push({ questionId: state.next.id, optionId: option.id });
  }
  return run(answers);
}

let failed = 0;
for (const code of TYPE_CODES) {
  const state = walk(pickFor(code));
  const got = state.result?.type;
  const n = state.answered;
  const ok = got === code && n <= 20 && state.done;
  if (!ok) {
    failed += 1;
    console.log("FAIL", code, "->", got, "n=", n, "done", state.done);
  } else {
    console.log("ok", code, "n=", n, state.result?.confidence);
  }
}

const intjFakingTe = walk((id, options) => {
  if (id.startsWith("t")) return "NT";
  if (id === "p1" || id === "p3") return "0";
  if (id === "p2") return "Te";
  if (id === "r-hero") return "Te";
  if (id === "r-parent") return "Ni";
  if (id === "c1") return "Fi";
  if (id === "b1") return "Se";
  return options[0];
});
console.log(
  "INTJ faking Te-home ->",
  intjFakingTe.result?.type,
  "swapped",
  intjFakingTe.result?.swapped,
  "n=",
  intjFakingTe.answered,
);
if (intjFakingTe.result?.type !== "INTJ") failed += 1;

if (failed) {
  console.error("failures:", failed);
  process.exit(1);
}
console.log("all 16 locked");
