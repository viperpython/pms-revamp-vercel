'use client';

import { ReactLenis, useLenis } from 'lenis/react';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function SmoothScroll({ children, disabled = false }: { children: React.ReactNode; disabled?: boolean }) {
  const lenis = useLenis();
  const pathname = usePathname();
  const [reducedMotion, setReducedMotion] = useState(false);

  // Detect prefers-reduced-motion on mount
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Force scroll to top on mount and route change — prevents browser scroll restoration
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true });
  }, [pathname, lenis]);

  // Mark html as Lenis-active for external styling hooks
  useEffect(() => {
    if (disabled || reducedMotion) return;
    document.documentElement.classList.add('lenis-active');
    return () => {
      document.documentElement.classList.remove('lenis-active');
    };
  }, [disabled, reducedMotion]);

  if (disabled || reducedMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 0.8,
      }}
    >
      {children}
    </ReactLenis>
  );
}