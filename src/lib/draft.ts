import type { Answer } from "@/lib/assessment";
import { invitePath } from "@/lib/invite-url";

export type Draft = {
  inviteToken: string | null;
  greet: boolean;
  name: string;
  named: boolean;
  answers: Answer[];
  seenInsight: number;
};

const VERSION = "v1";
const ACTIVE = `bb-draft:${VERSION}`;
const LEGACY_ACTIVE = "bb-draft";

let memory: Draft | null = null;

function tokenKey(inviteToken: string) {
  return `bb-draft:${VERSION}:${inviteToken}`;
}

function legacyTokenKey(inviteToken: string) {
  return `bb-draft:${inviteToken}`;
}

function storageGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function storageSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // private mode / quota
  }
}

function storageRemove(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

function parse(raw: string | null): Draft | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<Draft>;
    if (!Array.isArray(parsed.answers)) return null;
    return {
      inviteToken:
        typeof parsed.inviteToken === "string" ? parsed.inviteToken : null,
      greet: Boolean(parsed.greet),
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

function richer(a: Draft | null, b: Draft | null): Draft | null {
  if (!a) return b;
  if (!b) return a;
  const aScore = (a.named ? 1 : 0) + a.answers.length;
  const bScore = (b.named ? 1 : 0) + b.answers.length;
  return bScore > aScore ? b : a;
}

export function readDraft(inviteToken?: string | null): Draft | null {
  if (typeof window === "undefined") return null;

  if (inviteToken) {
    const fromMemory =
      memory?.inviteToken === inviteToken ? memory : null;
    const keyed = parse(storageGet(tokenKey(inviteToken)));
    const legacyKeyed = parse(storageGet(legacyTokenKey(inviteToken)));
    const active = parse(storageGet(ACTIVE));
    const fromActive =
      active?.inviteToken === inviteToken ? active : null;
    return richer(
      fromMemory,
      richer(keyed, richer(legacyKeyed, fromActive)),
    );
  }

  const active = parse(storageGet(ACTIVE)) ?? parse(storageGet(LEGACY_ACTIVE));
  return richer(memory, active);
}

export function writeDraft(
  inviteToken: string | null | undefined,
  draft: Omit<Draft, "inviteToken" | "greet"> & {
    inviteToken?: string | null;
    greet?: boolean;
  },
) {
  const token = inviteToken ?? draft.inviteToken ?? memory?.inviteToken ?? null;
  const full: Draft = {
    name: draft.name,
    named: draft.named,
    answers: draft.answers,
    seenInsight: draft.seenInsight,
    greet: draft.greet ?? memory?.greet ?? false,
    inviteToken: token,
  };
  memory = full;
  const raw = JSON.stringify(full);
  storageSet(ACTIVE, raw);
  if (token) storageSet(tokenKey(token), raw);
}

export function clearDraft(inviteToken?: string | null) {
  const token = inviteToken ?? memory?.inviteToken ?? null;
  memory = null;
  storageRemove(ACTIVE);
  storageRemove(LEGACY_ACTIVE);
  if (token) {
    storageRemove(tokenKey(token));
    storageRemove(legacyTokenKey(token));
  }
}

export function assessPathFromDraft(draft?: Draft | null): string {
  const d = draft ?? (typeof window === "undefined" ? null : readDraft());
  if (d?.inviteToken) return invitePath(d.inviteToken, d.greet);
  return "/assess";
}

export function draftIsInProgress(draft?: Draft | null): boolean {
  const d = draft ?? (typeof window === "undefined" ? null : readDraft());
  if (!d) return false;
  return d.named || d.answers.length > 0;
}
