import { NextResponse } from "next/server";
import { run, type Answer } from "@/lib/assessment";
import { getDb } from "@/lib/db";
import { assessments } from "@/lib/db/schema";

export async function POST(request: Request) {
  const body = (await request.json()) as { answers?: Answer[] };
  const answers = body.answers;
  if (!Array.isArray(answers) || answers.length < 16 || answers.length > 20) {
    return NextResponse.json({ error: "Invalid answers" }, { status: 400 });
  }

  const state = run(answers);
  if (!state.done || !state.result) {
    return NextResponse.json({ error: "Assessment incomplete" }, { status: 400 });
  }

  const db = getDb();
  const [row] = await db
    .insert(assessments)
    .values({
      typeCode: state.result.type,
      temperament: state.result.temperament,
      stack: state.result.stack,
      answers,
      result: state.result,
    })
    .returning({ id: assessments.id });

  return NextResponse.json({ id: row.id, result: state.result });
}
