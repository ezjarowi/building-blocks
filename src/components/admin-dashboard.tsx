"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShareInviteOpen } from "@/components/invite-modal";
import { SendInvite } from "@/components/send-invite";
import { TypeCharts } from "@/components/type-charts";
import { TypePicker } from "@/components/type-picker";
import { shortSha } from "@/lib/version";

type PersonRow = {
  id: string;
  name: string;
  expectedType: string | null;
  notes: string | null;
  createdAt: string;
  token: string | null;
  path: string | null;
  takeCount: number;
  latestType: string | null;
  latestAt: string | null;
  latestName: string | null;
  latestVerified: boolean;
  latestSource: string | null;
  createdIp: string | null;
};

type Take = {
  id: string;
  typeCode: string;
  temperament: string;
  stack: string[];
  respondentName: string | null;
  gitSha: string | null;
  verified: boolean;
  source: string | null;
  createdAt: string;
};

type Unlinked = {
  id: string;
  respondentName: string | null;
  typeCode: string;
  gitSha: string | null;
  verified: boolean;
  source: string | null;
  createdAt: string;
};

function sourceLabel(source: string | null | undefined) {
  return source === "shared" ? "Shared" : "Walk-in";
}

function PersonRecord({
  person,
  copied,
  onCopy,
  onSaved,
  onToggleVerified,
}: {
  person: PersonRow;
  copied: boolean;
  onCopy: (path: string) => void;
  onSaved: () => void;
  onToggleVerified: (takeId: string, verified: boolean) => void;
}) {
  const [name, setName] = useState(person.name);
  const [expectedType, setExpectedType] = useState(person.expectedType ?? "");
  const [notes, setNotes] = useState(person.notes ?? "");
  const [open, setOpen] = useState(false);
  const [takes, setTakes] = useState<Take[] | null>(null);

  async function patch(next: {
    name?: string;
    expectedType?: string;
    notes?: string;
  }) {
    await fetch(`/api/people/${person.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    onSaved();
  }

  async function toggleTakes() {
    if (open) {
      setOpen(false);
      return;
    }
    setOpen(true);
    const res = await fetch(`/api/people/${person.id}`);
    if (!res.ok) return;
    const data = (await res.json()) as { takes: Take[] };
    setTakes(data.takes);
  }

  return (
    <Card className="px-5 py-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => {
              if (name.trim() !== person.name.trim()) {
                void patch({ name });
              }
            }}
            placeholder="Unnamed"
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label>Type you thought they were</Label>
          <TypePicker
            value={expectedType}
            className="h-11 w-full"
            onChange={(value) => {
              setExpectedType(value);
              void patch({ expectedType: value });
            }}
          />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Label>Notes</Label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => {
            if ((notes.trim() || "") !== (person.notes?.trim() || "")) {
              void patch({ notes });
            }
          }}
          rows={2}
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
          placeholder="Optional"
        />
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        {person.takeCount === 0
          ? "Not taken yet"
          : `${person.takeCount} take${person.takeCount === 1 ? "" : "s"} · got ${person.latestType} · ${sourceLabel(person.latestSource)}`}
        {person.expectedType &&
        person.latestType &&
        person.expectedType === person.latestType
          ? " · match"
          : ""}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {person.token ? (
          <SendInvite
            token={person.token}
            name={name}
            copied={copied}
            onCopy={onCopy}
          />
        ) : null}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="rounded-full"
          onClick={() => void toggleTakes()}
        >
          {open ? "Hide takes" : "Takes"}
        </Button>
      </div>
      {open && takes ? (
        <div className="mt-4 space-y-3 border-t border-border pt-4">
          {takes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No responses yet.</p>
          ) : (
            takes.map((take) => (
              <div
                key={take.id}
                className="flex flex-wrap items-center justify-between gap-2 text-sm"
              >
                <Link
                  href={`/result/${take.id}`}
                  className="underline-offset-4 hover:underline"
                >
                  {take.typeCode} · {take.stack.slice(0, 4).join(" ")}
                </Link>
                <label className="flex items-center gap-2 text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={take.verified}
                    onChange={(e) => {
                      const verified = e.target.checked;
                      void fetch(`/api/assessments/${take.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ verified }),
                      });
                      setTakes((prev) =>
                        prev
                          ? prev.map((t) =>
                              t.id === take.id ? { ...t, verified } : t,
                            )
                          : prev,
                      );
                      onToggleVerified(take.id, verified);
                    }}
                  />
                  Verified
                </label>
                <span className="text-muted-foreground">
                  {sourceLabel(take.source)} · {shortSha(take.gitSha)} ·{" "}
                  {new Date(take.createdAt).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      ) : null}
    </Card>
  );
}

