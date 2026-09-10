"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { run, type Answer } from "@/lib/assessment";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function AssessClient() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [seenInsight, setSeenInsight] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const state = useMemo(() => run(answers), [answers]);
  const insightKey = state.answered;
  const showInsight =
    Boolean(state.insight) && seenInsight < insightKey && !state.done;

  async function finish(nextAnswers: Answer[]) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: nextAnswers }),
      });
      if (!res.ok) {
        throw new Error("Could not save");
      }
      const data = (await res.json()) as { id: string };
      router.push(`/result/${data.id}`);
    } catch {
      sessionStorage.setItem("bb-answers", JSON.stringify(nextAnswers));
      router.push("/result/local");
    }
  }

  function pick(optionId: string) {
    if (!state.next) return;
    const nextAnswers = [
      ...answers,
      { questionId: state.next.id, optionId },
    ];
    const preview = run(nextAnswers);
    if (preview.done) {
      void finish(nextAnswers);
      return;
    }
    setAnswers(nextAnswers);
  }

  function back() {
    setError(null);
    setAnswers((prev) => prev.slice(0, -1));
  }

  if (saving) {
    return (
      <div className="flex flex-1 flex-col justify-center py-16">
        <p className="font-heading text-3xl">Putting your stack together…</p>
        <p className="mt-3 text-muted-foreground">A moment.</p>
      </div>
    );
  }

  if (showInsight && state.insight) {
    return (
      <div className="flex flex-1 flex-col justify-center py-12">
        <p className="text-sm tracking-wide text-muted-foreground uppercase">
          A read so far
        </p>
        <h2 className="font-heading mt-4 text-4xl leading-tight text-balance">
          {state.insight.title}
        </h2>
        <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted-foreground">
          {state.insight.body}
        </p>
        <Button
          className="mt-8 h-12 w-fit rounded-full px-6"
          size="lg"
          onClick={() => setSeenInsight(insightKey)}
        >
          Keep going
        </Button>
      </div>
    );
  }

  const q = state.next;
  if (!q) {
    return (
      <div className="py-16">
        <p>Something went missing. Refresh and try once more.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col py-4">
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Question {state.answered + 1}
            <span className="text-muted-foreground/70"> · 20 or fewer</span>
          </span>
          {answers.length > 0 ? (
            <button
              type="button"
              onClick={back}
              className="underline-offset-4 hover:underline"
            >
              Back
            </button>
          ) : null}
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{
              width: `${Math.min(100, (state.answered / state.total) * 100)}%`,
            }}
          />
        </div>
      </div>

      <p className="text-sm text-muted-foreground">{q.prompt}</p>
      <h1 className="font-heading mt-3 text-3xl leading-tight text-balance sm:text-4xl">
        {q.stem}
      </h1>
      {q.note ? (
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {q.note}
        </p>
      ) : null}

      <div
        className={`mt-8 grid gap-3 ${q.options.length > 2 ? "sm:grid-cols-2" : "grid-cols-1"}`}
      >
        {q.options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => pick(option.id)}
            className="text-left"
          >
            <Card className="h-full px-5 py-5 ring-foreground/10 transition hover:ring-primary/40">
              <p className="text-base leading-relaxed">{option.label}</p>
            </Card>
          </button>
        ))}
      </div>

      {error ? <p className="mt-6 text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
