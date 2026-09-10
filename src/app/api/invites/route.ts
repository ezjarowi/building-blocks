import { NextResponse } from "next/server";
import { createInvite } from "@/lib/create-invite";
import { clientIp } from "@/lib/ip";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    name?: string;
    expectedType?: string;
    notes?: string;
  } | null;
  const name = body?.name?.trim() ?? "";
  const expectedType = body?.expectedType?.trim().toUpperCase() || null;
  const notes = body?.notes?.trim() || null;
  const made = await createInvite({
    name,
    expectedType,
    notes,
    ip: clientIp(request),
  });
  if ("error" in made) {
    return NextResponse.json({ error: made.error }, { status: 429 });
  }
  return NextResponse.json(made);
}