export function AdminDashboard() {
  const [people, setPeople] = useState<PersonRow[]>([]);
  const [unlinked, setUnlinked] = useState<Unlinked[]>([]);
  const [typeCounts, setTypeCounts] = useState<Record<string, number>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/people");
    if (!res.ok) {
      setError("Could not load people.");
      return;
    }
    const data = (await res.json()) as {
      people: PersonRow[];
      unlinked?: Unlinked[];
      typeCounts?: Record<string, number>;
    };
    setPeople(data.people);
    setUnlinked(data.unlinked ?? []);
    setTypeCounts(data.typeCounts ?? {});
  }

  useEffect(() => {
    void load();
    function onMade() {
      void load();
    }
    window.addEventListener("bb-invite-created", onMade);
    return () => window.removeEventListener("bb-invite-created", onMade);
  }, []);

  async function copyLink(path: string, key: string) {
    const url = `${window.location.origin}${path}`;
    await navigator.clipboard.writeText(url);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  }

  async function toggleVerified(takeId: string, verified: boolean) {
    await fetch(`/api/assessments/${takeId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verified }),
    });
    setUnlinked((prev) =>
      prev.map((t) => (t.id === takeId ? { ...t, verified } : t)),
    );
  }

  return (
    <div className="py-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="font-heading text-4xl">All responses</h1>
        <button
          type="button"
          className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          onClick={async () => {
            await fetch("/api/admin/logout", { method: "POST" });
            window.location.assign("/responses");
          }}
        >
          Just mine
        </button>
      </div>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        Everyone you made a link for — even before they take it. Copy or text
        again anytime. New links:{" "}
        <ShareInviteOpen className="underline-offset-4 hover:underline">
          Share Invite
        </ShareInviteOpen>
        .
      </p>
      {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}

      <div className="mt-8 space-y-3">
        {people.length === 0 ? (
          <p className="text-sm text-muted-foreground">No one yet.</p>
        ) : null}
        {people.map((person) => (
          <PersonRecord
            key={person.id}
            person={person}
            copied={copied === person.id}
            onCopy={(path) => copyLink(path, person.id)}
            onSaved={() => void load()}
            onToggleVerified={toggleVerified}
          />
        ))}
      </div>

      <TypeCharts counts={typeCounts} />

      {unlinked.length > 0 ? (
        <div className="mt-12">
          <h2 className="font-heading text-2xl">Walk-ins</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Took it without an invite link.
          </p>
          <div className="mt-4 space-y-2">
            {unlinked.map((take) => (
              <div
                key={take.id}
                className="flex flex-wrap items-baseline justify-between gap-2 text-sm"
              >
                <Link
                  href={`/result/${take.id}`}
                  className="underline-offset-4 hover:underline"
                >
                  {take.respondentName || "No name"} · {take.typeCode} ·{" "}
                  {sourceLabel(take.source)}
                </Link>
                <label className="flex items-center gap-2 text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={take.verified}
                    onChange={(e) => toggleVerified(take.id, e.target.checked)}
                  />
                  Verified
                </label>
                <span className="text-muted-foreground">
                  {shortSha(take.gitSha)} ·{" "}
                  {new Date(take.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
