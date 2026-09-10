import Link from "next/link";
import { ShareInviteOpen } from "@/components/invite-modal";
import { LookControls } from "@/components/look-controls";

export function SiteFooter() {
  return (
    <footer className="mt-auto flex flex-wrap items-center justify-between gap-3 px-6 py-8 text-[10px] text-muted-foreground/50">
      <span className="flex flex-wrap items-center gap-3">
        <span>© {new Date().getFullYear()} Fawn Finance LLC</span>
        <a
          href="https://www.churchofjesuschrist.org/study/scriptures/nt/1-cor/12?lang=eng&id=p22#p22"
          target="_blank"
          rel="noreferrer"
          className="hover:text-muted-foreground"
        >
          1 Corinthians 12:22
        </a>
      </span>
      <span className="flex flex-wrap items-center gap-4">
        <LookControls />
        <ShareInviteOpen className="hover:text-muted-foreground">
          Share Invite
        </ShareInviteOpen>
        <Link href="/responses" className="hover:text-muted-foreground">
          Admin
        </Link>
      </span>
    </footer>
  );
}
