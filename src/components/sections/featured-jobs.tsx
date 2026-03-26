"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Clock, DollarSign, ArrowRight, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { jobs } from "@/data/jobs";

export function FeaturedJobs() {
  const featuredJobs = jobs.filter((job) => job.featured).slice(0, 6);

  return (
    <section className="py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Featured Opportunities
            </h2>
            <p className="mt-3 text-lg text-gray-600">
              Discover top positions from leading employers
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/jobs">
              View All Jobs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        {/* Jobs Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link
                href={`/jobs/${job.id}`}
                className="group block h-full rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-100 transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="default">{job.industry}</Badge>
                      {job.featured && (
                        <Badge variant="success">Featured</Badge>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {job.title}
                    </h3>
                    <p className="mt-1 text-gray-600 font-medium">{job.company}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Briefcase className="h-4 w-4 flex-shrink-0" />
                    <span>{job.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <DollarSign className="h-4 w-4 flex-shrink-0" />
                    <span>{job.salary}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
                  </div>
                  <span className="text-blue-600 font-medium text-sm group-hover:underline">
                    Apply Now
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 mb-4">
            Don&apos;t see what you&apos;re looking for?
          </p>
          <Button asChild size="lg">
            <Link href="/jobs">
              Browse All {jobs.length}+ Jobs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
