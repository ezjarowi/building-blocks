import {
  apply,
  emptyHypothesis,
  finalize,
  insightAfter,
  nextQuestion,
  type AssessmentResult,
} from "./flow";
import type { Answer, Question } from "./questions";

export type EngineState = {
  next: Question | null;
  done: boolean;
  total: number;
  answered: number;
  insight: { title: string; body: string } | null;
  result: AssessmentResult | null;
  history: Question[];
};

export function run(answers: Answer[]): EngineState {
  let h = emptyHypothesis();
  const history: Question[] = [];

  for (const answer of answers) {
    const question = nextQuestion(h);
    if (!question) break;
    const option = question.options.find((o) => o.id === answer.optionId);
    if (!option) break;
    h = apply(h, question, option);
    history.push(question);
  }

  const next = nextQuestion(h);
  const result = h.status === "confirmed" || next == null ? finalize(h) : null;
  const done = Boolean(result) && (h.status === "confirmed" || next == null);
  const repairing = h.asked.some((id) =>
    ["t5", "p3", "r-split", "kill-te-home"].includes(id),
  );

  return {
    next: done ? null : next,
    done,
    total: h.status === "confirmed" ? history.length : repairing ? 20 : 10,
    answered: history.length,
    insight: insightAfter(h),
    result: done ? result : null,
    history,
  };
}
