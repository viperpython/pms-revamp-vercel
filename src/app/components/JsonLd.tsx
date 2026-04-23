export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://pms-engineering.com/#organization",
        name: "Pavement Management Services",
        alternateName: "PMS",
        url: "https://pms-engineering.com",
        description:
          "Industry-leading pavement engineering, FWD testing, overlay design, and RAMS-aligned deliverables.",
        foundingDate: "2014",
        areaServed: { "@type": "Country", name: "India" },
        knowsAbout: [
          "Pavement Engineering",
          "FWD Testing",
          "Overlay Design",
          "RAMS Deliverables",
          "Road Asset Management",
        ],
        sameAs: [
          "https://linkedin.com", // PLACEHOLDER — stakeholder will provide
          "https://twitter.com", // PLACEHOLDER
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://pms-engineering.com/#website",
        url: "https://pms-engineering.com",
        name: "PMS - Pavement Management Services",
        publisher: { "@id": "https://pms-engineering.com/#organization" },
      },
      {
        "@type": "ProfessionalService",
        name: "Pavement Management Services",
        serviceType: [
          "FWD Testing",
          "Pavement Design",
          "RAMS Deliverables",
          "Field Investigations",
          "Advisory & Training",
        ],
        areaServed: "India",
        provider: { "@id": "https://pms-engineering.com/#organization" },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
