'use client';

import React, { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ServiceSidebar from '../components/ServiceSidebar';
import TopoBackground from '../components/TopoBackground';
import { useAdaptivePerformance } from '../hooks/useAdaptivePerformance';
import Link from 'next/link';
import Image from 'next/image';
import PMSLogo from '../Untitled.png';

const ease = [0.16, 1, 0.3, 1] as const;

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services/fwd-testing' },
  { label: 'Why PMS', href: '/#advantage' },
  { label: 'Contact', href: '/contact' },
] as const;

const mobileServices = [
  { label: 'FWD', href: '/services/fwd-testing' },
  { label: 'Design', href: '/services/overlay-rehab-design' },
  { label: 'RAMS', href: '/services/rams-aligned-deliverables' },
  { label: 'Axle', href: '/services/axle-load-vdf-surveys' },
  { label: 'Field', href: '/services/field-investigations' },
  { label: 'Advisory', href: '/services/advisory-training' },
] as const;

const MobileServiceNav = React.memo(function MobileServiceNav({ pathname }: { pathname: string }) {
  return (
    <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[998] w-[calc(100%-2rem)] max-w-md">
      <div className="px-2 py-2 glass-panel rounded-lg border border-outline-variant/10 flex items-center justify-between">
        {mobileServices.map((s) => {
          const isActive = pathname === s.href;
          return (
            <Link
              key={s.href}
              href={s.href}
              className={`text-[11px] text-center transition-all duration-300 px-2 py-1.5 rounded-lg font-medium ${
                isActive
                  ? 'text-primary-container bg-surface-container-high'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              {s.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
});

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const perf = useAdaptivePerformance();

  const renderedNavLinks = useMemo(
    () =>
      navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm text-white/50 hover:text-white transition-colors duration-300"
        >
          {link.label}
        </Link>
      )),
    []
  );

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      {/* Topographic background pattern — lower opacity on text-heavy pages, no interaction */}
      {perf.tier !== 'low' && <TopoBackground opacity={0.5} interactive={false} />}

      {/* ═══════════════════ TOP NAV — glass-panel with gold CTA ═══════════════════ */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="fixed top-0 left-0 right-0 z-[999] glass-panel border-b border-outline-variant/10"
      >
        <div className="max-w-[1700px] mx-auto px-6 sm:px-12 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src={PMSLogo} alt="PMS" width={36} height={36} />
            <span className="text-sm font-semibold text-white/80 hidden sm:block">
              Pavement Management Solutions
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {renderedNavLinks}
            <Link href="/contact" className="btn-gradient px-5 py-2 rounded-lg text-xs">
              Get a Quote
            </Link>
          </nav>
        </div>
      </motion.header>

      {/* ═══════════════════ SIDEBAR (fixed / overlaid) ═══════════════════ */}
      <ServiceSidebar />

      {/* ═══════════════════ MAIN CONTENT — full-width ═══════════════════ */}
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease }}
          className="w-full"
        >
          {children}
        </motion.main>
      </AnimatePresence>

      {/* ═══════════════════ MOBILE NAV ═══════════════════ */}
      <MobileServiceNav pathname={pathname} />
    </div>
  );
}