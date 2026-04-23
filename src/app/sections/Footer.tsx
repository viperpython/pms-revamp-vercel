"use client";

import { useState, useCallback } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Send, Linkedin, Twitter, Mail } from "lucide-react";
import { useLenis } from "lenis/react";
import Link from "next/link";
import AnimatedCounter from "../components/AnimatedCounter";

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease },
  }),
};

const expertiseLinks = [
  { label: "FWD Testing", href: "/services/fwd-testing" },
  { label: "Overlay Design", href: "/services/overlay-rehab-design" },
  { label: "RAMS Deliverables", href: "/services/rams-aligned-deliverables" },
  { label: "Advisory & Training", href: "/services/advisory-training" },
];

const quickLinks: Array<{ label: string; href: string; dataPlaceholder?: boolean }> = [
  { label: "Vision & Mission", href: "/#vision" },
  { label: "Core Values", href: "/#values" },
  { label: "Advantage", href: "/#advantage" },
  { label: "Privacy Policy", href: "/privacy", dataPlaceholder: true },
];

const stats = [
  { value: 500, suffix: "+", label: "Projects" },
  { value: 10, suffix: "k+", label: "Kilometers" },
  { value: 100, suffix: "%", label: "RAMS Aligned" },
];

const socialLinks = [
  { name: "LinkedIn", href: "https://linkedin.com", icon: Linkedin, external: true },
  { name: "Twitter", href: "https://twitter.com", icon: Twitter, external: true },
  { name: "Email", href: "mailto:contact@pms.com", icon: Mail, external: false },
];

