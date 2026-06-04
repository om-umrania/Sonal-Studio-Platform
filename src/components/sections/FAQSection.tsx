"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FAQS } from "@/data/faqs";
import SectionHeader from "@/components/ui/SectionHeader";
import MotionReveal from "@/components/ui/MotionReveal";

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <MotionReveal delay={0.05 + index * 0.05}>
      <div className="border border-gold/20 rounded-card overflow-hidden bg-cream">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
          aria-expanded={open}
        >
          <span className="font-medium text-maroon text-base leading-snug">
            {question}
          </span>
          <motion.span
            className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full border border-gold/50 text-gold"
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden="true"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <p className="px-6 pb-5 text-sm text-muted leading-relaxed">
                {answer}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionReveal>
  );
}

export default function FAQSection() {
  return (
    <section className="py-20 md:py-28 bg-ivory" aria-labelledby="faq-heading">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <MotionReveal>
          <SectionHeader
            eyebrow="Common questions"
            title="Frequently asked"
            id="faq-heading"
          />
        </MotionReveal>

        <div className="mt-12 flex flex-col gap-3">
          {FAQS.map((faq, i) => (
            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
