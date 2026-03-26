import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Radar, Database, Filter, LineChart, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Talent Sourcing",
  description: "Build a robust talent pipeline with our proactive sourcing strategies and candidate engagement services.",
};

const features = [
  {
    icon: Radar,
    title: "Proactive Sourcing",
    description: "We identify and engage top talent before they hit the job market, giving you first access.",
  },
  {
    icon: Database,
    title: "Talent Pipeline",
    description: "Build a ready-to-hire candidate pool for current and future positions.",
  },
  {
    icon: Filter,
    title: "Pre-Qualified Candidates",
    description: "Every candidate is screened and vetted before being presented to you.",
  },
  {
    icon: LineChart,
    title: "Market Intelligence",
    description: "Gain insights on talent availability, compensation trends, and competitor hiring.",
  },
];

const capabilities = [
  "Boolean Search Expertise",
  "LinkedIn Recruiter Sourcing",
  "Passive Candidate Engagement",
  "Talent Mapping",
  "Competitor Analysis",
  "Diversity Sourcing",
  "Technical Screening",
  "Candidate Nurturing",
  "Pipeline Management",
  "Market Research",
];

export default function TalentSourcingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-cyan-600 to-cyan-800 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white">Talent Sourcing</h1>
              <p className="mt-6 text-xl text-cyan-100">
                Stay ahead of your hiring needs with strategic talent sourcing. We build and maintain a pipeline of qualified candidates ready when you need them.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild size="lg" variant="secondary">
                  <Link href="/employers/request-talent">Build Your Pipeline</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                  <Link href="/contact">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="relative aspect-video lg:aspect-square rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
                alt="Team brainstorming"
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
            <h2 className="text-3xl font-bold text-gray-900">Strategic Sourcing Advantage</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Move from reactive hiring to proactive talent acquisition with our sourcing expertise.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-cyan-100 flex items-center justify-center mb-6">
                  <feature.icon className="h-8 w-8 text-cyan-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Our Sourcing Capabilities</h2>
              <p className="mt-4 text-lg text-gray-600">
                Leverage our expertise in modern sourcing techniques and tools to find the talent that matters.
              </p>
              <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {capabilities.map((capability) => (
                  <li key={capability} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                    <span className="text-gray-700">{capability}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative aspect-video rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=800&q=80"
                alt="Professional networking"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Sourcing Process</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-cyan-600 text-white flex items-center justify-center text-xl font-bold mb-4">1</div>
              <h3 className="font-semibold text-gray-900">Define</h3>
              <p className="mt-2 text-gray-600 text-sm">Understand your ideal candidate profile and requirements</p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-cyan-600 text-white flex items-center justify-center text-xl font-bold mb-4">2</div>
              <h3 className="font-semibold text-gray-900">Search</h3>
              <p className="mt-2 text-gray-600 text-sm">Leverage multiple channels to identify potential candidates</p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-cyan-600 text-white flex items-center justify-center text-xl font-bold mb-4">3</div>
              <h3 className="font-semibold text-gray-900">Engage</h3>
              <p className="mt-2 text-gray-600 text-sm">Craft compelling outreach to attract passive candidates</p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-cyan-600 text-white flex items-center justify-center text-xl font-bold mb-4">4</div>
              <h3 className="font-semibold text-gray-900">Deliver</h3>
              <p className="mt-2 text-gray-600 text-sm">Present pre-qualified candidates ready for interviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-cyan-600">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to Build Your Talent Pipeline?</h2>
          <p className="mt-4 text-xl text-cyan-100 max-w-2xl mx-auto">
            Stop scrambling for candidates. Let us build a proactive sourcing strategy for your organization.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-8">
            <Link href="/employers/request-talent">Get Started</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
