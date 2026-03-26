import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Wallet, FileCheck, Globe, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Payroll & Employer of Record",
  description: "Simplify workforce management with our payroll processing and employer of record services.",
};

const features = [
  {
    icon: Wallet,
    title: "Payroll Processing",
    description: "Accurate, on-time payroll with tax withholding, direct deposit, and comprehensive reporting.",
  },
  {
    icon: FileCheck,
    title: "Compliance Management",
    description: "Stay compliant with ever-changing employment laws, tax regulations, and labor requirements.",
  },
  {
    icon: Globe,
    title: "Multi-State Support",
    description: "Seamlessly manage employees across multiple states with proper tax handling and compliance.",
  },
  {
    icon: Shield,
    title: "Risk Mitigation",
    description: "Transfer employment liability and reduce your exposure to HR-related risks.",
  },
];

const services = [
  "Payroll Processing & Tax Filing",
  "Benefits Administration",
  "Workers Compensation",
  "Unemployment Insurance",
  "Employment Verification",
  "Time & Attendance Tracking",
  "PTO & Leave Management",
  "Employee Onboarding",
  "Termination Processing",
  "W-2 & 1099 Preparation",
  "ACA Compliance",
  "HR Support & Guidance",
];

export default function PayrollPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 to-indigo-800 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white">Payroll & Employer of Record</h1>
              <p className="mt-6 text-xl text-indigo-100">
                Focus on growing your business while we handle the complexities of payroll, benefits, and employment compliance as your Employer of Record.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild size="lg" variant="secondary">
                  <Link href="/employers/request-talent">Get Started</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                  <Link href="/contact">Request a Quote</Link>
                </Button>
              </div>
            </div>
            <div className="relative aspect-video lg:aspect-square rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80"
                alt="Financial documents and calculator"
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
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Our EOR Services</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Eliminate administrative burden and reduce risk with our comprehensive employer of record solutions.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center mb-6">
                  <feature.icon className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-indigo-50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How Employer of Record Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold mb-4">1</div>
              <h3 className="text-lg font-semibold text-gray-900">We Become the Employer</h3>
              <p className="mt-2 text-gray-600">
                Your workers are legally employed by us, transferring all employment liability and administrative responsibilities.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold mb-4">2</div>
              <h3 className="text-lg font-semibold text-gray-900">You Maintain Control</h3>
              <p className="mt-2 text-gray-600">
                You direct the day-to-day work, set schedules, and manage performance while we handle HR and compliance.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold mb-4">3</div>
              <h3 className="text-lg font-semibold text-gray-900">We Handle Everything Else</h3>
              <p className="mt-2 text-gray-600">
                Payroll, taxes, benefits, insurance, compliance - all managed by our expert team on your behalf.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Comprehensive Services</h2>
              <p className="mt-4 text-lg text-gray-600">
                Everything you need to manage your workforce without the administrative headaches.
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
                src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80"
                alt="Business paperwork"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-indigo-600">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">Simplify Your Workforce Management</h2>
          <p className="mt-4 text-xl text-indigo-100 max-w-2xl mx-auto">
            Let us handle the complexities of employment while you focus on what you do best.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-8">
            <Link href="/contact">Request a Quote</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
