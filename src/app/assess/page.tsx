import { SiteHeader } from "@/components/site-header";
import { AssessClient } from "@/components/assess-client";

export default function AssessPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader quiet />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 pb-24">
        <AssessClient />
      </main>
    </div>
  );
}
