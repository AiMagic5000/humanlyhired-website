import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ClipboardCheck, Search, Users, FileText, CheckCircle, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Our Process",
  description: "Learn about our proven 6-step recruitment process that delivers exceptional results.",
};

const steps = [
  {
    number: "01",
    icon: ClipboardCheck,
    title: "Discovery & Consultation",
    description: "We begin with an in-depth consultation to understand your company culture, requirements, and hiring goals. This ensures we find candidates who are the perfect fit.",
  },
  {
    number: "02",
    icon: Search,
    title: "Talent Sourcing",
    description: "Our recruiters tap into our extensive network, industry databases, and passive candidate pools to identify top talent that matches your criteria.",
  },
  {
    number: "03",
    icon: FileText,
    title: "Screening & Assessment",
    description: "Candidates undergo rigorous screening including skills assessments, background checks, and behavioral interviews to ensure quality.",
  },
  {
    number: "04",
    icon: Users,
    title: "Candidate Presentation",
    description: "We present a curated shortlist of qualified candidates with detailed profiles, including our assessment notes and recommendations.",
  },
  {
    number: "05",
    icon: Handshake,
    title: "Interview Coordination",
    description: "We handle all scheduling and logistics, prepare candidates for interviews, and gather feedback to keep the process moving smoothly.",
  },
  {
    number: "06",
    icon: CheckCircle,
    title: "Offer & Onboarding",
    description: "We assist with offer negotiations, ensure smooth onboarding, and provide follow-up support to ensure long-term success.",
  },
];

export default function ProcessPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-white">Our Proven Process</h1>
            <p className="mt-6 text-xl text-blue-100">
              A systematic approach to finding and placing exceptional talent that delivers consistent results.
            </p>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How We Work</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Our 6-step process has been refined over 15 years to ensure we deliver the right talent, every time.
            </p>
          </div>
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`flex flex-col md:flex-row gap-8 items-center ${
                  index % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-4xl font-bold text-blue-100">{step.number}</span>
                      <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                        <step.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                    <p className="mt-3 text-gray-600">{step.description}</p>
                  </div>
                </div>
                <div className="hidden md:block w-px h-24 bg-blue-200" />
                <div className="flex-1" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Image */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Results You Can Count On</h2>
              <p className="mt-6 text-lg text-gray-600">
                Our process isn&apos;t just about filling positions - it&apos;s about building lasting relationships.
                We measure our success by the long-term impact of our placements.
              </p>
              <ul className="mt-8 space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Average time-to-fill of 21 days</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">92% of placements stay beyond 1 year</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">98% client satisfaction rate</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Dedicated account manager for every client</span>
                </li>
              </ul>
              <div className="mt-8">
                <Button asChild>
                  <Link href="/employers/request-talent">Start Your Search</Link>
                </Button>
              </div>
            </div>
            <div className="relative aspect-video lg:aspect-square rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
                alt="Team meeting"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
