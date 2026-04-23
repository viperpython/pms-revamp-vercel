"use client";

import { motion, useReducedMotion } from "framer-motion";

interface AnimatedDividerProps {
  color?: string;
  className?: string;
  width?: string;
}

export default function AnimatedDivider({
  color = "from-transparent via-white/10 to-transparent",
  className = "",
  width = "w-full",
}: AnimatedDividerProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={`h-px ${width} bg-gradient-to-r ${color} origin-center ${className}`}
    />
  );
}
