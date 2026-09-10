const KEY = "bb-takes";

export function readMyTakeIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === "string");
  } catch {
    return [];
  }
}

export function rememberTakeId(id: string) {
  const next = [id, ...readMyTakeIds().filter((x) => x !== id)].slice(0, 50);
  localStorage.setItem(KEY, JSON.stringify(next));
}
