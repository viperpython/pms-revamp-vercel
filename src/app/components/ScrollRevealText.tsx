"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

interface ScrollRevealTextProps {
  children: string;
  className?: string;
  as?: "h2" | "h3" | "p";
}

export default function ScrollRevealText({
  children,
  className = "",
  as: Tag = "h2",
}: ScrollRevealTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "start 35%"],
  });

  const backgroundPosition = useTransform(
    scrollYProgress,
    [0, 1],
    ["100% 0", "0% 0"]
  );

  if (prefersReducedMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <div ref={ref}>
      <motion.span
        style={{ backgroundPosition }}
        className={`${className} inline bg-[length:200%_100%] bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/20`}
      >
        {children}
      </motion.span>
    </div>
  );
}
