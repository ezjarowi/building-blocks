import Link from "next/link";
import { ShareInviteOpen } from "@/components/invite-modal";

export function SiteFooter() {
  return (
    <footer className="mt-auto flex items-center justify-between px-6 py-8 text-[10px] text-muted-foreground/50">
      <span>© {new Date().getFullYear()} Fawn Finance LLC</span>
      <span className="flex gap-4">
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
