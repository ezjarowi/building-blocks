import { NextResponse } from "next/server";
import { createInvite } from "@/lib/create-invite";
import { clientIp } from "@/lib/ip";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { name?: string } | null;
  const name = body?.name?.trim() ?? "";
  const made = await createInvite({ name, ip: clientIp(request) });
  if ("error" in made) {
    return NextResponse.json({ error: made.error }, { status: 429 });
  }
  return NextResponse.json(made);
}
