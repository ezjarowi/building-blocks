import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { run, type Answer } from "@/lib/assessment";
import { getDb } from "@/lib/db";
import { assessments, invites } from "@/lib/db/schema";
import { testVersion } from "@/lib/version";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    answers?: Answer[];
    name?: string;
    inviteToken?: string;
  };
  const answers = body.answers;
  const name = body.name?.trim() ?? "";
  if (!name) {
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  }
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
      .select()
      .from(invites)
      .where(eq(invites.token, token))
      .limit(1);
    if (found[0]) {
      inviteId = found[0].id;
      personId = found[0].personId;
    }
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
    })
    .returning({ id: assessments.id });

  return NextResponse.json({ id: row.id, result: state.result });
}
