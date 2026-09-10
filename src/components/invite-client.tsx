"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SendInvite } from "@/components/send-invite";
import { TypePicker } from "@/components/type-picker";
import { invitePath, inviteText, smsHref } from "@/lib/invite-url";

export function InviteClient({ embedded = false }: { embedded?: boolean }) {
  const [name, setName] = useState("");
  const [expectedType, setExpectedType] = useState("");
  const [notes, setNotes] = useState("");
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
      body: JSON.stringify({ name, expectedType, notes }),
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
    window.dispatchEvent(new Event("bb-invite-created"));
    return data;
  }

  function fullUrl(token: string) {
    return `${window.location.origin}${invitePath(token)}`;
  }

  async function copyNow() {
    const link = await makeLink();
    if (!link) return;
    await navigator.clipboard.writeText(fullUrl(link.token));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function textNow() {
    const link = await makeLink();
    if (!link) return;
    window.location.href = smsHref(inviteText(link.name, fullUrl(link.token)));
  }

  const heading = embedded ? (
    <>
      <DialogHeader className="mb-6 text-left">
        <DialogTitle className="font-heading text-3xl leading-tight">
          Share Invite
        </DialogTitle>
        <DialogDescription>
          Unique link for one person. Copy it or text it. Name, guessed type,
          and notes stay in Responses — not in the URL.
        </DialogDescription>
      </DialogHeader>
    </>
  ) : (
    <>
      <h1 className="font-heading text-4xl">Share Invite</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        Make a unique link for one person, then copy it or text it. Name,
        guessed type, and notes stay in Responses — not in the URL.
      </p>
    </>
  );

  return (
    <div className={embedded ? "" : "flex flex-1 flex-col justify-center py-8"}>
      {heading}

      <div className={`space-y-4 ${embedded ? "mt-0" : "mt-8"}`}>
        <div className="space-y-2">
          <Label htmlFor="invite-name">Their name (optional)</Label>
          <Input
            id="invite-name"
            value={made ? made.name : name}
            onChange={(e) => setName(e.target.value)}
            className="h-11"
            disabled={Boolean(made) || saving}
          />
        </div>
        <div className="space-y-2">
          <Label>Type you think they are (optional)</Label>
          <TypePicker
            value={expectedType}
            onChange={setExpectedType}
            className="h-11 w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="invite-notes">Notes (optional)</Label>
          <textarea
            id="invite-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            disabled={Boolean(made) || saving}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
            placeholder="Anything you want to remember"
          />
        </div>
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
            setExpectedType("");
            setNotes("");
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
