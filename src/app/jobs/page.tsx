"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Filter,
  X,
  Loader2,
  Building2,
  Globe,
  ChevronDown,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ExternalJob } from "@/lib/job-apis/types";

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Manufacturing",
  "Retail",
  "Logistics",
  "Marketing",
  "Sales",
  "Human Resources",
  "Creative",
  "Customer Service",
  "Government",
  "Other",
];

const jobTypes = ["Full-time", "Part-time", "Contract", "Temporary", "Internship"];

const locations = [
  "Remote",
  "New York, NY",
  "San Francisco, CA",
  "Los Angeles, CA",
  "Chicago, IL",
  "Austin, TX",
  "Seattle, WA",
  "Denver, CO",
  "Boston, MA",
  "Atlanta, GA",
  "Miami, FL",
  "Dallas, TX",
  "Phoenix, AZ",
];

interface JobsResponse {
  success: boolean;
  jobs: ExternalJob[];
  pagination: {
    total: number;
    limit: number;
    page: number;
    totalPages: number;
    hasMore: boolean;
  };
  source: string;
}

interface JobStats {
  totalJobs: number;
  byIndustry: Record<string, number>;
  byType: Record<string, number>;
  bySource: Record<string, number>;
  byLocationType: Record<string, number>;
  remoteCount: number;
}

