import { isAdmin } from "@/lib/admin";
import { AdminLogin } from "@/components/admin-login";
import { AdminDashboard } from "@/components/admin-dashboard";
import { SiteHeader } from "@/components/site-header";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const ok = await isAdmin();
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 pb-24">
        {ok ? <AdminDashboard /> : <AdminLogin />}
      </main>
    </div>
  );
}
