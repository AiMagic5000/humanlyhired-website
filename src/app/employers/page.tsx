import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Shield, Users, Target, HeartHandshake, Star, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "For Employers",
  description: "Partner with Humanly Hired to find top talent for your organization. Fast, reliable, and quality-guaranteed staffing solutions.",
};

const benefits = [
  {
    icon: Clock,
    title: "Fast Turnaround",
    description: "Get qualified candidates within days, not weeks. Our average time-to-fill is just 14 days.",
  },
  {
    icon: Shield,
    title: "Quality Guaranteed",
    description: "90-day replacement guarantee on all placements. We stand behind every candidate we recommend.",
  },
  {
    icon: Users,
    title: "Pre-Screened Talent",
    description: "Every candidate is thoroughly vetted through our rigorous 5-step screening process.",
  },
  {
    icon: Target,
    title: "Industry Expertise",
    description: "Specialized recruiters who understand your industry's unique requirements and challenges.",
  },
  {
    icon: HeartHandshake,
    title: "Dedicated Support",
    description: "Personal account manager providing end-to-end support throughout the hiring process.",
  },
];

const process = [
  {
    step: "01",
    title: "Discovery Call",
    description: "We learn about your company culture, requirements, and hiring goals.",
  },
  {
    step: "02",
    title: "Talent Search",
    description: "Our recruiters tap into our network and databases to find matching candidates.",
  },
  {
    step: "03",
    title: "Screening & Vetting",
    description: "Candidates undergo thorough interviews, skills assessments, and background checks.",
  },
  {
    step: "04",
    title: "Candidate Presentation",
    description: "We present top candidates with detailed profiles and our recommendations.",
  },
  {
    step: "05",
    title: "Interview Coordination",
    description: "We schedule interviews and gather feedback to refine the search if needed.",
  },
  {
    step: "06",
    title: "Offer & Onboarding",
    description: "We assist with negotiations and ensure a smooth transition for the new hire.",
  },
];

const clientLogos = [
  { name: "TechCorp", initial: "TC" },
  { name: "HealthFirst", initial: "HF" },
  { name: "FinanceHub", initial: "FH" },
  { name: "BuildCo", initial: "BC" },
  { name: "RetailMax", initial: "RM" },
  { name: "LogiPro", initial: "LP" },
];

export default function EmployersPage() {
  return (
    <div className="min-h-screen">
      {/* Hero with Background Image */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920&h=800&fit=crop"
            alt="Professional team"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-blue-800/80" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <span className="inline-block px-4 py-2 rounded-full bg-white/10 text-blue-200 text-sm font-medium backdrop-blur-sm mb-6">
                Trusted by 500+ Companies
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-white">
                Find Top Talent for Your Team
              </h1>
              <p className="mt-6 text-xl text-blue-100">
                Partner with {siteConfig.name} to access pre-screened, qualified candidates
                who fit your culture and exceed your expectations.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  <Link href="/employers/request-talent">
                    Request Talent
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10">
                  <Link href="/contact">Schedule a Call</Link>
                </Button>
              </div>
              {/* Trust indicators */}
              <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
                <div className="flex -space-x-2 flex-shrink-0">
                  {[
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop",
                    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
                  ].map((img, i) => (
                    <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white overflow-hidden">
                      <Image src={img} alt="Client" width={40} height={40} className="object-cover" />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-white/80 text-xs sm:text-sm">4.9/5 from 200+ reviews</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-8 lg:mt-0">
              <div className="rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur p-4 sm:p-6 text-white text-center">
                <p className="text-2xl sm:text-4xl font-bold">{siteConfig.stats.placements}</p>
                <p className="mt-1 sm:mt-2 text-xs sm:text-base text-blue-100">Placements</p>
              </div>
              <div className="rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur p-4 sm:p-6 text-white text-center">
                <p className="text-2xl sm:text-4xl font-bold">{siteConfig.stats.satisfaction}</p>
                <p className="mt-1 sm:mt-2 text-xs sm:text-base text-blue-100">Satisfaction</p>
              </div>
              <div className="rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur p-4 sm:p-6 text-white text-center">
                <p className="text-2xl sm:text-4xl font-bold">14</p>
                <p className="mt-1 sm:mt-2 text-xs sm:text-base text-blue-100">Avg. Days to Fill</p>
              </div>
              <div className="rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur p-4 sm:p-6 text-white text-center">
                <p className="text-2xl sm:text-4xl font-bold">90</p>
                <p className="mt-1 sm:mt-2 text-xs sm:text-base text-blue-100">Day Guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Logos */}
      <section className="py-12 bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <p className="text-center text-sm text-gray-500 mb-8">Trusted by leading companies across industries</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {clientLogos.map((logo) => (
              <div key={logo.name} className="w-24 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-gray-400">{logo.initial}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Why Partner With Us</h2>
              <p className="mt-4 text-lg text-gray-600">
                We&apos;re not just another staffing agency. We&apos;re your strategic hiring partner committed to your success.
              </p>
              <div className="mt-8 space-y-4">
                {benefits.map((benefit) => (
                  <div key={benefit.title} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{benefit.title}</h3>
                      <p className="text-sm text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop"
                  alt="Team collaboration"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">98% Success Rate</p>
                    <p className="text-sm text-gray-500">On first-round hires</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Our Hiring Process</h2>
            <p className="mt-4 text-lg text-gray-600">
              A streamlined approach to finding your perfect candidate
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {process.map((item) => (
              <div key={item.step} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-4xl font-bold text-blue-100">{item.step}</span>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-3 text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 md:p-12 overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=600&fit=crop"
                alt="Team"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <svg className="w-12 h-12 text-blue-400/50" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"/>
                </svg>
                <p className="mt-4 text-xl text-white leading-relaxed">
                  &ldquo;Humanly Hired has been an incredible partner in building our engineering team.
                  They found us candidates that not only had the technical skills we needed but also fit our culture perfectly.
                  We&apos;ve made 12 hires through them in the past year alone.&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/30">
                    <Image
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop"
                      alt="Client"
                      width={56}
                      height={56}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Robert Chen</p>
                    <p className="text-blue-200">VP of Engineering, TechCorp Solutions</p>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
                    <p className="text-3xl font-bold text-white">12</p>
                    <p className="text-blue-200 text-sm">Hires Made</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
                    <p className="text-3xl font-bold text-white">100%</p>
                    <p className="text-blue-200 text-sm">Retention Rate</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
                    <p className="text-3xl font-bold text-white">8</p>
                    <p className="text-blue-200 text-sm">Days Avg. Fill</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
                    <p className="text-3xl font-bold text-white">3</p>
                    <p className="text-blue-200 text-sm">Years Partner</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1920&h=600&fit=crop"
            alt="Office"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-blue-900/90" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to Build Your Dream Team?</h2>
          <p className="mt-4 text-xl text-blue-100 max-w-2xl mx-auto">
            Let&apos;s discuss your hiring needs and how we can help you find the perfect candidates.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              <Link href="/employers/request-talent">Submit a Request</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
