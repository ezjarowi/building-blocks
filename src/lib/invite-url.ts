export function invitePath(token: string, greet = false) {
  const base = `/assess?to=${encodeURIComponent(token)}`;
  return greet ? `${base}&hi=1` : base;
}

export function inviteUrl(token: string, origin: string, greet = false) {
  return `${origin}${invitePath(token, greet)}`;
}
