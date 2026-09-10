export function testVersion(): string {
  return (
    process.env.VERCEL_GIT_COMMIT_SHA ??
    process.env.GIT_SHA ??
    "local"
  );
}

export function shortSha(sha: string | null | undefined): string {
  if (!sha || sha === "local") return "local";
  return sha.slice(0, 7);
}
