import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search, FileCheck, Users, Building, Briefcase, Calculator, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Our Services",
  description: "Comprehensive staffing and recruitment services including executive search, contract staffing, direct hire, RPO, and more.",
};

const services = [
  {
    title: "Executive Search",
    description: "Find C-suite and senior leadership talent through our targeted executive recruitment approach. We leverage our extensive network and rigorous screening process to identify leaders who will drive your organization forward.",
    icon: Search,
    href: "/services/executive-search",
    features: ["C-Suite recruitment", "Board member placement", "Confidential searches", "Leadership assessment"],
    color: "bg-blue-500",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop",
  },
  {
    title: "Contract Staffing",
    description: "Flexible workforce solutions for project-based needs, seasonal demands, or temporary coverage. Get skilled professionals quickly without long-term commitments.",
    icon: FileCheck,
    href: "/services/contract-staffing",
    features: ["Quick turnaround", "Flexible terms", "Payroll management", "Compliance handled"],
    color: "bg-emerald-500",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=600&fit=crop",
  },
  {
    title: "Direct Hire",
    description: "Build your core team with permanent employees who fit your culture and have the skills to excel. We manage the entire recruitment process from sourcing to offer.",
    icon: Users,
    href: "/services/direct-hire",
    features: ["Full-cycle recruiting", "Culture matching", "Skills assessment", "Salary benchmarking"],
    color: "bg-purple-500",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
  },
  {
    title: "RPO Services",
    description: "Outsource your entire recruitment function or specific hiring projects to our expert team. We become an extension of your HR department.",
    icon: Building,
    href: "/services/rpo",
    features: ["Scalable solutions", "Dedicated team", "Process optimization", "Technology integration"],
    color: "bg-orange-500",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop",
  },
  {
    title: "Talent Sourcing",
    description: "Proactive candidate identification and pipeline building for current and future hiring needs. Never start from scratch when you have a new opening.",
    icon: Briefcase,
    href: "/services/talent-sourcing",
    features: ["Passive candidate outreach", "Talent mapping", "Pipeline development", "Market intelligence"],
    color: "bg-pink-500",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop",
  },
  {
    title: "Payroll Services",
    description: "Comprehensive payroll management for your contingent workforce. We handle compliance, taxes, and administration so you can focus on your business.",
    icon: Calculator,
    href: "/services/payroll",
    features: ["Payroll processing", "Tax compliance", "Benefits administration", "Reporting & analytics"],
    color: "bg-cyan-500",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero with Background Image */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=800&fit=crop"
            alt="Modern office"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-blue-800/80" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-2 rounded-full bg-white/10 text-blue-200 text-sm font-medium backdrop-blur-sm mb-6">
              Comprehensive Solutions
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white">
              Staffing Services Tailored to Your Needs
            </h1>
            <p className="mt-6 text-xl text-blue-100">
              From executive search to payroll management, we offer end-to-end staffing solutions
              that help your business thrive.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-blue-50">
                <Link href="/contact">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-white border-white/30 hover:bg-white/10">
                <Link href="/employers/request-talent">Request Talent</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="space-y-16 sm:space-y-20 lg:space-y-24">
            {services.map((service, index) => (
              <div
                key={service.title}
                className="grid gap-8 sm:gap-10 lg:gap-12 lg:grid-cols-2 items-center"
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className={`inline-flex rounded-xl ${service.color} p-4 text-white mb-6`}>
                    <service.icon className="h-8 w-8" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">{service.title}</h2>
                  <p className="mt-4 text-lg text-gray-600">{service.description}</p>
                  <ul className="mt-6 space-y-3">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-gray-600">
                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="mt-8">
                    <Link href={service.href}>
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className={`${index % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-tr ${service.color} opacity-10`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-white">15+</p>
              <p className="mt-2 text-gray-400">Years Experience</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">5,000+</p>
              <p className="mt-2 text-gray-400">Placements Made</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">98%</p>
              <p className="mt-2 text-gray-400">Client Satisfaction</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">24hr</p>
              <p className="mt-2 text-gray-400">Response Time</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Not Sure Which Service Is Right for You?</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Our team will work with you to understand your needs and recommend the best approach.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/contact">Schedule a Consultation</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/employers/request-talent">Request Talent</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
