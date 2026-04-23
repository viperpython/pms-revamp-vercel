"use client";

import { useReducedMotion } from "framer-motion";

interface InfiniteMarqueeProps {
  items: string[];
  speed?: number;
  className?: string;
}

export default function InfiniteMarquee({
  items,
  speed = 30,
  className = "",
}: InfiniteMarqueeProps) {
  const prefersReduced = useReducedMotion();

  // Static fallback for reduced-motion users
  if (prefersReduced) {
    return (
      <div
        className={`glass-panel py-4 border-t border-outline-variant/15 overflow-hidden ${className}`}
        aria-hidden="true"
      >
        <div className="flex items-center justify-center gap-6 whitespace-nowrap">
          {items.map((item, i) => (
            <span key={i} className="flex items-center gap-6">
              <span className="font-headline font-bold text-xs uppercase tracking-[0.2em] text-white/50">
                {item}
              </span>
              {i < items.length - 1 && (
                <span className="w-2 h-2 bg-primary rounded-full shrink-0" />
              )}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`glass-panel py-4 border-t border-outline-variant/15 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      <div
        className="flex whitespace-nowrap items-center"
        style={{
          animation: `marquee-scroll ${speed}s linear infinite`,
          willChange: "transform",
        }}
      >
        {[0, 1].map((copy) => (
          <span key={copy} className="flex items-center shrink-0">
            {items.map((item, i) => (
              <span key={`${copy}-${i}`} className="flex items-center">
                <span className="font-headline font-bold text-xs uppercase tracking-[0.2em] text-white/50">
                  {item}
                </span>
                <span className="mx-6 w-2 h-2 bg-primary rounded-full shrink-0" />
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
