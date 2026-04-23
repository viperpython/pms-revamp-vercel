"use client";

import { useEffect, useRef } from "react";

export function useTimingHarness(label: string) {
  const startRef = useRef<number>(performance.now());

  useEffect(() => {
    const duration = performance.now() - startRef.current;
    if (process.env.NODE_ENV === "development") {
      const color = duration < 100 ? "green" : duration < 300 ? "orange" : "red";
      console.log(
        `%c[Timing] ${label}: ${duration.toFixed(1)}ms`,
        `color: ${color}; font-weight: bold`
      );
    }
  }, [label]);

  return startRef.current;
}
