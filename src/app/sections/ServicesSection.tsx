"use client";

import { motion } from "framer-motion";
import { Microscope, Compass, FileText } from "lucide-react";
import ServiceCard from "../components/ServiceCard";
import type { Service } from "../components/ServiceCard";
import { useTimingHarness } from "../hooks/useTimingHarness";

const services: Service[] = [
  {
    title: "Testing",
    desc: "Structural capacity appraisal & FWD analysis with cutting-edge technology for pavement evaluation.",
    icon: Microscope,
    stats: "500+",
    label: "Projects Completed",
    link: "/services/fwd-testing",
    number: "01",
  },
  {
    title: "Consulting",
    desc: "Asset management baselining & strategic planning for optimal pavement performance.",
    icon: Compass,
    stats: "200+",
    label: "Designs Delivered",
    link: "/services/overlay-rehab-design",
    number: "02",
  },
  {
    title: "RAMS",
    desc: "Lifecycle cost optimization & RAMS-aligned deliverables for modern infrastructure compliance.",
    icon: FileText,
    stats: "50+",
    label: "Reports Issued",
    link: "/services/advisory-training",
    number: "03",
  },
];

// ==================== SERVICES SECTION ====================
export default function ServicesSection() {
  useTimingHarness("ServicesSection mount");

  return (
    <section
      id="services"
      className="bg-surface-container-low py-32 px-12 md:px-24"
      aria-labelledby="services-heading"
    >
      {/* Split header: title LEFT, description RIGHT */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8"
      >
        <div>
          <span className="font-label text-[0.75rem] font-bold uppercase tracking-[0.15em] text-primary block mb-3">
            Our Services
          </span>
          <h2
            id="services-heading"
            className="font-headline text-5xl font-bold text-white uppercase"
          >
            Core Expertise
          </h2>
        </div>
        <p className="text-on-surface-variant leading-relaxed max-w-md border-l border-outline/20 pl-8">
          Precision engineering meets data science. End-to-end pavement
          solutions that transform infrastructure management.
        </p>
      </motion.div>

      {/* 3-column grid with hairline separators */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-px bg-outline-variant/10"
        role="list"
      >
        {services.map((service, i) => (
          <ServiceCard key={service.title} service={service} index={i} />
        ))}
      </div>
    </section>
  );
}