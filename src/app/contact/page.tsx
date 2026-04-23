"use client";

import { useState, type FormEvent } from "react";
import {
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { Mail, Phone, MapPin, CheckCircle } from "lucide-react";
import Link from "next/link";

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease },
  }),
};

const noMotion: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: () => ({ opacity: 1, y: 0 }),
};

const subjectOptions = [
  "FWD Testing Inquiry",
  "Design Consultation",
  "RAMS Deliverables",
  "General Inquiry",
] as const;

const contactDetails = [
  {
    icon: Mail,
    label: "Email",
    value: "contact@pms.com",
    href: "mailto:contact@pms.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 98XXX XXXXX",
    href: "tel:+9198XXXXXXXX",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "India",
    href: undefined,
  },
] as const;

export default function ContactPage() {
  const prefersReducedMotion = !!useReducedMotion();
  const variants = prefersReducedMotion ? noMotion : fadeUp;

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // TODO: Connect to backend API (Formspree, Resend, etc.)
    setSubmitted(true);
  }

  return (
    <div className="bg-surface min-h-screen pt-24 pb-20">
      <div className="grid md:grid-cols-12 gap-12 max-w-[1400px] mx-auto px-12">
        {/* ═══════════════ Left Column — Company Info ═══════════════ */}
        <motion.div
          initial="hidden"
          animate="visible"
          className="md:col-span-5 flex flex-col justify-center"
        >
          <motion.span
            variants={variants}
            custom={0}
            className="font-label text-xs font-bold uppercase tracking-[0.15em] text-primary mb-4 block"
          >
            Get in Touch
          </motion.span>

          <motion.h1
            variants={variants}
            custom={1}
            className="font-headline text-5xl font-bold text-white uppercase tracking-tighter mb-6"
          >
            Let&apos;s Build
            <br />
            Together
          </motion.h1>

          <motion.p
            variants={variants}
            custom={2}
            className="text-on-surface-variant text-base leading-relaxed mb-10 max-w-md"
          >
            Whether you need FWD testing expertise, overlay design
            consultation, or RAMS-aligned deliverables — our team of
            pavement engineering specialists is ready to partner with you.
          </motion.p>

          <motion.div
            variants={variants}
            custom={3}
            className="space-y-6"
          >
            {contactDetails.map((detail) => {
              const Icon = detail.icon;
              const content = (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-primary-container" />
                  </div>
                  <div>
                    <span className="font-label text-xs font-bold uppercase tracking-[0.15em] text-on-surface-variant block mb-1">
                      {detail.label}
                    </span>
                    <span className="text-sm text-white">
                      {detail.value}
                    </span>
                  </div>
                </div>
              );

              return detail.href ? (
                <a
                  key={detail.label}
                  href={detail.href}
                  className="block hover:opacity-80 transition-opacity"
                >
                  {content}
                </a>
              ) : (
                <div key={detail.label}>{content}</div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* ═══════════════ Right Column — Contact Form ═══════════════ */}
        <motion.div
          initial="hidden"
          animate="visible"
          className="md:col-span-7"
        >
          <motion.div
            variants={variants}
            custom={1}
            className="bg-surface-container-high p-10 rounded-lg"
          >
            {submitted ? (
              /* ── Success State ── */
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <CheckCircle
                  size={48}
                  className="text-green-400 mb-6"
                />
                <h2 className="font-headline text-2xl font-bold text-white uppercase tracking-tight mb-3">
                  Thank You!
                </h2>
                <p className="text-on-surface-variant text-sm max-w-sm">
                  We&apos;ll be in touch within 24 hours.
                </p>
                <Link
                  href="/"
                  className="btn-ghost px-8 py-3 rounded-lg font-label text-xs mt-8 inline-block"
                >
                  Back to Home
                </Link>
              </div>
            ) : (
              /* ── Form ── */
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="font-label text-xs font-bold uppercase tracking-[0.15em] text-on-surface-variant mb-2 block"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="bg-surface-container-highest border-none p-4 text-on-surface font-body text-sm w-full rounded-lg focus:ring-2 focus:ring-primary-container focus:outline-none placeholder:text-white/30"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="font-label text-xs font-bold uppercase tracking-[0.15em] text-on-surface-variant mb-2 block"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    className="bg-surface-container-highest border-none p-4 text-on-surface font-body text-sm w-full rounded-lg focus:ring-2 focus:ring-primary-container focus:outline-none placeholder:text-white/30"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="font-label text-xs font-bold uppercase tracking-[0.15em] text-on-surface-variant mb-2 block"
                  >
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={form.subject}
                    onChange={handleChange}
                    className="bg-surface-container-highest border-none p-4 text-on-surface font-body text-sm w-full rounded-lg focus:ring-2 focus:ring-primary-container focus:outline-none appearance-none"
                  >
                    <option value="" disabled>
                      Select a subject
                    </option>
                    {subjectOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="font-label text-xs font-bold uppercase tracking-[0.15em] text-on-surface-variant mb-2 block"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project..."
                    className="bg-surface-container-highest border-none p-4 text-on-surface font-body text-sm w-full rounded-lg focus:ring-2 focus:ring-primary-container focus:outline-none resize-none placeholder:text-white/30"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-gradient w-full py-4 rounded-lg font-label text-sm"
                >
                  Send Message
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
