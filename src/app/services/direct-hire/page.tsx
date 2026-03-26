import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { UserCheck, Search, Handshake, Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Direct Hire",
  description: "Find permanent employees who will grow with your organization through our direct hire placement services.",
};

const features = [
  {
    icon: Search,
    title: "Comprehensive Screening",
    description: "Rigorous vetting process including skills assessment, background checks, and cultural fit evaluation.",
  },
  {
    icon: UserCheck,
    title: "Quality Candidates",
    description: "Access to both active job seekers and passive candidates who match your requirements.",
  },
  {
    icon: Handshake,
    title: "Long-Term Fit",
    description: "We focus on finding candidates who will thrive and grow within your organization.",
  },
  {
    icon: Star,
    title: "Replacement Guarantee",
    description: "Peace of mind with our guarantee period if a placement doesn&apos;t work out.",
  },
];

const positions = [
  "Software Engineers",
  "Product Managers",
  "Sales Representatives",
  "Marketing Managers",
  "Financial Analysts",
  "Operations Managers",
  "Human Resources Specialists",
  "Business Analysts",
  "Quality Assurance Engineers",
  "Customer Success Managers",
];

export default function DirectHirePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-600 to-purple-800 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white">Direct Hire</h1>
              <p className="mt-6 text-xl text-purple-100">
                Build your core team with permanent employees who share your vision. Our direct hire services connect you with top talent ready to make a lasting impact.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild size="lg" variant="secondary">
                  <Link href="/employers/request-talent">Find Talent</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                  <Link href="/contact">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="relative aspect-video lg:aspect-square rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80"
                alt="Professional woman in office"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Our Direct Hire Advantage</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              We take the time to understand your culture and needs to deliver candidates who truly fit.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mb-6">
                  <feature.icon className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Positions */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Roles We Place</h2>
              <p className="mt-4 text-lg text-gray-600">
                From individual contributors to management positions, we help you find the perfect permanent additions to your team.
              </p>
              <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {positions.map((position) => (
                  <li key={position} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                    <span className="text-gray-700">{position}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative aspect-video rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                alt="Team meeting"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-purple-600">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to Grow Your Team?</h2>
          <p className="mt-4 text-xl text-purple-100 max-w-2xl mx-auto">
            Let us help you find permanent employees who will contribute to your success for years to come.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-8">
            <Link href="/employers/request-talent">Start Hiring</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
