import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import DiamondDivider from "@/components/ui/DiamondDivider";
import MotionReveal from "@/components/ui/MotionReveal";
import { SERVICES } from "@/data/services";
import { WA } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Celebration styling, wedding consultation, custom fashion and handcrafted wedding essentials from Sonal Studio in Nagpur.",
};

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Page hero */}
        <section className="pt-32 pb-16 bg-cream">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold mb-4">
              What we offer
            </p>
            <h1 className="font-display text-5xl md:text-6xl text-maroon leading-tight mb-5">
              Services
            </h1>
            <DiamondDivider className="mb-6" />
            <p className="text-lg text-muted leading-relaxed">
              From custom outfits to celebration styling, Sonal Studio helps families
              plan and create beautiful details for weddings, festivals and rituals.
            </p>
          </div>
        </section>

        {/* Services list */}
        <section className="py-20 bg-ivory">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-24">
            {SERVICES.map((service, i) => (
              <MotionReveal key={service.id}>
                <article
                  id={service.id}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start scroll-mt-24"
                >
                  {/* Image — alternates sides */}
                  <div className={`${i % 2 === 1 ? "lg:order-2" : ""}`}>
                    <div className="relative aspect-[4/3] rounded-hero overflow-hidden">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`${i % 2 === 1 ? "lg:order-1" : ""} flex flex-col gap-5`}>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-3">
                        Service 0{i + 1}
                      </p>
                      <h2 className="font-display text-4xl md:text-5xl text-maroon leading-tight mb-4">
                        {service.title}
                      </h2>
                      <p className="text-muted leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    {service.boundary && (
                      <p className="text-sm text-muted/70 italic border-l-2 border-gold/30 pl-4">
                        {service.boundary}
                      </p>
                    )}

                    {/* Includes */}
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-4">
                        What's included
                      </h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5" role="list">
                        {service.includes.map((item) => (
                          <li key={item} className="flex items-start gap-2.5 text-sm text-ink">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Occasions */}
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-3">
                        Suitable occasions
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {service.occasions.map((occ) => (
                          <span
                            key={occ}
                            className="px-3 py-1 rounded-tag text-xs font-medium bg-blush/40 text-maroon border border-maroon/10"
                          >
                            {occ}
                          </span>
                        ))}
                      </div>
                    </div>

                    <WhatsAppButton
                      href={service.whatsappMessage}
                      label={`Discuss ${service.shortTitle} on WhatsApp`}
                      size="md"
                      className="self-start mt-2"
                    />
                  </div>
                </article>

                {i < SERVICES.length - 1 && (
                  <DiamondDivider className="mt-16" />
                )}
              </MotionReveal>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-cream">
          <div className="max-w-xl mx-auto px-4 text-center">
            <h2 className="font-display text-3xl md:text-4xl text-maroon mb-4">
              Not sure which service fits your occasion?
            </h2>
            <p className="text-muted mb-8">
              Just reach out on WhatsApp and we'll guide you from there.
            </p>
            <WhatsAppButton href={WA.general} label="Start a conversation" size="lg" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
