"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { run, type Answer } from "@/lib/assessment";
import { clearDraft, readDraft, writeDraft } from "@/lib/draft";
import { rememberTakeId } from "@/lib/my-takes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function Progress({ named, answered, total }: { named: boolean; answered: number; total: number }) {
  const done = (named ? 1 : 0) + answered;
  const max = 1 + Math.max(total, 8);
  const pct = Math.min(100, (done / max) * 100);
  return (
    <div className="mb-8 h-1.5 overflow-hidden rounded-full bg-secondary">
      <div
        className="h-full rounded-full bg-primary transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function AssessClient({
  inviteToken,
  intendedName,
  greet = false,
}: {
  inviteToken?: string | null;
  intendedName?: string | null;
  greet?: boolean;
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState(inviteToken ?? null);
  const [doGreet, setDoGreet] = useState(greet);
  const [name, setName] = useState(intendedName ?? "");
  const [named, setNamed] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [seenInsight, setSeenInsight] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const readyRef = useRef(false);
  const doneRef = useRef(false);
  const snap = useRef({
    token: inviteToken ?? null,
    greet,
    name: intendedName ?? "",
    named: false,
    answers: [] as Answer[],
    seenInsight: 0,
  });

  function persist(next: {
    token?: string | null;
    greet?: boolean;
    name?: string;
    named?: boolean;
    answers?: Answer[];
    seenInsight?: number;
  }) {
    const merged = {
      token: next.token ?? snap.current.token,
      greet: next.greet ?? snap.current.greet,
      name: next.name ?? snap.current.name,
      named: next.named ?? snap.current.named,
      answers: next.answers ?? snap.current.answers,
      seenInsight: next.seenInsight ?? snap.current.seenInsight,
    };
    snap.current = merged;
    writeDraft(merged.token, merged);
  }

  useEffect(() => {
    if (readyRef.current) return;
    const draft = readDraft(inviteToken);
    const nextToken = inviteToken || draft?.inviteToken || null;
    const nextName = (intendedName || draft?.name || "").trim();
    const nextGreet = inviteToken ? greet : Boolean(draft?.greet);
    const started = Boolean(draft?.named || (draft?.answers.length ?? 0) > 0);
    const nextNamed =
      started || Boolean(nextName && nextToken && !nextGreet);
    const restored = {
      token: nextToken,
      greet: nextGreet,
      name: nextName,
      named: nextNamed,
      answers: draft?.answers ?? [],
      seenInsight: draft?.seenInsight ?? 0,
    };
    snap.current = restored;
    readyRef.current = true;
    setToken(nextToken);
    setDoGreet(nextGreet);
    setName(nextName);
    setNamed(nextNamed);
    setAnswers(restored.answers);
    setSeenInsight(restored.seenInsight);
    writeDraft(nextToken, restored);
    setReady(true);
  }, [inviteToken, intendedName, greet]);

  useEffect(() => {
    const flush = () => {
      if (!readyRef.current || doneRef.current) return;
      const s = snap.current;
      writeDraft(s.token, s);
    };
    window.addEventListener("pagehide", flush);
    return () => {
      flush();
      window.removeEventListener("pagehide", flush);
    };
  }, []);

  const state = useMemo(() => run(answers), [answers]);
  const insightKey = state.answered;
  const showInsight =
    Boolean(state.insight) && seenInsight < insightKey && !state.done;
  const showGreet = !named && doGreet && Boolean(name.trim());
  const showNameAsk = !named && !showGreet;

  async function finish(nextAnswers: Answer[]) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: nextAnswers,
          name,
          inviteToken: token ?? undefined,
        }),
      });
      if (!res.ok) {
        throw new Error("Could not save");
      }
      const data = (await res.json()) as { id: string };
      rememberTakeId(data.id);
      doneRef.current = true;
      clearDraft(token);
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
    persist({ answers: nextAnswers, named: true });
    const preview = run(nextAnswers);
    if (preview.done) {
      void finish(nextAnswers);
      return;
    }
    setAnswers(nextAnswers);
  }

  function back() {
    setError(null);
    setAnswers((prev) => {
      const next = prev.slice(0, -1);
      persist({ answers: next });
      return next;
    });
  }

  function acceptName() {
    const next = name.trim();
    if (!next) return;
    setName(next);
    setNamed(true);
    persist({ name: next, named: true });
  }

  if (!ready) {
    return (
      <div className="flex flex-1 flex-col py-4">
        <Progress named={false} answered={0} total={10} />
      </div>
    );
  }

  if (showGreet) {
    return (
      <div className="flex flex-1 flex-col py-4">
        <Progress named={false} answered={0} total={state.total} />
        <div className="flex flex-1 flex-col justify-center py-8">
          <h1 className="font-heading text-5xl">Hi, {name}.</h1>
          <p className="mt-4 max-w-md text-lg text-muted-foreground">
            This one was made for you. No wrong answers.
          </p>
          <Button
            className="mt-8 h-12 w-fit rounded-full px-6"
            size="lg"
            onClick={() => {
              setNamed(true);
              persist({ named: true });
            }}
          >
            Start
          </Button>
        </div>
      </div>
    );
  }

  if (showNameAsk) {
    return (
      <form
        className="flex flex-1 flex-col py-4"
        onSubmit={(e) => {
          e.preventDefault();
          acceptName();
        }}
      >
        <Progress named={false} answered={0} total={state.total} />
        <div className="flex flex-1 flex-col justify-center py-8">
        <h1 className="font-heading text-4xl">What&apos;s your name?</h1>
        <p className="mt-3 max-w-md text-sm text-muted-foreground">
          So we remember who took it. No account.
        </p>
        <input
          className="mt-8 h-12 w-full max-w-sm rounded-xl border border-input bg-card px-4 text-base outline-none ring-ring focus:ring-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          autoFocus
        />
        <Button
          type="submit"
          className="mt-6 h-12 w-fit rounded-full px-6"
          size="lg"
          disabled={!name.trim()}
        >
          Continue
        </Button>
        </div>
      </form>
    );
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
      <div className="flex flex-1 flex-col py-4">
        <Progress named answered={state.answered} total={state.total} />
        <div className="flex flex-1 flex-col justify-center py-8">
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
          onClick={() => {
            setSeenInsight(insightKey);
            persist({ seenInsight: insightKey });
          }}
        >
          Keep going
        </Button>
        </div>
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
        <div className="flex items-center justify-end text-sm text-muted-foreground">
          {answers.length > 0 ? (
            <button
              type="button"
              onClick={back}
              className="underline-offset-4 hover:underline"
            >
              Back
            </button>
          ) : (
            <span className="h-5" />
          )}
        </div>
        <Progress named answered={state.answered} total={state.total} />
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
