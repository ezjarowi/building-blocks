import Link from "next/link";

export function SiteHeader({ quiet = false }: { quiet?: boolean }) {
  return (
    <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-6">
      <Link href="/" className="font-heading text-lg tracking-tight">
        Building Blocks
      </Link>
      {quiet ? (
        <span className="text-muted-foreground text-sm">No wrong answers</span>
      ) : (
        <div className="flex items-center gap-4">
          <Link
            href="/assess"
            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Take it
          </Link>
          <Link
            href="/responses"
            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Responses
          </Link>
        </div>
      )}
    </header>
  );
}
