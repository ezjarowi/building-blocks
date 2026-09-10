import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { ResultView } from "@/components/result-view";
import { LocalResult } from "@/components/local-result";
import type { AssessmentResult } from "@/lib/assessment";
import { getDb } from "@/lib/db";
import { assessments, invites } from "@/lib/db/schema";
import { invitePath } from "@/lib/invite-url";

export const dynamic = "force-dynamic";

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (id === "local") {
    return (
      <div className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-8">
          <LocalResult />
        </main>
      </div>
    );
  }

  const db = getDb();
  const rows = await db
    .select({
      row: assessments,
      token: invites.token,
    })
    .from(assessments)
    .leftJoin(invites, eq(assessments.inviteId, invites.id))
    .where(eq(assessments.id, id))
    .limit(1);

  const found = rows[0];
  if (!found) notFound();
  const row = found.row;
  const againHref = found.token
    ? `${invitePath(found.token)}?fresh=1`
    : "/assess?fresh=1";

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-8">
        <ResultView
          result={row.result as AssessmentResult}
          name={row.respondentName}
          gitSha={row.gitSha}
          quizVersion={row.quizVersion}
          takenAt={row.createdAt}
          againHref={againHref}
        />
      </main>
    </div>
  );
}
