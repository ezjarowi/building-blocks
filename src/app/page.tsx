import { SiteHeader } from "@/components/site-header";
import { StartCta } from "@/components/assess-link";
import { ShareInviteOpen } from "@/components/invite-modal";
import { BlockMark } from "@/components/block-mark";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    tone: "bg-choice-a text-white",
    text: "You'll see a temperament early — Progress, Stability, Meaning, or Motion.",
  },
  {
    tone: "bg-choice-b text-white",
    text: "Then the four building blocks you prefer, in order: happy place, make-sure, glad-for-help, burst.",
  },
  {
    tone: "bg-choice-c text-white",
    text: "Then the rest of the stack, from most preferred to least able to sustain.",
  },
];

export default function Home() {
  return (
    <div className="relative flex min-h-full flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-16 -right-12 size-56 rounded-full bg-choice-a/15" />
        <div className="absolute top-1/3 -left-10 size-40 rounded-full bg-choice-b/12" />
        <div className="absolute right-1/4 bottom-16 size-32 rounded-full bg-choice-c/18" />
        <div className="absolute top-24 left-1/3 size-3 rounded-full bg-choice-d/50" />
      </div>
      <SiteHeader />
      <main className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-6 pb-24 pt-8">
        <p className="inline-flex w-fit items-center gap-2 rounded-full bg-choice-c-wash px-3 py-1 text-sm font-medium text-choice-c-ink">
          A preference map, not a job test
        </p>
        <h1 className="font-heading mt-5 text-5xl leading-[1.05] tracking-tight text-balance sm:text-6xl">
          Which four building blocks does your mind actually prefer?
        </h1>
        <div className="mt-6">
          <BlockMark size="lg" />
        </div>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground">
          Twenty questions or fewer — often around ten, if the stack locks.
          Every option is a good one. Answer for what would be <em>fun</em> —
          not what a boss, a parent, or a résumé would like to hear.
        </p>
        <div className="mt-8 grid gap-3">
          {STEPS.map((step, i) => (
            <div
              key={step.text}
              className="flex items-start gap-3 rounded-3xl bg-card px-4 py-4 ring-1 ring-foreground/8"
            >
              <span
                className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${step.tone}`}
              >
                {i + 1}
              </span>
              <p className="pt-1 text-[0.95rem] leading-relaxed">{step.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button
            asChild
            size="lg"
            className="h-14 rounded-full px-8 text-base shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <StartCta />
          </Button>
          <ShareInviteOpen className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            Share Invite
          </ShareInviteOpen>
        </div>
        <p className="mt-3 text-muted-foreground text-sm">About five minutes.</p>
      </main>
    </div>
  );
}
