"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { shortSha } from "@/lib/version";

type PersonRow = {
  id: string;
  name: string;
  createdAt: string;
  token: string | null;
  path: string | null;
  takeCount: number;
  latestType: string | null;
  latestAt: string | null;
  latestName: string | null;
};

type Take = {
  id: string;
  typeCode: string;
  temperament: string;
  stack: string[];
  respondentName: string | null;
  gitSha: string | null;
  createdAt: string;
};

type Unlinked = {
  id: string;
  respondentName: string | null;
  typeCode: string;
  gitSha: string | null;
  createdAt: string;
};

export function AdminDashboard() {
  const [name, setName] = useState("");
  const [people, setPeople] = useState<PersonRow[]>([]);
  const [unlinked, setUnlinked] = useState<Unlinked[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [takes, setTakes] = useState<Take[] | null>(null);
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
    };
    setPeople(data.people);
    setUnlinked(data.unlinked ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function addPerson(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/people", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      setError("Could not add person.");
      return;
    }
    setName("");
    await load();
  }

  async function copyLink(path: string, id: string) {
    const url = `${window.location.origin}${path}`;
    await navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  }

  async function openPerson(id: string) {
    if (openId === id) {
      setOpenId(null);
      setTakes(null);
      return;
    }
    setOpenId(id);
    const res = await fetch(`/api/people/${id}`);
    if (!res.ok) return;
    const data = (await res.json()) as { takes: Take[] };
    setTakes(data.takes);
  }

  return (
    <div className="py-8">
      <h1 className="font-heading text-4xl">People</h1>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        Add a name, copy the link, send it. They type their name and take the
        test. You see whether they responded, what they were typed as, which
        Git version, and the date. Same person can take it more than once.
      </p>

      <form onSubmit={addPerson} className="mt-8 flex flex-wrap items-end gap-3">
        <div className="space-y-2">
          <Label htmlFor="person">Name</Label>
          <Input
            id="person"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Sarah"
            className="w-56"
          />
        </div>
        <Button type="submit" className="rounded-full">
          Add + make link
        </Button>
      </form>
      {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}

      <div className="mt-10 space-y-3">
        {people.length === 0 ? (
          <p className="text-sm text-muted-foreground">No one yet.</p>
        ) : null}
        {people.map((person) => (
          <Card key={person.id} className="px-5 py-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-heading text-xl">{person.name}</p>
                <p className="text-sm text-muted-foreground">
                  {person.takeCount === 0
                    ? "Not taken yet"
                    : `${person.takeCount} take${person.takeCount === 1 ? "" : "s"} · latest ${person.latestType}${person.latestName ? ` as “${person.latestName}”` : ""}`}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {person.path ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => copyLink(person.path!, person.id)}
                  >
                    {copied === person.id ? "Copied" : "Copy link"}
                  </Button>
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
              <div className="mt-4 space-y-2 border-t border-border pt-4">
                {takes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No responses yet.</p>
                ) : (
                  takes.map((take) => (
                    <div
                      key={take.id}
                      className="flex flex-wrap items-baseline justify-between gap-2 text-sm"
                    >
                      <Link
                        href={`/result/${take.id}`}
                        className="underline-offset-4 hover:underline"
                      >
                        {take.typeCode} · {take.stack.slice(0, 4).join(" ")}
                      </Link>
                      <span className="text-muted-foreground">
                        {take.respondentName} · {shortSha(take.gitSha)} ·{" "}
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
                  {take.respondentName || "No name"} · {take.typeCode}
                </Link>
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