const jobsPerPageOptions = [24, 48, 96, 192];

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [jobsPerPage, setJobsPerPage] = useState(24);

  const [jobs, setJobs] = useState<ExternalJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<JobStats | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);

  // Fetch jobs from API
  const fetchJobs = useCallback(async (pageNum: number = 1, refresh: boolean = false, limit: number = jobsPerPage) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set("page", pageNum.toString());
      params.set("limit", limit.toString());

      if (searchQuery) params.set("query", searchQuery);
      if (selectedIndustry !== "all") params.set("industry", selectedIndustry);
      if (selectedType !== "all") params.set("type", selectedType);
      if (selectedLocation !== "all" && selectedLocation !== "Remote") {
        params.set("location", selectedLocation);
      }
      if (remoteOnly || selectedLocation === "Remote") {
        params.set("remote", "true");
      }
      if (refresh) params.set("refresh", "true");

      const response = await fetch(`/api/jobs?${params}`);
      const data: JobsResponse = await response.json();

      if (data.success) {
        setJobs(data.jobs);
        setPage(data.pagination.page);
        setTotalPages(data.pagination.totalPages);
        setTotalJobs(data.pagination.total);
      } else {
        setError("Failed to load jobs. Please try again.");
      }
    } catch (err) {
      setError("Failed to connect to job service. Please try again later.");
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedIndustry, selectedType, selectedLocation, remoteOnly, jobsPerPage]);

  // Fetch job statistics
  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch("/api/jobs?stats=true");
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchJobs(1);
    fetchStats();
  }, []);

  // Refetch when filters change
  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchJobs(1);
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery, selectedIndustry, selectedType, selectedLocation, remoteOnly, fetchJobs]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedIndustry("all");
    setSelectedType("all");
    setSelectedLocation("all");
    setRemoteOnly(false);
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedIndustry !== "all" ||
    selectedType !== "all" ||
    selectedLocation !== "all" ||
    remoteOnly;

  const handleRefresh = () => {
    fetchJobs(page, true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const getSourceBadge = (source: string) => {
    const sourceColors: Record<string, string> = {
      internal: "bg-blue-100 text-blue-800",
      database: "bg-emerald-100 text-emerald-800",
      adzuna: "bg-purple-100 text-purple-800",
      usajobs: "bg-green-100 text-green-800",
      remotive: "bg-orange-100 text-orange-800",
      arbeitnow: "bg-pink-100 text-pink-800",
      joinrise: "bg-cyan-100 text-cyan-800",
    };
    return sourceColors[source] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Header */}
      <section className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 py-12 sm:py-16 lg:py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Find Your Next Career Opportunity
            </h1>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
              Browse{" "}
              <span className="font-semibold text-white">
                {totalJobs.toLocaleString()}+
              </span>{" "}
              open positions from top companies worldwide
            </p>

            {/* Stats Row */}
            {stats && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-6 flex flex-wrap justify-center gap-3 sm:gap-6"
              >
                <div className="flex items-center gap-2 text-blue-100 text-xs sm:text-sm">
                  <Building2 className="h-4 w-4" />
                  <span>
                    <strong className="text-white">{Object.keys(stats.byIndustry).length}</strong> industries
                  </span>
                </div>
                <div className="flex items-center gap-2 text-blue-100 text-xs sm:text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span>
                    <strong className="text-white">{Object.keys(stats.byType).length}</strong> job types
                  </span>
                </div>
                <div className="flex items-center gap-2 text-blue-100 text-xs sm:text-sm">
                  <Globe className="h-4 w-4" />
                  <span>
                    <strong className="text-white">{stats.remoteCount || 0}</strong> remote jobs
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 sm:mt-8 max-w-3xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row gap-2 bg-white rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-2xl">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search jobs, companies, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-0 focus-visible:ring-0 text-base h-11 sm:h-12"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  className="sm:hidden flex-1 h-11"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </Button>
                <Button
                  type="submit"
                  className="flex-1 sm:flex-none h-11 sm:h-12 px-6 sm:px-8 bg-blue-600 hover:bg-blue-700"
                  onClick={() => fetchJobs(1)}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Search"
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 lg:py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Filters Sidebar */}
          <aside
            className={`lg:w-72 xl:w-80 flex-shrink-0 ${
              showFilters ? "block" : "hidden lg:block"
            }`}
          >
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 sticky top-20 sm:top-24">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="font-semibold text-gray-900 text-lg">Filters</h2>
                <div className="flex items-center gap-2">
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Clear all
                    </button>
                  )}
                  <button
                    onClick={handleRefresh}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                    title="Refresh jobs"
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              <div className="space-y-5 sm:space-y-6">
                {/* Remote Toggle */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={remoteOnly}
                      onChange={(e) => setRemoteOnly(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      Remote positions only
                    </span>
                  </label>
                </div>

                {/* Industry Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="All Industries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Industries</SelectItem>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                          {stats?.byIndustry[industry] && (
                            <span className="ml-2 text-gray-400">
                              ({stats.byIndustry[industry]})
                            </span>
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Job Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type
                  </label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {jobTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                          {stats?.byType[type] && (
                            <span className="ml-2 text-gray-400">
                              ({stats.byType[type]})
                            </span>
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Close button for mobile */}
              <Button
                variant="outline"
                className="w-full mt-6 lg:hidden h-11"
                onClick={() => setShowFilters(false)}
              >
                Apply Filters
              </Button>
            </div>
          </aside>

          {/* Jobs List */}
          <div className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
              <div className="flex items-center gap-4">
                <p className="text-gray-600 text-sm sm:text-base">
                  Showing{" "}
                  <span className="font-semibold text-gray-900">
                    {jobs.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-900">
                    {totalJobs.toLocaleString()}
                  </span>{" "}
                  jobs
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Per page:</span>
                  <Select
                    value={jobsPerPage.toString()}
                    onValueChange={(val) => {
                      const newLimit = parseInt(val);
                      setJobsPerPage(newLimit);
                      fetchJobs(1, false, newLimit);
                    }}
                  >
                    <SelectTrigger className="w-20 h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {jobsPerPageOptions.map((option) => (
                        <SelectItem key={option} value={option.toString()}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                  {selectedIndustry !== "all" && (
                    <Badge variant="secondary" className="gap-1 text-xs">
                      {selectedIndustry}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setSelectedIndustry("all")}
                      />
                    </Badge>
                  )}
                  {selectedType !== "all" && (
                    <Badge variant="secondary" className="gap-1 text-xs">
                      {selectedType}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setSelectedType("all")}
                      />
                    </Badge>
                  )}
                  {selectedLocation !== "all" && (
                    <Badge variant="secondary" className="gap-1 text-xs">
                      {selectedLocation}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setSelectedLocation("all")}
                      />
                    </Badge>
                  )}
                  {remoteOnly && (
                    <Badge variant="secondary" className="gap-1 text-xs">
                      Remote Only
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setRemoteOnly(false)}
                      />
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Top Pagination */}
            {!loading && totalPages > 1 && (
              <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Button
                  variant="outline"
                  onClick={() => fetchJobs(page - 1)}
                  disabled={page <= 1 || loading}
                  className="w-full sm:w-auto"
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600 order-first sm:order-none">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => fetchJobs(page + 1)}
                  disabled={page >= totalPages || loading}
                  className="w-full sm:w-auto"
                >
                  Next
                </Button>
              </div>
            )}

            {/* Loading State */}
            {loading && jobs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 sm:py-20">
                <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500">Loading jobs...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12 sm:py-16 bg-white rounded-xl border border-red-100">
                <div className="text-red-500 mb-4">
                  <X className="h-10 w-10 sm:h-12 sm:w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{error}</h3>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => fetchJobs(page)}
                >
                  Try Again
                </Button>
              </div>
            )}

            {/* Jobs Grid */}
            {!loading && !error && jobs.length > 0 && (
              <AnimatePresence mode="wait">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3 sm:space-y-4"
                >
                  {jobs.map((job, index) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                    >
                      <Link
                        href={`/jobs/${job.id}`}
                        className="block bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-200 group"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                          {/* Company Logo Placeholder */}
                          {job.companyLogo ? (
                            <img
                              src={job.companyLogo}
                              alt={job.company}
                              className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold text-lg">
                                {job.company.charAt(0)}
                              </span>
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            {/* Badges Row */}
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2">
                              <Badge className="text-xs font-medium">
                                {job.industry}
                              </Badge>
                              {job.featured && (
                                <Badge variant="success" className="text-xs">
                                  Featured
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs">
                                {job.type}
                              </Badge>
                              {job.locationType === 'remote' && (
                                <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                  Remote
                                </Badge>
                              )}
                            </div>

                            {/* Job Title */}
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                              {job.title}
                            </h3>

                            {/* Company Name */}
                            <p className="mt-1 text-sm sm:text-base text-gray-600 font-medium">
                              {job.company}
                            </p>

                            {/* Description */}
                            <p className="mt-2 text-xs sm:text-sm text-gray-500 line-clamp-2">
                              {job.description.replace(/<[^>]*>/g, '').substring(0, 200)}...
                            </p>

                            {/* Meta Info */}
                            <div className="mt-3 sm:mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs sm:text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 text-gray-400" />
                                <span className="truncate max-w-[120px] sm:max-w-[180px]">
                                  {job.location}
                                </span>
                              </span>
                              {job.salary && (
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 text-gray-400" />
                                  <span className="truncate">{job.salary}</span>
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 text-gray-400" />
                                {formatDate(job.postedDate)}
                              </span>
                            </div>

                            {/* Skills */}
                            {job.skills.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-1.5">
                                {job.skills.slice(0, 5).map((skill) => (
                                  <span
                                    key={skill}
                                    className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md"
                                  >
                                    {skill}
                                  </span>
                                ))}
                                {job.skills.length > 5 && (
                                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded-md">
                                    +{job.skills.length - 5} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* View Job Button */}
                          <div className="flex sm:flex-col gap-2 sm:gap-3 mt-2 sm:mt-0">
                            <Button className="flex-1 sm:flex-none h-10 sm:h-11 px-4 sm:px-6 text-sm">
                              View Job
                            </Button>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}

            {/* Empty State */}
            {!loading && !error && jobs.length === 0 && (
              <div className="text-center py-12 sm:py-16 bg-white rounded-xl border border-gray-100">
                <Briefcase className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  No jobs found
                </h3>
                <p className="mt-2 text-gray-500 text-sm sm:text-base">
                  Try adjusting your search or filters
                </p>
                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Button
                  variant="outline"
                  onClick={() => fetchJobs(page - 1)}
                  disabled={page <= 1 || loading}
                  className="w-full sm:w-auto"
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600 order-first sm:order-none">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => fetchJobs(page + 1)}
                  disabled={page >= totalPages || loading}
                  className="w-full sm:w-auto"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
