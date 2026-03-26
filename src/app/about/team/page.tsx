import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Linkedin, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Team",
  description: "Meet the dedicated team behind Brand Metrics LLC",
};

const team = [
  {
    name: "Antonio Goldwire",
    role: "Founder & CEO",
    bio: "Antonio founded Humanly Hired with a vision to transform how companies and talent connect. With over 15 years in recruitment, he leads our strategic direction.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Sarah Mitchell",
    role: "VP of Operations",
    bio: "Sarah ensures our operations run smoothly and efficiently. Her background in HR consulting brings valuable insights to our processes.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Michael Chen",
    role: "Director of Technology Recruiting",
    bio: "Michael leads our IT and technology staffing division. His engineering background helps him understand client needs deeply.",
    image: "https://randomuser.me/api/portraits/men/52.jpg",
  },
  {
    name: "Jennifer Rodriguez",
    role: "Director of Healthcare Recruiting",
    bio: "Jennifer brings 10+ years of healthcare recruiting experience, specializing in nursing and allied health placements.",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    name: "David Park",
    role: "Senior Account Executive",
    bio: "David manages relationships with our largest enterprise clients, ensuring they receive exceptional service and results.",
    image: "https://randomuser.me/api/portraits/men/76.jpg",
  },
  {
    name: "Amanda Torres",
    role: "Talent Acquisition Manager",
    bio: "Amanda leads our candidate sourcing efforts, building pipelines of top talent across all industries.",
    image: "https://randomuser.me/api/portraits/women/89.jpg",
  },
];

export default function TeamPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-white">Meet Our Team</h1>
            <p className="mt-6 text-xl text-blue-100">
              Dedicated professionals committed to connecting great talent with great opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-square bg-gradient-to-br from-blue-100 to-blue-50">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-blue-600 font-medium">{member.role}</p>
                  <p className="mt-4 text-gray-600 text-sm">{member.bio}</p>
                  <div className="mt-6 flex gap-3">
                    <a
                      href="#"
                      className="rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                    <a
                      href="#"
                      className="rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                    >
                      <Mail className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Team CTA */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Join Our Team</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            We&apos;re always looking for talented individuals who share our passion for connecting
            people with opportunities.
          </p>
          <Link
            href="/jobs"
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            View Open Positions
          </Link>
        </div>
      </section>
    </div>
  );
}
