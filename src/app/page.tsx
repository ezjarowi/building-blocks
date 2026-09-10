import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-6 pb-24 pt-8">
        <p className="text-sm tracking-wide text-muted-foreground uppercase">
          A preference map, not a job test
        </p>
        <h1 className="font-heading mt-4 text-5xl leading-[1.05] tracking-tight text-balance sm:text-6xl">
          Which four building blocks does your mind actually prefer?
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground">
          Twenty questions or fewer — often around ten, if the stack locks.
          Every option is a good one. Answer for what would be <em>fun</em> —
          not what a boss, a parent, or a résumé would like to hear.
        </p>
        <ul className="mt-8 space-y-3 text-[0.95rem] leading-relaxed">
          <li>You&apos;ll see a temperament early — Progress, Stability, Meaning, or Motion.</li>
          <li>Then the four building blocks you prefer, in order: happy place, make-sure, glad-for-help, burst.</li>
          <li>Then the rest of the stack, from most preferred to least able to sustain.</li>
        </ul>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button asChild size="lg" className="h-12 rounded-full px-6 text-base">
            <Link href="/assess">Start — it&apos;s a party game</Link>
          </Button>
          <p className="text-muted-foreground text-sm">About five minutes.</p>
        </div>
      </main>
    </div>
  );
}
