import Link from "next/link";
import { TakeItLink } from "@/components/assess-link";
import { BlockMark } from "@/components/block-mark";

export function SiteHeader({ quiet = false }: { quiet?: boolean }) {
  return (
    <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-6">
      <Link href="/" className="font-heading flex items-center gap-2.5 text-base tracking-tight sm:text-lg">
        <BlockMark />
        Benson&apos;s Talent Blueprint
      </Link>
      {quiet ? (
        <span className="text-muted-foreground text-sm">No wrong answers</span>
      ) : (
        <TakeItLink className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline" />
      )}
    </header>
  );
}
