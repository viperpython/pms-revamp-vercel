"use client";

import {
  useTransform,
  useReducedMotion,
  useSpring,
  useMotionValue,
  motion,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLenis } from "lenis/react";
import { useTimingHarness } from "../hooks/useTimingHarness";
import SkyLine from "../city-skyline.jpg";
import Image from "next/image";
import InfiniteMarquee from "../components/InfiniteMarquee";

/* ── Motion Constants ─────────────────────────────────────────── */
const EASE_SMOOTH_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Stagger Variants ─────────────────────────────────────────── */
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE_SMOOTH_OUT },
  },
};

const headlineWordVariants: Variants = {
  hidden: { y: "100%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.8, ease: EASE_SMOOTH_OUT },
  },
};

/* ── Magnetic Hover Button ─────────────────────────────────────── */
function MagneticButton({
  children,
  className,
  ...props
}: React.ComponentProps<typeof motion.a>) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const prefersReducedMotion = useReducedMotion();

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (prefersReducedMotion || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      x.set((e.clientX - centerX) * 0.3);
      y.set((e.clientY - centerY) * 0.3);
    },
    [prefersReducedMotion, x, y]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  return (
    <motion.a
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      {...props}
    >
      {children}
    </motion.a>
  );
}

/* ── Marquee Items ────────────────────────────────────────────── */
const MARQUEE_ITEMS = [
  "Pavement Testing",
  "Engineering Design",
  "RAMS Compliance",
  "Advisory & Training",
  "Field Investigations",
  "Axle Load Surveys",
];

/* ── Component ────────────────────────────────────────────────── */
function HeroSection({
  scrollYProgress,
  enableParallax = true,
}: {
  scrollYProgress: MotionValue<number>;
  enableParallax?: boolean;
}) {
  useTimingHarness("HeroSection mount");
  const router = useRouter();
  const lenis = useLenis();

  const smoothScrollTo = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
      e.preventDefault();
      const el = document.querySelector(target) as HTMLElement | null;
      if (lenis) {
        lenis.scrollTo(el || target, { duration: 1.2, offset: -80 });
      } else if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    },
    [lenis]
  );

  /* Parallax transforms */
  const contentY = useTransform(scrollYProgress, [0, 0.3], [0, -150]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const bgY = useTransform(scrollYProgress, [0, 0.5], [0, 200]);

  const prefersReducedMotion = useReducedMotion();
  const noMotion = !!prefersReducedMotion;
  const noParallax = noMotion || !enableParallax;

  return (
    <section
      className="relative h-screen w-full flex items-center overflow-hidden"
      aria-label="Hero — Pavement Management Services"
    >
      {/* ── Parallax City Background ─────────────────────────── */}
      <motion.div
        className="absolute inset-0"
        style={{ y: noParallax ? 0 : bgY }}
        aria-hidden="true"
      >
        <Image
          src={SkyLine}
          alt=""
          fill
          sizes="100vw"
          priority
          quality={75}
          placeholder="blur"
          className="object-cover grayscale brightness-50 contrast-125 scale-110"
          role="presentation"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />
      </motion.div>

      {/* ── Main Content (LEFT-ALIGNED) ──────────────────────── */}
      <motion.div
        style={
          noParallax
            ? {}
            : { y: contentY, opacity: contentOpacity }
        }
        className="relative z-10 px-12 md:px-24 max-w-7xl w-full"
      >
        <motion.div
          className="space-y-0"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Overline */}
          <motion.div variants={fadeUpVariant} className="flex items-center gap-3 mb-6">
            <span
              className="w-2 h-2 rounded-full bg-primary-container shrink-0"
              style={noMotion ? {} : { animation: "pulse-glow 2s ease-in-out infinite" }}
              aria-hidden="true"
            />
            <span className="font-label text-[0.75rem] font-bold uppercase tracking-[0.3em] text-primary">
              Pavement Management Solutions
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="font-headline text-5xl md:text-8xl font-bold text-white leading-[1.1] tracking-tighter uppercase"
            variants={containerVariants}
          >
            <span className="block overflow-hidden">
              <motion.span className="block" variants={headlineWordVariants}>
                Pavement
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span className="block" variants={headlineWordVariants}>
                Management
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span className="block text-gradient" variants={headlineWordVariants}>
                Services
              </motion.span>
            </span>
          </motion.h1>

          {/* Gold divider */}
          <motion.div variants={fadeUpVariant}>
            <div className="h-1 w-24 bg-primary-container mt-8" />
          </motion.div>

          {/* Tagline */}
          <motion.p
            variants={fadeUpVariant}
            className="text-on-surface-variant text-lg font-light leading-relaxed max-w-2xl mt-8"
          >
            Expertise in Pavement Engineering — structural evaluation and
            turn-key RAMS deliverables. Building India&apos;s road
            infrastructure with data-driven precision.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUpVariant}
            className="flex flex-wrap gap-5 mt-10"
          >
            <MagneticButton
              href="/contact"
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => { e.preventDefault(); router.push("/contact"); }}
              whileTap={{ scale: 0.97 }}
              className="btn-gradient px-10 py-4 rounded-lg font-headline text-sm uppercase tracking-widest inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              <span>Contact Us</span>
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </MagneticButton>

            <MagneticButton
              href="#services"
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => smoothScrollTo(e, "#services")}
              whileTap={{ scale: 0.97 }}
              className="btn-ghost px-10 py-4 rounded-lg font-headline text-sm uppercase tracking-widest inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              <span>Explore Services</span>
            </MagneticButton>
          </motion.div>

          {/* Credential badges */}
          <motion.div
            variants={fadeUpVariant}
            className="flex flex-wrap items-center gap-6 mt-12"
          >
            <span className="font-label text-[10px] font-bold uppercase tracking-[0.15em] text-white opacity-60">
              NHAI Standards Compliant
            </span>
            <span className="w-px h-3 bg-white/20" aria-hidden="true" />
            <span className="font-label text-[10px] font-bold uppercase tracking-[0.15em] text-white opacity-60">
              Engineering Precision Since 2014
            </span>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── Scroll Indicator ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: noMotion ? 0 : 2, duration: noMotion ? 0 : 1 }}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-3"
        aria-hidden="true"
      >
        <span className="font-label text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">
          Scroll to explore
        </span>
        <motion.div
          className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent origin-top"
          animate={noMotion ? {} : { scaleY: [0.3, 1, 0.3], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* ── Bottom Marquee ────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <InfiniteMarquee items={MARQUEE_ITEMS} speed={30} />
      </div>
    </section>
  );
}

export default HeroSection;