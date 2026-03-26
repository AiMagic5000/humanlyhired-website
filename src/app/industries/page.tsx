import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Monitor, Heart, DollarSign, Factory, ShoppingBag, Truck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { jobs } from "@/data/jobs";

export const metadata: Metadata = {
  title: "Industries We Serve",
  description: "Specialized staffing solutions across technology, healthcare, finance, manufacturing, retail, and logistics industries.",
};

const industries = [
  {
    name: "Technology & IT",
    slug: "technology",
    description: "From software engineers to cybersecurity experts, we connect top tech talent with innovative companies. Our deep understanding of the tech landscape ensures perfect matches.",
    icon: Monitor,
    roles: ["Software Engineers", "Data Scientists", "DevOps Engineers", "Product Managers", "UI/UX Designers"],
    gradient: "from-blue-500 to-cyan-500",
    image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=500&fit=crop",
  },
  {
    name: "Healthcare",
    slug: "healthcare",
    description: "We understand the critical nature of healthcare staffing. Our rigorous vetting process ensures you get qualified, compassionate professionals.",
    icon: Heart,
    roles: ["Registered Nurses", "Physicians", "Medical Technicians", "Healthcare Administrators", "Therapists"],
    gradient: "from-rose-500 to-pink-500",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=500&fit=crop",
  },
  {
    name: "Finance & Accounting",
    slug: "finance",
    description: "Connect with skilled financial professionals who can drive your business forward. From analysts to CFOs, we find the right fit.",
    icon: DollarSign,
    roles: ["Financial Analysts", "Accountants", "Controllers", "Investment Bankers", "Tax Specialists"],
    gradient: "from-emerald-500 to-green-500",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=500&fit=crop",
  },
  {
    name: "Manufacturing",
    slug: "manufacturing",
    description: "Build your production team with skilled workers who understand quality, safety, and efficiency. We staff all levels of manufacturing operations.",
    icon: Factory,
    roles: ["Production Managers", "Quality Engineers", "CNC Machinists", "Maintenance Technicians", "Plant Managers"],
    gradient: "from-orange-500 to-amber-500",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=500&fit=crop",
  },
  {
    name: "Retail & Hospitality",
    slug: "retail",
    description: "Customer-facing roles require special skills. We find professionals who deliver exceptional experiences and drive sales.",
    icon: ShoppingBag,
    roles: ["Store Managers", "Sales Associates", "Hotel Managers", "Restaurant GMs", "Visual Merchandisers"],
    gradient: "from-purple-500 to-violet-500",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop",
  },
  {
    name: "Logistics & Warehouse",
    slug: "logistics",
    description: "Keep your supply chain moving with reliable warehouse and logistics professionals. From drivers to distribution managers.",
    icon: Truck,
    roles: ["Warehouse Supervisors", "Logistics Coordinators", "Fleet Managers", "Dispatch Supervisors", "Supply Chain Analysts"],
    gradient: "from-slate-500 to-gray-600",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=500&fit=crop",
  },
];

export default function IndustriesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero with Background Image */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1560472355-536de3962603?w=1920&h=800&fit=crop"
            alt="Industry professionals"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-blue-800/80" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-2 rounded-full bg-white/10 text-blue-200 text-sm font-medium backdrop-blur-sm mb-6">
              Specialized Expertise
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white">
              Industries We Serve
            </h1>
            <p className="mt-6 text-xl text-blue-100">
              Deep expertise across multiple sectors ensures we understand your unique
              hiring challenges and deliver candidates who excel.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-3">
                {[
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
                  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=80&h=80&fit=crop",
                  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop",
                  "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=80&h=80&fit=crop",
                ].map((img, i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                    <Image src={img} alt="Team member" width={40} height={40} className="object-cover" />
                  </div>
                ))}
              </div>
              <div className="text-white">
                <p className="font-semibold">500+ Industry Experts</p>
                <p className="text-sm text-blue-200">Ready to help you hire</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry) => {
              const industryJobCount = jobs.filter(
                (job) => job.industry === industry.name.split(" ")[0] ||
                         job.industry === industry.name
              ).length;

              return (
                <div
                  key={industry.slug}
                  className="group rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-48">
                    <Image
                      src={industry.image}
                      alt={industry.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${industry.gradient} opacity-60`} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <industry.icon className="h-16 w-16 text-white" />
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 text-xs font-semibold text-white bg-black/30 backdrop-blur-sm rounded-full">
                        {industryJobCount}+ open positions
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900">{industry.name}</h2>
                    <p className="mt-2 text-gray-600 text-sm line-clamp-2">{industry.description}</p>
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-1.5">
                        {industry.roles.slice(0, 3).map((role) => (
                          <span
                            key={role}
                            className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600"
                          >
                            {role}
                          </span>
                        ))}
                        {industry.roles.length > 3 && (
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500">
                            +{industry.roles.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-6 flex gap-3">
                      <Button asChild size="sm" className="flex-1">
                        <Link href={`/industries/${industry.slug}`}>
                          Learn More
                          <ArrowRight className="ml-1.5 h-4 w-4" />
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/jobs?industry=${industry.name}`}>View Jobs</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us for Industry Staffing */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Why Choose Humanly for Industry-Specific Staffing?</h2>
              <p className="mt-4 text-lg text-gray-600">
                Our specialized recruiters have deep industry knowledge and connections that make finding the right talent faster and more efficient.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  { title: "Industry Expertise", description: "Recruiters who understand your sector's unique challenges" },
                  { title: "Pre-Vetted Candidates", description: "All candidates screened for industry-specific skills" },
                  { title: "Compliance Ready", description: "We ensure all certifications and requirements are met" },
                  { title: "Faster Time-to-Hire", description: "Average placement in under 2 weeks" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=800&h=800&fit=crop"
                  alt="Team collaboration"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 font-bold text-lg">98%</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Placement Success</p>
                    <p className="text-sm text-gray-500">Across all industries</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">Don&apos;t See Your Industry?</h2>
          <p className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">
            We work with companies across many sectors. Contact us to discuss your specific staffing needs.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10">
              <Link href="/jobs">Browse All Jobs</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
