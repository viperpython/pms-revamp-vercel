"use client";

import { useMotionValue, useSpring, useReducedMotion, motion } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";

function CustomCursor({ disabled = false }: { disabled?: boolean }) {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const rafPending = useRef(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Main dot spring — snappy
  const dotSpring = { stiffness: 400, damping: 30 };
  const dotX = useSpring(cursorX, dotSpring);
  const dotY = useSpring(cursorY, dotSpring);

  // Trailing ring spring — softer, delayed feel
  const ringSpring = { stiffness: 200, damping: 25 };
  const ringX = useSpring(cursorX, ringSpring);
  const ringY = useSpring(cursorY, ringSpring);

  const handlePointerTargets = useCallback(() => {
    const interactiveEls = document.querySelectorAll(
      'a, button, [data-cursor="pointer"], input, textarea, select, [role="button"]'
    );
    const enter = () => setIsHovering(true);
    const leave = () => setIsHovering(false);
    interactiveEls.forEach((el) => {
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
    });
    return () => {
      interactiveEls.forEach((el) => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
    };
  }, []);

  useEffect(() => {
    if (disabled || prefersReducedMotion) return;
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) return;

    setIsVisible(true);

    // Throttle mousemove to max 60fps using rAF guard
    const moveCursor = (e: MouseEvent) => {
      if (rafPending.current) return;
      rafPending.current = true;
      requestAnimationFrame(() => {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
        rafPending.current = false;
      });
    };
    window.addEventListener("mousemove", moveCursor, { passive: true });

    let cleanupTargets = handlePointerTargets();

    // Debounced MutationObserver callback (500ms)
    const observer = new MutationObserver(() => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        cleanupTargets();
        cleanupTargets = handlePointerTargets();
      }, 500);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      cleanupTargets();
      observer.disconnect();
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [cursorX, cursorY, prefersReducedMotion, handlePointerTargets, disabled]);

  if (!isVisible) return null;

  return (
    <div className="hidden md:block" aria-hidden="true">
      {/* Trailing ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[998] mix-blend-difference"
        style={{ x: ringX, y: ringY }}
      >
        <motion.div
          className="w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20"
          animate={{
            scale: isHovering ? 1.6 : 1,
            borderColor: isHovering ? "rgba(251,191,36,0.4)" : "rgba(255,255,255,0.2)",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      </motion.div>

      {/* Main dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[999] mix-blend-difference"
        style={{ x: dotX, y: dotY }}
      >
        <motion.div
          className="w-5 h-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6),0_0_20px_rgba(251,191,36,0.3)]"
          animate={{
            scale: isHovering ? 0.5 : 1,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      </motion.div>
    </div>
  );
}

export default CustomCursor;