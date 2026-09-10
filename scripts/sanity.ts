import { run, type Answer } from "../src/lib/assessment";

function walk(picks: string[]) {
  const answers: Answer[] = [];
  for (let i = 0; i < 20; i++) {
    const state = run(answers);
    if (state.done) return state;
    if (!state.next) return state;
    const pick = picks[i] ?? state.next.options[0].id;
    const option =
      state.next.options.find((o) => o.id === pick) ?? state.next.options[0];
    answers.push({ questionId: state.next.id, optionId: option.id });
  }
  return run(answers);
}

const intj = walk([
  "nt",
  "nt",
  "nt",
  "nt",
  "Ni",
  "Te",
  "Fi",
  "Si",
  "Ni",
  "Te",
  "Ne",
  "Ti",
  "Ni",
  "Te",
  "Fi",
  "Se",
]);

const esfp = walk([
  "sp",
  "sp",
  "sp",
  "sp",
  "Ne",
  "Te",
  "Fe",
  "Se",
  "Se",
  "Fi",
  "Si",
  "Fe",
  "Se",
  "Fi",
  "Te",
  "Ni",
]);

console.log("INTJ-ish ->", intj.result?.type, intj.result?.stack.slice(0, 4), "n=", intj.answered);
console.log("ESFP-ish ->", esfp.result?.type, esfp.result?.stack.slice(0, 4), "n=", esfp.answered);
if (intj.answered > 20 || esfp.answered > 20) {
  throw new Error("Too many questions");
}
