"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
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
      setError("Wrong password.");
      return;
    }
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-sm py-16">
      <h1 className="font-heading text-3xl">Admin</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        For you. Not for the people taking the test.
      </p>
      <div className="mt-8 space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </div>
      {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
      <Button type="submit" className="mt-6 rounded-full" disabled={saving}>
        {saving ? "…" : "Enter"}
      </Button>
    </form>
  );
}
