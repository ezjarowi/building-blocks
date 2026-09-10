import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto flex items-center justify-between px-6 py-8 text-[10px] text-muted-foreground/50">
      <span>© {new Date().getFullYear()} Fawn Finance LLC</span>
      <Link href="/responses" className="hover:text-muted-foreground">
        Responses
      </Link>
    </footer>
  );
}
