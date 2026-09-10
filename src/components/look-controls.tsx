"use client";

import { useEffect, useState } from "react";
import { applyNight, NIGHT_KEY } from "@/lib/looks";

export function LookControls() {
  const [night, setNight] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(NIGHT_KEY) === "1";
    setNight(stored);
    applyNight(stored);
  }, []);

  function toggleNight() {
    const next = !night;
    setNight(next);
    localStorage.setItem(NIGHT_KEY, next ? "1" : "0");
    applyNight(next);
  }

  return (
    <button
      type="button"
      onClick={toggleNight}
      className="hover:text-muted-foreground"
    >
      {night ? "Day" : "Night"}
    </button>
  );
}
