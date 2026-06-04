"use client";

import MotionReveal from "@/components/ui/MotionReveal";
import SectionHeader from "@/components/ui/SectionHeader";

const STEPS = [
  {
    number: "01",
    title: "Start a conversation",
    description:
      "Reach out on WhatsApp or Instagram. Share your occasion, requirements, and any inspiration you have in mind.",
  },
  {
    number: "02",
    title: "Discuss and plan",
    description:
      "We discuss your vision, occasion, outfit or product requirements, timelines, and any customisation details.",
  },
  {
    number: "03",
    title: "Design and create",
    description:
      "Your outfit, ritual item, or celebration detail is crafted with care and attention to every detail.",
  },
  {
    number: "04",
    title: "Celebrate beautifully",
    description:
      "Receive your order or attend your final styling session in time for your special occasion.",
  },
];

export default function ProcessSection() {
  return (
    <section className="py-20 md:py-28 bg-cream" aria-labelledby="process-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MotionReveal>
          <SectionHeader
            eyebrow="How it works"
            title="From first message to celebration"
            id="process-heading"
          />
        </MotionReveal>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <MotionReveal key={step.number} delay={0.1 + i * 0.1}>
              <div className="relative bg-ivory rounded-card p-7 h-full" style={{ boxShadow: "var(--shadow-soft)" }}>
                {/* Number */}
                <div className="w-10 h-10 rounded-full border-2 border-gold flex items-center justify-center mb-5">
                  <span className="text-sm font-bold text-gold">{step.number}</span>
                </div>
                {/* Connector line (desktop) */}
                {i < STEPS.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-11 left-full w-6 h-px bg-gold/30 -translate-x-3"
                    aria-hidden="true"
                  />
                )}
                <h3 className="font-semibold text-maroon mb-3">{step.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{step.description}</p>
              </div>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
