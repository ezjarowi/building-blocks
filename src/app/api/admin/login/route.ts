import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminSecret } from "@/lib/admin";

export async function POST(request: Request) {
  const secret = adminSecret();
  if (!secret) {
    return NextResponse.json({ error: "Admin is not configured" }, { status: 500 });
  }
  const body = (await request.json()) as { password?: string };
  if (body.password !== secret) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }
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
