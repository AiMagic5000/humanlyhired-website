"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  FileCheck,
  Users,
  Building,
  Briefcase,
  Calculator,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    title: "Executive Search",
    description: "Find C-suite and senior leadership talent through our targeted executive recruitment approach.",
    icon: Search,
    href: "/services/executive-search",
    color: "bg-blue-500",
  },
  {
    title: "Contract Staffing",
    description: "Flexible workforce solutions for project-based needs and seasonal demands.",
    icon: FileCheck,
    href: "/services/contract-staffing",
    color: "bg-emerald-500",
  },
  {
    title: "Direct Hire",
    description: "Permanent placement solutions to build your core team with top talent.",
    icon: Users,
    href: "/services/direct-hire",
    color: "bg-purple-500",
  },
  {
    title: "RPO Services",
    description: "Recruitment Process Outsourcing to streamline your entire hiring function.",
    icon: Building,
    href: "/services/rpo",
    color: "bg-orange-500",
  },
  {
    title: "Talent Sourcing",
    description: "Proactive candidate sourcing and pipeline development for future needs.",
    icon: Briefcase,
    href: "/services/talent-sourcing",
    color: "bg-pink-500",
  },
  {
    title: "Payroll Services",
    description: "Comprehensive payroll management and compliance solutions.",
    icon: Calculator,
    href: "/services/payroll",
    color: "bg-cyan-500",
  },
];

export function ServicesPreview() {
  return (
    <section className="py-20 bg-gray-50">
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
            Comprehensive Staffing Solutions
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            From executive search to payroll services, we offer end-to-end staffing solutions
            tailored to your business needs.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link
                href={service.href}
                className="group block h-full rounded-2xl bg-white p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-100 transition-all duration-300"
              >
                <div className={`inline-flex rounded-xl ${service.color} p-3 text-white`}>
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                <p className="mt-3 text-gray-600">
                  {service.description}
                </p>
                <div className="mt-6 flex items-center text-blue-600 font-medium">
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
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
          <Button asChild size="lg">
            <Link href="/services">
              View All Services
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
