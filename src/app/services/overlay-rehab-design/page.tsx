import ServicePageTemplate, { ServicePageData } from '../../components/ServicePageTemplate';
import HeroImage from '../../design.jpg';

const data: ServicePageData = {
  title: "ENGINEERING",
  titleAccent: "DESIGN",
  tagline: "Design That Last",
  overline: "OVERLAY & REHABILITATION",
  heroImage: HeroImage,
  accentColor: "blue",
  icon: "📐",
  stats: { value: "200+", label: "Designs Delivered" },
  compliance: { label: "IRC/MoRTH", value: "Compliant" },
  sections: [
    {
      body: "PMS offers comprehensive overlay and rehabilitation design services grounded in FWD data, laboratory evaluations, and field performance observations. Our experts apply backcalculation analysis to estimate in-situ layer moduli, evaluate pavement structural capacity, and identify sections requiring strengthening. Using IRC and MoRTH guidelines, we develop optimized overlay thicknesses that ensure extended pavement life and cost-effective rehabilitation.",
    },
    {
      heading: "Our Design Process Emphasizes",
      body: "This data-driven design approach supports agencies in minimizing lifecycle costs while maintaining serviceability and safety.",
      bullets: [
        { text: "Mechanistic–empirical design for accurate structural response predictions." },
        { text: "Calibration using local materials and conditions." },
        { text: "Prioritization of rehabilitation based on pavement health indices and remaining life analysis." },
      ],
    },
  ],
  prevService: { title: "FWD Testing", href: "/services/fwd-testing" },
  nextService: { title: "RAMS-Aligned Deliverables", href: "/services/rams-aligned-deliverables" },
};

export default function OverlayRehabDesignPage() {
  return <ServicePageTemplate data={data} />;
}