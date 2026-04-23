"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Link from "next/link";
import AnimatedCounter from "../components/AnimatedCounter";

/* ── Animation Variants ──────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

/* ── Stats Data ──────────────────────────────────────────────── */
const stats = [
  { value: "10+", numericValue: 10, suffix: "+", label: "Years Experience" },
  { value: "500+", numericValue: 500, suffix: "+", label: "Projects Delivered" },
  { value: "50+", numericValue: 50, suffix: "+", label: "Expert Team" },
  { value: "99%", numericValue: 99, suffix: "%", label: "Client Satisfaction" },
];

/* ── Main Component ──────────────────────────────────────────── */
export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="bg-[#030303] text-white min-h-screen overflow-x-hidden">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-[60vh] flex items-center justify-center overflow-hidden"
        aria-label="About hero"
      >
        {/* Parallax gradient orbs */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-amber-500/[0.06] blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-rose-500/[0.05] blur-[100px]" />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-xs uppercase tracking-[0.2em] font-medium text-amber-400/60 mb-6"
          >
            About Us
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight"
          >
            About{" "}
            <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 bg-clip-text text-transparent">
              PMS
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-white/70 leading-relaxed"
          >
            Pioneering excellence in pavement management and engineering solutions
          </motion.p>
        </div>
      </section>

      {/* ── Company Overview ──────────────────────────────────── */}
      <section className="py-32 lg:py-40" aria-label="Company overview">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="bg-white/[0.06] backdrop-blur-2xl border border-white/10 rounded-2xl p-8 sm:p-12 lg:p-16"
          >
            <motion.p
              variants={fadeUp}
              custom={0}
              className="text-xs uppercase tracking-[0.2em] font-medium text-amber-400/60 mb-4"
            >
              Who We Are
            </motion.p>

            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-8"
            >
              A Legacy of{" "}
              <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 bg-clip-text text-transparent">
                Engineering Excellence
              </span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-white/70 text-lg leading-relaxed max-w-3xl"
            >
              PMS is a premier pavement management consultancy specializing in
              cutting-edge engineering solutions. With deep expertise in FWD testing,
              overlay design, and RAMS-aligned deliverables, we partner with
              infrastructure organizations to extend pavement life, optimize maintenance
              budgets, and ensure regulatory compliance.
            </motion.p>

            <motion.p
              variants={fadeUp}
              custom={3}
              className="text-white/50 text-base leading-relaxed max-w-3xl mt-6"
            >
              Our multidisciplinary team combines decades of field experience with
              modern analytical capabilities — delivering data-driven insights that
              transform how organizations maintain and invest in their road networks.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────── */}
      <StatsSection />

      {/* ── Values Preview ───────────────────────────────────── */}
      <section className="py-32 lg:py-40" aria-label="Our values">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.p
              variants={fadeUp}
              custom={0}
              className="text-xs uppercase tracking-[0.2em] font-medium text-amber-400/60 mb-4"
            >
              Our Values
            </motion.p>

            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6"
            >
              Principles That Define Us
            </motion.h2>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto mb-10"
            >
              Our core values drive every project we undertake — from initial assessment
              through final delivery.
            </motion.p>

            <motion.div variants={fadeUp} custom={3}>
              <Link
                href="/#values"
                className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold bg-white/[0.06] backdrop-blur-2xl border border-white/10 text-white/90 hover:border-amber-400/30 hover:text-white transition-all duration-500"
              >
                Explore our values
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-32 lg:py-40" aria-label="Call to action">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative overflow-hidden rounded-2xl bg-white/[0.06] backdrop-blur-2xl border border-white/10 p-12 sm:p-16 text-center"
          >
            {/* Gradient glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-amber-500/[0.08] to-transparent rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                Ready to{" "}
                <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 bg-clip-text text-transparent">
                  Collaborate
                </span>
                ?
              </h2>

              <p className="text-white/70 text-lg max-w-xl mx-auto mb-10">
                Let&apos;s discuss how our pavement engineering expertise can support
                your next infrastructure project.
              </p>

              <a
                href="mailto:info@pms.com"
                data-placeholder="true"
                className="btn-premium inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-white shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-shadow duration-500"
              >
                Get in Touch
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

/* ── Stats Sub-Component ─────────────────────────────────────── */
function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-32 lg:py-40" aria-label="Key statistics">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: i * 0.12,
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="bg-white/[0.06] backdrop-blur-2xl border border-white/10 rounded-2xl p-6 sm:p-8 text-center card-premium"
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 bg-clip-text text-transparent mb-2">
                <AnimatedCounter target={stat.numericValue} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-white/40 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}