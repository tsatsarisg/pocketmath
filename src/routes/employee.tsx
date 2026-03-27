import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/employee")({
  component: EmployeePage,
});

function EmployeePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold tracking-tight">
        Employee Calculator
      </h1>
      <p className="text-muted-foreground">Coming soon.</p>
    </div>
  );
}
