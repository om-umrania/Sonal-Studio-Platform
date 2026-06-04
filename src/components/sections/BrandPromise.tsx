"use client";

import MotionReveal from "@/components/ui/MotionReveal";
import DiamondDivider from "@/components/ui/DiamondDivider";

const TRUST_POINTS = [
  { icon: "✦", label: "Handmade with care" },
  { icon: "✦", label: "Custom to every occasion" },
  { icon: "✦", label: "Traditional yet stylish" },
  { icon: "✦", label: "Nagpur-based personal studio" },
];

export default function BrandPromise() {
  return (
    <section className="bg-cream py-14 md:py-16" aria-label="Brand promise">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MotionReveal>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-gold mb-3">
            For weddings · festivals · poojas · family celebrations
          </p>
          <p className="text-center text-lg md:text-xl font-[var(--font-editorial)] italic text-muted max-w-2xl mx-auto">
            Handcrafted details, outfit guidance and celebration styling rooted in Indian tradition.
          </p>
        </MotionReveal>

        <MotionReveal delay={0.15}>
          <DiamondDivider className="my-10" />
        </MotionReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {TRUST_POINTS.map((point, i) => (
            <MotionReveal key={point.label} delay={0.1 + i * 0.08}>
              <div className="flex flex-col items-center text-center gap-2">
                <span
                  className="text-lg text-gold"
                  aria-hidden="true"
                >
                  {point.icon}
                </span>
                <p className="text-sm font-medium text-ink">
                  {point.label}
                </p>
              </div>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
