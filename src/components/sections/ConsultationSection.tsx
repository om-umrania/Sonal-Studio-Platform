"use client";

import Image from "next/image";
import MotionReveal from "@/components/ui/MotionReveal";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import DiamondDivider from "@/components/ui/DiamondDivider";
import { WA } from "@/lib/whatsapp";

const DETAILS = [
  "What should be prepared for each ceremony?",
  "What should the bride and family wear?",
  "Which ritual items are needed?",
  "How should the setup look coordinated?",
  "What can be handmade or customised?",
];

export default function ConsultationSection() {
  return (
    <section className="py-20 md:py-28 bg-ivory" aria-labelledby="consultation-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Image side */}
          <MotionReveal direction="up">
            <div className="relative rounded-hero overflow-hidden aspect-[4/5]">
              <Image
                src="/images/photo-2025-01-13-10-39-06.jpg"
                alt="Wedding consultation and celebration styling guidance at Sonal Studio"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Floating info card */}
              <div className="absolute bottom-6 left-6 right-6 bg-cream/90 backdrop-blur-sm rounded-card p-5 shadow-card">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-1">
                  Creative guidance
                </p>
                <p className="font-display text-lg text-maroon">
                  Thoughtful planning for every ceremony
                </p>
              </div>
            </div>
          </MotionReveal>

          {/* Text side */}
          <div>
            <MotionReveal delay={0.1}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-4">
                Wedding & Celebration Consultation
              </p>
              <h2
                id="consultation-heading"
                className="font-display text-3xl md:text-4xl lg:text-5xl text-maroon leading-tight mb-5"
              >
                Thoughtful guidance for wedding and celebration details
              </h2>
              <p className="text-muted leading-relaxed mb-6">
                Families often need help with the small but important choices that
                make a celebration feel personal and beautiful. Sonal Studio helps
                you think through:
              </p>
            </MotionReveal>

            <ul className="flex flex-col gap-3 mb-8" aria-label="Consultation areas">
              {DETAILS.map((detail, i) => (
                <MotionReveal key={detail} delay={0.15 + i * 0.07}>
                  <li className="flex items-start gap-3 text-sm text-ink">
                    <span className="mt-1 w-4 h-4 rounded-full border border-gold flex items-center justify-center shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                    </span>
                    {detail}
                  </li>
                </MotionReveal>
              ))}
            </ul>

            <MotionReveal delay={0.5}>
              <p className="text-xs text-muted/70 italic mb-6 border-l-2 border-gold/30 pl-4">
                This is creative consultation and styling guidance, not full event
                management unless discussed separately.
              </p>
              <DiamondDivider className="justify-start mb-6" />
              <WhatsAppButton href={WA.consultation} label="Discuss your celebration" size="lg" />
            </MotionReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
