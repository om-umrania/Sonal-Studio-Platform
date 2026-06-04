"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { SERVICES } from "@/data/services";
import SectionHeader from "@/components/ui/SectionHeader";
import MotionReveal from "@/components/ui/MotionReveal";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

function ServiceCard({ service, delay }: { service: (typeof SERVICES)[0]; delay: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-6, 6]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <MotionReveal delay={delay} className="h-full">
      <motion.div
        ref={cardRef}
        className="relative h-full rounded-card overflow-hidden cursor-pointer bg-cream"
        style={{
          boxShadow: hovered
            ? "var(--shadow-card)"
            : "var(--shadow-soft)",
          rotateX,
          rotateY,
          transformPerspective: 800,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        animate={{ y: hovered ? -8 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          <motion.div
            className="relative w-full h-full"
            animate={{ scale: hovered ? 1.06 : 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={service.image}
              alt={service.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          </motion.div>
          {/* Gold border glow on hover */}
          <motion.div
            className="absolute inset-0 border-2 border-gold rounded-t-card pointer-events-none"
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.25 }}
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-2">
            Service
          </p>
          <h3 className="font-display text-2xl text-maroon mb-3 leading-tight">
            {service.title}
          </h3>
          <p className="text-sm text-muted leading-relaxed mb-5 line-clamp-3">
            {service.shortDescription}
          </p>

          {service.boundary && (
            <p className="text-xs text-muted/70 italic mb-4 border-l-2 border-gold/30 pl-3">
              {service.boundary}
            </p>
          )}

          {/* CTA row */}
          <div className="flex items-center justify-between">
            <Link
              href={`/services#${service.id}`}
              className="text-sm font-semibold text-maroon flex items-center gap-1 hover:gap-2.5 transition-all duration-200"
            >
              Learn more
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
              </svg>
            </Link>
            <WhatsAppButton href={service.whatsappMessage} label="Discuss" size="sm" />
          </div>
        </div>
      </motion.div>
    </MotionReveal>
  );
}

export default function ServicePillars() {
  return (
    <section className="py-20 md:py-28 bg-ivory" aria-labelledby="services-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MotionReveal>
          <SectionHeader
            eyebrow="What we do"
            title="Four ways to celebrate beautifully"
            subtitle="From custom outfits to handcrafted ritual essentials — everything Sonal Studio offers is rooted in personal care and celebration."
            id="services-heading"
          />
        </MotionReveal>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.id} service={service} delay={0.1 + i * 0.1} />
          ))}
        </div>

        <MotionReveal delay={0.5} className="mt-10 flex justify-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-btn border-2 border-maroon text-maroon font-semibold hover:bg-maroon hover:text-cream transition-all duration-200"
          >
            View all services
          </Link>
        </MotionReveal>
      </div>
    </section>
  );
}
