"use client";

import MotionReveal from "@/components/ui/MotionReveal";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import DiamondDivider from "@/components/ui/DiamondDivider";
import { WA } from "@/lib/whatsapp";

export default function FinalCTA() {
  return (
    <section
      className="py-24 md:py-32 bg-wine relative overflow-hidden"
      aria-labelledby="final-cta-heading"
    >
      {/* Decorative background texture */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, var(--color-gold) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <MotionReveal>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold mb-6">
            Let's connect
          </p>
          <h2
            id="final-cta-heading"
            className="font-display text-4xl md:text-5xl text-cream leading-tight mb-5"
          >
            Planning a wedding, festival or family celebration?
          </h2>
          <DiamondDivider className="mb-6" />
          <p className="text-cream/65 text-lg leading-relaxed mb-10">
            Let's discuss the outfits, rituals, decor and details that can make
            it feel personal and beautiful.
          </p>
          <WhatsAppButton
            href={WA.general}
            label="Message Sonal Studio on WhatsApp"
            size="lg"
          />
        </MotionReveal>
      </div>
    </section>
  );
}
