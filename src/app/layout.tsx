import type { Metadata, Viewport } from "next";
import SmoothScroll from "./SmoothScroll";
import WebVitals from "./components/WebVitals";
import JsonLd from "./components/JsonLd";
import GoogleAnalytics from "./components/GoogleAnalytics";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-headline",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "PMS | Pavement Management Services",
    template: "%s | PMS",
  },
  description:
    "Industry-leading pavement engineering, FWD testing, overlay design, and RAMS-aligned deliverables. Building India's road infrastructure with data-driven precision.",
  keywords: [
    "pavement management",
    "FWD testing",
    "RAMS deliverables",
    "overlay design",
    "road engineering",
    "NHAI",
    "pavement engineering India",
  ],
  authors: [{ name: "Pavement Management Services" }],
  creator: "PMS",
  metadataBase: new URL("https://pms-engineering.com"),
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://pms-engineering.com",
    siteName: "PMS - Pavement Management Services",
    title: "PMS | Pavement Management Services",
    description:
      "Industry-leading pavement engineering, FWD testing, overlay design, and RAMS-aligned deliverables.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PMS - Pavement Management Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PMS | Pavement Management Services",
    description:
      "Industry-leading pavement engineering, FWD testing, overlay design, and RAMS-aligned deliverables.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "theme-color": "#111318",
  },
};

export const viewport: Viewport = {
  themeColor: "#111318",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Prevent browser scroll restoration — must run before hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if("scrollRestoration"in history)history.scrollRestoration="manual";window.scrollTo(0,0);`,
          }}
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} bg-surface font-body text-on-surface antialiased`}
      >
        <GoogleAnalytics />
        <WebVitals />
        <JsonLd />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
