"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";
import type { LucideIcon } from "lucide-react";

export interface Service {
  title: string;
  desc: string;
  icon: LucideIcon;
  stats: string;
  label: string;
  link: string;
  number: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.15,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

export default function ServiceCard({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  const prefersReducedMotion = !!useReducedMotion();
  const Icon = service.icon;
  const statsNumber = parseInt(service.stats);
  const statsSuffix = service.stats.replace(/[0-9]/g, "");

  return (
    <motion.article
      variants={cardVariants}
      initial={prefersReducedMotion ? "visible" : "hidden"}
      whileInView="visible"
      custom={index}
      viewport={{ once: true, amount: 0.15 }}
      className="bg-surface-container-low p-12 group hover:bg-surface-container-high transition-colors duration-500 cursor-pointer"
      role="listitem"
    >
      <Link href={service.link} className="block">
        {/* Faded number */}
        <span className="font-headline text-4xl text-primary-container font-light opacity-50 mb-8 block">
          {service.number}
        </span>

        {/* Icon + Title row */}
        <div className="flex items-center gap-4 mb-4">
          <Icon className="w-6 h-6 text-primary shrink-0" aria-hidden="true" />
          <h3 className="font-headline text-2xl font-bold text-white uppercase tracking-tight">
            {service.title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-on-surface-variant leading-relaxed mb-12">
          {service.desc}
        </p>

        {/* Bottom row */}
        <div className="flex items-end justify-between">
          {/* Arrow link */}
          <span className="flex items-center gap-3 text-primary font-label text-xs uppercase font-bold tracking-widest group-hover:gap-6 transition-all duration-500">
            Explore
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </span>

          {/* Stat */}
          <div className="text-right">
            <AnimatedCounter
              target={statsNumber}
              suffix={statsSuffix}
              className="font-headline text-2xl font-bold text-white block"
            />
            <span className="font-label text-[10px] text-white/40 uppercase tracking-widest">
              {service.label}
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}