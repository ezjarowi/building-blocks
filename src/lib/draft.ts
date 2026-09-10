import type { Answer } from "@/lib/assessment";

export type Draft = {
  inviteToken: string | null;
  name: string;
  named: boolean;
  answers: Answer[];
  seenInsight: number;
};

const ACTIVE = "bb-draft";

function tokenKey(inviteToken: string) {
  return `bb-draft:${inviteToken}`;
}

function parse(raw: string | null): Draft | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<Draft>;
    if (!Array.isArray(parsed.answers)) return null;
    return {
      inviteToken:
        typeof parsed.inviteToken === "string" ? parsed.inviteToken : null,
      name: typeof parsed.name === "string" ? parsed.name : "",
      named: Boolean(parsed.named),
      answers: parsed.answers,
      seenInsight:
        typeof parsed.seenInsight === "number" ? parsed.seenInsight : 0,
    };
  } catch {
    return null;
  }
}

export function readDraft(inviteToken?: string | null): Draft | null {
  if (typeof window === "undefined") return null;
  if (inviteToken) {
    return parse(localStorage.getItem(tokenKey(inviteToken)));
  }
  return parse(localStorage.getItem(ACTIVE));
}

export function writeDraft(
  inviteToken: string | null | undefined,
  draft: Omit<Draft, "inviteToken">,
) {
  const full: Draft = {
    ...draft,
    inviteToken: inviteToken ?? null,
  };
  const raw = JSON.stringify(full);
  localStorage.setItem(ACTIVE, raw);
  if (inviteToken) localStorage.setItem(tokenKey(inviteToken), raw);
}

export function clearDraft(inviteToken?: string | null) {
  localStorage.removeItem(ACTIVE);
  if (inviteToken) localStorage.removeItem(tokenKey(inviteToken));
}
