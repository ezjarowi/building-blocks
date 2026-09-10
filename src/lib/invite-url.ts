export function invitePath(token: string) {
  return `/assess?to=${encodeURIComponent(token)}`;
}

export function inviteUrl(token: string, origin: string) {
  return `${origin}${invitePath(token)}`;
}
