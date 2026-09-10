import { SiteHeader } from "@/components/site-header";
import { InviteClient } from "@/components/invite-client";

export default function InvitePage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 pb-24">
        <InviteClient />
      </main>
    </div>
  );
}
