import { eq } from "drizzle-orm";
import { SiteHeader } from "@/components/site-header";
import { AssessClient } from "@/components/assess-client";
import { getDb } from "@/lib/db";
import { invites, people } from "@/lib/db/schema";

export async function AssessInvite({
  token,
  fresh = false,
}: {
  token?: string | null;
  fresh?: boolean;
}) {
  let intendedName: string | null = null;
  let inviteToken: string | null = null;

  if (token) {
    try {
      const db = getDb();
      const rows = await db
        .select({ name: people.name, token: invites.token })
        .from(invites)
        .innerJoin(people, eq(invites.personId, people.id))
        .where(eq(invites.token, token))
        .limit(1);
      if (rows[0]) {
        intendedName = rows[0].name?.trim() || null;
        inviteToken = rows[0].token;
      }
    } catch {
      intendedName = null;
    }
  }

  const greet = Boolean(inviteToken && intendedName);

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader quiet />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 pb-24">
        <AssessClient
          inviteToken={inviteToken}
          intendedName={intendedName}
          greet={greet}
          fresh={fresh}
        />
      </main>
    </div>
  );
}
