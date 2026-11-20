import type { ReactNode } from "react";

export function CalculatorHeading({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 pb-5 sm:pb-7">
      <div className="max-w-2xl space-y-2">
        <h1 className="text-[clamp(1.875rem,6vw,3.5rem)] leading-[1.04] font-bold tracking-[-0.045em] text-balance">
          {title}
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}
