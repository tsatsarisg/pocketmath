import { Input } from "@/components/ui/input";

export function EuroInput({
  id,
  value,
  onChange,
  placeholder,
  ...props
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string | undefined;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string | undefined;
}) {
  return (
    <div className="relative flex min-w-0 items-center">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-0 flex h-full w-10 items-center justify-center text-sm text-muted-foreground"
      >
        €
      </span>
      <Input
        {...props}
        id={id}
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        placeholder={placeholder ?? "0"}
        className="pl-10"
      />
    </div>
  );
}
