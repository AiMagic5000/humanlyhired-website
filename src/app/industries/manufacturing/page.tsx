import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Factory, Wrench, Shield, Cog, HardHat, CheckCircle, Users, Award, ClipboardCheck, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Manufacturing Staffing",
  description: "Industrial and manufacturing staffing solutions. Find skilled production workers, engineers, quality specialists, and plant management professionals.",
};

const features = [
  {
    icon: Shield,
    title: "Safety First",
    description: "All candidates are screened for safety certifications including OSHA 10/30 and industry-specific requirements.",
  },
  {
    icon: ClipboardCheck,
    title: "Skills Verified",
    description: "Hands-on assessments validate technical skills from CNC operation to welding certifications.",
  },
  {
    icon: HardHat,
    title: "Rapid Deployment",
    description: "Production cannot wait. We maintain a ready workforce for quick deployment to your facility.",
  },
  {
    icon: Cog,
    title: "All Shifts Covered",
    description: "24/7 manufacturing operations require flexible staffing. We fill all shifts and schedules.",
  },
];

const roles = [
  "Plant Managers",
  "Production Supervisors",
  "Manufacturing Engineers",
  "Quality Engineers",
  "Process Engineers",
  "Maintenance Technicians",
  "CNC Machinists",
  "Welders & Fabricators",
  "Assembly Line Workers",
  "Machine Operators",
  "Warehouse Associates",
  "Forklift Operators",
  "Quality Inspectors",
  "Shipping & Receiving",
  "Lean/Six Sigma Specialists",
  "EHS Coordinators",
];

const stats = [
  { value: "12.8M", label: "US manufacturing workers" },
  { value: "500K+", label: "Open manufacturing jobs" },
  { value: "48hrs", label: "Average time to fill production roles" },
  { value: "96%", label: "Worker retention rate" },
];

const industries = [
  { name: "Automotive", icon: Settings },
  { name: "Aerospace & Defense", icon: Factory },
  { name: "Food & Beverage", icon: Factory },
  { name: "Pharmaceuticals", icon: Factory },
  { name: "Electronics", icon: Factory },
  { name: "Plastics & Packaging", icon: Factory },
  { name: "Metal Fabrication", icon: Wrench },
  { name: "Consumer Goods", icon: Factory },
];

export default function ManufacturingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&h=800&fit=crop"
            alt="Manufacturing facility"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-orange-900/90 to-amber-800/80" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-orange-200 text-sm font-medium backdrop-blur-sm mb-6">
                <Factory className="h-4 w-4" />
                Manufacturing Staffing
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-white">
                Keep Your Production Lines Running
              </h1>
              <p className="mt-6 text-xl text-orange-100">
                From skilled machinists to plant managers, we provide the manufacturing workforce you need to meet production goals and maintain quality standards.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-orange-50">
                  <Link href="/employers/request-talent">Find Manufacturing Staff</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10">
                  <Link href="/jobs?industry=Manufacturing">View Open Roles</Link>
                </Button>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="relative aspect-square rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800&q=80"
                  alt="Manufacturing worker"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <HardHat className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">50,000+</p>
                    <p className="text-sm text-gray-500">Workers placed annually</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-orange-600">{stat.value}</p>
                <p className="mt-1 text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Manufacturing Staffing Excellence</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              We understand that downtime is costly. Our rapid response and pre-vetted workforce keeps your operations moving.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="text-center p-6 rounded-2xl bg-orange-50 hover:bg-orange-100 transition-colors">
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

      {/* Roles We Fill */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Manufacturing Roles We Staff</h2>
              <p className="mt-4 text-lg text-gray-600">
                From the production floor to the executive suite, we fill positions across all levels of manufacturing operations.
              </p>
              <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {roles.map((role) => (
                  <li key={role} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                    <span className="text-gray-700">{role}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1504917595217-d4dc5ebb6122?w=800&q=80"
                alt="CNC machining"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Manufacturing Industries */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Manufacturing Sectors We Serve</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Specialized expertise across diverse manufacturing industries.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {industries.map((industry) => (
              <div key={industry.name} className="flex flex-col items-center p-6 rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all">
                <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center mb-4">
                  <industry.icon className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="text-center font-semibold text-gray-900">{industry.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
                alt="Certified welder"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Certified & Qualified Workers</h2>
              <p className="mt-4 text-lg text-gray-600">
                Our candidates come with verified certifications and hands-on experience.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  { cert: "OSHA 10/30 Safety Certification", desc: "Workplace safety trained" },
                  { cert: "AWS Welding Certifications", desc: "All positions and processes" },
                  { cert: "Forklift Operator License", desc: "Sit-down, stand-up, reach trucks" },
                  { cert: "Lean Six Sigma", desc: "Green and Black Belt certified" },
                  { cert: "CNC Programming", desc: "Fanuc, Mazak, Haas certified" },
                  { cert: "Quality Certifications", desc: "ASQ CQE, CQI, CQA" },
                ].map((item) => (
                  <div key={item.cert} className="flex items-start gap-3 p-3 rounded-lg bg-white border border-gray-100">
                    <CheckCircle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">{item.cert}</p>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Manufacturers Partner with Humanly</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Users, title: "On-Site Management", description: "Dedicated staffing managers at your facility to handle day-to-day workforce coordination." },
              { icon: Award, title: "Quality Guarantee", description: "All placements backed by our performance guarantee. No-questions-asked replacements." },
              { icon: Wrench, title: "Skilled Trades Ready", description: "Pre-tested pool of welders, machinists, electricians, and maintenance techs ready to work." },
            ].map((item) => (
              <div key={item.title} className="bg-orange-50 rounded-2xl p-8">
                <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center mb-6">
                  <item.icon className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-3 text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-orange-600 to-amber-600">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">Build Your Manufacturing Workforce</h2>
          <p className="mt-4 text-xl text-orange-100 max-w-2xl mx-auto">
            From one shift worker to an entire production team, we deliver the skilled workforce your facility needs.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-orange-50">
              <Link href="/employers/request-talent">Request Manufacturing Staff</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10">
              <Link href="/contact">Schedule a Site Visit</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
