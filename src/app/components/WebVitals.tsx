"use client";

import { useEffect } from "react";

function sendToAnalytics(metric: { name: string; value: number; rating: string }) {
  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    const color = metric.rating === "good" ? "green" : metric.rating === "needs-improvement" ? "orange" : "red";
    console.log(
      `%c[Web Vital] ${metric.name}: ${Math.round(metric.value)}ms (${metric.rating})`,
      `color: ${color}; font-weight: bold`
    );
  }
}

export default function WebVitals() {
  useEffect(() => {
    // Dynamic import to avoid bundle bloat
    import("web-vitals").then(({ onCLS, onINP, onLCP, onFCP, onTTFB }) => {
      onCLS(sendToAnalytics);
      onINP(sendToAnalytics);
      onLCP(sendToAnalytics);
      onFCP(sendToAnalytics);
      onTTFB(sendToAnalytics);
    });
  }, []);

  return null;
}
