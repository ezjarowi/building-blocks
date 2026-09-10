import { randomBytes } from "node:crypto";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { getDb } from "@/lib/db";
import { assessments, invites, people } from "@/lib/db/schema";
import { invitePath } from "@/lib/invite-url";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const db = getDb();
  const allPeople = await db.select().from(people).orderBy(desc(people.createdAt));
  const allInvites = await db.select().from(invites);
  const allTakes = await db
    .select()
    .from(assessments)
    .orderBy(desc(assessments.createdAt));

  const rows = allPeople.map((person) => {
    const personInvites = allInvites.filter((i) => i.personId === person.id);
    const takes = allTakes.filter((t) => t.personId === person.id);
    const latest = takes[0] ?? null;
    return {
      id: person.id,
      name: person.name,
      expectedType: person.expectedType,
      notes: person.notes,
      createdAt: person.createdAt,
      token: personInvites[0]?.token ?? null,
      path: personInvites[0] ? invitePath(personInvites[0].token) : null,
      takeCount: takes.length,
      latestType: latest?.typeCode ?? null,
      latestAt: latest?.createdAt ?? null,
      latestName: latest?.respondentName ?? null,
      latestVerified: latest?.verified ?? false,
    };
  });

  const unlinked = allTakes
    .filter((t) => !t.personId)
    .map((t) => ({
      id: t.id,
      respondentName: t.respondentName,
      typeCode: t.typeCode,
      gitSha: t.gitSha,
      verified: t.verified,
      createdAt: t.createdAt,
    }));

  const typeCounts: Record<string, number> = {};
  for (const take of allTakes) {
    typeCounts[take.typeCode] = (typeCounts[take.typeCode] ?? 0) + 1;
  }

  return NextResponse.json({ people: rows, unlinked, typeCounts });
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json()) as {
    name?: string;
    expectedType?: string;
    notes?: string;
  };
  const name = body.name?.trim();
  if (!name) {
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  }
  const expectedType = body.expectedType?.trim().toUpperCase() || null;
  const notes = body.notes?.trim() || null;

  const db = getDb();
  const [person] = await db
    .insert(people)
    .values({ name, expectedType, notes })
    .returning();
  const token = randomBytes(9).toString("base64url");
  await db.insert(invites).values({ token, personId: person.id });

  return NextResponse.json({
    id: person.id,
    name: person.name,
    token,
    path: invitePath(token),
  });
}
