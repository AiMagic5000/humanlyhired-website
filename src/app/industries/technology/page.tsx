import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Monitor, Code, Shield, Cloud, Database, CheckCircle, TrendingUp, Users, Award, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Technology & IT Staffing",
  description: "Connect with top tech talent including software engineers, data scientists, cybersecurity experts, and IT professionals. Expert technology staffing solutions.",
};

const features = [
  {
    icon: Code,
    title: "Technical Screening",
    description: "Our tech recruiters have hands-on development experience and conduct rigorous technical assessments.",
  },
  {
    icon: Shield,
    title: "Security Cleared",
    description: "Access to candidates with security clearances for government and enterprise clients.",
  },
  {
    icon: Cloud,
    title: "Cloud & DevOps",
    description: "Specialists in AWS, Azure, GCP, and modern DevOps practices and tools.",
  },
  {
    icon: Database,
    title: "Data Expertise",
    description: "From data engineers to ML specialists, we find talent that drives data initiatives.",
  },
];

const roles = [
  "Software Engineers",
  "Full-Stack Developers",
  "Frontend Developers (React, Vue, Angular)",
  "Backend Developers (Node, Python, Java)",
  "DevOps Engineers",
  "Cloud Architects",
  "Data Scientists",
  "Data Engineers",
  "Machine Learning Engineers",
  "Cybersecurity Analysts",
  "Security Engineers",
  "QA Engineers",
  "Product Managers",
  "UI/UX Designers",
  "Scrum Masters",
  "Technical Project Managers",
];

const stats = [
  { value: "45%", label: "Tech talent shortage in the US" },
  { value: "5.7M", label: "Tech jobs unfilled globally" },
  { value: "72hrs", label: "Average time to submit candidates" },
  { value: "94%", label: "Client satisfaction rate" },
];

export default function TechnologyPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=1920&h=800&fit=crop"
            alt="Technology professionals working"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-cyan-800/80" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-cyan-200 text-sm font-medium backdrop-blur-sm mb-6">
                <Monitor className="h-4 w-4" />
                Technology & IT Staffing
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-white">
                Build Your Tech Team with Elite Talent
              </h1>
              <p className="mt-6 text-xl text-blue-100">
                From startups to Fortune 500 companies, we connect you with software engineers, data scientists, and IT professionals who drive innovation.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  <Link href="/employers/request-talent">Find Tech Talent</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10">
                  <Link href="/jobs?industry=Technology">View Open Roles</Link>
                </Button>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="relative aspect-square rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                  alt="Tech team collaborating"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">10,000+</p>
                    <p className="text-sm text-gray-500">Tech placements made</p>
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
                <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
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
            <h2 className="text-3xl font-bold text-gray-900">Our Technology Staffing Advantage</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              We speak tech. Our recruiters understand the difference between React and Angular, Python and Java, AWS and Azure.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-blue-50 transition-colors">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-6">
                  <feature.icon className="h-8 w-8 text-blue-600" />
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
              <h2 className="text-3xl font-bold text-gray-900">Tech Roles We Specialize In</h2>
              <p className="mt-4 text-lg text-gray-600">
                Whether you need a single developer or an entire engineering team, we have the talent pipeline to deliver.
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
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80"
                alt="Developer coding"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Expertise */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Technologies We Recruit For</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Our network includes experts across the modern tech stack.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              "React", "Node.js", "Python", "TypeScript", "AWS", "Azure",
              "Docker", "Kubernetes", "PostgreSQL", "MongoDB", "GraphQL", "Go",
              "Java", "C#", ".NET", "Vue.js", "Angular", "Terraform"
            ].map((tech) => (
              <div key={tech} className="flex items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                <span className="font-medium text-gray-700">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Tech Companies Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80"
                alt="Tech office environment"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Why Tech Companies Choose Humanly</h2>
              <div className="mt-8 space-y-6">
                {[
                  { icon: Users, title: "50,000+ Tech Candidates", description: "Pre-vetted developers, engineers, and IT professionals ready to start" },
                  { icon: Award, title: "Technical Assessments", description: "Coding challenges and technical interviews before submission" },
                  { icon: Zap, title: "72-Hour Submittals", description: "Qualified candidates in your inbox within 3 business days" },
                  { icon: Shield, title: "90-Day Guarantee", description: "We stand behind every placement with our replacement guarantee" },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-cyan-600">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to Scale Your Tech Team?</h2>
          <p className="mt-4 text-xl text-blue-100 max-w-2xl mx-auto">
            Partner with staffing experts who understand technology. Get qualified candidates faster.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              <Link href="/employers/request-talent">Request Tech Talent</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10">
              <Link href="/contact">Talk to a Tech Recruiter</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
