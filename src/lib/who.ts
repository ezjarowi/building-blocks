const KEY = "bb-who";

export type Who = {
  token: string | null;
  name: string;
};

export function readWho(): Who | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Who>;
    const name = typeof parsed.name === "string" ? parsed.name.trim() : "";
    if (!name && !parsed.token) return null;
    return {
      token: typeof parsed.token === "string" && parsed.token ? parsed.token : null,
      name,
    };
  } catch {
    return null;
  }
}

export function rememberWho(who: Who) {
  try {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        token: who.token,
        name: who.name.trim(),
      }),
    );
  } catch {
    // private mode / quota
  }
}
