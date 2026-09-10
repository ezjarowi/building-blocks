import { randomBytes } from "node:crypto";
import { and, eq, gte, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { invites, people } from "@/lib/db/schema";
import { invitePath } from "@/lib/invite-url";

const MAX_PER_DAY = 30;

export async function createInvite({
  name,
  expectedType,
  notes,
  ip,
}: {
  name: string;
  expectedType?: string | null;
  notes?: string | null;
  ip: string;
}) {
  const db = getDb();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const [countRow] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(invites)
    .where(and(eq(invites.createdIp, ip), gte(invites.createdAt, since)));
  if ((countRow?.n ?? 0) >= MAX_PER_DAY) {
    return { error: "Too many links from here today. Try again tomorrow." } as const;
  }

  const [person] = await db
    .insert(people)
    .values({
      name,
      expectedType: expectedType ?? null,
      notes: notes ?? null,
    })
    .returning();
  const token = randomBytes(5).toString("base64url");
  await db.insert(invites).values({
    token,
    personId: person.id,
    createdIp: ip,
  });

  return {
    id: person.id,
    name: person.name,
    token,
    path: invitePath(token),
  } as const;
}
