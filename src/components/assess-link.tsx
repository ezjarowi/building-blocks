"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  assessPathFromDraft,
  draftIsInProgress,
  readDraft,
} from "@/lib/draft";

function subscribe() {
  return () => {};
}

function pathSnapshot() {
  return assessPathFromDraft(readDraft());
}

function pathServer() {
  return "/assess";
}

function progressSnapshot() {
  return draftIsInProgress(readDraft());
}

function progressServer() {
  return false;
}

export function TakeItLink({ className }: { className?: string }) {
  const href = useSyncExternalStore(subscribe, pathSnapshot, pathServer);
  return (
    <Link href={href} className={className}>
      Take it
    </Link>
  );
}

export function StartCta({ className }: { className?: string }) {
  const href = useSyncExternalStore(subscribe, pathSnapshot, pathServer);
  const continuing = useSyncExternalStore(
    subscribe,
    progressSnapshot,
    progressServer,
  );
  return (
    <Link href={href} className={className}>
      {continuing ? "Continue where you left off" : "Start — it's a party game"}
    </Link>
  );
}
