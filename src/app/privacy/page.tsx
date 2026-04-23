import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | PMS",
  description: "Privacy policy for Pavement Management Services.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-surface min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-12">
        <span className="font-label text-xs font-bold uppercase tracking-[0.15em] text-primary mb-4 block">
          Legal
        </span>

        <h1 className="font-headline text-5xl font-bold text-white uppercase tracking-tighter mb-8">
          Privacy Policy
        </h1>

        <div className="bg-surface-container-high p-10 rounded-lg mb-10">
          <p className="text-on-surface-variant text-sm leading-relaxed">
            This privacy policy will be updated with our complete data
            handling practices before launch. We are committed to
            protecting your personal information and ensuring
            transparency in how we collect, use, and store data in
            compliance with applicable Indian and international privacy
            regulations.
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
