import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GalleryClient from "@/components/gallery/GalleryClient";
import DiamondDivider from "@/components/ui/DiamondDivider";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse Sonal Studio's gallery — custom fashion, blouses, lehengas, pooja thalis, kalash decor, and festive details crafted in Nagpur.",
};

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Page hero */}
        <section className="pt-32 pb-10 bg-cream">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold mb-4">
              Our work
            </p>
            <h1 className="font-display text-5xl md:text-6xl text-maroon leading-tight mb-4">
              Gallery
            </h1>
            <DiamondDivider className="mb-5" />
            <p className="text-muted leading-relaxed">
              Custom fashion, handcrafted essentials, and celebration styling — created
              with care for families across Nagpur.
            </p>
          </div>
        </section>

        <GalleryClient />
      </main>
      <Footer />
    </>
  );
}
