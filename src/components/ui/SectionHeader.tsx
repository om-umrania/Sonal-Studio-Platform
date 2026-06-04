type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  id?: string;
};

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className = "",
  id,
}: Props) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`max-w-2xl ${alignClass} ${className}`}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-3">
          {eyebrow}
        </p>
      )}
      <h2 id={id} className="font-display text-3xl md:text-4xl lg:text-5xl text-maroon leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base md:text-lg text-muted leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
