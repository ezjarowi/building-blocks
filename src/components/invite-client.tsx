"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SendInvite } from "@/components/send-invite";

export function InviteClient() {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [made, setMade] = useState<{ token: string; name: string } | null>(
    null,
  );

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const res = await fetch("/api/invites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Could not make a link.");
      return;
    }
    const data = (await res.json()) as { token: string; name: string };
    setMade({ token: data.token, name: data.name });
  }

  function copy(path: string) {
    void navigator.clipboard.writeText(`${window.location.origin}${path}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (made) {
    return (
      <div className="flex flex-1 flex-col justify-center py-8">
        <h1 className="font-heading text-4xl">Send it</h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          {made.name.trim()
            ? `This one is for ${made.name}. Copy the link or text it.`
            : "Copy the link or text it. They can type their name when they open it."}
        </p>
        <div className="mt-8 flex flex-wrap gap-2">
          <SendInvite
            token={made.token}
            name={made.name}
            copied={copied}
            onCopy={copy}
          />
        </div>
        <button
          type="button"
          className="mt-8 w-fit text-sm text-muted-foreground underline-offset-4 hover:underline"
          onClick={() => {
            setMade(null);
            setName("");
            setCopied(false);
          }}
        >
          Make another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={create}
      className="flex flex-1 flex-col justify-center py-8"
    >
      <h1 className="font-heading text-4xl">Share Invite</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        Make a unique link. Name is optional — it stays behind the scenes, not
        in the URL.
      </p>
      <div className="mt-8 max-w-sm space-y-2">
        <Label htmlFor="invite-name">Their name (optional)</Label>
        <Input
          id="invite-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Sarah"
          className="h-11"
        />
      </div>
      {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
      <Button
        type="submit"
        className="mt-6 h-12 w-full max-w-sm rounded-full px-5 sm:w-auto"
        disabled={saving}
      >
        {saving ? "…" : "Make link"}
      </Button>
    </form>
  );
}
