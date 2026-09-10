import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { QUIZ_VERSION, run, type Answer } from "@/lib/assessment";
import { getDb } from "@/lib/db";
import { assessments, invites, people } from "@/lib/db/schema";
import { testVersion } from "@/lib/version";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    answers?: Answer[];
    name?: string;
    inviteToken?: string;
  };
  const answers = body.answers;
  let name = body.name?.trim() ?? "";
  if (!Array.isArray(answers) || answers.length < 8 || answers.length > 20) {
    return NextResponse.json({ error: "Invalid answers" }, { status: 400 });
  }

  const state = run(answers);
  if (!state.done || !state.result) {
    return NextResponse.json({ error: "Assessment incomplete" }, { status: 400 });
  }

  const db = getDb();
  let personId: string | null = null;
  let inviteId: string | null = null;
  const token = body.inviteToken?.trim();
  if (token) {
    const found = await db
      .select({
        inviteId: invites.id,
        personId: invites.personId,
        personName: people.name,
      })
      .from(invites)
      .innerJoin(people, eq(invites.personId, people.id))
      .where(eq(invites.token, token))
      .limit(1);
    if (found[0]) {
      inviteId = found[0].inviteId;
      personId = found[0].personId;
      if (!name) name = found[0].personName?.trim() ?? "";
      if (name && !found[0].personName?.trim()) {
        await db
          .update(people)
          .set({ name })
          .where(eq(people.id, found[0].personId));
      }
    }
  }
  if (!name) {
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  }

  const [row] = await db
    .insert(assessments)
    .values({
      typeCode: state.result.type,
      temperament: state.result.temperament,
      stack: state.result.stack,
      answers,
      result: state.result,
      respondentName: name,
      personId,
      inviteId,
      gitSha: testVersion(),
      quizVersion: QUIZ_VERSION,
      source: inviteId ? "shared" : "walk-in",
    })
    .returning({ id: assessments.id });

  return NextResponse.json({ id: row.id, result: state.result });
}
