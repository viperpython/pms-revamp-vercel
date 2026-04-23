'use client';

import { useRef } from 'react';
import { useScroll } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useAdaptivePerformance } from './hooks/useAdaptivePerformance';

// Above-the-fold — loaded eagerly
import HeroSection from './sections/HeroSection';
import ScrollProgress from './components/ScrollProgress';
import FloatingNav from './components/FloatingNav';
import CustomCursor from './components/CustomCursor';
import SideNav from './components/SideNav';
import TopoBackground from './components/TopoBackground';

// Minimal loading skeleton (tiny footprint)
const SectionSkeleton = ({ height }: { height: string }) => (
  <div style={{ width: '100%', height }} />
);

// Below-the-fold — lazy loaded with code splitting (ssr: false)
const ServicesSection = dynamic(() => import('./sections/ServicesSection'), {
  loading: () => <SectionSkeleton height="600px" />,
  ssr: false,
});
const VisionMissionSection = dynamic(() => import('./sections/VisionMissionSection'), {
  loading: () => <SectionSkeleton height="500px" />,
  ssr: false,
});
const ValuesSection = dynamic(() => import('./sections/ValuesSection'), {
  loading: () => <SectionSkeleton height="600px" />,
  ssr: false,
});
const StrategicAdvantageSection = dynamic(() => import('./sections/StrategicAdvantageSection'), {
  loading: () => <SectionSkeleton height="800px" />,
  ssr: false,
});
const Footer = dynamic(() => import('./sections/Footer'), {
  loading: () => <SectionSkeleton height="400px" />,
  ssr: false,
});

export default function Home() {
  const container = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });
  const perf = useAdaptivePerformance();

  return (
    <div className="bg-surface text-white overflow-x-hidden min-h-screen">
      {/* Topographic background pattern */}
      {perf.tier !== 'low' && (
        <TopoBackground interactive={perf.tier === 'high'} />
      )}

      {/* Accessibility: skip-to-main */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[10000] focus:px-5 focus:py-2.5 focus:rounded-xl focus:font-semibold focus:text-sm focus:bg-white/[0.06] focus:backdrop-blur-2xl focus:border focus:border-primary-container/40 focus:text-primary focus:shadow-[0_0_30px_rgba(255,184,0,0.15)] focus:outline-none focus:ring-2 focus:ring-primary-container/50 focus:ring-offset-2 focus:ring-offset-surface transition-all duration-300"
      >
        Skip to main content
      </a>

      {/* Fixed UI overlays */}
      <ScrollProgress />
      {perf.enableCustomCursor && <CustomCursor />}
      <FloatingNav />
      <SideNav />

      {/* Main content */}
      <main ref={container} id="main-content" role="main">
        <HeroSection scrollYProgress={scrollYProgress} enableParallax={perf.enableParallax} />
        <ServicesSection />
        <VisionMissionSection />
        <ValuesSection />
        <StrategicAdvantageSection />
        <Footer />
      </main>
    </div>
  );
}