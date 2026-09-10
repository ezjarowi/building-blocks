"use client";

import { createContext, useContext, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { InviteClient } from "@/components/invite-client";

const ShareInviteContext = createContext<{ openShare: () => void } | null>(
  null,
);

export function useShareInvite() {
  const ctx = useContext(ShareInviteContext);
  if (!ctx) {
    throw new Error("ShareInviteProvider is missing");
  }
  return ctx;
}

export function ShareInviteProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <ShareInviteContext.Provider value={{ openShare: () => setOpen(true) }}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="gap-0 p-6 sm:max-w-md" showCloseButton>
          <InviteClient key={open ? "open" : "closed"} embedded />
        </DialogContent>
      </Dialog>
    </ShareInviteContext.Provider>
  );
}

export function ShareInviteOpen({
  className,
  children = "Share Invite",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const { openShare } = useShareInvite();
  return (
    <button type="button" className={className} onClick={openShare}>
      {children}
    </button>
  );
}
