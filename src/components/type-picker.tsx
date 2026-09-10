"use client";

import { useMemo, useState } from "react";
import { TYPE_CODES } from "@/lib/assessment";
import { Input } from "@/components/ui/input";

export function TypePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const q = value.trim().toUpperCase();
  const options = useMemo(() => {
    if (!q) return [...TYPE_CODES];
    return TYPE_CODES.filter((code) => code.includes(q));
  }, [q]);

  return (
    <div className="relative">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        placeholder="INTJ"
        className="w-28"
      />
      {open ? (
        <ul className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-md border border-border bg-card py-1 text-sm shadow-sm">
          <li>
            <button
              type="button"
              className="w-full px-2 py-1 text-left text-muted-foreground hover:bg-muted"
              onMouseDown={(e) => {
                e.preventDefault();
                onChange("");
              }}
            >
              None
            </button>
          </li>
          {options.map((code) => (
            <li key={code}>
              <button
                type="button"
                className="w-full px-2 py-1 text-left hover:bg-muted"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(code);
                }}
              >
                {code}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
