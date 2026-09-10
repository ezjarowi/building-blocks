export function invitePath(token: string, greet = true) {
  const base = `/assess?to=${encodeURIComponent(token)}`;
  return greet ? `${base}&hi=1` : `${base}&quiet=1`;
}

export function inviteUrl(token: string, origin: string, greet = false) {
  return `${origin}${invitePath(token, greet)}`;
}

export function inviteText(name: string, url: string) {
  const who = name.trim();
  const line = who
    ? `Hey ${who}, take this personality test I found`
    : `Hey, take this personality test I found`;
  return `${line} ${url}`;
}

export function smsHref(body: string) {
  const encoded = encodeURIComponent(body);
  const ios =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/i.test(navigator.userAgent);
  return ios ? `sms:&body=${encoded}` : `sms:?body=${encoded}`;
}
