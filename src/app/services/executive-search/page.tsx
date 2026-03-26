import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Target, Users, Clock, Award, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Executive Search",
  description: "Find exceptional C-suite and senior leadership talent with our executive search services.",
};

const features = [
  {
    icon: Target,
    title: "Targeted Approach",
    description: "We identify and engage passive candidates who aren't actively looking but are perfect for your role.",
  },
  {
    icon: Users,
    title: "Extensive Network",
    description: "Access to a curated network of senior executives across industries and functions.",
  },
  {
    icon: Clock,
    title: "Confidential Process",
    description: "Discreet searches that protect your organization's interests and the candidates' privacy.",
  },
  {
    icon: Award,
    title: "Quality Guarantee",
    description: "Extended guarantees on executive placements to ensure long-term fit and success.",
  },
];

const positions = [
  "Chief Executive Officer (CEO)",
  "Chief Financial Officer (CFO)",
  "Chief Technology Officer (CTO)",
  "Chief Operating Officer (COO)",
  "Vice President",
  "Senior Director",
  "Board Members",
  "General Manager",
];

export default function ExecutiveSearchPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white">Executive Search</h1>
              <p className="mt-6 text-xl text-blue-100">
                Find transformational leaders who will drive your organization forward. Our executive search practice connects you with exceptional C-suite and senior leadership talent.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild size="lg" variant="secondary">
                  <Link href="/employers/request-talent">Start Your Search</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                  <Link href="/contact">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="relative aspect-video lg:aspect-square rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&q=80"
                alt="Executive office"
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
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Our Executive Search</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Our dedicated executive practice combines deep industry expertise with a personalized approach.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-6">
                  <feature.icon className="h-8 w-8 text-blue-600" />
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
              <h2 className="text-3xl font-bold text-gray-900">Positions We Fill</h2>
              <p className="mt-4 text-lg text-gray-600">
                From C-suite executives to board members, we have the expertise to find leaders who will make an impact.
              </p>
              <ul className="mt-8 space-y-3">
                {positions.map((position) => (
                  <li key={position} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">{position}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative aspect-video rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80"
                alt="Business leadership"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to Find Your Next Leader?</h2>
          <p className="mt-4 text-xl text-blue-100 max-w-2xl mx-auto">
            Let us help you find the executive talent that will drive your organization&apos;s success.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-8">
            <Link href="/employers/request-talent">Request Executive Search</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
