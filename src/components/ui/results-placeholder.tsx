import { CircleAlert, Wallet } from "lucide-react";

export function ResultsPlaceholder({
  message,
  invalid = false,
}: {
  message: string;
  invalid?: boolean;
}) {
  return (
    <div className="results-placeholder flex min-h-36 flex-col items-center justify-center gap-3 rounded-xl border border-border px-4 py-6 text-center lg:min-h-56">
      {invalid ? (
        <CircleAlert className="size-6 text-destructive" aria-hidden="true" />
      ) : (
        <span className="grid size-12 place-items-center rounded-xl border border-border bg-card text-primary shadow-sm">
          <Wallet className="size-5" aria-hidden="true" />
        </span>
      )}
      <p className="max-w-64 text-sm leading-relaxed text-muted-foreground">
        {message}
      </p>
    </div>
  );
}
