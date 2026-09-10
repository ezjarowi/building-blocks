"use client";

import { useEffect, useState } from "react";
import { run, type Answer, type AssessmentResult } from "@/lib/assessment";
import { ResultView } from "@/components/result-view";

export function LocalResult() {
  const [result, setResult] = useState<AssessmentResult | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("bb-answers");
    if (!raw) return;
    try {
      const answers = JSON.parse(raw) as Answer[];
      const state = run(answers);
      if (state.result) setResult(state.result);
    } catch {
      setResult(null);
    }
  }, []);

  if (!result) {
    return (
      <p className="text-muted-foreground">
        No local result found. Take the assessment from the start.
      </p>
    );
  }

  return <ResultView result={result} />;
}
