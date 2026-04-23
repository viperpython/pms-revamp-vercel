"use client";

import { useState, useEffect } from "react";
import { useReducedMotion } from "framer-motion";

export type PerformanceTier = "high" | "medium" | "low";

interface AdaptivePerformance {
  tier: PerformanceTier;
  prefersReducedMotion: boolean;
  enableParticles: boolean;
  enableCustomCursor: boolean;
  enableSmoothScroll: boolean;
  enableParallax: boolean;
  enableStaggerAnimations: boolean;
  enableHoverEffects: boolean;
  particleCount: number;
}

const TIER_MAP: Record<PerformanceTier, Omit<AdaptivePerformance, "tier" | "prefersReducedMotion">> = {
  high: {
    enableParticles: true,
    enableCustomCursor: true,
    enableSmoothScroll: true,
    enableParallax: true,
    enableStaggerAnimations: true,
    enableHoverEffects: true,
    particleCount: 12,
  },
  medium: {
    enableParticles: true,
    enableCustomCursor: true,
    enableSmoothScroll: true,
    enableParallax: false,
    enableStaggerAnimations: true,
    enableHoverEffects: true,
    particleCount: 6,
  },
  low: {
    enableParticles: false,
    enableCustomCursor: false,
    enableSmoothScroll: false,
    enableParallax: false,
    enableStaggerAnimations: false,
    enableHoverEffects: true,
    particleCount: 0,
  },
};

function tierRank(tier: PerformanceTier): number {
  if (tier === "low") return 0;
  if (tier === "medium") return 1;
  return 2;
}

function rankToTier(rank: number): PerformanceTier {
  if (rank <= 0) return "low";
  if (rank === 1) return "medium";
  return "high";
}

function worstTier(...tiers: PerformanceTier[]): PerformanceTier {
  return rankToTier(Math.min(...tiers.map(tierRank)));
}

function downgrade(tier: PerformanceTier): PerformanceTier {
  return rankToTier(tierRank(tier) - 1);
}

function detectTier(): Promise<PerformanceTier> {
  return new Promise((resolve) => {
    const signals: PerformanceTier[] = [];

    // 1. Hardware concurrency (CPU cores)
    const cores = navigator.hardwareConcurrency ?? 8;
    if (cores <= 2) signals.push("low");
    else if (cores <= 4) signals.push("medium");
    else signals.push("high");

    // 2. Device memory
    const memory = (navigator as any).deviceMemory as number | undefined;
    if (memory !== undefined) {
      if (memory <= 2) signals.push("low");
      else if (memory <= 4) signals.push("medium");
      else signals.push("high");
    }

    // 3. Network effective type
    const connection = (navigator as any).connection as
      | { effectiveType?: string }
      | undefined;
    if (connection?.effectiveType) {
      const etype = connection.effectiveType;
      if (etype === "slow-2g" || etype === "2g") signals.push("low");
      else if (etype === "3g") signals.push("medium");
      else signals.push("high");
    }

    // 4. Reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      signals.push("low");
    }

    // 5. Mobile device — cap at medium
    const isMobile = window.matchMedia("(pointer: coarse)").matches;

    // 6. FPS detection — 30-frame benchmark
    let baseTier = signals.length > 0 ? worstTier(...signals) : "high";
    if (isMobile && tierRank(baseTier) > 1) {
      baseTier = "medium";
    }

    let frameCount = 0;
    let startTime = 0;

    function measureFrame(timestamp: number) {
      if (frameCount === 0) {
        startTime = timestamp;
      }
      frameCount++;
      if (frameCount >= 30) {
        const elapsed = timestamp - startTime;
        const avgFrameTime = elapsed / 30;
        // If average frame time > 20ms (below 50fps), downgrade one tier
        const finalTier = avgFrameTime > 20 ? downgrade(baseTier) : baseTier;
        resolve(finalTier);
        return;
      }
      requestAnimationFrame(measureFrame);
    }

    requestAnimationFrame(measureFrame);
  });
}

// Cache result across hook instances within the same page session
let cachedResult: AdaptivePerformance | null = null;

export function useAdaptivePerformance(): AdaptivePerformance {
  const prefersReducedMotion = !!useReducedMotion();

  const [perf, setPerf] = useState<AdaptivePerformance>(() => {
    if (cachedResult) return { ...cachedResult, prefersReducedMotion };
    // Default to "high" during SSR / before detection
    return { tier: "high", prefersReducedMotion, ...TIER_MAP.high };
  });

  useEffect(() => {
    // If we already have a cached result, use it
    if (cachedResult) {
      const tier = prefersReducedMotion ? "low" : cachedResult.tier;
      const flags = TIER_MAP[tier];
      const result = { tier, prefersReducedMotion, ...flags };
      cachedResult = result;
      setPerf(result);
      return;
    }

    let cancelled = false;

    detectTier().then((detectedTier) => {
      if (cancelled) return;
      const tier = prefersReducedMotion ? "low" : detectedTier;
      const flags = TIER_MAP[tier];
      const result = { tier, prefersReducedMotion, ...flags };
      cachedResult = result;
      setPerf(result);
    });

    return () => {
      cancelled = true;
    };
  }, [prefersReducedMotion]);

  return perf;
}
