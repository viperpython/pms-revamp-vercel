"use client";

import { useEffect } from "react";
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

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const prefersReducedMotion = !!useReducedMotion();
  const variants = prefersReducedMotion ? noMotion : fadeIn;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="bg-surface min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial="hidden"
        animate="visible"
        className="relative text-center"
      >
        {/* Large background text */}
        <motion.span
          variants={variants}
          custom={0}
          className="font-headline text-[10rem] md:text-[14rem] font-bold text-surface-container-high leading-none select-none pointer-events-none block"
          aria-hidden="true"
        >
          ERR
        </motion.span>

        {/* Overlay content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.h1
            variants={variants}
            custom={1}
            className="font-headline text-2xl font-bold text-white uppercase tracking-widest mb-4"
          >
            Something Went Wrong
          </motion.h1>

          <motion.p
            variants={variants}
            custom={2}
            className="text-on-surface-variant text-sm max-w-md mb-10"
          >
            An unexpected error occurred. Please try again or return to
            the home page.
          </motion.p>

          <motion.div
            variants={variants}
            custom={3}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <button
              onClick={reset}
              className="btn-gradient px-10 py-4 rounded-lg font-label text-xs"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="btn-ghost px-10 py-4 rounded-lg font-label text-xs inline-block"
            >
              Back to Home
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
