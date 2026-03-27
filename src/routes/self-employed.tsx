import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/self-employed")({
  component: SelfEmployedPage,
});

function SelfEmployedPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold tracking-tight">
        Self-Employed Calculator
      </h1>
      <p className="text-muted-foreground">Coming soon.</p>
    </div>
  );
}
