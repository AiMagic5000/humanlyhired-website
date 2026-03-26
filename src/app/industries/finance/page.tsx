import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DollarSign, TrendingUp, Shield, Calculator, BarChart3, CheckCircle, Users, Award, FileCheck, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Finance & Accounting Staffing",
  description: "Expert finance and accounting staffing solutions. Find qualified CPAs, financial analysts, controllers, and accounting professionals for your organization.",
};

const features = [
  {
    icon: FileCheck,
    title: "CPA & Certification Verified",
    description: "We verify all professional certifications including CPA, CFA, CMA, and state licenses.",
  },
  {
    icon: Shield,
    title: "Background Screened",
    description: "Comprehensive background checks including credit history for sensitive financial roles.",
  },
  {
    icon: Calculator,
    title: "Technical Assessments",
    description: "Skills testing on accounting software, Excel, financial modeling, and industry-specific tools.",
  },
  {
    icon: BarChart3,
    title: "Industry Specialization",
    description: "From public accounting to corporate finance, we understand your specific requirements.",
  },
];

const roles = [
  "Chief Financial Officers (CFO)",
  "Controllers",
  "Finance Directors",
  "Financial Analysts",
  "Senior Accountants",
  "Staff Accountants",
  "Accounts Payable/Receivable",
  "Bookkeepers",
  "Tax Managers",
  "Tax Preparers",
  "Auditors (Internal & External)",
  "Payroll Specialists",
  "Budget Analysts",
  "Treasury Analysts",
  "Financial Planning & Analysis (FP&A)",
  "Investment Analysts",
];

const stats = [
  { value: "2.4M", label: "Finance jobs in the US" },
  { value: "89%", label: "Placement success rate" },
  { value: "$95K", label: "Average salary placed" },
  { value: "14 days", label: "Average time to fill" },
];

const specializations = [
  { name: "Public Accounting", description: "Big 4, regional, and local CPA firms" },
  { name: "Corporate Finance", description: "In-house finance and accounting teams" },
  { name: "Banking & Financial Services", description: "Banks, credit unions, investment firms" },
  { name: "Insurance", description: "Carriers, brokers, and agencies" },
  { name: "Private Equity & VC", description: "Fund accounting and portfolio management" },
  { name: "Real Estate", description: "REITs, property management, development" },
];

export default function FinancePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1920&h=800&fit=crop"
            alt="Finance professionals"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 to-green-800/80" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-emerald-200 text-sm font-medium backdrop-blur-sm mb-6">
                <DollarSign className="h-4 w-4" />
                Finance & Accounting Staffing
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-white">
                Financial Talent That Drives Business Growth
              </h1>
              <p className="mt-6 text-xl text-emerald-100">
                From CPAs to CFOs, we connect you with finance and accounting professionals who bring expertise, accuracy, and strategic insight to your organization.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50">
                  <Link href="/employers/request-talent">Find Finance Talent</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10">
                  <Link href="/jobs?industry=Finance">View Open Roles</Link>
                </Button>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="relative aspect-square rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80"
                  alt="Financial analysis"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">15,000+</p>
                    <p className="text-sm text-gray-500">Finance placements</p>
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
                <p className="text-3xl font-bold text-emerald-600">{stat.value}</p>
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
            <h2 className="text-3xl font-bold text-gray-900">Our Finance Staffing Process</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Precision matters in finance. Our rigorous vetting ensures every candidate has the skills and credentials you need.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="text-center p-6 rounded-2xl bg-emerald-50 hover:bg-emerald-100 transition-colors">
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

      {/* Roles We Fill */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Finance & Accounting Roles We Staff</h2>
              <p className="mt-4 text-lg text-gray-600">
                From entry-level bookkeepers to C-suite executives, we have the network to fill any finance position.
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
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
                alt="Financial dashboard"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Industry Specializations */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Industry Specializations</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Finance roles vary significantly by industry. We understand the nuances that matter.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specializations.map((spec) => (
              <div key={spec.name} className="p-6 rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                  <PieChart className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{spec.name}</h3>
                <p className="mt-2 text-gray-600">{spec.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Software Expertise */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
                alt="Financial software"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Candidates Skilled in Leading Software</h2>
              <p className="mt-4 text-lg text-gray-600">
                Our candidates are proficient in the tools your team uses every day.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  "QuickBooks", "SAP", "Oracle", "NetSuite",
                  "Sage", "Microsoft Dynamics", "Workday", "Xero",
                  "Bloomberg Terminal", "Excel (Advanced)", "Power BI", "Tableau"
                ].map((software) => (
                  <div key={software} className="flex items-center gap-2 p-3 rounded-lg bg-white border border-gray-100">
                    <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span className="text-gray-700 text-sm">{software}</span>
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
            <h2 className="text-3xl font-bold text-gray-900">Why Finance Leaders Choose Humanly</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Users, title: "CPA Recruiters on Staff", description: "Our finance team includes former CPAs and finance managers who speak your language." },
              { icon: Award, title: "Credential Verification", description: "Every certification is verified directly with issuing bodies before candidate submission." },
              { icon: Shield, title: "Confidential Searches", description: "Discrete executive searches for sensitive CFO and controller placements." },
            ].map((item) => (
              <div key={item.title} className="bg-gray-50 rounded-2xl p-8">
                <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center mb-6">
                  <item.icon className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-3 text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-green-600">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">Find Finance Talent That Adds Up</h2>
          <p className="mt-4 text-xl text-emerald-100 max-w-2xl mx-auto">
            Partner with staffing experts who understand the bottom line. Get qualified finance candidates faster.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50">
              <Link href="/employers/request-talent">Request Finance Talent</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10">
              <Link href="/contact">Talk to a Finance Recruiter</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
