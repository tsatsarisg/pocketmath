import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/mplokaki")({
  component: MplokakiPage,
});

function MplokakiPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold tracking-tight">
        {"\u039C\u03C0\u03BB\u03BF\u03BA\u03AC\u03BA\u03B9"} Calculator
      </h1>
      <p className="text-muted-foreground">Coming soon.</p>
    </div>
  );
}
