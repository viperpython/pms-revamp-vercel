"use client";

import { useRef, useEffect, useCallback } from "react";
import { useReducedMotion } from "framer-motion";

// ─── Compact 2D simplex noise ────────────────────────────────────────────────
const F2 = 0.5 * (Math.sqrt(3) - 1);
const G2 = (3 - Math.sqrt(3)) / 6;

const perm = new Uint8Array(512);
const grad: [number, number][] = [
  [1, 1], [-1, 1], [1, -1], [-1, -1],
  [1, 0], [-1, 0], [0, 1], [0, -1],
];
// Seeded permutation table (deterministic so it's the same across renders)
for (let i = 0; i < 256; i++) perm[i] = i;
for (let i = 255; i > 0; i--) {
  const j = (i * 48271 + 11) % (i + 1); // simple LCG shuffle
  [perm[i], perm[j]] = [perm[j], perm[i]];
}
for (let i = 0; i < 256; i++) perm[i + 256] = perm[i];

function noise2D(x: number, y: number): number {
  const s = (x + y) * F2;
  const i = Math.floor(x + s);
  const j = Math.floor(y + s);
  const t = (i + j) * G2;
  const x0 = x - (i - t);
  const y0 = y - (j - t);
  const i1 = x0 > y0 ? 1 : 0;
  const j1 = x0 > y0 ? 0 : 1;
  const x1 = x0 - i1 + G2;
  const y1 = y0 - j1 + G2;
  const x2 = x0 - 1 + 2 * G2;
  const y2 = y0 - 1 + 2 * G2;
  const ii = i & 255;
  const jj = j & 255;

  let n0 = 0, n1 = 0, n2 = 0;
  let t0 = 0.5 - x0 * x0 - y0 * y0;
  if (t0 > 0) {
    t0 *= t0;
    const g = grad[perm[ii + perm[jj]] & 7];
    n0 = t0 * t0 * (g[0] * x0 + g[1] * y0);
  }
  let t1 = 0.5 - x1 * x1 - y1 * y1;
  if (t1 > 0) {
    t1 *= t1;
    const g = grad[perm[ii + i1 + perm[jj + j1]] & 7];
    n1 = t1 * t1 * (g[0] * x1 + g[1] * y1);
  }
  let t2 = 0.5 - x2 * x2 - y2 * y2;
  if (t2 > 0) {
    t2 *= t2;
    const g = grad[perm[ii + 1 + perm[jj + 1]] & 7];
    n2 = t2 * t2 * (g[0] * x2 + g[1] * y2);
  }
  return 70 * (n0 + n1 + n2);
}

// Fractal Brownian Motion for richer terrain
function fbm(x: number, y: number, octaves: number = 3): number {
  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  let maxValue = 0;
  for (let i = 0; i < octaves; i++) {
    value += noise2D(x * frequency, y * frequency) * amplitude;
    maxValue += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }
  return value / maxValue;
}

// ─── Types ───────────────────────────────────────────────────────────────────
interface TopoBackgroundProps {
  className?: string;
  opacity?: number;
  interactive?: boolean;
}

// ─── Constants ───────────────────────────────────────────────────────────────
const LINE_COUNT = 18;
const NOISE_SCALE = 0.003;
const TIME_SPEED = 0.0008;
const MOUSE_RADIUS = 200;
const MOUSE_STRENGTH = 25;
const LERP_FACTOR = 0.03;
const FRAME_INTERVAL = 1000 / 30; // ~30fps
const MOBILE_BREAKPOINT = 768;

