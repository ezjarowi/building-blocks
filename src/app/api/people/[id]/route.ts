import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { getDb } from "@/lib/db";
import { assessments, invites, people } from "@/lib/db/schema";
import { invitePath } from "@/lib/invite-url";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const db = getDb();
  const personRows = await db.select().from(people).where(eq(people.id, id)).limit(1);
  const person = personRows[0];
  if (!person) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const personInvites = await db
    .select()
    .from(invites)
    .where(eq(invites.personId, id));
  const takes = await db
    .select()
    .from(assessments)
    .where(eq(assessments.personId, id))
    .orderBy(desc(assessments.createdAt));

  return NextResponse.json({
    person,
    token: personInvites[0]?.token ?? null,
    path: personInvites[0] ? invitePath(personInvites[0].token) : null,
    takes: takes.map((t) => ({
      id: t.id,
      typeCode: t.typeCode,
      temperament: t.temperament,
      stack: t.stack,
      respondentName: t.respondentName,
      gitSha: t.gitSha,
      verified: t.verified,
      source: t.source ?? (t.inviteId ? "shared" : "walk-in"),
      createdAt: t.createdAt,
      answers: t.answers,
    })),
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = (await request.json()) as {
    name?: string;
    notes?: string;
    expectedType?: string;
  };
  const db = getDb();
  const patch: {
    name?: string;
    notes?: string | null;
    expectedType?: string | null;
  } = {};
  if ("name" in body) patch.name = body.name?.trim() ?? "";
  if ("notes" in body) patch.notes = body.notes?.trim() || null;
  if ("expectedType" in body) {
    patch.expectedType = body.expectedType?.trim().toUpperCase() || null;
  }
  const [updated] = await db
    .update(people)
    .set(patch)
    .where(eq(people.id, id))
    .returning();
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}
