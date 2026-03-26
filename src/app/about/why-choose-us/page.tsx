import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Award, Users, Clock, Shield, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Why Choose Us",
  description: "Discover why leading companies trust Humanly Hired for their recruitment needs.",
};

const reasons = [
  {
    icon: Users,
    title: "Industry Expertise",
    description: "Our recruiters specialize in specific industries, giving them deep knowledge of market trends and candidate expectations.",
  },
  {
    icon: Clock,
    title: "Fast Time-to-Fill",
    description: "Our extensive talent network and streamlined processes mean we can fill positions faster than the industry average.",
  },
  {
    icon: Shield,
    title: "Quality Guarantee",
    description: "We stand behind our placements with comprehensive guarantees to ensure your satisfaction.",
  },
  {
    icon: TrendingUp,
    title: "Scalable Solutions",
    description: "Whether you need one hire or one hundred, our flexible solutions scale with your business needs.",
  },
  {
    icon: Award,
    title: "Proven Track Record",
    description: "With over 2,500 successful placements and a 98% client satisfaction rate, results speak for themselves.",
  },
  {
    icon: CheckCircle,
    title: "Transparent Process",
    description: "We keep you informed every step of the way with regular updates and clear communication.",
  },
];

const stats = [
  { value: "98%", label: "Client Satisfaction" },
  { value: "2,500+", label: "Successful Placements" },
  { value: "15+", label: "Years Experience" },
  { value: "72hrs", label: "Avg. Time to Present Candidates" },
];

export default function WhyChooseUsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-white">Why Choose Humanly Hired?</h1>
            <p className="mt-6 text-xl text-blue-100">
              We&apos;re not just recruiters - we&apos;re your strategic partners in building exceptional teams.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-blue-600">{stat.value}</div>
                <div className="mt-2 text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reasons Grid */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">What Sets Us Apart</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Our commitment to excellence and personalized service makes us the preferred choice for growing businesses.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {reasons.map((reason) => (
              <div
                key={reason.title}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-6">
                  <reason.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{reason.title}</h3>
                <p className="mt-3 text-gray-600">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-video lg:aspect-square rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                alt="Team collaboration"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">A Partner You Can Trust</h2>
              <p className="mt-6 text-lg text-gray-600">
                For over 15 years, we&apos;ve been helping companies of all sizes find the talent they need to grow and succeed.
                Our personalized approach means we take the time to understand your unique culture, requirements, and goals.
              </p>
              <p className="mt-4 text-lg text-gray-600">
                We believe that every hire is an opportunity to make a positive impact on both the company and the candidate.
                That&apos;s why we go beyond resumes to find candidates who are truly the right fit.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild>
                  <Link href="/employers/request-talent">Request Talent</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
