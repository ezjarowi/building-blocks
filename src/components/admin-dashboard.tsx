"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { SendInvite } from "@/components/send-invite";
import { TypeCharts } from "@/components/type-charts";
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

export function AdminDashboard() {
  const [people, setPeople] = useState<PersonRow[]>([]);
  const [unlinked, setUnlinked] = useState<Unlinked[]>([]);
  const [typeCounts, setTypeCounts] = useState<Record<string, number>>({});
  const [openId, setOpenId] = useState<string | null>(null);
  const [takes, setTakes] = useState<Take[] | null>(null);
  const [editNotes, setEditNotes] = useState("");
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
  }, []);

  async function copyLink(path: string, key: string) {
    const url = `${window.location.origin}${path}`;
    await navigator.clipboard.writeText(url);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  }

  async function openPerson(id: string) {
    if (openId === id) {
      setOpenId(null);
      setTakes(null);
      return;
    }
    setOpenId(id);
    const person = people.find((p) => p.id === id);
    setEditNotes(person?.notes ?? "");
    const res = await fetch(`/api/people/${id}`);
    if (!res.ok) return;
    const data = (await res.json()) as { takes: Take[]; person?: PersonRow };
    setTakes(data.takes);
    if (data.person?.notes != null) setEditNotes(data.person.notes);
  }

  async function saveNotes(id: string) {
    await fetch(`/api/people/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: editNotes }),
    });
    await load();
  }

  async function toggleVerified(takeId: string, verified: boolean) {
    await fetch(`/api/assessments/${takeId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verified }),
    });
    setTakes((prev) =>
      prev
        ? prev.map((t) => (t.id === takeId ? { ...t, verified } : t))
        : prev,
    );
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
        Everyone&apos;s takes — Shared or Walk-in. New links are on{" "}
        <Link href="/invite" className="underline-offset-4 hover:underline">
          Share Invite
        </Link>
        .
      </p>
      {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}

      <TypeCharts counts={typeCounts} />

      <div className="mt-10 space-y-3">
        {people.length === 0 ? (
          <p className="text-sm text-muted-foreground">No one yet.</p>
        ) : null}
        {people.map((person) => (
          <Card key={person.id} className="px-5 py-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-heading text-xl">
                  {person.name.trim() || "Unnamed link"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {person.expectedType
                    ? `Thought ${person.expectedType}`
                    : "No guessed type"}
                  {person.takeCount === 0
                    ? " · not taken yet"
                    : ` · ${person.takeCount} take${person.takeCount === 1 ? "" : "s"} · got ${person.latestType} · ${sourceLabel(person.latestSource)}`}
                  {person.expectedType &&
                  person.latestType &&
                  person.expectedType === person.latestType
                    ? " · match"
                    : ""}
                  {person.createdIp ? ` · from ${person.createdIp}` : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {person.token ? (
                  <SendInvite
                    token={person.token}
                    name={person.name}
                    copied={copied === person.id}
                    onCopy={(path) => copyLink(path, person.id)}
                  />
                ) : null}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="rounded-full"
                  onClick={() => openPerson(person.id)}
                >
                  {openId === person.id ? "Hide" : "Takes"}
                </Button>
              </div>
            </div>
            {openId === person.id && takes ? (
              <div className="mt-4 space-y-3 border-t border-border pt-4">
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    onBlur={() => saveNotes(person.id)}
                    rows={2}
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  />
                </div>
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
                          onChange={(e) =>
                            toggleVerified(take.id, e.target.checked)
                          }
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
        ))}
      </div>

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
