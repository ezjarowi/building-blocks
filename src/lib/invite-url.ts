export function invitePath(token: string) {
  return `/s/${encodeURIComponent(token)}`;
}

export function inviteUrl(token: string, origin: string) {
  return `${origin}${invitePath(token)}`;
}

export function inviteText(name: string, url: string) {
  const who = name.trim();
  const line = who
    ? `Hey ${who}, take Benson's personality test`
    : `Hey, take Benson's personality test`;
  const short = url.replace(/^https:\/\//i, "");
  return `${line}\n\n${short}`;
}

export function smsHref(body: string) {
  const encoded = encodeURIComponent(body);
  const ios =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/i.test(navigator.userAgent);
  return ios ? `sms:&body=${encoded}` : `sms:?body=${encoded}`;
}
