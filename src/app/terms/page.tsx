import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Engagement | PMS",
  description: "Terms of engagement for Pavement Management Services.",
};

export default function TermsPage() {
  return (
    <div className="bg-surface min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-12">
        <span className="font-label text-xs font-bold uppercase tracking-[0.15em] text-primary mb-4 block">
          Legal
        </span>

        <h1 className="font-headline text-5xl font-bold text-white uppercase tracking-tighter mb-8">
          Terms of Engagement
        </h1>

        <div className="bg-surface-container-high p-10 rounded-lg mb-10">
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Our terms of engagement are currently being finalized and
            will be published before launch. These terms will outline the
            scope of services, deliverables, timelines, liability
            provisions, and dispute resolution processes applicable to
            all consulting engagements with Pavement Management Services.
          </p>
        </div>

        <Link
          href="/"
          className="btn-ghost px-8 py-3 rounded-lg font-label text-xs inline-block"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
