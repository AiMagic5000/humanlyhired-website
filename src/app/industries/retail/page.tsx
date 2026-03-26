import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Store, Users, Star, Clock, CheckCircle, Award, TrendingUp, Sparkles, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Retail & Hospitality Staffing",
  description: "Customer-focused retail and hospitality staffing solutions. Find sales associates, store managers, hotel staff, and restaurant professionals.",
};

const features = [
  {
    icon: Star,
    title: "Customer Service Focus",
    description: "We screen for communication skills, professionalism, and genuine customer service orientation.",
  },
  {
    icon: Clock,
    title: "Seasonal Scalability",
    description: "Ramp up quickly for peak seasons and holidays with our ready-to-deploy workforce.",
  },
  {
    icon: Sparkles,
    title: "Brand Ambassadors",
    description: "Candidates who represent your brand values and create memorable customer experiences.",
  },
  {
    icon: Users,
    title: "Flexible Scheduling",
    description: "Part-time, full-time, weekends, and holidays - we fill all shifts and schedules.",
  },
];

const retailRoles = [
  "Store Managers",
  "Assistant Managers",
  "Sales Associates",
  "Cashiers",
  "Visual Merchandisers",
  "Loss Prevention",
  "Stock Associates",
  "Department Supervisors",
];

const hospitalityRoles = [
  "Hotel General Managers",
  "Front Desk Agents",
  "Concierge",
  "Housekeeping Staff",
  "Restaurant Managers",
  "Servers & Bartenders",
  "Line Cooks & Chefs",
  "Event Coordinators",
];

const stats = [
  { value: "15.8M", label: "US retail workers" },
  { value: "10.5M", label: "US hospitality workers" },
  { value: "24hrs", label: "Average time to fill urgent roles" },
  { value: "92%", label: "Client rehire rate" },
];

const sectors = [
  { name: "Department Stores", icon: Store },
  { name: "Specialty Retail", icon: ShoppingBag },
  { name: "Grocery & Supermarkets", icon: ShoppingBag },
  { name: "Hotels & Resorts", icon: Star },
  { name: "Restaurants & Bars", icon: UtensilsCrossed },
  { name: "Quick Service Restaurants", icon: UtensilsCrossed },
  { name: "Event Venues", icon: Sparkles },
  { name: "Entertainment Venues", icon: Star },
];

export default function RetailPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=800&fit=crop"
            alt="Retail store environment"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 to-violet-800/80" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-purple-200 text-sm font-medium backdrop-blur-sm mb-6">
                <ShoppingBag className="h-4 w-4" />
                Retail & Hospitality Staffing
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-white">
                Staff That Delivers Exceptional Experiences
              </h1>
              <p className="mt-6 text-xl text-purple-100">
                Your customers deserve the best. We find retail and hospitality professionals who create memorable experiences and drive revenue.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-purple-50">
                  <Link href="/employers/request-talent">Find Retail Staff</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10">
                  <Link href="/jobs?industry=Retail">View Open Roles</Link>
                </Button>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="relative aspect-square rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80"
                  alt="Retail professional"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">30,000+</p>
                    <p className="text-sm text-gray-500">Retail placements yearly</p>
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
                <p className="text-3xl font-bold text-purple-600">{stat.value}</p>
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
            <h2 className="text-3xl font-bold text-gray-900">Customer-First Staffing</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              In retail and hospitality, your people are your brand. We find candidates who embody service excellence.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="text-center p-6 rounded-2xl bg-purple-50 hover:bg-purple-100 transition-colors">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mb-6">
                  <feature.icon className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Retail Roles */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Retail Positions We Fill</h2>
              <p className="mt-4 text-lg text-gray-600">
                From the sales floor to store leadership, we staff every retail position.
              </p>
              <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {retailRoles.map((role) => (
                  <li key={role} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                    <span className="text-gray-700">{role}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=80"
                alt="Retail store"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Hospitality Roles */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl order-2 lg:order-1">
              <Image
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"
                alt="Hotel lobby"
                fill
                className="object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-gray-900">Hospitality Positions We Fill</h2>
              <p className="mt-4 text-lg text-gray-600">
                Hotels, restaurants, and event venues trust us for exceptional hospitality staff.
              </p>
              <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {hospitalityRoles.map((role) => (
                  <li key={role} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                    <span className="text-gray-700">{role}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Sectors We Serve */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Sectors We Serve</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              From luxury retail to quick service, we understand each sector's unique needs.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {sectors.map((sector) => (
              <div key={sector.name} className="flex flex-col items-center p-6 rounded-2xl bg-white border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all">
                <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
                  <sector.icon className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-center font-semibold text-gray-900">{sector.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seasonal Staffing */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Seasonal & Peak Staffing</h2>
              <p className="mt-4 text-lg text-gray-600">
                Holiday rushes, special events, and seasonal peaks require rapid workforce scaling. We deliver.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  { season: "Black Friday & Holiday", desc: "50-200% staff increase in days, not weeks" },
                  { season: "Back to School", desc: "Trained associates ready for the rush" },
                  { season: "Summer Tourism", desc: "Hospitality staff for peak travel season" },
                  { season: "Event Staffing", desc: "One-time and recurring event support" },
                ].map((item) => (
                  <div key={item.season} className="flex items-start gap-3 p-4 rounded-lg bg-purple-50">
                    <CheckCircle className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">{item.season}</p>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&q=80"
                alt="Holiday shopping"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Retail & Hospitality Leaders Choose Humanly</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Users, title: "Pre-Trained Talent", description: "Candidates with POS experience, food safety certifications, and customer service training." },
              { icon: Award, title: "Brand Alignment", description: "We match personality and presentation to your brand standards and customer expectations." },
              { icon: Clock, title: "Same-Day Placement", description: "Emergency staffing needs? We can have qualified staff at your location within hours." },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center mb-6">
                  <item.icon className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-3 text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-violet-600">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">Elevate Your Customer Experience</h2>
          <p className="mt-4 text-xl text-purple-100 max-w-2xl mx-auto">
            Great service starts with great people. Let us help you build a team that wows customers.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-purple-50">
              <Link href="/employers/request-talent">Request Retail Staff</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10">
              <Link href="/contact">Discuss Your Needs</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
