export default function DiamondDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
      <div className="h-px w-16 bg-gold/40" />
      <div
        className="w-2 h-2 rotate-45 bg-gold"
        style={{ borderRadius: "2px" }}
      />
      <div className="h-px w-16 bg-gold/40" />
    </div>
  );
}
