import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { invites, people } from "@/lib/db/schema";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const db = getDb();
  const rows = await db
    .select({
      token: invites.token,
      personId: people.id,
      name: people.name,
    })
    .from(invites)
    .innerJoin(people, eq(invites.personId, people.id))
    .where(eq(invites.token, token))
    .limit(1);

  if (!rows[0]) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(rows[0]);
}