export default function Footer() {
  const prefersReducedMotion = !!useReducedMotion();
  const lenis = useLenis();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleHashClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      const hash = href.split("#")[1];
      if (!hash) return;
      const el = document.getElementById(hash);
      if (el) {
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(el as HTMLElement, { duration: 1.2, offset: -80 });
        } else {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    },
    [lenis]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");
    setSubmitted(true);
    // TODO: Wire to email service (Mailchimp, ConvertKit, etc.)
  };

  const resolvedFadeUp: Variants = prefersReducedMotion
    ? {
        hidden: { opacity: 1, y: 0 },
        visible: () => ({ opacity: 1, y: 0 }),
      }
    : fadeUp;

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════
          CTA SECTION
          ═══════════════════════════════════════════════════════════ */}
      <section
        className="relative py-32 px-12 md:px-24 bg-surface-container-high overflow-hidden"
        aria-label="Call to action"
      >
        {/* Background — city skyline placeholder (grayscale, faded) */}
        <div
          className="absolute inset-0 opacity-20 grayscale bg-cover bg-center bg-no-repeat pointer-events-none"
          style={{ backgroundImage: "url('/city-skyline.jpg')" }}
          aria-hidden="true"
        />
        {/* Fallback gradient overlay for when no image is present */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(180deg, rgba(40,42,46,0) 0%, rgba(40,42,46,0.6) 100%)",
          }}
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="relative z-10 text-center max-w-4xl mx-auto"
        >
          <motion.h2
            variants={resolvedFadeUp}
            custom={0}
            className="font-headline text-5xl md:text-7xl font-bold text-white tracking-tighter uppercase mb-6"
          >
            Building India&apos;s
            <br />
            Infrastructure
          </motion.h2>

          <motion.p
            variants={resolvedFadeUp}
            custom={1}
            className="text-xl text-on-surface-variant font-light max-w-2xl mx-auto mb-10"
          >
            Partner with India&apos;s most trusted pavement engineering
            consultancy for data-driven highway solutions.
          </motion.p>

          {/* Buttons */}
          <motion.div
            variants={resolvedFadeUp}
            custom={2}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <a
              href="mailto:contact@pms.com"
              data-placeholder="true"
              className="btn-gradient px-12 py-5 rounded-lg font-label text-sm inline-block"
            >
              Contact Our Experts
            </a>
            <a
              href="#"
              data-placeholder="true"
              title="Coming soon"
              className="btn-ghost px-12 py-5 rounded-lg font-label text-sm inline-block"
            >
              Download Capabilities
            </a>
          </motion.div>

          {/* Stats row */}
          <motion.div
            variants={resolvedFadeUp}
            custom={3}
            className="flex items-center justify-center gap-12 md:gap-20 opacity-50"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <span className="font-headline text-3xl md:text-4xl font-bold text-white block">
                  <AnimatedCounter
                    target={stat.value}
                    suffix={stat.suffix}
                    duration={2}
                  />
                </span>
                <span className="text-xs text-on-surface-variant uppercase tracking-wider mt-1 block">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════ */}
      <footer
        id="contact"
        className="mt-24 bg-surface-container-lowest"
        aria-label="Site footer"
      >
        {/* ── Footer Grid ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-4 gap-12 px-12 py-24 max-w-7xl mx-auto"
        >
          {/* Col 1 — Logo & tagline */}
          <motion.div variants={resolvedFadeUp} custom={0}>
            <div className="flex items-center gap-3 mb-6">
              {/* Text logo with gold badge */}
              <span className="font-headline text-2xl font-bold text-white tracking-wider">
                PMS
              </span>
              <span className="bg-primary-container text-on-primary-fixed text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                Est.
              </span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed mb-6">
              Data-driven pavement management solutions built on evidence,
              precision, and scalable methodology.
            </p>
            <div className="inline-flex items-center gap-2 border border-outline-variant/10 rounded-lg px-3 py-2">
              <span className="w-2 h-2 rounded-sm bg-primary-container" aria-hidden="true" />
              <span className="text-[11px] text-on-surface-variant uppercase tracking-wider font-label">
                NHAI Standards Compliant
              </span>
            </div>
          </motion.div>

          {/* Col 2 — Expertise */}
          <motion.div variants={resolvedFadeUp} custom={1}>
            <h3 className="font-label text-primary text-xs uppercase tracking-[0.3em] mb-6">
              Expertise
            </h3>
            <nav aria-label="Expertise links">
              <ul className="space-y-4">
                {expertiseLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-primary-container hover:translate-x-2 transition-all duration-300 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>

          {/* Col 3 — Quick Links */}
          <motion.div variants={resolvedFadeUp} custom={2}>
            <h3 className="font-label text-primary text-xs uppercase tracking-[0.3em] mb-6">
              Quick Links
            </h3>
            <nav aria-label="Quick links">
              <ul className="space-y-4">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={(e) => link.href.includes("#") && handleHashClick(e, link.href)}
                      className="text-sm text-white/60 hover:text-primary-container hover:translate-x-2 transition-all duration-300 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>

          {/* Col 4 — Consultation */}
          <motion.div variants={resolvedFadeUp} custom={3}>
            <h3 className="font-label text-primary text-xs uppercase tracking-[0.3em] mb-6">
              Consultation
            </h3>

            {/* Email input */}
            {submitted ? (
              <div className="flex items-center mb-6 bg-surface-container-highest rounded-lg p-4">
                <p className="text-sm text-primary-container">
                  Thanks! We&apos;ll keep you updated.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mb-6"
              >
                <div className="flex items-center">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="Your email address"
                    aria-label="Email for consultation"
                    className="flex-1 bg-surface-container-highest border-none p-4 text-sm text-white placeholder:text-white/30 rounded-lg rounded-r-none outline-none focus:ring-1 focus:ring-primary-container"
                  />
                  <button
                    type="submit"
                    aria-label="Send consultation request"
                    className="bg-primary-container text-on-primary-fixed p-4 rounded-lg rounded-l-none hover:brightness-110 transition-all"
                  >
                    <Send size={16} strokeWidth={2} />
                  </button>
                </div>
                {error && (
                  <p className="text-xs text-red-400 mt-2">{error}</p>
                )}
              </form>
            )}

            {/* Social icons */}
            <div className="flex gap-3">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    data-placeholder="true"
                    aria-label={`Follow us on ${item.name}`}
                    {...(item.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-white/40 hover:text-primary-container hover:bg-surface-container-high transition-all duration-300"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </motion.div>
        </motion.div>

        {/* ── Bottom Bar ── */}
        <div className="border-t border-white/5 px-12 py-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/30 uppercase tracking-wider">
              &copy; 2024 Pavement Management Services. All Rights Reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/terms"
                className="text-xs text-white/30 hover:text-primary-container transition-colors uppercase tracking-wider"
              >
                Legal Compliance
              </Link>
              <Link
                href="/terms"
                className="text-xs text-white/30 hover:text-primary-container transition-colors uppercase tracking-wider"
              >
                Terms of Engagement
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}