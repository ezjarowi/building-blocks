"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SendInvite } from "@/components/send-invite";
import { invitePath, inviteText, smsHref } from "@/lib/invite-url";

export function InviteClient() {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [made, setMade] = useState<{ token: string; name: string } | null>(
    null,
  );

  async function makeLink() {
    if (made) return made;
    setSaving(true);
    setError(null);
    const res = await fetch("/api/invites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setSaving(false);
      setError(data?.error ?? "Could not make a link.");
      return null;
    }
    const data = (await res.json()) as { token: string; name: string };
    setMade(data);
    setSaving(false);
    return data;
  }

  function fullUrl(token: string, who: string) {
    return `${window.location.origin}${invitePath(token, Boolean(who.trim()))}`;
  }

  async function copyNow() {
    const link = await makeLink();
    if (!link) return;
    await navigator.clipboard.writeText(fullUrl(link.token, link.name));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function textNow() {
    const link = await makeLink();
    if (!link) return;
    window.location.href = smsHref(inviteText(link.name, fullUrl(link.token, link.name)));
  }

  return (
    <div className="flex flex-1 flex-col justify-center py-8">
      <h1 className="font-heading text-4xl">Share Invite</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        Make a unique link for one person, then copy it or text it. Name is
        optional — it is not in the URL.
      </p>

      <div className="mt-8 max-w-sm space-y-2">
        <Label htmlFor="invite-name">Their name (optional)</Label>
        <Input
          id="invite-name"
          value={made ? made.name : name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Sarah"
          className="h-11"
          disabled={Boolean(made) || saving}
        />
      </div>
      {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}

      <div className="mt-8 flex flex-wrap gap-2">
        {made ? (
          <SendInvite
            token={made.token}
            name={made.name}
            copied={copied}
            onCopy={async (path) => {
              await navigator.clipboard.writeText(
                `${window.location.origin}${path}`,
              );
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
          />
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              className="h-11 min-w-[7rem] rounded-full px-4"
              disabled={saving}
              onClick={() => void copyNow()}
            >
              {saving ? "…" : "Copy link"}
            </Button>
            <Button
              type="button"
              className="h-11 min-w-[5.5rem] rounded-full px-4"
              disabled={saving}
              onClick={() => void textNow()}
            >
              {saving ? "…" : "Text"}
            </Button>
          </>
        )}
      </div>

      {made ? (
        <button
          type="button"
          className="mt-8 w-fit text-sm text-muted-foreground underline-offset-4 hover:underline"
          onClick={() => {
            setMade(null);
            setName("");
            setCopied(false);
            setError(null);
          }}
        >
          Another person
        </button>
      ) : null}
    </div>
  );
}
