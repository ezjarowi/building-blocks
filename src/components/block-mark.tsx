export function BlockMark({ size = "sm" }: { size?: "sm" | "md" | "lg" }) {
  const box =
    size === "lg"
      ? "size-8 rounded-lg"
      : size === "md"
        ? "size-5 rounded-md"
        : "size-2 rounded-[3px]";
  const gap = size === "lg" ? "gap-1.5" : size === "md" ? "gap-1" : "gap-0.5";
  return (
    <span
      aria-hidden
      className={`inline-grid grid-cols-2 ${gap}`}
    >
      <span className={`${box} rotate-[-8deg] bg-choice-a`} />
      <span className={`${box} rotate-[7deg] bg-choice-b`} />
      <span className={`${box} rotate-[5deg] bg-choice-c`} />
      <span className={`${box} rotate-[-6deg] bg-choice-d`} />
    </span>
  );
}
