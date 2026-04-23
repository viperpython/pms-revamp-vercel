"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Wrench, Eye, ShieldCheck, TrendingUp } from "lucide-react";

interface LenisScrollToOptions {
  offset?: number;
  duration?: number;
  easing?: (t: number) => number;
}

interface Lenis {
  scrollTo: (target: HTMLElement, options?: LenisScrollToOptions) => void;
}

const SIDE_NAV_ITEMS = [
  { id: "services", label: "Services", icon: Wrench },
  { id: "vision", label: "Vision", icon: Eye },
  { id: "values", label: "Values", icon: ShieldCheck },
  { id: "advantage", label: "Advantage", icon: TrendingUp },
] as const;

export default function SideNav() {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );

    SIDE_NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = useCallback((sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (!target) return;

    const lenis = (window as Window & { __lenis?: Lenis }).__lenis;
    if (lenis) {
      lenis.scrollTo(target, {
        offset: -80,
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <nav
      className="fixed left-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex"
      aria-label="Section navigation"
    >
      <div className="flex flex-col items-center gap-6 rounded-full py-8 w-16 bg-surface-container-high/90 backdrop-blur-lg shadow-2xl shadow-black/50 outline outline-1 outline-outline-variant/15">
        {SIDE_NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = activeSection === id;

          return (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="relative flex flex-col items-center gap-1 w-12 h-12 justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container rounded-lg"
              aria-label={`Navigate to ${label}`}
              aria-current={isActive ? "true" : undefined}
            >
              {/* Active background indicator */}
              {isActive && (
                <motion.div
                  layoutId="sidenav-active"
                  className="absolute inset-0 bg-primary-container/10 rounded-lg"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <Icon
                className={`relative w-5 h-5 transition-colors duration-300 ${
                  isActive ? "text-primary-container" : "text-white/40 hover:text-primary"
                }`}
                strokeWidth={isActive ? 2.5 : 1.5}
              />
              <span
                className={`relative font-label text-[0.5rem] font-bold uppercase tracking-[0.08em] transition-colors duration-300 ${
                  isActive
                    ? "text-primary-container"
                    : "text-white/30"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
