type Props = {
  label: string;
  variant?: "gold" | "maroon" | "muted" | "rani";
  className?: string;
};

export default function Badge({ label, variant = "gold", className = "" }: Props) {
  const variantClass = {
    gold: "bg-gold/15 text-gold border border-gold/30",
    maroon: "bg-maroon/10 text-maroon border border-maroon/20",
    muted: "bg-muted/10 text-muted border border-muted/20",
    rani: "bg-[var(--color-rani)]/10 text-rani border border-[var(--color-rani)]/20",
  }[variant];

  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-tag text-xs font-semibold uppercase tracking-wider ${variantClass} ${className}`}
    >
      {label}
    </span>
  );
}
