"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, MapPin, Briefcase, Users, Award, TrendingUp, CheckCircle2, Star, ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";

const stats = [
  { value: "2,500+", label: "Successful Placements", icon: Users },
  { value: "98%", label: "Client Satisfaction", icon: Award },
  { value: "14", label: "Day Avg. Time to Fill", icon: TrendingUp },
  { value: "12+", label: "Industries Served", icon: Briefcase },
];

const clientLogos = [
  "Fortune 500 Companies",
  "Tech Startups",
  "Healthcare Systems",
  "Financial Institutions",
  "Manufacturing Leaders",
];

const reviews = [
  { name: "Sarah M.", role: "HR Director", company: "TechCorp", rating: 5, image: "https://randomuser.me/api/portraits/women/44.jpg" },
  { name: "James L.", role: "CEO", company: "StartupXYZ", rating: 5, image: "https://randomuser.me/api/portraits/men/32.jpg" },
  { name: "Maria G.", role: "Hiring Manager", company: "HealthFirst", rating: 5, image: "https://randomuser.me/api/portraits/women/68.jpg" },
];

const trustBadgeImages = [
  "https://randomuser.me/api/portraits/women/22.jpg",
  "https://randomuser.me/api/portraits/men/45.jpg",
  "https://randomuser.me/api/portraits/women/56.jpg",
  "https://randomuser.me/api/portraits/men/67.jpg",
];

export function Hero() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [location, setLocation] = React.useState("");

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-gradient-radial from-blue-100/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-indigo-100/30 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center py-16 lg:py-24">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="inline-flex flex-wrap items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6 max-w-full"
            >
              <div className="flex -space-x-2 flex-shrink-0">
                {trustBadgeImages.map((img, i) => (
                  <Image
                    key={i}
                    src={img}
                    alt={`Customer ${i + 1}`}
                    width={28}
                    height={28}
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>
              <span className="text-xs sm:text-sm font-medium text-blue-900">
                Trusted by 500+ companies
              </span>
              <div className="flex items-center gap-0.5 flex-shrink-0">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
              Hiring{" "}
              <span className="relative">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  top talent
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path d="M2 8.5C50 2.5 150 2.5 198 8.5" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>{" "}
              for fast-growing teams
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed">
              {siteConfig.name} is your global recruitment and staffing partner dedicated to finding,
              hiring, and managing exceptional talent across technology, healthcare, finance, and beyond.
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-8 p-2 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100"
            >
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Job title, keywords, or company"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border-0 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="City, state, or remote"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border-0 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>
                <Button size="lg" className="w-full sm:w-auto px-6 sm:px-8 py-4 h-auto text-base font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25" asChild>
                  <Link href="/jobs" className="flex items-center justify-center gap-2">
                    Search Jobs
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Quick Links */}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
              <span className="font-medium text-gray-900">Popular:</span>
              {["Software Engineer", "Healthcare", "Finance", "Remote"].map((term) => (
                <Link
                  key={term}
                  href={`/jobs?q=${encodeURIComponent(term)}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {term}
                </Link>
              ))}
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-10 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4"
            >
              <Button asChild size="lg" className="w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 h-auto text-base font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25">
                <Link href="/employers/request-talent" className="flex items-center justify-center gap-2">
                  <Users className="h-5 w-5" />
                  Hire Talent
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 h-auto text-base font-semibold rounded-xl border-2 border-gray-200 hover:border-blue-200 hover:bg-blue-50">
                <Link href="/jobs" className="flex items-center justify-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Find Jobs
                </Link>
              </Button>
              <Button variant="ghost" size="lg" className="w-full sm:w-auto px-6 py-5 sm:py-6 h-auto text-base font-semibold rounded-xl text-gray-600 hover:text-blue-600" asChild>
                <Link href="/about" className="flex items-center justify-center gap-2">
                  <Play className="h-5 w-5 fill-current" />
                  Watch How It Works
                </Link>
              </Button>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-100"
            >
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <div className="flex -space-x-2 sm:-space-x-3 flex-shrink-0">
                  {reviews.map((review, i) => (
                    <Image
                      key={i}
                      src={review.image}
                      alt={review.name}
                      width={40}
                      height={40}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white object-cover shadow-md"
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-semibold text-gray-900">4.9/5</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">from 500+ verified reviews</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative hidden lg:block"
          >
            {/* Main Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl transform rotate-3 scale-105 opacity-10" />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/20">
                <Image
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="Professional team collaboration"
                  width={600}
                  height={500}
                  className="w-full h-auto object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent" />
              </div>

              {/* Floating Stats Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute -left-8 top-8 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">2,500+</p>
                    <p className="text-sm text-gray-600">Successful Placements</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Review Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="absolute -right-4 bottom-16 bg-white rounded-2xl shadow-xl p-4 border border-gray-100 max-w-[220px]"
              >
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 italic">
                  &quot;Found the perfect candidate in just 10 days!&quot;
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <Image
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt="Sarah Mitchell"
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-xs font-semibold text-gray-900">Sarah Mitchell</p>
                    <p className="text-xs text-gray-500">HR Director, TechCorp</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Job Alert */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute -bottom-4 left-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-4 text-white"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-100">New Jobs Added</p>
                    <p className="text-xl font-bold">50+ this week</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="border-t border-gray-100 bg-gray-50/50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 text-blue-600 mb-3">
                  <stat.icon className="w-6 h-6" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Client Logos */}
      <div className="border-t border-gray-100 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <p className="text-center text-sm font-medium text-gray-500 mb-6">
            TRUSTED BY INDUSTRY LEADERS
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {clientLogos.map((logo, i) => (
              <div
                key={i}
                className="flex items-center justify-center h-8 px-4 text-gray-400 font-semibold text-sm tracking-wider"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
