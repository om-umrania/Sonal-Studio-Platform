import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DiamondDivider from "@/components/ui/DiamondDivider";
import MotionReveal from "@/components/ui/MotionReveal";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { WA } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Return & Exchange Policy",
  description:
    "Return and exchange policies for custom fashion and handcrafted essentials at Sonal Studio Nagpur.",
};

export default function ReturnPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="bg-ivory min-h-screen">
        {/* Page Hero */}
        <section className="pt-32 pb-12 bg-cream">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold mb-3">
              Customer care
            </p>
            <h1 className="font-display text-4xl sm:text-5xl text-maroon leading-tight mb-4">
              Return & Exchange Policy
            </h1>
            <DiamondDivider className="mb-5" />
            <p className="text-muted leading-relaxed max-w-xl mx-auto">
              At Sonal Studio, every piece is custom-made or handcrafted to order.
              We take pride in our craftsmanship and want to ensure a clear, fair policy.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 bg-ivory">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-10">
              
              {/* 1. Custom and Made-to-Order Nature */}
              <MotionReveal delay={0.05}>
                <div className="bg-cream rounded-card p-8 border border-gold/10" style={{ boxShadow: "var(--shadow-soft)" }}>
                  <h2 className="font-display text-2xl text-maroon mb-4">
                    1. Custom & Made-to-Order Policy
                  </h2>
                  <p className="text-sm text-ink leading-relaxed">
                    Sonal Studio creations — including custom outfits, bridal blouses, handcrafted pooja thalis, decorated kalash sets, and festive decor — are individually designed and custom-crafted to order. Due to the bespoke nature of these products, we do not accept returns or offer refunds for change-of-mind.
                  </p>
                </div>
              </MotionReveal>

              {/* 2. Defective or Damaged Items */}
              <MotionReveal delay={0.1}>
                <div className="bg-cream rounded-card p-8 border border-gold/10" style={{ boxShadow: "var(--shadow-soft)" }}>
                  <h2 className="font-display text-2xl text-maroon mb-4">
                    2. Defective or Damaged Products
                  </h2>
                  <p className="text-sm text-ink leading-relaxed mb-4">
                    We accept returns and provide replacements **only for defective or damaged products** upon receipt.
                  </p>
                  <ul className="list-disc pl-5 text-sm text-muted space-y-2">
                    <li>
                      <strong>Reporting Window:</strong> You must notify us of any damage or defect within <strong>48 hours</strong> of receiving the delivery.
                    </li>
                    <li>
                      <strong>Evidence:</strong> Please share clear photos or an unboxing video showing the defect via WhatsApp.
                    </li>
                    <li>
                      <strong>Resolution:</strong> Upon verification, we will arrange for a replacement to be custom-made and shipped to you at no additional cost.
                    </li>
                  </ul>
                </div>
              </MotionReveal>

              {/* 3. Exchange Policy */}
              <MotionReveal delay={0.15}>
                <div className="bg-cream rounded-card p-8 border border-gold/10" style={{ boxShadow: "var(--shadow-soft)" }}>
                  <h2 className="font-display text-2xl text-maroon mb-4">
                    3. Exchanges & Alterations
                  </h2>
                  <p className="text-sm text-ink leading-relaxed mb-4">
                    For custom garments (such as blouses, lehengas, and suits), we accept requests for exchanges and alterations to ensure the perfect fit:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-muted space-y-2">
                    <li>
                      <strong>Fit Adjustments:</strong> If a custom garment requires sizing alterations, contact us within <strong>5 days</strong> of delivery.
                    </li>
                    <li>
                      <strong>Alteration Support:</strong> Alterations are conducted at our studio in Nagpur. The garment must be unworn, unwashed, and in its original condition.
                    </li>
                    <li>
                      <strong>Feasibility:</strong> Exchanges for an entirely different design are subject to design feasibility and material availability.
                    </li>
                  </ul>
                </div>
              </MotionReveal>

              {/* 4. How to Request a Return or Exchange */}
              <MotionReveal delay={0.2}>
                <div className="bg-cream rounded-card p-8 border border-gold/10 text-center" style={{ boxShadow: "var(--shadow-soft)" }}>
                  <h2 className="font-display text-2xl text-maroon mb-4">
                    How to Initiate a Request
                  </h2>
                  <p className="text-sm text-ink leading-relaxed mb-6 max-w-lg mx-auto">
                    To start a return for a defective item or request a sizing alteration, click below to message us directly on WhatsApp. Please include your order details, date of receipt, and photos/videos if applicable.
                  </p>
                  <div className="inline-block">
                    <WhatsAppButton
                      href={WA.general}
                      label="Contact Support on WhatsApp"
                      size="md"
                    />
                  </div>
                </div>
              </MotionReveal>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
