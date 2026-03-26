import {
  Hero,
  ServicesPreview,
  IndustriesPreview,
  FeaturedJobs,
  WhyChooseUs,
  Testimonials,
  CTA,
} from "@/components/sections";

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
