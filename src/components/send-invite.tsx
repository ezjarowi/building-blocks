"use client";

import { Button } from "@/components/ui/button";
import { invitePath, inviteText, smsHref } from "@/lib/invite-url";

export function SendInvite({
  token,
  name,
  copied,
  onCopy,
}: {
  token: string;
  name: string;
  copied: boolean;
  onCopy: (path: string) => void;
}) {
  const greet = Boolean(name.trim());
  const path = invitePath(token, greet);

  function text() {
    const url = `${window.location.origin}${path}`;
    window.location.href = smsHref(inviteText(name, url));
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="h-11 min-w-[7rem] rounded-full px-4"
        onClick={() => onCopy(path)}
      >
        {copied ? "Copied" : "Copy link"}
      </Button>
      <Button
        type="button"
        className="h-11 min-w-[5.5rem] rounded-full px-4"
        onClick={text}
      >
        Text
      </Button>
    </>
  );
}
