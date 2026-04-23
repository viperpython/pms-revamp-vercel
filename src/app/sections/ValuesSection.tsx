"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import { useTimingHarness } from "../hooks/useTimingHarness";
import {
  BarChart3,
  Heart,
  Award,
  Users,
  Lightbulb,
  ShieldCheck,
  Eye,
  BookOpen,
  Check,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ==================== VALUES DATA ====================
interface Value {
  title: string;
  desc: string;
  icon: LucideIcon;
  checklist: string[];
}

const values: Value[] = [
  {
    title: "Integrity in Data",
    desc: "Our advice and decisions are always based on honest measurements and facts.",
    icon: BarChart3,
    checklist: [
      "Transparent Methodology",
      "Empirical Decision Making",
      "Zero Bias Reporting",
      "Global Best Practices",
    ],
  },
  {
    title: "Client Satisfaction",
    desc: "We listen to our clients and work to exceed their expectations all the time.",
    icon: Heart,
    checklist: [
      "Responsive Communication",
      "Tailored Solutions",
      "Continuous Feedback Loops",
      "Exceeding Expectations",
    ],
  },
  {
    title: "Quality Commitment",
    desc: "We maintain high standards, from field testing to final reporting.",
    icon: Award,
    checklist: [
      "Rigorous Field Testing",
      "ISO Standard Compliance",
      "Peer Review Process",
      "Calibrated Equipment",
    ],
  },
  {
    title: "Teamwork",
    desc: "PMS believes in collaboration among engineers, clients, and partners, to get the best results.",
    icon: Users,
    checklist: [
      "Cross-Functional Collaboration",
      "Knowledge Sharing",
      "Unified Project Goals",
      "Partner Integration",
    ],
  },
  {
    title: "Innovation",
    desc: "We use new technology and new ideas to deliver smarter and more cost-effective solutions.",
    icon: Lightbulb,
    checklist: [
      "Emerging Technologies",
      "Research-Driven Solutions",
      "Process Automation",
      "Smart Analytics",
    ],
  },
  {
    title: "Reliability",
    desc: "We deliver every project on time and as promised, building trust through performance.",
    icon: ShieldCheck,
    checklist: [
      "On-Time Delivery",
      "Consistent Performance",
      "Predictable Outcomes",
      "Trust-Based Partnerships",
    ],
  },
  {
    title: "Transparency",
    desc: "Our process and reports are always clear and open for client review.",
    icon: Eye,
    checklist: [
      "Open Documentation",
      "Real-Time Reporting",
      "Client Access Portals",
      "Audit-Ready Processes",
    ],
  },
  {
    title: "Learning",
    desc: "We keep improving by learning new methods and sharing best practices.",
    icon: BookOpen,
    checklist: [
      "Continuous Training",
      "Industry Conferences",
      "Best Practice Sharing",
      "Research Publications",
    ],
  },
];

const ROTATION_DURATION = 5;
const EASING: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ==================== VALUES SECTION ====================
export default function ValuesSection() {
  useTimingHarness("ValuesSection mount");
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const hasUserInteracted = useRef(false);

  // IntersectionObserver: only auto-rotate when visible
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Auto-rotation timer
  useEffect(() => {
    if (isPaused || !isInView) return;
    hasUserInteracted.current = true;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % values.length);
    }, ROTATION_DURATION * 1000);
    return () => clearInterval(timer);
  }, [isPaused, isInView]);

  // Scroll active tab into view within the tab list when it changes.
  // Skip the initial mount — scrollIntoView() scrolls ALL ancestor
  // containers (including the window), which pulls the page away from
  // the top when this below-fold section loads via dynamic import.
  useEffect(() => {
    if (!hasUserInteracted.current) return;
    const activeTab = document.getElementById(`value-tab-${active}`);
    activeTab?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [active]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      let newIndex = index;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        newIndex = (index + 1) % values.length;
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        newIndex = (index - 1 + values.length) % values.length;
      } else if (e.key === "Home") {
        e.preventDefault();
        newIndex = 0;
      } else if (e.key === "End") {
        e.preventDefault();
        newIndex = values.length - 1;
      } else {
        return;
      }
      setActive(newIndex);
      setIsPaused(true);
      document.getElementById(`value-tab-${newIndex}`)?.focus();
    },
    [],
  );

  const motionSafe = !prefersReducedMotion;

  return (
    <section
      ref={sectionRef}
      id="values"
      className="bg-surface-container-lowest py-32 overflow-hidden"
      aria-labelledby="values-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* ── Section Header ── */}
        <motion.div
          initial={motionSafe ? { opacity: 0, y: 30 } : undefined}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASING }}
          className="text-center mb-16"
        >
          <h2
            id="values-heading"
            className="font-headline text-4xl font-bold text-white tracking-widest uppercase"
          >
            OUR CORE VALUES
          </h2>
          <div
            className="w-24 h-1 bg-primary mx-auto mt-6"
            aria-hidden="true"
          />
        </motion.div>

        {/* ── Tab Interface ── */}
        <motion.div
          initial={motionSafe ? { opacity: 0, y: 20 } : undefined}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASING }}
          className="flex flex-col md:flex-row gap-1"
        >
          {/* ── Left: Vertical Tab List (1/4) ── */}
          <div className="md:w-1/4 flex-shrink-0 flex flex-col">
            <div
              role="tablist"
              aria-label="Company values"
              aria-orientation="vertical"
              className="flex flex-col md:max-h-[520px] md:overflow-y-auto"
            >
              {values.map((item, index) => {
                const Icon = item.icon;
                const isActive = active === index;
                return (
                  <button
                    key={index}
                    id={`value-tab-${index}`}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`value-panel-${index}`}
                    tabIndex={isActive ? 0 : -1}
                    onMouseEnter={() => {
                      hasUserInteracted.current = true;
                      setActive(index);
                      setIsPaused(true);
                    }}
                    onMouseLeave={() => setIsPaused(false)}
                    onFocus={() => {
                      hasUserInteracted.current = true;
                      setActive(index);
                      setIsPaused(true);
                    }}
                    onBlur={() => setIsPaused(false)}
                    onClick={() => {
                      hasUserInteracted.current = true;
                      setActive(index);
                      setIsPaused(true);
                    }}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className={`w-full flex items-center gap-3 text-left cursor-pointer transition-all duration-200 border-l-4 px-8 py-6 lg:py-8
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-lowest
                      ${
                        isActive
                          ? "bg-surface-container-high border-primary text-primary"
                          : "bg-surface-container-low border-transparent text-white/50 hover:bg-surface-bright hover:text-white"
                      }`}
                  >
                    <Icon
                      className="w-5 h-5 opacity-50 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="font-headline font-bold uppercase tracking-widest text-xs sm:text-sm truncate">
                      {item.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Play / Pause */}
            <div className="mt-2 px-4">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="flex items-center gap-2 text-xs text-on-surface-variant/60 hover:text-on-surface-variant transition-colors
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg px-2 py-1.5"
                aria-label={
                  isPaused ? "Resume auto-rotation" : "Pause auto-rotation"
                }
              >
                {isPaused ? (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M2.5 1.5l8 4.5-8 4.5z" />
                  </svg>
                ) : (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <rect x="2" y="1.5" width="3" height="9" rx="0.5" />
                    <rect x="7" y="1.5" width="3" height="9" rx="0.5" />
                  </svg>
                )}
                {isPaused ? "Resume" : "Pause"}
              </button>
            </div>
          </div>

          {/* ── Right: Tab Panel (3/4) ── */}
          <div className="md:w-3/4 min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                id={`value-panel-${active}`}
                role="tabpanel"
                aria-labelledby={`value-tab-${active}`}
                initial={
                  motionSafe ? { opacity: 0, x: 20 } : { opacity: 0 }
                }
                animate={{ opacity: 1, x: 0 }}
                exit={motionSafe ? { opacity: 0, x: -20 } : { opacity: 0 }}
                transition={{ duration: 0.4, ease: EASING }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                className="bg-surface-container-high p-10 lg:p-16 h-full relative"
              >
                {/* Title */}
                <motion.h3
                  key={`title-${active}`}
                  initial={motionSafe ? { opacity: 0, y: 12 } : undefined}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06, duration: 0.4, ease: EASING }}
                  className="font-headline text-3xl font-bold text-white mb-8"
                >
                  {values[active].title}
                </motion.h3>

                {/* Description */}
                <motion.p
                  key={`desc-${active}`}
                  initial={motionSafe ? { opacity: 0, y: 12 } : undefined}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12, duration: 0.4, ease: EASING }}
                  className="text-xl text-on-surface-variant leading-relaxed font-light mb-10"
                >
                  {values[active].desc}
                </motion.p>

                {/* Checklist: 2-column grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  {values[active].checklist.map((item, i) => (
                    <motion.div
                      key={item}
                      initial={
                        motionSafe ? { opacity: 0, y: 8 } : undefined
                      }
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.18 + i * 0.08,
                        duration: 0.3,
                        ease: EASING,
                      }}
                      className="flex items-center gap-3"
                    >
                      <Check
                        className="w-4 h-4 text-primary flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
                        {item}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Progress bar */}
                {!isPaused && isInView && (
                  <motion.div
                    key={`progress-${active}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      duration: ROTATION_DURATION,
                      ease: "linear",
                    }}
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary origin-left"
                    aria-hidden="true"
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}