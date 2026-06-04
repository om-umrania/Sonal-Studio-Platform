"use client";

import Image from "next/image";
import Link from "next/link";
import MotionReveal from "@/components/ui/MotionReveal";
import DiamondDivider from "@/components/ui/DiamondDivider";

export default function AboutPreview() {
  return (
    <section className="py-20 md:py-28 bg-ivory" aria-labelledby="about-preview-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Text */}
          <div className="order-2 lg:order-1">
            <MotionReveal>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-4">
                About Sonal Studio
              </p>
              <h2
                id="about-preview-heading"
                className="font-display text-3xl md:text-4xl lg:text-5xl text-maroon leading-tight mb-6"
              >
                A personal studio rooted in celebration
              </h2>
              <p className="text-muted leading-relaxed mb-4">
                Sonal Studio is a family-led creative studio from Nagpur. What started as a
                love for handcrafted fashion and ritual details has grown into a full
                celebration studio — offering custom outfits, wedding essentials, festive
                decor, and styling guidance for families across Nagpur.
              </p>
              <p className="text-muted leading-relaxed mb-8">
                Every piece is made with care, tradition, and a personal touch — because
                celebrations deserve more than generic choices.
              </p>
            </MotionReveal>

            <MotionReveal delay={0.2}>
              <DiamondDivider className="justify-start mb-8" />
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-maroon font-semibold hover:gap-4 transition-all duration-200"
              >
                Meet Sonal
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </Link>
            </MotionReveal>
          </div>

          {/* Images */}
          <MotionReveal delay={0.15} className="order-1 lg:order-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-[3/4] rounded-card overflow-hidden">
                <Image
                  src="/images/photo-2026-04-28-22-49-09.jpg"
                  alt="Sonal Studio — handcrafted celebration details"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="flex flex-col gap-4 pt-8">
                <div className="relative aspect-square rounded-card overflow-hidden">
                  <Image
                    src="/images/photo-2024-12-28-15-55-36.jpg"
                    alt="Custom fashion by Sonal Studio"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="relative aspect-square rounded-card overflow-hidden">
                  <Image
                    src="/images/photo-2022-05-11-21-46-17.jpg"
                    alt="Wedding essentials handcrafted by Sonal Studio"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </div>
              </div>
            </div>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}
