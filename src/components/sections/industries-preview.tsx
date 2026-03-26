"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Monitor,
  Heart,
  DollarSign,
  Factory,
  ShoppingBag,
  Truck,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const industries = [
  {
    name: "Technology & IT",
    description: "Software engineers, data scientists, cybersecurity experts, and IT professionals.",
    icon: Monitor,
    href: "/industries/technology",
    jobs: "120+ Open Positions",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    name: "Healthcare",
    description: "Nurses, physicians, medical technicians, and healthcare administrators.",
    icon: Heart,
    href: "/industries/healthcare",
    jobs: "85+ Open Positions",
    gradient: "from-rose-500 to-pink-500",
  },
  {
    name: "Finance & Accounting",
    description: "Financial analysts, accountants, auditors, and investment professionals.",
    icon: DollarSign,
    href: "/industries/finance",
    jobs: "65+ Open Positions",
    gradient: "from-emerald-500 to-green-500",
  },
  {
    name: "Manufacturing",
    description: "Production managers, engineers, quality control specialists, and technicians.",
    icon: Factory,
    href: "/industries/manufacturing",
    jobs: "70+ Open Positions",
    gradient: "from-orange-500 to-amber-500",
  },
  {
    name: "Retail & Hospitality",
    description: "Store managers, customer service, hospitality professionals, and sales teams.",
    icon: ShoppingBag,
    href: "/industries/retail",
    jobs: "55+ Open Positions",
    gradient: "from-purple-500 to-violet-500",
  },
  {
    name: "Logistics & Warehouse",
    description: "Supply chain managers, warehouse supervisors, drivers, and coordinators.",
    icon: Truck,
    href: "/industries/logistics",
    jobs: "45+ Open Positions",
    gradient: "from-slate-500 to-gray-600",
  },
];

export function IndustriesPreview() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Industries We Specialize In
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Deep expertise across multiple sectors ensures we understand your unique hiring challenges
            and deliver candidates who fit your industry requirements.
          </p>
        </motion.div>

        {/* Industries Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry, index) => (
            <motion.div
              key={industry.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link
                href={industry.href}
                className="group relative block h-full overflow-hidden rounded-2xl bg-gray-900 p-8 transition-transform hover:-translate-y-1"
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${industry.gradient} opacity-90`} />

                {/* Content */}
                <div className="relative z-10">
                  <industry.icon className="h-10 w-10 text-white" />
                  <h3 className="mt-6 text-xl font-semibold text-white">
                    {industry.name}
                  </h3>
                  <p className="mt-3 text-white/80 text-sm">
                    {industry.description}
                  </p>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm font-medium text-white/90">
                      {industry.jobs}
                    </span>
                    <ArrowRight className="h-5 w-5 text-white transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Button asChild variant="outline" size="lg">
            <Link href="/industries">
              Explore All Industries
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
