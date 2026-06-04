import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import DiamondDivider from "@/components/ui/DiamondDivider";
import MotionReveal from "@/components/ui/MotionReveal";
import { WA } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Sonal — the creative behind Sonal Studio, a Nagpur-based celebration styling and custom fashion studio rooted in Indian tradition.",
};

const WORK_AREAS = [
  "Custom blouses and bridal fashion",
  "Lehengas, gowns, anarkalis, and sharara sets",
  "Pooja thalis and kalash decor",
  "Wedding and ritual essentials",
  "Festive home decor",
  "Celebration styling and wedding consultation",
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 bg-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Image */}
              <MotionReveal>
                <div className="relative aspect-[3/4] max-w-md mx-auto lg:mx-0 rounded-hero overflow-hidden">
                  <Image
                    src="/images/photo-2026-04-28-22-49-09.jpg"
                    alt="Sonal — creative behind Sonal Studio, Nagpur"
                    fill
                    priority
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 80vw, 480px"
                  />
                </div>
              </MotionReveal>

              {/* Intro */}
              <div>
                <MotionReveal delay={0.15}>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold mb-4">
                    Meet Sonal
                  </p>
                  <h1 className="font-display text-5xl md:text-6xl text-maroon leading-tight mb-6">
                    A studio built on celebration
                  </h1>
                  <DiamondDivider className="justify-start mb-6" />
                  <p className="text-muted leading-relaxed mb-4">
                    Sonal Studio is a Nagpur-based creative studio founded on a love for
                    handcrafted fashion, Indian rituals, and the small beautiful details that
                    make family celebrations meaningful.
                  </p>
                  <p className="text-muted leading-relaxed mb-8">
                    What started as crafting custom outfits and pooja thalis for family and
                    friends has grown into a full creative studio offering custom fashion,
                    festive decor, handmade wedding essentials, and celebration styling
                    guidance for families across Nagpur.
                  </p>
                  <WhatsAppButton href={WA.general} label="Say hello on WhatsApp" size="md" />
                </MotionReveal>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section className="py-20 bg-ivory" aria-labelledby="philosophy-heading">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <MotionReveal>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold mb-4">
                Creative philosophy
              </p>
              <h2
                id="philosophy-heading"
                className="font-display text-4xl md:text-5xl text-maroon leading-tight mb-6"
              >
                Celebrations deserve personal detail
              </h2>
              <DiamondDivider className="mb-6" />
              <p className="text-muted text-lg leading-relaxed mb-4">
                Every family celebration — whether a big wedding or a small diwali puja — has
                details that deserve care. The right outfit. The right ritual items. The right
                colours and handmade touches that make it feel uniquely yours.
              </p>
              <p className="text-muted leading-relaxed">
                Sonal Studio exists to help families think through those details and create
                them with tradition, warmth, and a personal touch.
              </p>
            </MotionReveal>
          </div>
        </section>

        {/* What she creates */}
        <section className="py-20 bg-cream" aria-labelledby="work-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <MotionReveal>
              <div className="text-center mb-12">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold mb-3">
                  Areas of work
                </p>
                <h2
                  id="work-heading"
                  className="font-display text-4xl md:text-5xl text-maroon"
                >
                  What Sonal Studio creates
                </h2>
              </div>
            </MotionReveal>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {WORK_AREAS.map((area, i) => (
                <MotionReveal key={area} delay={0.07 * i}>
                  <div className="bg-ivory rounded-card p-5 text-center" style={{ boxShadow: "var(--shadow-soft)" }}>
                    <div className="w-8 h-8 rounded-full border border-gold/50 flex items-center justify-center mx-auto mb-3">
                      <span className="w-2 h-2 rounded-full bg-gold" />
                    </div>
                    <p className="text-sm font-medium text-ink leading-snug">
                      {area}
                    </p>
                  </div>
                </MotionReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Photo collage */}
        <section className="py-20 bg-ivory">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <MotionReveal>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { src: "/images/photo-2024-04-19-14-57-43.jpg", alt: "Celebration styling by Sonal Studio" },
                  { src: "/images/photo-2022-10-13-18-16-31.jpg", alt: "Custom blouse crafted by Sonal Studio" },
                  { src: "/images/photo-2026-02-22-12-24-45.jpg", alt: "Handcrafted pooja thali" },
                  { src: "/images/photo-2024-12-28-15-55-11.jpg", alt: "Festive outfit by Sonal Studio" },
                ].map((img, i) => (
                  <MotionReveal key={img.src} delay={0.08 * i}>
                    <div className={`relative rounded-card overflow-hidden ${i % 2 === 1 ? "mt-6" : ""}`}>
                      <div className="aspect-[3/4]">
                        <Image
                          src={img.src}
                          alt={img.alt}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      </div>
                    </div>
                  </MotionReveal>
                ))}
              </div>
            </MotionReveal>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-cream">
          <div className="max-w-xl mx-auto px-4 text-center">
            <MotionReveal>
              <h2 className="font-display text-3xl md:text-4xl text-maroon mb-4">
                Let's create something beautiful together
              </h2>
              <p className="text-muted mb-8">
                Whether you need a custom outfit, wedding essentials, or celebration styling
                guidance — start a conversation on WhatsApp.
              </p>
              <WhatsAppButton href={WA.general} label="Connect on WhatsApp" size="lg" />
            </MotionReveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
