export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">{heading}</h2>
      <div className="text-[0.9375rem] leading-relaxed text-muted-foreground space-y-2">
        {children}
      </div>
    </section>
  );
}
