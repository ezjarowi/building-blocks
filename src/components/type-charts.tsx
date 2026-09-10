import { TYPE_CODES } from "@/lib/assessment";

const COLORS = [
  "#8c5a3c",
  "#c4894a",
  "#6b7c5a",
  "#4a6b73",
  "#7a5a73",
  "#a36b4a",
  "#5a6b8c",
  "#8c6b5a",
  "#6b8c6b",
  "#8c5a5a",
  "#5a738c",
  "#738c5a",
  "#8c735a",
  "#5a8c73",
  "#735a8c",
  "#8c8c5a",
];

export function TypeCharts({ counts }: { counts: Record<string, number> }) {
  const total = TYPE_CODES.reduce((sum, code) => sum + (counts[code] ?? 0), 0);
  const max = Math.max(1, ...TYPE_CODES.map((code) => counts[code] ?? 0));

  let angle = -Math.PI / 2;
  const slices = TYPE_CODES.map((code, i) => {
    const n = counts[code] ?? 0;
    const frac = total === 0 ? 0 : n / total;
    const start = angle;
    angle += frac * Math.PI * 2;
    return { code, n, start, end: angle, color: COLORS[i] };
  }).filter((s) => s.n > 0);

  return (
    <div className="mt-8 grid gap-8 sm:grid-cols-2">
      <div>
        <p className="mb-3 text-sm text-muted-foreground">Types so far</p>
        {total === 0 ? (
          <p className="text-sm text-muted-foreground">No takes yet.</p>
        ) : (
          <svg viewBox="0 0 120 120" className="h-40 w-40">
            {slices.map((s) => {
              const r = 48;
              const cx = 60;
              const cy = 60;
              const large = s.end - s.start > Math.PI ? 1 : 0;
              const x1 = cx + r * Math.cos(s.start);
              const y1 = cy + r * Math.sin(s.start);
              const x2 = cx + r * Math.cos(s.end);
              const y2 = cy + r * Math.sin(s.end);
              if (slices.length === 1) {
                return (
                  <circle key={s.code} cx={cx} cy={cy} r={r} fill={s.color} />
                );
              }
              return (
                <path
                  key={s.code}
                  d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`}
                  fill={s.color}
                >
                  <title>
                    {s.code} {s.n}
                  </title>
                </path>
              );
            })}
          </svg>
        )}
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
          {slices.map((s) => (
            <span key={s.code}>
              <span
                className="mr-1 inline-block h-2 w-2 rounded-full"
                style={{ background: s.color }}
              />
              {s.code} {s.n}
            </span>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-3 text-sm text-muted-foreground">All 16</p>
        <div className="space-y-1">
          {[...TYPE_CODES]
            .map((code, i) => ({ code, n: counts[code] ?? 0, color: COLORS[i] }))
            .sort((a, b) => b.n - a.n || a.code.localeCompare(b.code))
            .map((row) => (
              <div key={row.code} className="flex items-center gap-2 text-[11px]">
                <span className="w-10 shrink-0 text-muted-foreground">
                  {row.code}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(row.n / max) * 100}%`,
                      background: row.color,
                    }}
                  />
                </div>
                <span className="w-4 text-right text-muted-foreground">
                  {row.n}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
