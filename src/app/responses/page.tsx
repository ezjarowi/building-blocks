import { isAdmin } from "@/lib/admin";
import { AdminDashboard } from "@/components/admin-dashboard";
import { MyResponses } from "@/components/my-responses";
import { SiteHeader } from "@/components/site-header";

export const dynamic = "force-dynamic";

export default async function ResponsesPage() {
  const all = await isAdmin();
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 pb-24">
        {all ? <AdminDashboard /> : <MyResponses />}
      </main>
    </div>
  );
}
