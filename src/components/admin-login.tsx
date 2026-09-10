"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordField } from "@/components/password-field";

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
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Wrong password.");
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
        <PasswordField
          id="password"
          value={password}
          onChange={setPassword}
        />
      </div>
      {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
      <Button type="submit" className="mt-6 rounded-full" disabled={saving}>
        {saving ? "…" : "Enter"}
      </Button>
    </form>
  );
}
