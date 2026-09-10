export function invitePath(token: string) {
  return `/assess?to=${encodeURIComponent(token)}`;
}

export function inviteUrl(token: string, origin: string) {
  return `${origin}${invitePath(token)}`;
}

export function inviteText(name: string, url: string) {
  const who = name.trim();
  const line = who
    ? `Hey ${who}, take this personality test I found`
    : `Hey, take this personality test I found`;
  return `${line}\n\n${url}`;
}

export function smsHref(body: string) {
  const encoded = encodeURIComponent(body);
  const ios =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/i.test(navigator.userAgent);
  return ios ? `sms:&body=${encoded}` : `sms:?body=${encoded}`;
}
