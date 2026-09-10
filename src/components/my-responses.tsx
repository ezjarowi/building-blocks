"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { readMyTakeIds } from "@/lib/my-takes";
import { shortSha } from "@/lib/version";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordField } from "@/components/password-field";

type Take = {
  id: string;
  typeCode: string;
  temperament: string;
  stack: string[];
  respondentName: string | null;
  gitSha: string | null;
  createdAt: string;
};

export function MyResponses() {
  const [takes, setTakes] = useState<Take[] | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const ids = readMyTakeIds();
    if (ids.length === 0) {
      setTakes([]);
      return;
    }
    void fetch(`/api/takes?ids=${ids.map(encodeURIComponent).join(",")}`)
      .then((res) => res.json())
      .then((data: { takes: Take[] }) => setTakes(data.takes ?? []))
      .catch(() => setTakes([]));
  }, []);

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Wrong password.");
      return;
    }
    window.location.assign("/responses");
  }

  return (
    <div className="py-8">
      <h1 className="font-heading text-4xl">Responses</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Takes from this browser.
      </p>

      <div className="mt-8 space-y-3">
        {takes === null ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : takes.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No takes on this device yet.
          </p>
        ) : (
          takes.map((take) => (
            <div
              key={take.id}
              className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border py-3"
            >
              <Link
                href={`/result/${take.id}`}
                className="font-heading text-lg underline-offset-4 hover:underline"
              >
                {take.typeCode}
                {take.respondentName ? ` · ${take.respondentName}` : ""}
              </Link>
              <span className="text-sm text-muted-foreground">
                {new Date(take.createdAt).toLocaleString()} ·{" "}
                {shortSha(take.gitSha)}
              </span>
            </div>
          ))
        )}
      </div>

      <form
        onSubmit={unlock}
        className="mt-16 max-w-sm border-t border-border pt-8"
      >
        <p className="text-sm text-muted-foreground">
          Password shows every response.
        </p>
        <div className="mt-4 space-y-2">
          <Label htmlFor="password">Password</Label>
          <PasswordField
            id="password"
            value={password}
            onChange={setPassword}
          />
        </div>
        {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
        <Button
          type="submit"
          className="mt-4 h-11 rounded-full px-5"
          disabled={saving}
        >
          {saving ? "…" : "See all"}
        </Button>
      </form>
    </div>
  );
}
