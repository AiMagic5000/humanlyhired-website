import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Zap, Shield, TrendingUp, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Contract Staffing",
  description: "Flexible contract and temporary staffing solutions to meet your project needs and workforce demands.",
};

const features = [
  {
    icon: Calendar,
    title: "Flexible Engagements",
    description: "Scale your workforce up or down based on project demands and seasonal needs.",
  },
  {
    icon: Zap,
    title: "Rapid Deployment",
    description: "Access pre-vetted talent ready to start within days, not weeks.",
  },
  {
    icon: Shield,
    title: "Risk Mitigation",
    description: "We handle employment compliance, benefits, and administrative burdens.",
  },
  {
    icon: TrendingUp,
    title: "Cost Efficiency",
    description: "Optimize your labor costs with pay-as-you-go staffing models.",
  },
];

const positions = [
  "Project Managers",
  "Software Developers",
  "Data Analysts",
  "Administrative Support",
  "Accountants & Finance",
  "Marketing Specialists",
  "HR Professionals",
  "Customer Service Representatives",
  "IT Support Technicians",
  "Warehouse & Logistics Staff",
];

export default function ContractStaffingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-600 to-emerald-800 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white">Contract Staffing</h1>
              <p className="mt-6 text-xl text-emerald-100">
                Build an agile workforce with our contract and temporary staffing solutions. Get the right talent exactly when you need it, without long-term commitments.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild size="lg" variant="secondary">
                  <Link href="/employers/request-talent">Get Started</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                  <Link href="/contact">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="relative aspect-video lg:aspect-square rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80"
                alt="Team collaboration"
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
            <h2 className="text-3xl font-bold text-gray-900">Benefits of Contract Staffing</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Gain workforce flexibility while maintaining productivity and controlling costs.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6">
                  <feature.icon className="h-8 w-8 text-emerald-600" />
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
              <h2 className="text-3xl font-bold text-gray-900">Roles We Staff</h2>
              <p className="mt-4 text-lg text-gray-600">
                From short-term projects to long-term assignments, we provide skilled contract professionals across all industries.
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
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80"
                alt="Office workers collaborating"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-emerald-600">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">Need Flexible Workforce Solutions?</h2>
          <p className="mt-4 text-xl text-emerald-100 max-w-2xl mx-auto">
            Let us help you build an agile team that adapts to your business needs.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-8">
            <Link href="/employers/request-talent">Request Contract Staff</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
