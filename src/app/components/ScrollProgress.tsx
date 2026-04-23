"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Drive aria-valuenow from scroll progress
  const progressPercent = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100]" role="progressbar" aria-label="Page scroll progress" aria-valuemin={0} aria-valuemax={100}>
      {/* Glow layer underneath */}
      <motion.div
        className="absolute top-0 left-0 h-[4px] w-full origin-left bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 blur-sm opacity-60"
        style={{ scaleX }}
      />
      {/* Main progress bar */}
      <motion.div
        className="relative h-[2px] w-full origin-left bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500"
        style={{ scaleX }}
      >
        {/* Pulse-glow tip */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(251,146,60,0.5),0_0_20px_rgba(251,146,60,0.3)] animate-pulse" />
      </motion.div>
    </div>
  );
}

export default ScrollProgress;