// Gold palette line colors (low to high opacity)
function getLineColor(index: number, total: number): string {
  const t = index / (total - 1);
  const r = Math.round(255 - t * 0);       // 255
  const g = Math.round(184 + t * 36);       // 184 → 220
  const b = Math.round(0 + t * 161);        // 0 → 161
  const alpha = 0.04 + t * 0.06;            // 0.04 → 0.10
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function TopoBackground({
  className = "",
  opacity = 1,
  interactive = true,
}: TopoBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const smoothMouseRef = useRef<{ x: number; y: number; influence: number }>({ x: -9999, y: -9999, influence: 0 });
  const mouseInfluenceRef = useRef(0); // 0 = no effect, 1 = full effect
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);
  const lastFrameRef = useRef(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current.x = e.clientX;
    mouseRef.current.y = e.clientY;
    mouseInfluenceRef.current = 1;
  }, []);

  const handleMouseLeave = useCallback(() => {
    // Don't snap position — just fade out influence
    mouseInfluenceRef.current = 0;
  }, []);

  useEffect(() => {
    // Skip on mobile
    if (typeof window === "undefined" || window.innerWidth < MOBILE_BREAKPOINT) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: false });
    if (!ctx) return;

    const isStatic = !!reducedMotion;
    const isInteractive = interactive && !isStatic;

    // ── Resize handling ──────────────────────────────────────────────────
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 200);
    };
    window.addEventListener("resize", handleResize);

    // ── Mouse events ─────────────────────────────────────────────────────
    if (isInteractive) {
      window.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseleave", handleMouseLeave);
    }

    // ── Drawing ──────────────────────────────────────────────────────────
    const drawContours = (time: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      // Lerp smooth mouse position + fade influence
      if (isInteractive) {
        // Smoothly fade influence in/out (water-like settle)
        const targetInfluence = mouseInfluenceRef.current;
        const currentInfluence = smoothMouseRef.current.influence ;
        smoothMouseRef.current.influence = currentInfluence + (targetInfluence - currentInfluence) * 0.02;

        // Only lerp position when mouse is active
        if (mouseInfluenceRef.current > 0) {
          smoothMouseRef.current.x +=
            (mouseRef.current.x - smoothMouseRef.current.x) * LERP_FACTOR;
          smoothMouseRef.current.y +=
            (mouseRef.current.y - smoothMouseRef.current.y) * LERP_FACTOR;
        }
      }

      const mx = smoothMouseRef.current.x;
      const my = smoothMouseRef.current.y;
      const mInfluence = smoothMouseRef.current.influence ;
      const step = 6; // horizontal sample step (px)

      for (let i = 0; i < LINE_COUNT; i++) {
        const baseY = (h / (LINE_COUNT + 1)) * (i + 1);
        const color = getLineColor(i, LINE_COUNT);
        const lineWidth = 0.5 + (i % 3) * 0.25; // 0.5, 0.75, 1.0 cycling

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;

        let firstPoint = true;
        // Collect points for smooth curve
        const points: { x: number; y: number }[] = [];

        for (let x = -step; x <= w + step; x += step) {
          // Multi-octave noise for organic terrain feel
          const nx = x * NOISE_SCALE;
          const ny = i * 0.6;
          const noiseVal = fbm(nx, ny + time * 0.5, 3);

          // Amplitude varies per line for depth
          const amplitude = 30 + Math.sin(i * 0.7) * 15;
          let yOffset = noiseVal * amplitude;

          // Secondary wave for additional contour character
          const secondaryNoise = noise2D(nx * 2.5, ny * 1.3 + time * 0.3);
          yOffset += secondaryNoise * 12;

          let py = baseY + yOffset;

          // Mouse distortion — even outward push (no whiplash)
          if (isInteractive && mInfluence > 0.01) {
            const dx = x - mx;
            const dy = py - my;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < MOUSE_RADIUS) {
              const t = dist / MOUSE_RADIUS;
              const falloff = 1 - t * t * (3 - 2 * t);
              // Push purely vertical, away from cursor center
              // Positive dy = line is below cursor → push down
              // Negative dy = line is above cursor → push up
              // Near zero dy = minimal push (line is at cursor level)
              const normalizedDy = dy / (Math.abs(dy) + 30); // soft normalize, avoids flip at zero
              py += normalizedDy * falloff * MOUSE_STRENGTH * mInfluence * 2.5;
            }
          }

          points.push({ x, y: py });
        }

        // Draw smooth curve through points using quadratic curves
        if (points.length > 1) {
          ctx.moveTo(points[0].x, points[0].y);
          for (let p = 0; p < points.length - 1; p++) {
            const cpx = (points[p].x + points[p + 1].x) / 2;
            const cpy = (points[p].y + points[p + 1].y) / 2;
            ctx.quadraticCurveTo(points[p].x, points[p].y, cpx, cpy);
          }
          const last = points[points.length - 1];
          ctx.lineTo(last.x, last.y);
        }

        ctx.stroke();
      }

      // Optional: faint blue accent line (tertiary)
      {
        const accentIdx = Math.floor(LINE_COUNT * 0.6);
        const baseY = (h / (LINE_COUNT + 1)) * (accentIdx + 1);
        ctx.beginPath();
        ctx.strokeStyle = "rgba(171, 235, 255, 0.025)";
        ctx.lineWidth = 0.8;

        const pts: { x: number; y: number }[] = [];
        for (let x = -step; x <= w + step; x += step) {
          const nx = x * NOISE_SCALE * 1.2;
          const ny = accentIdx * 0.6 + 0.3;
          const noiseVal = fbm(nx, ny + time * 0.5, 3);
          let py = baseY + noiseVal * 25 - 8;

          if (isInteractive && mInfluence > 0.01) {
            const dx = x - mx;
            const dy = py - my;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < MOUSE_RADIUS) {
              const t = dist / MOUSE_RADIUS;
              const falloff = 1 - t * t * (3 - 2 * t);
              const normalizedDy = dy / (Math.abs(dy) + 30);
              py += normalizedDy * falloff * MOUSE_STRENGTH * mInfluence * 2.5;
            }
          }

          pts.push({ x, y: py });
        }

        if (pts.length > 1) {
          ctx.moveTo(pts[0].x, pts[0].y);
          for (let p = 0; p < pts.length - 1; p++) {
            const cpx = (pts[p].x + pts[p + 1].x) / 2;
            const cpy = (pts[p].y + pts[p + 1].y) / 2;
            ctx.quadraticCurveTo(pts[p].x, pts[p].y, cpx, cpy);
          }
          const last = pts[pts.length - 1];
          ctx.lineTo(last.x, last.y);
        }
        ctx.stroke();
      }
    };

    // ── Static render (reduced motion) ───────────────────────────────────
    if (isStatic) {
      drawContours(0);
      return () => {
        window.removeEventListener("resize", handleResize);
        clearTimeout(resizeTimeout);
      };
    }

    // ── Animation loop (30fps throttled) ─────────────────────────────────
    const animate = (timestamp: number) => {
      rafRef.current = requestAnimationFrame(animate);

      const delta = timestamp - lastFrameRef.current;
      if (delta < FRAME_INTERVAL) return;
      lastFrameRef.current = timestamp - (delta % FRAME_INTERVAL);

      timeRef.current += TIME_SPEED;
      drawContours(timeRef.current);
    };

    rafRef.current = requestAnimationFrame(animate);

    // ── Cleanup ──────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
      if (isInteractive) {
        window.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [reducedMotion, interactive, handleMouseMove, handleMouseLeave]);

  // Don't render on mobile (SSR-safe: render canvas always, effect will skip draw)
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity,
      }}
    />
  );
}
