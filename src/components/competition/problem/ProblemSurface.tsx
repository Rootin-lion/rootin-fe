import type { Ref } from "react";

export default function ProblemSurface({
  children,
  compact = false,
  className = "",
  surfaceRef,
}: {
  children: React.ReactNode;
  compact?: boolean;
  className?: string;
  surfaceRef?: Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={surfaceRef}
      className={`w-full rounded-lg bg-white ${compact ? "min-w-0 p-3 md:min-h-33.5 md:px-6 md:py-7" : "min-h-33.5 min-w-53.5 px-6 py-7"} ${className}`}
    >
      {children}
    </div>
  );
}
