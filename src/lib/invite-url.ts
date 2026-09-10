export function invitePath(token: string, greet = true) {
  const base = `/assess?to=${encodeURIComponent(token)}`;
  return greet ? `${base}&hi=1` : `${base}&quiet=1`;
}

export function inviteUrl(token: string, origin: string, greet = false) {
  return `${origin}${invitePath(token, greet)}`;
}
