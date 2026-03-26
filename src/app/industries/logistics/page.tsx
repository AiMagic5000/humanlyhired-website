import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Truck, Package, Warehouse, Clock, Shield, CheckCircle, Users, Award, MapPin, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Logistics & Warehouse Staffing",
  description: "Supply chain, logistics, and warehouse staffing solutions. Find forklift operators, warehouse associates, drivers, and distribution management professionals.",
};

const features = [
  {
    icon: Shield,
    title: "Safety Certified",
    description: "All workers are OSHA trained with verified forklift certifications and safety records.",
  },
  {
    icon: Clock,
    title: "24/7 Operations",
    description: "Warehouses never sleep. We staff all shifts including nights, weekends, and holidays.",
  },
  {
    icon: Package,
    title: "Peak Season Ready",
    description: "Scale your workforce 200%+ for holiday and peak seasons with our temp-to-hire model.",
  },
  {
    icon: MapPin,
    title: "Multi-Site Support",
    description: "Coordinated staffing across multiple distribution centers and warehouse locations.",
  },
];

const roles = [
  "Warehouse Managers",
  "Distribution Center Supervisors",
  "Logistics Coordinators",
  "Supply Chain Analysts",
  "Forklift Operators",
  "Order Pickers",
  "Packers & Shippers",
  "Receiving Clerks",
  "Inventory Specialists",
  "Fleet Managers",
  "Dispatch Supervisors",
  "CDL Drivers",
  "Delivery Drivers",
  "Route Planners",
  "Dock Workers",
  "Quality Control Inspectors",
];

const stats = [
  { value: "1.4M", label: "Warehouse jobs in the US" },
  { value: "28%", label: "E-commerce growth driving demand" },
  { value: "4hrs", label: "Average time to fill urgent orders" },
  { value: "97%", label: "Show-up rate for our workers" },
];

const equipment = [
  "Sit-Down Forklifts",
  "Stand-Up Reach Trucks",
  "Order Pickers",
  "Electric Pallet Jacks",
  "Cherry Pickers",
  "Clamp Trucks",
  "RF Scanners",
  "WMS Systems",
];

export default function LogisticsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&h=800&fit=crop"
            alt="Warehouse operations"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 to-gray-800/80" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-slate-200 text-sm font-medium backdrop-blur-sm mb-6">
                <Truck className="h-4 w-4" />
                Logistics & Warehouse Staffing
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-white">
                Keep Your Supply Chain Moving
              </h1>
              <p className="mt-6 text-xl text-slate-200">
                From dock to delivery, we provide the reliable workforce that keeps warehouses efficient and goods flowing. Safety-trained, equipment-certified, and ready to work.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-white text-slate-800 hover:bg-slate-100">
                  <Link href="/employers/request-talent">Find Warehouse Staff</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10">
                  <Link href="/jobs?industry=Logistics">View Open Roles</Link>
                </Button>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="relative aspect-square rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80"
                  alt="Warehouse worker"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                    <Warehouse className="h-6 w-6 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">100,000+</p>
                    <p className="text-sm text-gray-500">Warehouse workers placed</p>
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
                <p className="text-3xl font-bold text-slate-700">{stat.value}</p>
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
            <h2 className="text-3xl font-bold text-gray-900">Logistics Staffing Excellence</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              We understand the demands of modern logistics. Our workers are trained, certified, and reliable.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="text-center p-6 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-6">
                  <feature.icon className="h-8 w-8 text-slate-700" />
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
              <h2 className="text-3xl font-bold text-gray-900">Logistics & Warehouse Roles</h2>
              <p className="mt-4 text-lg text-gray-600">
                From the warehouse floor to fleet management, we fill every position in your supply chain.
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
                src="https://images.unsplash.com/photo-1565891741441-64926e441838?w=800&q=80"
                alt="Forklift operation"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Equipment Certified */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl order-2 lg:order-1">
              <Image
                src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&q=80"
                alt="Warehouse equipment"
                fill
                className="object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-gray-900">Equipment-Certified Workers</h2>
              <p className="mt-4 text-lg text-gray-600">
                Our candidates come with verified certifications on the equipment your facility uses.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {equipment.map((item) => (
                  <div key={item} className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <CheckCircle className="h-4 w-4 text-slate-600 shrink-0" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* E-commerce & Peak Season */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">E-Commerce & Peak Season Staffing</h2>
              <p className="mt-4 text-lg text-gray-600">
                Online retail demands are unpredictable. We help you scale your workforce to meet every order.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  { title: "Prime Day & Cyber Week", desc: "Pre-staged workforce ready for instant deployment" },
                  { title: "Holiday Peak Season", desc: "2-3x workforce scaling in under 2 weeks" },
                  { title: "New Facility Openings", desc: "Complete staffing from day one of operations" },
                  { title: "Volume Fluctuations", desc: "Flexible staffing that adjusts with your volume" },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3 p-4 rounded-lg bg-white border border-gray-100">
                    <BarChart3 className="h-5 w-5 text-slate-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&q=80"
                alt="E-commerce warehouse"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Compliance */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Safety is Our Priority</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Every worker we place is trained and certified to maintain a safe work environment.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "OSHA 10/30 Certified", description: "All warehouse workers complete OSHA safety training before placement." },
              { icon: Award, title: "Forklift Certified", description: "Equipment operators carry current certifications for all powered industrial trucks." },
              { icon: Users, title: "Drug & Background Screened", description: "Comprehensive screening including drug testing and criminal background checks." },
            ].map((item) => (
              <div key={item.title} className="bg-slate-50 rounded-2xl p-8">
                <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center mb-6">
                  <item.icon className="w-7 h-7 text-slate-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-3 text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* On-Site Management */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="bg-slate-800 rounded-3xl p-8 md:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white">On-Site Workforce Management</h2>
                <p className="mt-4 text-lg text-slate-300">
                  For high-volume facilities, we provide dedicated on-site managers to coordinate your workforce daily.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    "Daily attendance and scheduling management",
                    "Real-time performance tracking",
                    "Immediate backfill for no-shows",
                    "Safety compliance monitoring",
                    "Ongoing training and development",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-slate-200">
                      <CheckCircle className="h-5 w-5 text-green-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=800&q=80"
                  alt="Warehouse management"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-slate-700 to-gray-800">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">Power Your Warehouse Operations</h2>
          <p className="mt-4 text-xl text-slate-300 max-w-2xl mx-auto">
            From one forklift operator to an entire distribution center team, we deliver reliable logistics staffing.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-slate-800 hover:bg-slate-100">
              <Link href="/employers/request-talent">Request Warehouse Staff</Link>
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
