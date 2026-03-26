import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Heart, Stethoscope, Shield, Clock, Award, CheckCircle, Users, Building, BadgeCheck, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Healthcare Staffing",
  description: "Specialized healthcare staffing solutions for hospitals, clinics, and medical facilities. Find qualified nurses, physicians, therapists, and healthcare administrators.",
};

const features = [
  {
    icon: BadgeCheck,
    title: "Credential Verification",
    description: "Thorough verification of licenses, certifications, and education for all healthcare professionals.",
  },
  {
    icon: Shield,
    title: "Compliance Expertise",
    description: "We ensure all candidates meet HIPAA, Joint Commission, and state-specific requirements.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Healthcare never stops. Neither do we. Round-the-clock support for urgent staffing needs.",
  },
  {
    icon: Heart,
    title: "Culture Matching",
    description: "We find compassionate professionals who align with your facility's values and patient care standards.",
  },
];

const roles = [
  "Registered Nurses (RN)",
  "Licensed Practical Nurses (LPN)",
  "Nurse Practitioners (NP)",
  "Certified Nursing Assistants (CNA)",
  "Physicians & Specialists",
  "Physician Assistants (PA)",
  "Medical Technicians",
  "Laboratory Technologists",
  "Radiologic Technologists",
  "Physical Therapists",
  "Occupational Therapists",
  "Speech-Language Pathologists",
  "Healthcare Administrators",
  "Medical Coders & Billers",
  "Pharmacists",
  "Respiratory Therapists",
];

const stats = [
  { value: "500K+", label: "Healthcare workers placed nationwide" },
  { value: "98%", label: "Credential verification accuracy" },
  { value: "24/7", label: "Emergency staffing support" },
  { value: "1.3M", label: "Nursing shortage projected by 2030" },
];

const facilityTypes = [
  "Hospitals & Health Systems",
  "Outpatient Clinics",
  "Long-Term Care Facilities",
  "Rehabilitation Centers",
  "Home Health Agencies",
  "Urgent Care Centers",
  "Specialty Practices",
  "Telehealth Providers",
];

export default function HealthcarePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1920&h=800&fit=crop"
            alt="Healthcare professionals"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-rose-900/90 to-pink-800/80" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-rose-200 text-sm font-medium backdrop-blur-sm mb-6">
                <Heart className="h-4 w-4" />
                Healthcare Staffing
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-white">
                Compassionate Care Starts with the Right Team
              </h1>
              <p className="mt-6 text-xl text-rose-100">
                We understand the critical importance of healthcare staffing. Our rigorous vetting ensures you get qualified, compassionate professionals who deliver exceptional patient care.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-white text-rose-600 hover:bg-rose-50">
                  <Link href="/employers/request-talent">Find Healthcare Staff</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10">
                  <Link href="/jobs?industry=Healthcare">View Open Roles</Link>
                </Button>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="relative aspect-square rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80"
                  alt="Doctor with patient"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                    <HeartPulse className="h-6 w-6 text-rose-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">25,000+</p>
                    <p className="text-sm text-gray-500">Healthcare placements</p>
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
                <p className="text-3xl font-bold text-rose-600">{stat.value}</p>
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
            <h2 className="text-3xl font-bold text-gray-900">Healthcare Staffing You Can Trust</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Patient safety is paramount. Our comprehensive screening process ensures every candidate meets the highest standards.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="text-center p-6 rounded-2xl bg-rose-50 hover:bg-rose-100 transition-colors">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-100 flex items-center justify-center mb-6">
                  <feature.icon className="h-8 w-8 text-rose-600" />
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
              <h2 className="text-3xl font-bold text-gray-900">Healthcare Roles We Staff</h2>
              <p className="mt-4 text-lg text-gray-600">
                From frontline nurses to administrative leadership, we fill positions across the entire healthcare spectrum.
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
                src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&q=80"
                alt="Nurse with patient"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Facilities We Serve */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl order-2 lg:order-1">
              <Image
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80"
                alt="Hospital building"
                fill
                className="object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-gray-900">Healthcare Facilities We Serve</h2>
              <p className="mt-4 text-lg text-gray-600">
                We partner with healthcare organizations of all sizes, from small practices to large health systems.
              </p>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {facilityTypes.map((facility) => (
                  <div key={facility} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <Building className="h-5 w-5 text-rose-500 shrink-0" />
                    <span className="text-gray-700">{facility}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Healthcare Facilities Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">The Humanly Healthcare Difference</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Users, title: "Specialized Recruiters", description: "Our healthcare division is staffed by former nurses and healthcare administrators who understand your needs." },
              { icon: Award, title: "Joint Commission Ready", description: "All candidates are screened to meet Joint Commission and state regulatory requirements." },
              { icon: Stethoscope, title: "Clinical Competency", description: "Skills assessments and competency testing ensure candidates can hit the ground running." },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="w-14 h-14 rounded-xl bg-rose-100 flex items-center justify-center mb-6">
                  <item.icon className="w-7 h-7 text-rose-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-3 text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-rose-600 to-pink-600">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">Ensure Quality Patient Care with the Right Staff</h2>
          <p className="mt-4 text-xl text-rose-100 max-w-2xl mx-auto">
            Partner with healthcare staffing experts who prioritize patient safety and clinical excellence.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-rose-600 hover:bg-rose-50">
              <Link href="/employers/request-talent">Request Healthcare Staff</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10">
              <Link href="/contact">Speak with a Specialist</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
