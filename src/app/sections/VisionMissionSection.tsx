"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import Image from "next/image";
import citySkyline from "../city-skyline.jpg";
import designImg from "../design.jpg";

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

const visionText =
  "To help India build and maintain strong and durable pavements by using pavement condition data and lifecycle planning.";

const missionText =
  "To deliver data-driven solutions that empower road agencies to make informed decisions, extend pavement life, and ensure cost-effective and sustainable road networks. We keep improving through continuous learning and sharing of best practices from projects and research.";

/* ── Animation variants ── */
const sectionVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE_OUT_EXPO },
  },
};

const slideLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.9, ease: EASE_OUT_EXPO },
  },
};

const slideRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.9, ease: EASE_OUT_EXPO },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: EASE_OUT_EXPO },
  },
};

const noMotion: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
};

// ==================== VISION & MISSION SECTION ====================
export default function VisionMissionSection() {
  const prefersReducedMotion = !!useReducedMotion();

  const v = (variants: Variants) =>
    prefersReducedMotion ? noMotion : variants;

  return (
    <section
      id="vision"
      className="bg-surface py-48 overflow-hidden"
      aria-labelledby="purpose-heading"
    >
      <motion.div
        className="max-w-7xl mx-auto px-6 lg:px-8"
        variants={prefersReducedMotion ? { hidden: {}, visible: {} } : sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        <div className="grid md:grid-cols-12 gap-12 items-center">
          {/* ── Left Column (6 cols) ── */}
          <div className="md:col-span-6 space-y-8">
            {/* Overline */}
            <motion.p
              variants={v(fadeUp)}
              className="font-label text-primary-container tracking-widest uppercase text-sm"
            >
              Vision &amp; Mission
            </motion.p>

            {/* Headline */}
            <motion.h2
              id="purpose-heading"
              variants={v(fadeUp)}
              className="font-headline text-5xl lg:text-6xl font-bold text-white tracking-tighter uppercase"
            >
              OUR PURPOSE.
            </motion.h2>

            {/* Vision quote */}
            <motion.blockquote
              variants={v(fadeUp)}
              className="text-xl text-on-surface-variant font-light italic leading-relaxed"
            >
              &ldquo;{visionText}&rdquo;
            </motion.blockquote>

            {/* Mission box */}
            <motion.div
              variants={v(slideLeft)}
              className="glass-panel bg-surface-container-high/40 p-12 rounded-lg outline outline-1 outline-outline-variant/10"
            >
              <h3 className="font-headline text-xl font-bold text-white uppercase tracking-wider mb-4">
                MISSION STATEMENT
              </h3>
              <p className="text-on-surface-variant leading-relaxed font-light">
                {missionText}
              </p>
            </motion.div>
          </div>

          {/* ── Right Column (6 cols) — Image Composition ── */}
          <motion.div
            variants={v(slideRight)}
            className="md:col-span-6 relative h-[500px] lg:h-[600px]"
          >
            {/* Back image (top-right) */}
            <div className="absolute top-0 right-0 w-4/5 h-4/5 rounded-lg overflow-hidden bg-surface-container-highest">
              <Image
                src={citySkyline}
                alt="City skyline representing infrastructure vision"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 80vw, 40vw"
                placeholder="blur"
              />
            </div>

            {/* Front image (bottom-left, grayscale) */}
            <motion.div
              variants={v(scaleIn)}
              className="absolute bottom-0 left-0 w-3/4 h-3/4 rounded-lg overflow-hidden bg-surface-container grayscale shadow-2xl z-[1]"
            >
              <Image
                src={designImg}
                alt="Engineering design and planning"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 75vw, 35vw"
                placeholder="blur"
              />
            </motion.div>

            {/* Floating stat badge */}
            <motion.div
              variants={v(fadeUp)}
              className="absolute bottom-8 right-8 glass-panel rounded-lg px-6 py-4 outline outline-1 outline-outline-variant/10 z-10"
            >
              <p className="font-headline text-3xl font-bold text-primary">
                100%
              </p>
              <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
                Compliance Rate
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
