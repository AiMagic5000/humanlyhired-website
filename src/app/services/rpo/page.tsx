import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Building2, BarChart3, Cog, Users2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Recruitment Process Outsourcing (RPO)",
  description: "Transform your hiring with end-to-end recruitment process outsourcing. We become an extension of your team.",
};

const features = [
  {
    icon: Building2,
    title: "Scalable Solutions",
    description: "Flex your recruitment capacity up or down based on hiring demands without fixed overhead.",
  },
  {
    icon: BarChart3,
    title: "Data-Driven Insights",
    description: "Comprehensive analytics and reporting to optimize your hiring process and outcomes.",
  },
  {
    icon: Cog,
    title: "Process Excellence",
    description: "Standardized best practices and technology to streamline your entire recruitment lifecycle.",
  },
  {
    icon: Users2,
    title: "Dedicated Team",
    description: "Embedded recruiters who understand your culture and act as an extension of your HR team.",
  },
];

const services = [
  "Full-Cycle Recruitment",
  "Employer Branding",
  "Candidate Sourcing",
  "Interview Scheduling",
  "Offer Management",
  "Onboarding Support",
  "ATS Implementation",
  "Recruitment Analytics",
  "Compliance Management",
  "Diversity Hiring Programs",
];

export default function RPOPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-500 to-orange-700 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white">Recruitment Process Outsourcing</h1>
              <p className="mt-6 text-xl text-orange-100">
                Transform your talent acquisition with a strategic RPO partnership. We integrate seamlessly with your team to deliver better hires, faster.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild size="lg" variant="secondary">
                  <Link href="/employers/request-talent">Explore RPO</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                  <Link href="/contact">Schedule Consultation</Link>
                </Button>
              </div>
            </div>
            <div className="relative aspect-video lg:aspect-square rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=800&q=80"
                alt="Team planning session"
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
            <h2 className="text-3xl font-bold text-gray-900">Why Partner With Us for RPO</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Reduce costs, improve quality of hire, and gain the agility to scale your recruitment efforts.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center mb-6">
                  <feature.icon className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Comprehensive RPO Services</h2>
              <p className="mt-4 text-lg text-gray-600">
                From strategy to execution, we manage every aspect of your recruitment process to deliver exceptional results.
              </p>
              <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services.map((service) => (
                  <li key={service} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                    <span className="text-gray-700">{service}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative aspect-video rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80"
                alt="Business strategy meeting"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Results That Speak</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600">40%</div>
              <p className="mt-2 text-gray-600">Reduction in Cost-Per-Hire</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600">50%</div>
              <p className="mt-2 text-gray-600">Faster Time-to-Fill</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600">95%</div>
              <p className="mt-2 text-gray-600">Hiring Manager Satisfaction</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600">30%</div>
              <p className="mt-2 text-gray-600">Improvement in Quality of Hire</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-orange-600">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">Transform Your Recruitment</h2>
          <p className="mt-4 text-xl text-orange-100 max-w-2xl mx-auto">
            Discover how our RPO solutions can revolutionize your talent acquisition strategy.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-8">
            <Link href="/contact">Schedule a Consultation</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
