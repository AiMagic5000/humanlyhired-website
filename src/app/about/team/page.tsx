import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Linkedin, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Meet Our Recruiting Team",
  description:
    "Meet the staffing experts at Humanly Hired. Our recruiters specialize in tech, healthcare, and finance hiring across all industries. Connect with us.",
  openGraph: {
    title: "Meet Our Recruiting Team | Humanly Hired",
    description:
      "Meet the staffing experts at Humanly Hired. Our recruiters specialize in tech, healthcare, and finance hiring across all industries.",
    url: "https://humanlyhired.com/about/team",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meet Our Recruiting Team | Humanly Hired",
    description:
      "Meet the staffing experts at Humanly Hired. Our recruiters specialize in tech, healthcare, and finance hiring across all industries.",
  },
};

const team = [
  {
    name: "Allie Pearson",
    role: "Managing Director",
    bio: "Allie oversees all staffing operations at Humanly Hired, bringing years of leadership experience in talent acquisition and workforce management.",
    image: "https://cdn.prod.website-files.com/67ec4cfbdf0509c176a8ce28/69ae21477cdee786dd2a9b9e_hf_20260309_012033_28ab78b2-0135-4827-8174-ee43f8da5bff.png",
  },
  {
    name: "Corey Pearson",
    role: "Chief Technology Officer",
    bio: "Corey drives the technology strategy behind Humanly Hired, building the systems that connect top talent with the right opportunities faster.",
    image: "https://cdn.prod.website-files.com/67ec4cfbdf0509c176a8ce28/6989e3c699a6f566bbd4e7e0_hf_20260209_133712_432c1773-abf6-4c7a-a3ac-571fd88c0dba.png",
  },
  {
    name: "Anna Price",
    role: "Senior Staffing Agent - Paralegal",
    bio: "Anna brings a legal background to our staffing operations, handling compliance and supporting placements across regulated industries.",
    image: "https://cdn.prod.website-files.com/67ec4cfbdf0509c176a8ce28/69ae228f7a7b95d8b5d86914_hf_20260309_012844_3e9d73f5-768c-4391-83bd-78d2f4e1ce63.png",
  },
  {
    name: "Sara Wise",
    role: "Licensed Realtor - Senior Staffing Agent",
    bio: "Sara leverages her real estate and business development background to match professionals with career opportunities that fit.",
    image: "https://cdn.prod.website-files.com/67ec4cfbdf0509c176a8ce28/69a7a230b19590d943b5b5ff_hf_20260304_030708_48f98c6f-007e-4dbb-ab20-e1ec5840eab6.jpeg",
  },
  {
    name: "Rebecca Maguire",
    role: "Assistant Director - Staffing Specialist",
    bio: "Rebecca manages day-to-day staffing operations and ensures every candidate placement meets our quality standards.",
    image: "https://cdn.prod.website-files.com/67ec4cfbdf0509c176a8ce28/69a79f728fdf37f650e945d1_Rebecca%20Maguire.png",
  },
  {
    name: "Rachael Torricelli",
    role: "Staffing Agent - Licensed Realtor",
    bio: "Rachael combines recruiting expertise with business acumen to find the right match for both candidates and employers.",
    image: "https://cdn.prod.website-files.com/67ec4cfbdf0509c176a8ce28/69a7a02ff32f7aef0f50a522_hf_20260209_200641_d5c1ac22-19d1-484c-b340-3b8d8420a3f1.png",
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
