"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";

export function CTA() {
  return (
    <section className="py-20 bg-blue-600">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Ready to Find Your Perfect Match?
          </h2>
          <p className="mt-4 text-xl text-blue-100 max-w-2xl mx-auto">
            Whether you&apos;re looking for your next career opportunity or searching for top talent,
            we&apos;re here to help you succeed.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="xl" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
              <Link href="/jobs">
                Find Jobs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link href="/employers/request-talent">
                Hire Talent
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Contact Info */}
          <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-6 text-blue-100">
            <a
              href={`tel:${siteConfig.contact.phone.replace(/[^0-9]/g, "")}`}
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <Phone className="h-5 w-5" />
              {siteConfig.contact.phone}
            </a>
            <span className="hidden sm:block text-blue-300">|</span>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <Mail className="h-5 w-5" />
              {siteConfig.contact.email}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
