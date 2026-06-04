"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { WA } from "@/lib/whatsapp";
import Link from "next/link";

const HERO_IMAGES = [
  {
    src: "/images/photo-2024-04-19-14-57-43.jpg",
    alt: "Bridal Lehenga Styling — Sonal Studio Nagpur",
  },
  {
    src: "/images/photo-2025-01-13-10-39-06.jpg",
    alt: "Contemporary Party Wear Gown — Sonal Studio Nagpur",
  },
  {
    src: "/images/photo-2026-02-22-12-24-45.jpg",
    alt: "Handcrafted Pooja Thali — Sonal Studio Nagpur",
  },
  {
    src: "/images/photo-2024-01-25-15-47-05.jpg",
    alt: "Haldi Celebration Styling — Sonal Studio Nagpur",
  },
  {
    src: "/images/photo-2022-10-13-18-16-31.jpg",
    alt: "Bridal Blouse with Gold Embroidery — Sonal Studio Nagpur",
  },
];

export default function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % HERO_IMAGES.length);
    }, 5000); // 5 seconds per slide
    return () => clearInterval(timer);
  }, [currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
  };

  return (
    <section
      className="relative min-h-screen flex items-end overflow-hidden"
      aria-label="Hero"
    >
      {/* Background images with crossfade and Ken Burns effect */}
      <div className="absolute inset-0 overflow-hidden bg-[var(--color-wine)]">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <motion.div
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 5, ease: "easeOut" }}
              className="w-full h-full relative"
            >
              <Image
                src={HERO_IMAGES[currentIndex].src}
                alt={HERO_IMAGES[currentIndex].alt}
                fill
                priority
                className="object-cover object-center"
                sizes="100vw"
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
        {/* Gradient overlay — bottom heavy for text legibility */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[var(--color-wine)]/90 via-[var(--color-wine)]/45 to-[var(--color-wine)]/15 pointer-events-none" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-32 md:pb-28">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <motion.p
            className="text-xs font-semibold uppercase tracking-[0.3em] text-gold mb-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Nagpur, Maharashtra
          </motion.p>

          {/* Main heading */}
          <motion.h1
            className="font-display text-5xl sm:text-6xl md:text-7xl text-cream leading-tight mb-4"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            Sonal Studio
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="font-[var(--font-editorial)] italic text-xl sm:text-2xl text-cream/80 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            Celebration Styling & Wedding Consultation
          </motion.p>

          {/* Description */}
          <motion.p
            className="text-base sm:text-lg text-cream/65 leading-relaxed mb-8 max-w-lg"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            Custom fashion, handcrafted wedding essentials, festive decor and
            thoughtful guidance for weddings, festivals and family celebrations.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <WhatsAppButton href={WA.general} label="Inquire on WhatsApp" size="lg" />
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-btn border-2 border-cream/40 text-cream text-lg font-semibold hover:border-cream/70 hover:bg-cream/10 transition-all duration-200"
            >
              Explore Our Work
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        <span className="text-xs text-cream/40 tracking-widest uppercase">Scroll</span>
        <motion.div
          className="w-px h-8 bg-gradient-to-b from-cream/40 to-transparent"
          animate={{ scaleY: [1, 0.4, 1] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Carousel Controls */}
      <div className="absolute bottom-6 right-4 sm:right-6 lg:right-8 z-20 flex items-center gap-4 bg-[var(--color-wine)]/25 backdrop-blur-md px-4 py-2.5 rounded-full border border-cream/10 select-none">
        {/* Pagination Indicators */}
        <div className="flex items-center gap-2">
          {HERO_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="group relative py-1"
              aria-label={`Go to slide ${index + 1}`}
            >
              <div className="h-[3px] w-6 rounded-full bg-cream/25 overflow-hidden transition-colors group-hover:bg-cream/40">
                {index === currentIndex && (
                  <motion.div
                    key={currentIndex}
                    className="h-full bg-gold"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 5, ease: "linear" }}
                  />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="w-[1px] h-4 bg-cream/15" />

        {/* Arrow Navigation */}
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrev}
            className="w-7 h-7 rounded-full text-cream/70 hover:text-cream hover:bg-cream/10 flex items-center justify-center transition-all duration-200 cursor-pointer"
            aria-label="Previous slide"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path
                fillRule="evenodd"
                d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="w-7 h-7 rounded-full text-cream/70 hover:text-cream hover:bg-cream/10 flex items-center justify-center transition-all duration-200 cursor-pointer"
            aria-label="Next slide"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

