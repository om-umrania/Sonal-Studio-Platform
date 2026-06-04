"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { GALLERY_ITEMS, GALLERY_CATEGORIES, type GalleryCategory, type GalleryItem } from "@/data/gallery";
import Badge from "@/components/ui/Badge";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

/* ─── Filter bar ─────────────────────────────────────────── */
function FilterBar({
  active,
  onChange,
}: {
  active: GalleryCategory;
  onChange: (cat: GalleryCategory) => void;
}) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
      style={{ scrollbarWidth: "none" }}
      role="tablist"
      aria-label="Filter gallery by category"
    >
      {GALLERY_CATEGORIES.map((cat) => (
        <button
          key={cat}
          role="tab"
          aria-selected={active === cat}
          onClick={() => onChange(cat)}
          className={`shrink-0 px-4 py-2 rounded-pill text-sm font-medium transition-all duration-200 ${
            active === cat
              ? "bg-maroon text-cream"
              : "bg-cream text-muted border border-gold/20 hover:border-gold/50"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

/* ─── Gallery card ───────────────────────────────────────── */
function GalleryCard({
  item,
  onOpen,
}: {
  item: GalleryItem;
  onOpen: (item: GalleryItem) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-card overflow-hidden bg-cream cursor-pointer group"
      style={{ boxShadow: hovered ? "var(--shadow-card)" : "var(--shadow-soft)" }}
      onClick={() => onOpen(item)}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={{ scale: 0.98 }}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
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
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </motion.div>

        {/* Category chip */}
        <div className="absolute top-3 left-3">
          <Badge label={item.category} />
        </div>

        {/* Hover overlay */}
        <motion.div
          className="absolute inset-0 bg-wine/50 flex flex-col items-center justify-center gap-2 p-4"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <span className="bg-cream/90 text-maroon text-xs font-semibold px-4 py-2 rounded-pill">
            View details
          </span>
        </motion.div>
      </div>

      {/* Card footer */}
      <div className="p-4">
        <h3 className="font-semibold text-ink text-sm leading-tight mb-1">
          {item.title}
        </h3>
        <p className="text-xs text-muted">
          {item.occasion.slice(0, 2).join(" · ")}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Quick-view drawer ──────────────────────────────────── */
function QuickViewDrawer({
  item,
  onClose,
}: {
  item: GalleryItem | null;
  onClose: () => void;
}) {
  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Mobile: bottom sheet | Desktop: right drawer */}
      <motion.div
        key="drawer"
        className="fixed bottom-0 left-0 right-0 z-50 bg-cream rounded-t-hero md:bottom-auto md:top-0 md:right-0 md:left-auto md:w-[420px] md:h-full md:rounded-l-hero md:rounded-tr-none overflow-y-auto"
        style={{ boxShadow: "var(--shadow-luxury)" }}
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        role="dialog"
        aria-modal="true"
        aria-label={item.title}
      >
        {/* Drag handle (mobile) */}
        <div className="w-10 h-1 bg-muted/20 rounded-pill mx-auto mt-4 mb-2 md:hidden" />

        {/* Image */}
        <div className="relative aspect-[4/3] md:aspect-[3/2] w-full overflow-hidden">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
            sizes="420px"
            priority
          />
        </div>

        {/* Content */}
        <div className="p-6 pb-10">
          <div className="flex items-start justify-between mb-4">
            <Badge label={item.category} />
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-muted/10 text-muted hover:bg-muted/20 transition-colors ml-3 shrink-0"
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <h2 className="font-display text-2xl text-maroon mb-3 leading-tight">
            {item.title}
          </h2>

          <p className="text-sm text-muted leading-relaxed mb-4">
            {item.description}
          </p>

          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold mb-2">
              Occasions
            </p>
            <div className="flex flex-wrap gap-2">
              {item.occasion.map((occ) => (
                <span
                  key={occ}
                  className="px-3 py-1 rounded-tag text-xs font-medium bg-blush/40 text-maroon border border-maroon/10"
                >
                  {occ}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold mb-2">
              Tags
            </p>
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-tag text-xs text-muted bg-muted/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted/60 italic mb-6">
            Each piece is custom-made — pricing and timelines are discussed on inquiry.
          </p>

          <WhatsAppButton href={item.whatsappMessage} label="Inquire on WhatsApp" size="md" className="w-full justify-center" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Main gallery client ────────────────────────────────── */
export default function GalleryClient() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("All");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const filtered =
    activeCategory === "All"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <div>
      {/* Filter bar */}
      <div className="sticky top-16 md:top-20 z-30 bg-ivory/90 backdrop-blur-md border-b border-gold/10 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <FilterBar active={activeCategory} onChange={setActiveCategory} />
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filtered.length === 0 ? (
          <div className="py-24 text-center text-muted">
            No items in this category yet — check back soon.
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((item) => (
                <GalleryCard key={item.id} item={item} onOpen={setSelectedItem} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Quick-view */}
      <AnimatePresence>
        {selectedItem && (
          <QuickViewDrawer
            key={selectedItem.id}
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
