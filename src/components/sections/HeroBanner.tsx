"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { WA } from "@/lib/whatsapp";
import Link from "next/link";

const HERO_IMAGE = "/images/photo-2024-04-19-14-57-43.jpg";
// Phase 5: swap HERO_IMAGE to the curated hero photo once available

export default function HeroBanner() {
  return (
    <section
      className="relative min-h-screen flex items-end overflow-hidden"
      aria-label="Hero"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={HERO_IMAGE}
          alt="Sonal Studio — celebration styling and custom fashion in Nagpur"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Gradient overlay — bottom heavy for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-wine)]/90 via-[var(--color-wine)]/40 to-[var(--color-wine)]/10" />
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
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
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
    </section>
  );
}
