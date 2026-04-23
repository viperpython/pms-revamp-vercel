"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import Link from "next/link";

const ease = [0.16, 1, 0.3, 1] as const;

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease },
  }),
};

const noMotion: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: () => ({ opacity: 1, y: 0 }),
};

export default function NotFound() {
  const prefersReducedMotion = !!useReducedMotion();
  const variants = prefersReducedMotion ? noMotion : fadeIn;

  return (
    <div className="bg-surface min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial="hidden"
        animate="visible"
        className="relative text-center"
      >
        {/* Large background "404" */}
        <motion.span
          variants={variants}
          custom={0}
          className="font-headline text-[12rem] md:text-[16rem] font-bold text-surface-container-high leading-none select-none pointer-events-none block"
          aria-hidden="true"
        >
          404
        </motion.span>

        {/* Overlay content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.h1
            variants={variants}
            custom={1}
            className="font-headline text-2xl font-bold text-white uppercase tracking-widest mb-4"
          >
            Page Not Found
          </motion.h1>

          <motion.p
            variants={variants}
            custom={2}
            className="text-on-surface-variant text-sm max-w-md mb-10"
          >
            The page you&apos;re looking for doesn&apos;t exist or has
            been moved.
          </motion.p>

          <motion.div
            variants={variants}
            custom={3}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link
              href="/"
              className="btn-gradient px-10 py-4 rounded-lg font-label text-xs inline-block"
            >
              Back to Home
            </Link>
            <Link
              href="/services/fwd-testing"
              className="btn-ghost px-10 py-4 rounded-lg font-label text-xs inline-block"
            >
              View Services
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
