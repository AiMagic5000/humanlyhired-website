"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Clock,
  Shield,
  Users,
  Award,
  Target,
  HeartHandshake,
  CheckCircle2,
} from "lucide-react";
import { siteConfig } from "@/lib/config";

const features = [
  {
    icon: Clock,
    title: "Fast Placement",
    description: "Average time-to-fill of just 14 days. Get qualified candidates faster than industry average.",
  },
  {
    icon: Shield,
    title: "Quality Guaranteed",
    description: "98% satisfaction rate with a 90-day replacement guarantee on all placements.",
  },
  {
    icon: Users,
    title: "Extensive Network",
    description: "Access to 50,000+ pre-screened candidates across all industries and experience levels.",
  },
  {
    icon: Award,
    title: "Industry Expertise",
    description: "Specialized recruiters with deep knowledge in their respective industries.",
  },
  {
    icon: Target,
    title: "Precision Matching",
    description: "Advanced screening process ensures perfect culture and skill fit every time.",
  },
  {
    icon: HeartHandshake,
    title: "Dedicated Support",
    description: "Personal account managers providing end-to-end support throughout the process.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Why Companies Choose{" "}
              <span className="text-blue-600">{siteConfig.name}</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              We&apos;re not just another staffing agency. We&apos;re your strategic partner
              in building high-performing teams that drive business success.
            </p>

            {/* Key Benefits List */}
            <div className="mt-8 space-y-4">
              {[
                "Access to 50,000+ pre-vetted candidates",
                "Average 14-day time to fill positions",
                "90-day replacement guarantee",
                "Dedicated account manager support",
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-2 gap-6">
              <div className="rounded-xl bg-blue-50 p-6">
                <p className="text-4xl font-bold text-blue-600">{siteConfig.stats.placements}</p>
                <p className="mt-1 text-sm text-gray-600">Successful Placements</p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-6">
                <p className="text-4xl font-bold text-emerald-600">{siteConfig.stats.satisfaction}</p>
                <p className="mt-1 text-sm text-gray-600">Client Satisfaction</p>
              </div>
              <div className="rounded-xl bg-purple-50 p-6">
                <p className="text-4xl font-bold text-purple-600">{siteConfig.stats.industries}</p>
                <p className="mt-1 text-sm text-gray-600">Industries Served</p>
              </div>
              <div className="rounded-xl bg-amber-50 p-6">
                <p className="text-4xl font-bold text-amber-600">{siteConfig.stats.yearsExperience}</p>
                <p className="mt-1 text-sm text-gray-600">Years Experience</p>
              </div>
            </div>

            {/* Professional Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-10 relative rounded-2xl overflow-hidden"
            >
              <Image
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Team collaboration and success"
                width={600}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="font-semibold">Building Dream Teams Since 2010</p>
                <p className="text-sm text-blue-100">Trusted by Fortune 500 companies worldwide</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Features */}
          <div className="grid gap-6 sm:grid-cols-2">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="rounded-xl border border-gray-100 p-6 hover:border-blue-100 hover:shadow-md transition-all"
              >
                <div className="inline-flex rounded-lg bg-blue-100 p-2 text-blue-600">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
