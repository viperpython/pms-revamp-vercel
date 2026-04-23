"use client";

import { useReducedMotion, motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";

type ParticleShape = "dot" | "cross" | "diamond";

interface Particle {
  id: number;
  x: number;
  y: number;
  xDrift: number;
  duration: number;
  delay: number;
  opacity: number;
  size: number;
  shape: ParticleShape;
  color: string;
}

const COLORS = [
  "rgba(245,158,11,0.2)",   // amber-500/20
  "rgba(255,255,255,0.1)",  // white/10
  "rgba(249,115,22,0.15)",  // orange-500/15
  "rgba(251,191,36,0.15)",  // amber-400/15
  "rgba(255,255,255,0.06)", // white/6
];

const SHAPES: ParticleShape[] = ["dot", "dot", "dot", "cross", "diamond"];

const MAX_PARTICLES = 12;

function FloatingParticles({ maxCount }: { maxCount?: number }) {
  const [ready, setReady] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const count = maxCount ?? MAX_PARTICLES;

  useEffect(() => {
    if (!prefersReducedMotion && count > 0) setReady(true);
  }, [prefersReducedMotion, count]);

  const particles = useMemo<Particle[]>(() => {
    if (!ready) return [];
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,        // percentage-based for responsiveness
      y: Math.random() * 100,
      xDrift: (Math.random() - 0.5) * 60, // px drift on x axis
      duration: Math.random() * 10 + 15,   // 15-25s
      delay: Math.random() * 8,
      opacity: Math.random() * 0.2 + 0.1,  // 0.1 - 0.3
      size: Math.random() > 0.6 ? 4 : Math.random() > 0.3 ? 2 : 1,
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
  }, [ready, count]);

  if (prefersReducedMotion || count === 0 || !ready || particles.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{
            y: [0, -600, -1200],
            x: [0, p.xDrift, p.xDrift * 0.5],
            opacity: [0, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        >
          <ParticleShape shape={p.shape} size={p.size} color={p.color} />
        </motion.div>
      ))}
    </div>
  );
}

function ParticleShape({ shape, size, color }: { shape: ParticleShape; size: number; color: string }) {
  if (shape === "cross") {
    return (
      <svg width={size * 3} height={size * 3} viewBox="0 0 12 12" fill="none">
        <line x1="6" y1="1" x2="6" y2="11" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="1" y1="6" x2="11" y2="6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (shape === "diamond") {
    return (
      <svg width={size * 3} height={size * 3} viewBox="0 0 12 12" fill="none">
        <rect x="6" y="1" width="5" height="5" rx="0.5" transform="rotate(45 6 1)" fill={color} />
      </svg>
    );
  }
  // Default: dot
  return (
    <div
      className="rounded-full"
      style={{ width: size, height: size, backgroundColor: color }}
    />
  );
}

export default FloatingParticles;