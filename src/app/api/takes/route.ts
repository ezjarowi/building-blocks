import { inArray } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { assessments } from "@/lib/db/schema";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = (searchParams.get("ids") ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .slice(0, 50);

  if (ids.length === 0) {
    return NextResponse.json({ takes: [] });
  }

  const db = getDb();
  const rows = await db
    .select({
      id: assessments.id,
      typeCode: assessments.typeCode,
      temperament: assessments.temperament,
      stack: assessments.stack,
      respondentName: assessments.respondentName,
      gitSha: assessments.gitSha,
      quizVersion: assessments.quizVersion,
      createdAt: assessments.createdAt,
    })
    .from(assessments)
    .where(inArray(assessments.id, ids));

  const order = new Map(ids.map((id, i) => [id, i]));
  rows.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));

  return NextResponse.json({ takes: rows });
}
