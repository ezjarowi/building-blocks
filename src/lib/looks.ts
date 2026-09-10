export const LOOK_IDS = ["simple", "paper", "boardroom", "studio"] as const;

export type LookId = (typeof LOOK_IDS)[number];

export const LOOKS: { id: LookId; name: string; vibe: string }[] = [
  { id: "simple", name: "Simple", vibe: "Almost no color" },
  { id: "paper", name: "Paper", vibe: "Warm, quiet, notebook" },
  { id: "boardroom", name: "Boardroom", vibe: "Navy, business" },
  { id: "studio", name: "Studio", vibe: "Soft professional" },
];

export const LOOK_KEY = "bb-look";
export const NIGHT_KEY = "bb-night";

export function isLookId(value: string | null): value is LookId {
  return LOOK_IDS.includes(value as LookId);
}

export function applyLook(look: LookId, night: boolean) {
  const root = document.documentElement;
  root.setAttribute("data-theme", look);
  root.classList.toggle("dark", night);
}

export const LOOK_BOOT = `(function(){try{var t=localStorage.getItem("${LOOK_KEY}");if(t!=="simple"&&t!=="paper"&&t!=="boardroom"&&t!=="studio")t="simple";var n=localStorage.getItem("${NIGHT_KEY}")==="1";document.documentElement.setAttribute("data-theme",t);document.documentElement.classList.toggle("dark",n);}catch(e){}})();`;
