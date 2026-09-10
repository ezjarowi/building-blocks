import Link from "next/link";
import { ShareInviteOpen } from "@/components/invite-modal";
import { LookControls } from "@/components/look-controls";

export function SiteFooter() {
  return (
    <footer className="mt-auto flex flex-wrap items-center justify-between gap-3 px-6 py-8 text-[10px] text-muted-foreground/50">
      <span>© {new Date().getFullYear()} Fawn Finance LLC</span>
      <span className="flex flex-wrap items-center gap-4">
        <LookControls />
        <ShareInviteOpen className="hover:text-muted-foreground">
          Share Invite
        </ShareInviteOpen>
        <Link href="/responses" className="hover:text-muted-foreground">
          Responses
        </Link>
      </span>
    </footer>
  );
}
