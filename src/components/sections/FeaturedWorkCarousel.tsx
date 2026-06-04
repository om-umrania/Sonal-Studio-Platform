"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { GALLERY_ITEMS } from "@/data/gallery";
import Badge from "@/components/ui/Badge";
import SectionHeader from "@/components/ui/SectionHeader";
import MotionReveal from "@/components/ui/MotionReveal";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

const FEATURED = GALLERY_ITEMS.slice(0, 8);

function WorkCard({ item }: { item: (typeof GALLERY_ITEMS)[0] }) {
  const [quickView, setQuickView] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <motion.div
        className="relative rounded-card overflow-hidden cursor-pointer bg-cream shrink-0 w-64 md:w-72"
        style={{ boxShadow: "var(--shadow-soft)" }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onClick={() => setQuickView(true)}
        whileTap={{ scale: 0.98 }}
      >
        {/* Image */}
        <div className="relative h-80 overflow-hidden">
          <motion.div
            className="w-full h-full"
            animate={{ scale: hovered ? 1.06 : 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
              sizes="288px"
            />
          </motion.div>
          {/* Category chip */}
          <div className="absolute top-3 left-3">
            <Badge label={item.category} />
          </div>
          {/* Hover overlay with quick-view cue */}
          <motion.div
            className="absolute inset-0 bg-wine/40 flex items-center justify-center"
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <span className="bg-cream/90 text-maroon text-xs font-semibold px-4 py-2 rounded-pill">
              Quick view
            </span>
          </motion.div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-ink text-sm leading-tight mb-1">
            {item.title}
          </h3>
          <p className="text-xs text-muted">
            {item.occasion.slice(0, 2).join(" · ")}
          </p>
        </div>
      </motion.div>

      {/* Mobile / desktop quick view */}
      <AnimatePresence>
        {quickView && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuickView(false)}
              aria-hidden="true"
            />
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 bg-cream rounded-t-hero p-6 pb-10 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg md:rounded-card md:shadow-luxury"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              role="dialog"
              aria-modal="true"
              aria-label={item.title}
            >
              {/* Drag handle (mobile) */}
              <div className="w-10 h-1 bg-muted/20 rounded-pill mx-auto mb-5 md:hidden" />

              <div className="flex gap-5">
                <div className="relative w-32 h-40 rounded-card overflow-hidden shrink-0">
                  <Image src={item.image} alt={item.title} fill className="object-cover" sizes="128px" />
                </div>
                <div className="flex-1">
                  <Badge label={item.category} className="mb-2" />
                  <h3 className="font-display text-xl text-maroon leading-tight mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed mb-4">
                    {item.description}
                  </p>
                  <p className="text-xs text-muted/70 mb-4">
                    {item.occasion.join(" · ")}
                  </p>
                  <WhatsAppButton href={item.whatsappMessage} label="Inquire on WhatsApp" size="sm" />
                </div>
              </div>

              <button
                onClick={() => setQuickView(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-muted/10 text-muted hover:bg-muted/20 transition-colors"
                aria-label="Close quick view"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default function FeaturedWorkCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!trackRef.current) return;
    const amount = 300;
    trackRef.current.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
  };

  return (
    <section className="py-20 md:py-28 bg-cream overflow-hidden" aria-labelledby="featured-work-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MotionReveal>
          <div className="flex items-end justify-between mb-12">
            <SectionHeader
              eyebrow="Featured work"
              title="Crafted with care"
              subtitle="A glimpse of the outfits, essentials and styling work created at Sonal Studio."
              align="left"
              id="featured-work-heading"
            />
            {/* Desktop carousel controls */}
            <div className="hidden md:flex items-center gap-3 shrink-0 mb-1">
              <button
                onClick={() => scroll("left")}
                className="w-11 h-11 rounded-full border-2 border-gold/40 text-maroon flex items-center justify-center hover:bg-maroon hover:text-cream hover:border-transparent transition-all duration-200"
                aria-label="Scroll left"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-11 h-11 rounded-full border-2 border-gold/40 text-maroon flex items-center justify-center hover:bg-maroon hover:text-cream hover:border-transparent transition-all duration-200"
                aria-label="Scroll right"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </MotionReveal>

        {/* Carousel track */}
        <div
          ref={trackRef}
          className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {FEATURED.map((item) => (
            <div key={item.id} className="snap-start">
              <WorkCard item={item} />
            </div>
          ))}
        </div>

        {/* Mobile swipe hint */}
        <p className="md:hidden text-xs text-muted/50 text-center mt-4">
          Swipe to explore
        </p>
      </div>
    </section>
  );
}
