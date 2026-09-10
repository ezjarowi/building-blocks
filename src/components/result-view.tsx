import Link from "next/link";
import {
  FUNCTIONS,
  ROLE_LABELS,
  TEMPERAMENTS,
  axisLoop,
  complementaryLoop,
  workingLoop,
  type AssessmentResult,
  type FunctionId,
} from "@/lib/assessment";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function ResultView({
  result,
  name,
  gitSha,
  takenAt,
}: {
  result: AssessmentResult;
  name?: string | null;
  gitSha?: string | null;
  takenAt?: Date | string | null;
}) {
  const t = TEMPERAMENTS[result.temperament];
  const hero = result.stack[0] as FunctionId;
  const parent = result.stack[1] as FunctionId;
  const work = workingLoop(result.type);
  const comp = complementaryLoop(result.type);
  const axis = axisLoop(result.type);

  return (
    <div className="space-y-10 pb-8">
      <div>
        <p className="text-sm tracking-wide text-muted-foreground uppercase">
          {t.name} · {t.want}
        </p>
        <h1 className="font-heading mt-3 text-5xl tracking-tight">{result.type}</h1>
        {name ? (
          <p className="mt-2 text-muted-foreground">{name}</p>
        ) : null}
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Based on how you answered, this looks like the order you prefer to
          work — most at home, down to what you can only do in a burst.
        </p>
        {gitSha || takenAt ? (
          <p className="mt-3 text-xs text-muted-foreground">
            {takenAt ? new Date(takenAt).toLocaleString() : null}
            {takenAt && gitSha ? " · " : null}
            {gitSha ? `test ${gitSha.slice(0, 7)}` : null}
          </p>
        ) : null}
      </div>

      <section className="space-y-4">
        <ol className="space-y-4">
          {result.stack.slice(0, 4).map((id, i) => {
            const fn = FUNCTIONS[id as FunctionId];
            const role = ROLE_LABELS[i];
            return (
              <li key={id}>
                <p className="font-heading text-xl">
                  {i + 1}. {id} · {fn.name}
                </p>
                <p className="mt-1 text-muted-foreground">
                  <span className="text-foreground">{role.name}.</span> {fn.want}
                </p>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-2xl">The rest of the stack</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Most preferred to least able to do for long periods. Same eight
          building blocks, just further down.
        </p>
        <div className="grid gap-2">
          {result.stack.slice(4).map((id, i) => {
            const fn = FUNCTIONS[id as FunctionId];
            const role = ROLE_LABELS[i + 4];
            return (
              <div
                key={id}
                className="flex items-start justify-between gap-4 rounded-xl bg-card px-4 py-3 ring-1 ring-foreground/10"
              >
                <div>
                  <p className="font-medium">
                    {i + 5}. {id} · {fn.name}
                  </p>
                  <p className="text-muted-foreground text-sm">{role.brief}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="font-heading text-2xl">Loops</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          These aren&apos;t extra types. They&apos;re how the building blocks
          move together.
        </p>
        <div className="grid gap-3 sm:grid-cols-1">
          <LoopCard
            title={`${hero} × ${parent} — working loop`}
            body={work.note}
          />
          <LoopCard
            title={`${comp.a} × ${comp.b} — complementary`}
            body={comp.note}
          />
          <LoopCard
            title={`${axis.a} × ${axis.b} — vision into action`}
            body={axis.note}
          />
        </div>
      </section>

      <div className="flex flex-wrap gap-3 pt-4">
        <Button asChild className="rounded-full" size="lg">
          <Link href="/assess">Take it again</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full" size="lg">
          <Link href="/">Back home</Link>
        </Button>
      </div>
    </div>
  );
}

function LoopCard({ title, body }: { title: string; body: string }) {
  return (
    <Card className="px-5 py-5">
      <p className="font-heading text-lg">{title}</p>
      <p className="mt-2 leading-relaxed text-muted-foreground">{body}</p>
    </Card>
  );
}
