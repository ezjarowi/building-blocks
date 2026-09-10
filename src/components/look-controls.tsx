"use client";

import { useEffect, useState } from "react";
import {
  applyLook,
  isLookId,
  LOOK_KEY,
  LOOKS,
  NIGHT_KEY,
  type LookId,
} from "@/lib/looks";

export function LookControls() {
  const [look, setLook] = useState<LookId>("simple");
  const [night, setNight] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const storedLook = localStorage.getItem(LOOK_KEY);
    const storedNight = localStorage.getItem(NIGHT_KEY) === "1";
    const nextLook = isLookId(storedLook) ? storedLook : "simple";
    setLook(nextLook);
    setNight(storedNight);
    applyLook(nextLook, storedNight);
  }, []);

  function pickLook(id: LookId) {
    setLook(id);
    localStorage.setItem(LOOK_KEY, id);
    applyLook(id, night);
    setOpen(false);
  }

  function toggleNight() {
    const next = !night;
    setNight(next);
    localStorage.setItem(NIGHT_KEY, next ? "1" : "0");
    applyLook(look, next);
  }

  return (
    <span className="relative flex items-center gap-4">
      {open ? (
        <span className="absolute bottom-6 right-0 z-50 w-56 rounded-xl border border-border bg-popover p-2 text-left text-popover-foreground shadow-md">
          {LOOKS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => pickLook(item.id)}
              className={`block w-full rounded-lg px-2 py-1.5 text-left ${
                look === item.id ? "bg-muted" : "hover:bg-muted/70"
              }`}
            >
              <span className="block text-[11px] text-foreground">
                {item.name}
              </span>
              <span className="block text-[10px] text-muted-foreground">
                {item.vibe}
              </span>
            </button>
          ))}
        </span>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="hover:text-muted-foreground"
      >
        Look
      </button>
      <button
        type="button"
        onClick={toggleNight}
        className="hover:text-muted-foreground"
      >
        {night ? "Day" : "Night"}
      </button>
    </span>
  );
}
