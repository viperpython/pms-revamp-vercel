'use client';

import { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';

// ─── Types ───────────────────────────────────────────────
export interface ServiceBullet {
  text: string;
}

export interface ServiceSection {
  heading?: string;
  body: string;
  bullets?: ServiceBullet[];
}

export interface ServiceImage {
  src: StaticImageData;
  alt: string;
}

export interface ServicePageData {
  title: string;
  titleAccent?: string;
  tagline: string;
  overline: string;
  heroImage: StaticImageData;
  accentColor: 'amber' | 'blue' | 'emerald' | 'rose' | 'teal' | 'indigo';
  icon?: string;
  stats: { value: string; label: string };
  compliance?: { label: string; value: string };
  sections: ServiceSection[];
  images?: ServiceImage[];
  prevService?: { title: string; href: string };
  nextService?: { title: string; href: string };
}

const ease = [0.16, 1, 0.3, 1] as const;

export default function ServicePageTemplate({ data }: { data: ServicePageData }) {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const prefersReducedMotion = !!useReducedMotion();
  const animDuration = prefersReducedMotion ? 0 : 0.8;

  // Split sections: overview (no heading before first heading), bento (with headings), trailing compliance text
  const { overviewSections, bentoSections, complianceText } = useMemo(() => {
    const overview: ServiceSection[] = [];
    const bento: ServiceSection[] = [];
    let compliance = '';
    let foundHeading = false;

    for (const s of data.sections) {
      if (s.heading) {
        foundHeading = true;
        bento.push(s);
      } else if (!foundHeading) {
        overview.push(s);
      } else {
        compliance = s.body;
      }
    }
    return { overviewSections: overview, bentoSections: bento, complianceText: compliance };
  }, [data.sections]);

  const sectionAnim = (delay: number) => ({
    initial: { opacity: 0, y: prefersReducedMotion ? 0 : 40 } as const,
    whileInView: { opacity: 1, y: 0 } as const,
    viewport: { once: true, margin: '-80px' as const },
    transition: { duration: prefersReducedMotion ? 0 : 0.7, delay: prefersReducedMotion ? 0 : delay, ease },
  });

  const displayTitle = data.title + (data.titleAccent ? ' ' + data.titleAccent : '');

  return (
    <article className="w-full">
      {/* ═══════════════════ HERO ═══════════════════ */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center px-6 sm:px-12 lg:pl-24 pt-20 overflow-hidden"
      >
        {/* Background image — grayscale + dimmed */}
        <motion.div
          className="absolute inset-0"
          style={prefersReducedMotion ? {} : { y: heroY, scale: heroScale }}
        >
          <Image
            src={data.heroImage}
            alt={displayTitle}
            fill
            className="object-cover grayscale opacity-40"
            priority
            sizes="100vw"
            placeholder="blur"
          />
        </motion.div>

        {/* Gradient overlay — left-to-right fade */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />

        {/* Hero content */}
        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-4xl">
          {/* Overline */}
          <motion.div
            initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: animDuration, delay: prefersReducedMotion ? 0 : 0.2, ease }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-8 h-px bg-primary" />
            <span className="font-label text-xs font-bold uppercase tracking-[0.2em] text-primary">
              {data.overline}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: animDuration, delay: prefersReducedMotion ? 0 : 0.3, ease }}
            className="font-headline text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] leading-[0.9] font-bold text-white uppercase mb-6"
          >
            {data.title}
            {data.titleAccent && (
              <>
                <br />
                <span className="text-primary-container">{data.titleAccent}</span>
              </>
            )}
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: animDuration, delay: prefersReducedMotion ? 0 : 0.5, ease }}
            className="font-body text-xl sm:text-2xl text-on-surface-variant font-medium mb-12"
          >
            {data.tagline}
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: animDuration, delay: prefersReducedMotion ? 0 : 0.7, ease }}
            className="flex items-center gap-6 flex-wrap"
          >
            <div>
              <span className="text-4xl sm:text-5xl font-headline font-bold text-white">
                {data.stats.value}
              </span>
              <p className="text-sm text-on-surface-variant mt-1">{data.stats.label}</p>
            </div>

            {data.compliance && (
              <>
                <div className="w-px h-12 bg-outline-variant/30" />
                <div className="glass-panel rounded-lg px-5 py-3 border border-outline-variant/20">
                  <span className="font-label text-xs font-bold uppercase tracking-[0.15em] text-primary">
                    {data.compliance.label}
                  </span>
                  <p className="text-sm text-on-surface-variant mt-0.5">{data.compliance.value}</p>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: prefersReducedMotion ? 0 : 1.2, duration: prefersReducedMotion ? 0 : 0.6 }}
          className="absolute bottom-8 left-6 sm:left-12 lg:left-24 flex items-center gap-3 text-on-surface-variant/60"
        >
          <span className="font-label text-xs uppercase tracking-[0.15em]">Technical Specifications</span>
          <motion.svg
            animate={prefersReducedMotion ? {} : { y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </motion.svg>
        </motion.div>
      </section>

      {/* ═══════════════════ ASYMMETRIC BENTO GRID ═══════════════════ */}
      <section className="py-16 sm:py-24 px-6 sm:px-12 lg:pl-24 bg-surface">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-[1700px] mx-auto">
          {/* Left column — overview + compliance card */}
          <div className="lg:col-span-4 space-y-8">
            {overviewSections.map((section, i) => (
              <motion.div key={i} {...sectionAnim(i * 0.1)}>
                <p className="font-body text-on-surface-variant leading-relaxed text-base lg:text-lg">
                  {section.body}
                </p>
              </motion.div>
            ))}

            {data.compliance && (
              <motion.div
                {...sectionAnim(0.3)}
                className="glass-panel shimmer-border rounded-lg p-6 border-l-4 border-primary-container"
              >
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-5 h-5 text-primary-container" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="font-label text-xs font-bold uppercase tracking-[0.15em] text-primary">
                    {data.compliance.label} {data.compliance.value}
                  </span>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  All protocols aligned with national standards and regulatory frameworks.
                </p>
              </motion.div>
            )}
          </div>

          {/* Right column — bento grid cards */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {bentoSections.map((section, i) => {
                const isFullWidth = bentoSections.length === 1 || i >= 2;

                return (
                  <motion.div
                    key={i}
                    {...sectionAnim(0.1 + i * 0.15)}
                    className={`glass-panel shimmer-border rounded-lg p-6 sm:p-8 border border-outline-variant/10 ${
                      isFullWidth ? 'sm:col-span-2' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-2 h-2 rounded-full bg-primary-container" />
                      <h3 className="font-headline text-lg font-bold text-white">
                        {section.heading}
                      </h3>
                    </div>

                    <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-4">
                      {section.body}
                    </p>

                    {section.bullets && section.bullets.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {section.bullets.map((bullet, j) => (
                          <motion.span
                            key={j}
                            initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: prefersReducedMotion ? 0 : j * 0.05, ease }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-high rounded-lg text-xs text-on-surface-variant border border-outline-variant/10"
                          >
                            <svg className="w-3 h-3 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            {bullet.text}
                          </motion.span>
                        ))}
                      </div>
                    )}

                    {/* Progress bars for full-width bottom cards */}
                    {isFullWidth && i >= 2 && (
                      <div className="mt-6 space-y-3">
                        {['Structural Analysis', 'Design Optimization', 'Quality Assurance'].map((label, j) => (
                          <div key={label}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-on-surface-variant/70">{label}</span>
                              <span className="text-primary">{[92, 87, 95][j]}%</span>
                            </div>
                            <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${[92, 87, 95][j]}%` }}
                                viewport={{ once: true }}
                                transition={{
                                  duration: prefersReducedMotion ? 0 : 1.2,
                                  delay: prefersReducedMotion ? 0 : 0.3 + j * 0.15,
                                  ease,
                                }}
                                className="h-full bg-gradient-to-r from-primary-container to-primary rounded-full"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ COMPLIANCE SECTION ═══════════════════ */}
      {(complianceText || data.compliance) && (
        <section className="bg-surface-container-lowest py-16 sm:py-24">
          <div className="max-w-[1700px] mx-auto px-6 sm:px-12 lg:pl-24">
            <motion.div
              {...sectionAnim(0.1)}
              className="glass-panel rounded-lg p-8 sm:p-12 border-l-4 border-primary-container flex flex-col lg:flex-row items-start lg:items-center gap-8"
            >
              <div className="flex-1">
                <h2 className="font-headline text-2xl sm:text-3xl font-bold text-white uppercase mb-4">
                  {data.compliance?.label ?? 'NHAI'} Compliant Protocols
                </h2>
                {complianceText && (
                  <p className="font-body text-on-surface-variant leading-relaxed">
                    {complianceText}
                  </p>
                )}
              </div>

              {/* Spinning seal badge */}
              <div className="shrink-0" aria-hidden="true">
                <motion.div
                  animate={prefersReducedMotion ? {} : { rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-primary-container/30 flex items-center justify-center"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-surface-container-high border border-primary-container/20 flex items-center justify-center">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-primary-container" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════════════ IMAGE GALLERY ═══════════════════ */}
      {data.images && data.images.length > 0 && (
        <section className="py-16 sm:py-24 px-6 sm:px-12 lg:pl-24">
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6, ease }}
            className="max-w-[1700px] mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
          >
            {data.images.map((img, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4, ease }}
                className="relative h-64 rounded-lg overflow-hidden glass-panel border border-outline-variant/10 group cursor-pointer hover:border-outline-variant/20 transition-all duration-500"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <p className="absolute bottom-4 left-4 right-4 text-sm text-on-surface-variant font-medium">
                  {img.alt}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* ═══════════════════ CTA SECTION ═══════════════════ */}
      <section className="py-20 sm:py-32 px-6 sm:px-12 lg:pl-24">
        <motion.div {...sectionAnim(0.1)} className="max-w-3xl mx-auto text-center">
          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to get started with{' '}
            <span className="text-primary-container">{displayTitle}</span>?
          </h2>
          <p className="font-body text-lg text-on-surface-variant mb-10 max-w-xl mx-auto">
            Let&apos;s discuss how PMS can support your project with expert services.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="btn-gradient px-8 py-4 rounded-lg text-sm">
              Get in Touch
            </Link>
            <Link href="/" className="btn-ghost px-8 py-4 rounded-lg text-sm">
              Learn More
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ PREV / NEXT NAVIGATION ═══════════════════ */}
      <div className="px-6 sm:px-12 lg:pl-24 pb-20">
        <div className="max-w-[1700px] mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {data.prevService ? (
            <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
              <Link
                href={data.prevService.href}
                className="group flex items-center gap-4 p-6 glass-panel rounded-lg border border-outline-variant/10 hover:border-outline-variant/20 transition-all duration-300"
              >
                <span className="shrink-0 w-10 h-10 rounded-lg bg-surface-container-high border border-outline-variant/10 flex items-center justify-center group-hover:-translate-x-1 transition-transform duration-300">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </span>
                <div>
                  <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant/50 font-medium">
                    Previous
                  </span>
                  <p className="text-white font-semibold mt-0.5">{data.prevService.title}</p>
                </div>
              </Link>
            </motion.div>
          ) : (
            <div />
          )}
          {data.nextService ? (
            <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
              <Link
                href={data.nextService.href}
                className="group flex items-center justify-end gap-4 p-6 glass-panel rounded-lg border border-outline-variant/10 hover:border-outline-variant/20 transition-all duration-300 text-right"
              >
                <div>
                  <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant/50 font-medium">
                    Next
                  </span>
                  <p className="text-white font-semibold mt-0.5">{data.nextService.title}</p>
                </div>
                <span className="shrink-0 w-10 h-10 rounded-lg bg-surface-container-high border border-outline-variant/10 flex items-center justify-center group-hover:translate-x-1 transition-transform duration-300">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </motion.div>
          ) : (
            <div />
          )}
        </div>
      </div>
    </article>
  );
}