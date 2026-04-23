import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | PMS",
  description:
    "Get in touch with Pavement Management Services for FWD testing, overlay design, RAMS deliverables, and expert consultations.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
