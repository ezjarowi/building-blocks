export const LOOK_IDS = [
  "simple",
  "paper",
  "modern",
  "playful",
  "boardroom",
  "studio",
  "circuit",
  "ink",
] as const;

export type LookId = (typeof LOOK_IDS)[number];

export const LOOKS: { id: LookId; name: string; vibe: string }[] = [
  { id: "simple", name: "Simple", vibe: "Warm quiz, not a clinic" },
  { id: "paper", name: "Paper", vibe: "Warm, quiet, notebook" },
  { id: "modern", name: "Modern", vibe: "Cool, clean, a bit airy" },
  { id: "playful", name: "Playful", vibe: "Friendly, a little loud" },
  { id: "boardroom", name: "Boardroom", vibe: "Navy, business" },
  { id: "studio", name: "Studio", vibe: "Soft professional" },
  { id: "circuit", name: "Circuit", vibe: "Tech, sharp" },
  { id: "ink", name: "Ink", vibe: "Editorial, high contrast" },
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

export const LOOK_BOOT = `(function(){try{var ok=["simple","paper","modern","playful","boardroom","studio","circuit","ink"];var t=localStorage.getItem("${LOOK_KEY}");if(ok.indexOf(t)<0)t="simple";var n=localStorage.getItem("${NIGHT_KEY}")==="1";document.documentElement.setAttribute("data-theme",t);document.documentElement.classList.toggle("dark",n);}catch(e){}})();`;
