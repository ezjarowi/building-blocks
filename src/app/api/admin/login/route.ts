import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminSecret } from "@/lib/admin";
import { getDb } from "@/lib/db";
import { adminLockouts } from "@/lib/db/schema";

const MAX_TRIES = 3;
const LOCK_MS = 7 * 24 * 60 * 60 * 1000;

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export async function POST(request: Request) {
  const secret = adminSecret();
  const ip = clientIp(request);
  const db = getDb();
  const now = new Date();

  const existing = await db
    .select()
    .from(adminLockouts)
    .where(eq(adminLockouts.ip, ip))
    .limit(1);
  const row = existing[0];

  if (row?.lockedUntil && row.lockedUntil.getTime() > now.getTime()) {
    return NextResponse.json(
      { error: "Too many tries. Locked for a week." },
      { status: 429 },
    );
  }

  const body = (await request.json()) as { password?: string };
  if (body.password === secret) {
    await db.delete(adminLockouts).where(eq(adminLockouts.ip, ip));
    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE, secret, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  }

  const failures = (row?.failures ?? 0) + 1;
  const lockedUntil = failures >= MAX_TRIES ? new Date(now.getTime() + LOCK_MS) : null;
  await db
    .insert(adminLockouts)
    .values({
      ip,
      failures,
      lockedUntil,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: adminLockouts.ip,
      set: { failures, lockedUntil, updatedAt: now },
    });

  if (lockedUntil) {
    return NextResponse.json(
      { error: "Too many tries. Locked for a week." },
      { status: 429 },
    );
  }

  return NextResponse.json({ error: "Wrong password" }, { status: 401 });
}
