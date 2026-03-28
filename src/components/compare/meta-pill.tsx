import { cn } from "@/lib/utils";

export function MetaPill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-full text-[0.625rem] font-semibold uppercase tracking-wider",
      className,
    )}>
      {children}
    </span>
  );
}
