import Script from "next/script";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX"; // PLACEHOLDER

export default function GoogleAnalytics() {
  if (process.env.NODE_ENV !== "production" || GA_MEASUREMENT_ID === "G-XXXXXXXXXX") {
    return null; // Don't load in dev or without real ID
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_title: document.title,
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
