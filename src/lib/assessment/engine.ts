import { applyOption, emptyScores, finalize, type Scores } from "./scoring";
import {
  getQuestion,
  insightAfter,
  plannedLength,
  type Answer,
  type Question,
} from "./questions";
import type { AssessmentResult } from "./scoring";

export type EngineStep = {
  question: Question;
  answer: Answer;
};

export type EngineState = {
  scores: Scores;
  next: Question | null;
  done: boolean;
  total: number;
  answered: number;
  insight: { title: string; body: string } | null;
  result: AssessmentResult | null;
  history: Question[];
};

export function run(answers: Answer[]): EngineState {
  let scores = emptyScores();
  const history: Question[] = [];

  for (const answer of answers) {
    const question = getQuestion(historyToAnswers(history), scores);
    if (!question) break;
    const option = question.options.find((o) => o.id === answer.optionId);
    if (!option) break;
    scores = applyOption(scores, option);
    history.push(question);
  }

  const answered = history.length;
  const next = getQuestion(historyToAnswers(history), scores);
  const total = plannedLength(historyToAnswers(history), scores);
  const done = next == null;
  const insight = insightAfter(historyToAnswers(history), scores);

  return {
    scores,
    next,
    done,
    total,
    answered,
    insight,
    result: done ? finalize(scores) : null,
    history,
  };
}

function historyToAnswers(history: Question[]): Answer[] {
  // getQuestion only needs length + whether t5 was asked, plus scores.
  // Reconstruct placeholder answers with the question ids.
  return history.map((q) => ({
    questionId: q.id,
    optionId: q.options[0]?.id ?? "",
  }));
}
