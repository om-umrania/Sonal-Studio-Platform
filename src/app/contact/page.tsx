import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DiamondDivider from "@/components/ui/DiamondDivider";
import MotionReveal from "@/components/ui/MotionReveal";
import { WA } from "@/lib/whatsapp";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Sonal Studio on WhatsApp or Instagram. Based in Nagpur, Maharashtra.",
};

const INQUIRY_OPTIONS = [
  {
    label: "Custom outfit inquiry",
    description: "Blouses, lehengas, gowns, anarkalis, and more.",
    href: WA.customFashion,
    icon: "✂",
  },
  {
    label: "Wedding essentials inquiry",
    description: "Pooja thalis, kalash decor, ritual items, and kits.",
    href: WA.weddingEssentials,
    icon: "✦",
  },
  {
    label: "Celebration styling & consultation",
    description: "Guidance for weddings, festivals, and family functions.",
    href: WA.consultation,
    icon: "✦",
  },
  {
    label: "General inquiry",
    description: "Not sure? Just say hello and we'll guide you from there.",
    href: WA.general,
    icon: "✉",
  },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 bg-cream">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold mb-4">
              Get in touch
            </p>
            <h1 className="font-display text-5xl md:text-6xl text-maroon leading-tight mb-4">
              Let's connect
            </h1>
            <DiamondDivider className="mb-5" />
            <p className="text-muted leading-relaxed">
              The easiest way to reach Sonal Studio is through WhatsApp. Choose what
              fits your inquiry and start a conversation.
            </p>
          </div>
        </section>

        {/* WhatsApp options */}
        <section className="py-16 bg-ivory" aria-labelledby="contact-options-heading">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 id="contact-options-heading" className="sr-only">Contact options</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {INQUIRY_OPTIONS.map((opt, i) => (
                <MotionReveal key={opt.label} delay={0.08 * i}>
                  <a
                    href={opt.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col gap-3 p-6 rounded-card bg-cream border border-gold/15 hover:border-gold/40 hover:shadow-card transition-all duration-200"
                    style={{ boxShadow: "var(--shadow-soft)" }}
                  >
                    <span className="text-2xl" aria-hidden="true">{opt.icon}</span>
                    <div>
                      <h3 className="font-semibold text-maroon mb-1 group-hover:underline">
                        {opt.label}
                      </h3>
                      <p className="text-sm text-muted">{opt.description}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-whatsapp mt-auto">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Open in WhatsApp →
                    </div>
                  </a>
                </MotionReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Other info */}
        <section className="py-16 bg-cream">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <MotionReveal>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                {/* Instagram */}
                <a
                  href={SITE.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-3 p-6 rounded-card bg-ivory hover:shadow-card transition-all duration-200 group"
                  style={{ boxShadow: "var(--shadow-soft)" }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-maroon" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold mb-1">
                      Instagram
                    </p>
                    <p className="text-sm font-medium text-maroon group-hover:underline">
                      {SITE.instagramHandle}
                    </p>
                  </div>
                </a>

                {/* Phone */}
                <a
                  href={WA.general}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-3 p-6 rounded-card bg-ivory hover:shadow-card transition-all duration-200"
                  style={{ boxShadow: "var(--shadow-soft)" }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-whatsapp" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold mb-1">
                      WhatsApp
                    </p>
                    <p className="text-sm font-medium text-maroon">{SITE.phone}</p>
                  </div>
                </a>

                {/* Location */}
                <div className="flex flex-col items-center gap-3 p-6 rounded-card bg-ivory" style={{ boxShadow: "var(--shadow-soft)" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 text-maroon" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold mb-1">
                      Location
                    </p>
                    <p className="text-sm font-medium text-maroon">{SITE.location}</p>
                  </div>
                </div>
              </div>
            </MotionReveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
