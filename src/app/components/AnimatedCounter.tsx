"use client";

import {
  useInView,
  useMotionValue,
  useReducedMotion,
  animate,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

export default function AnimatedCounter({
  target,
  suffix = "",
  duration = 2,
  className = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const prefersReduced = useReducedMotion();
  const motionVal = useMotionValue(0);
  const [display, setDisplay] = useState(prefersReduced ? target : 0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    if (prefersReduced) {
      setDisplay(target);
      return;
    }

    // Overshoot to target * 1.05 then settle back
    const overshoot = Math.round(target * 1.05);

    const unsub = motionVal.on("change", (v) => {
      setDisplay(Math.round(v));
    });

    // Phase 1: ramp up to overshoot
    const controls = animate(motionVal, overshoot, {
      duration: duration * 0.8,
      ease: "easeOut",
      onComplete() {
        // Phase 2: settle back to exact target
        animate(motionVal, target, {
          duration: duration * 0.2,
          ease: "easeInOut",
        });
      },
    });

    return () => {
      controls.stop();
      unsub();
    };
  }, [isInView, target, duration, prefersReduced, motionVal]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}
