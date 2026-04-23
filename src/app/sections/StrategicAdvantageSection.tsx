"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Compass, Wrench, Trophy, Crosshair } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.15, ease },
  }),
};

const advantages = [
  {
    title: "Expert Guidance",
    desc: "Seasoned pavement engineers who understand NHAI protocols, IRC standards, and every nuance of highway lifecycle management.",
    icon: Compass,
  },
  {
    title: "World-Class Tools",
    desc: "FWD testing rigs, GPR scanners, and proprietary analytics — the same arsenal trusted by India's top highway agencies.",
    icon: Wrench,
  },
  {
    title: "Proven Track Record",
    desc: "500+ projects delivered across national and state highways with consistent on-time, on-budget performance.",
    icon: Trophy,
  },
  {
    title: "RAMS Precision",
    desc: "Every deliverable is RAMS-portal aligned — from condition surveys to overlay designs — ensuring zero rework at submission.",
    icon: Crosshair,
  },
];

export default function StrategicAdvantageSection() {
  const prefersReducedMotion = !!useReducedMotion();

  const resolvedFadeUp: Variants = prefersReducedMotion
    ? {
        hidden: { opacity: 1, y: 0 },
        visible: () => ({ opacity: 1, y: 0 }),
      }
    : fadeUp;

  return (
    <section
      id="advantage"
      className="relative py-48 px-12 md:px-24 bg-surface"
      aria-labelledby="advantage-heading"
    >
      {/* Dot pattern background */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: "radial-gradient(#ffdca1 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 items-start max-w-7xl mx-auto">
        {/* ── Left Column (Sticky) ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="md:col-span-4 md:sticky md:top-32"
        >
          <motion.p
            variants={resolvedFadeUp}
            custom={0}
            className="font-label text-primary tracking-[0.4em] uppercase text-xs mb-6"
          >
            Why Partner With Us
          </motion.p>

          <motion.h2
            id="advantage-heading"
            variants={resolvedFadeUp}
            custom={1}
            className="font-headline text-6xl font-bold text-white uppercase leading-none mb-8"
          >
            PMS
            <br />
            Advantage
          </motion.h2>

          <motion.p
            variants={resolvedFadeUp}
            custom={2}
            className="text-on-surface-variant leading-relaxed font-light"
          >
            We don&apos;t just consult — we embed. Our team integrates with
            yours, bringing laboratory-grade precision to every corridor,
            every overlay, every deliverable.
          </motion.p>
        </motion.div>

        {/* ── Right Column (2×2 Card Grid) ── */}
        <div className="md:col-span-8 grid md:grid-cols-2 gap-px bg-outline-variant/10 border border-outline-variant/10 rounded-lg overflow-hidden">
          {advantages.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={resolvedFadeUp}
                custom={i}
                className="bg-surface-container-low p-12 hover:bg-surface-container-high transition-all duration-500 group"
              >
                <Icon
                  className="text-primary mb-8"
                  size={36}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <h3 className="font-headline text-xl font-bold text-white uppercase tracking-wider mb-4">
                  {item.title}
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}