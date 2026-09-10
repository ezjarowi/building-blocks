import { cookies } from "next/headers";

export const ADMIN_COOKIE = "bb_admin";

export function adminSecret(): string {
  return process.env.ADMIN_SECRET || "password";
}

export async function isAdmin(): Promise<boolean> {
  const secret = adminSecret();
  if (!secret) return false;
  const jar = await cookies();
  return jar.get(ADMIN_COOKIE)?.value === secret;
}
