"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface LenisScrollToOptions {
  offset?: number;
  duration?: number;
  easing?: (t: number) => number;
}

interface Lenis {
  scrollTo: (target: HTMLElement, options?: LenisScrollToOptions) => void;
}

const NAV_ITEMS = ["Services", "Vision", "Values", "Advantage"] as const;
const SECTIONS = NAV_ITEMS.map((s) => s.toLowerCase());

function FloatingNav() {
  const [activeSection, setActiveSection] = useState("");

  // Track active section via IntersectionObserver
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

    SECTIONS.forEach((id) => {
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

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
      e.preventDefault();
      scrollTo(sectionId);
    },
    [scrollTo]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLAnchorElement>, sectionId: string) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        scrollTo(sectionId);
      }
    },
    [scrollTo]
  );

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="fixed top-0 w-full z-50 glass-panel shadow-[0px_20px_40px_rgba(0,0,0,0.4)] border-b border-outline-variant/15"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-between px-12 py-6 max-w-[1920px] mx-auto">
        {/* Left: PMS Logo Badge */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container rounded-lg"
          aria-label="PMS — Back to top"
        >
          <div className="w-8 h-8 bg-primary-container rounded-lg flex items-center justify-center">
            <span className="font-headline text-[0.6rem] font-bold text-on-primary tracking-wider">
              PMS
            </span>
          </div>
          <span className="font-headline text-sm font-bold text-white tracking-widest uppercase">
            PMS
          </span>
        </a>

        {/* Center: Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => {
            const sectionId = item.toLowerCase();
            const isActive = activeSection === sectionId;

            return (
              <a
                key={item}
                href={`#${sectionId}`}
                onClick={(e) => handleClick(e, sectionId)}
                onKeyDown={(e) => handleKeyDown(e, sectionId)}
                className={`font-label text-[0.75rem] font-bold uppercase tracking-[0.15em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded-sm ${
                  isActive
                    ? "text-primary-container border-b-2 border-primary-container pb-1"
                    : "text-white/70 hover:text-white"
                }`}
                aria-current={isActive ? "true" : undefined}
              >
                {item}
              </a>
            );
          })}
        </div>

        {/* Right: Contact CTA */}
        <Link
          href="/contact"
          className="btn-gradient px-6 py-2 rounded-lg font-label text-[0.75rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          Contact Us
        </Link>
      </div>
    </motion.nav>
  );
}

export default FloatingNav;