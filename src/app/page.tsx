import { Metadata } from "next";
import {
  Hero,
  ServicesPreview,
  IndustriesPreview,
  FeaturedJobs,
  WhyChooseUs,
  Testimonials,
  CTA,
} from "@/components/sections";

export const metadata: Metadata = {
  title: "Humanly Hired | Premier Staffing & Recruitment Solutions",
  description:
    "Find top talent or your next career with Humanly Hired. We offer staffing, recruitment, executive search, and contract staffing services. Start hiring today.",
  openGraph: {
    title: "Humanly Hired | Premier Staffing & Recruitment Solutions",
    description:
      "Find top talent or your next career with Humanly Hired. We offer staffing, recruitment, executive search, and contract staffing services.",
    url: "https://humanlyhired.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Humanly Hired | Premier Staffing & Recruitment Solutions",
    description:
      "Find top talent or your next career with Humanly Hired. We offer staffing, recruitment, executive search, and contract staffing services.",
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesPreview />
      <FeaturedJobs />
      <IndustriesPreview />
      <WhyChooseUs />
      <Testimonials />
      <CTA />
    </>
  );
}
