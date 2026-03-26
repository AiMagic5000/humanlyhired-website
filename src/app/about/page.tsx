import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Users, Target, Award, Heart, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "About Our Staffing Agency",
  description:
    "Humanly Hired by Brand Metrics LLC has placed 2,500+ professionals since 2010. Learn about our mission, values, and team. Get in touch today.",
  openGraph: {
    title: "About Our Staffing Agency | Humanly Hired",
    description:
      "Humanly Hired by Brand Metrics LLC has placed 2,500+ professionals since 2010. Learn about our mission, values, and team.",
    url: "https://humanlyhired.com/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Our Staffing Agency | Humanly Hired",
    description:
      "Humanly Hired by Brand Metrics LLC has placed 2,500+ professionals since 2010. Learn about our mission, values, and team.",
  },
};

const values = [
  {
    icon: Users,
    title: "People First",
    description: "We believe that great companies are built by great people. Our focus is always on the human element of hiring.",
  },
  {
    icon: Target,
    title: "Precision Matching",
    description: "We don't just fill positions; we find the perfect fit for both candidates and employers.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We maintain the highest standards in everything we do, from candidate screening to client service.",
  },
  {
    icon: Heart,
    title: "Integrity",
    description: "Honesty and transparency guide every interaction. We build relationships based on trust.",
  },
];

const milestones = [
  { year: "2010", event: "Founded in Wyoming with a vision to transform staffing" },
  { year: "2013", event: "Expanded services to include executive search" },
  { year: "2016", event: "Reached 500+ successful placements milestone" },
  { year: "2019", event: "Launched RPO services for enterprise clients" },
  { year: "2022", event: "Expanded to serve 12+ industries nationwide" },
  { year: "2024", event: "Surpassed 2,500 successful placements" },
];

const teamMembers = [
  {
    name: "Sarah Mitchell",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop",
    bio: "20+ years in executive recruitment",
  },
  {
    name: "David Chen",
    role: "Director of Operations",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    bio: "15 years transforming staffing processes",
  },
  {
    name: "Jennifer Martinez",
    role: "Head of Client Success",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    bio: "Building lasting client partnerships",
  },
  {
    name: "Michael Thompson",
    role: "VP of Talent Acquisition",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    bio: "Expert in technical recruiting",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=1080&fit=crop"
            alt="Team collaboration"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-500/30 text-white text-sm font-medium mb-6">
                Trusted Since 2010
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-white">
                About {siteConfig.name}
              </h1>
              <p className="mt-6 text-xl text-blue-100">
                We&apos;re more than a staffing agency. We&apos;re your strategic partner in building
                exceptional teams that drive business success.
              </p>
              <div className="mt-6 sm:mt-8 flex flex-wrap gap-4 sm:gap-6">
                {[
                  { value: "2,500+", label: "Placements" },
                  { value: "98%", label: "Satisfaction" },
                  { value: "12+", label: "Industries" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center min-w-[70px]">
                    <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                    <p className="text-blue-200 text-xs sm:text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="relative aspect-square max-w-md mx-auto">
                <Image
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=600&fit=crop"
                  alt="Professional team meeting"
                  fill
                  className="object-cover rounded-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">14+ Years</p>
                      <p className="text-sm text-gray-600">Industry Experience</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                At {siteConfig.name}, our mission is to transform the way companies build their teams
                and how professionals find meaningful careers. We believe that the right match between
                talent and opportunity creates value that extends far beyond the workplace.
              </p>
              <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                We combine deep industry expertise with a personal touch, ensuring that every placement
                is not just a hire, but the beginning of a successful partnership.
              </p>
              <div className="mt-8 flex gap-4">
                <Button asChild>
                  <Link href="/services">
                    Our Services
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-blue-50 p-8 text-center">
                <p className="text-4xl font-bold text-blue-600">{siteConfig.stats.placements}</p>
                <p className="mt-2 text-gray-600">Placements</p>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-8 text-center">
                <p className="text-4xl font-bold text-emerald-600">{siteConfig.stats.satisfaction}</p>
                <p className="mt-2 text-gray-600">Satisfaction</p>
              </div>
              <div className="rounded-2xl bg-purple-50 p-8 text-center">
                <p className="text-4xl font-bold text-purple-600">{siteConfig.stats.industries}</p>
                <p className="mt-2 text-gray-600">Industries</p>
              </div>
              <div className="rounded-2xl bg-amber-50 p-8 text-center">
                <p className="text-4xl font-bold text-amber-600">{siteConfig.stats.yearsExperience}</p>
                <p className="mt-2 text-gray-600">Years</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Our Core Values</h2>
            <p className="mt-4 text-lg text-gray-600">
              These principles guide everything we do and shape how we serve our clients and candidates.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100"
              >
                <div className="mx-auto w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                  <value.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">{value.title}</h3>
                <p className="mt-3 text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Our Journey</h2>
            <p className="mt-4 text-lg text-gray-600">
              From humble beginnings to industry leadership
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={milestone.year} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                      {milestone.year.slice(2)}
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="flex-1 w-0.5 bg-blue-200 mt-2" />
                    )}
                  </div>
                  <div className="pb-8">
                    <p className="text-sm font-medium text-blue-600">{milestone.year}</p>
                    <p className="mt-1 text-lg text-gray-900">{milestone.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Meet Our Leadership</h2>
            <p className="mt-4 text-lg text-gray-600">
              A dedicated team of professionals committed to your success
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
              >
                <div className="relative h-64">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-blue-600 font-medium text-sm">{member.role}</p>
                  <p className="mt-2 text-gray-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop"
                alt="Team strategy meeting"
                width={800}
                height={600}
                className="rounded-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-blue-600 rounded-xl p-6 text-white max-w-xs hidden md:block">
                <p className="text-3xl font-bold">500+</p>
                <p className="text-blue-100">Active clients trust us with their hiring needs</p>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Why Companies Choose Us</h2>
              <p className="mt-4 text-lg text-gray-600">
                We bring a unique combination of industry expertise, personal service, and
                proven results that sets us apart from traditional staffing agencies.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  "Deep understanding of your industry and hiring needs",
                  "Rigorous candidate screening and vetting process",
                  "Dedicated account management for personalized service",
                  "Flexible solutions from temp staffing to executive search",
                  "Transparent communication throughout the process",
                ].map((point, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">{point}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Button asChild>
                  <Link href="/employers/request-talent">
                    Partner With Us
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to Work With Us?</h2>
          <p className="mt-4 text-xl text-blue-100 max-w-2xl mx-auto">
            Whether you&apos;re looking for talent or your next opportunity, we&apos;re here to help.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
              <Link href="/employers/request-talent">Hire Talent</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link href="/jobs">Find Jobs</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
