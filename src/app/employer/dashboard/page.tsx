"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Briefcase,
  Users,
  Eye,
  TrendingUp,
  Clock,
  Calendar,
  ArrowRight,
  MapPin,
  DollarSign,
  MoreHorizontal,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Application {
  id: string;
  candidate: string;
  position: string;
  appliedAt: string;
  status: string;
  avatar: string;
  experience: string;
  location: string;
}

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  applications: number;
  views: number;
  postedAt: string;
  status: string;
}

interface EmployerAnalytics {
  stats: {
    activeJobs: number;
    totalApplications: number;
    profileViews: number;
    hireRate: number;
  };
  changes: {
    jobs: string;
    applications: string;
    views: string;
    hireRate: string;
  };
  recentApplications: Application[];
  activeJobs: Job[];
}

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  new: { bg: "bg-blue-100", text: "text-blue-700", label: "New" },
  reviewing: { bg: "bg-amber-100", text: "text-amber-700", label: "Reviewing" },
  shortlisted: { bg: "bg-purple-100", text: "text-purple-700", label: "Shortlisted" },
  interviewed: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Interviewed" },
  rejected: { bg: "bg-red-100", text: "text-red-700", label: "Rejected" },
  hired: { bg: "bg-green-100", text: "text-green-700", label: "Hired" },
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Unknown";

  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Unknown";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function EmployerDashboard() {
  const [analytics, setAnalytics] = useState<EmployerAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const greeting = getGreeting();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);

      const response = await fetch("/api/employer/analytics");
      const result = await response.json();

      if (result.success && result.data) {
        setAnalytics(result.data);
        if (showToast) {
          toast.success("Dashboard refreshed");
        }
      } else {
        throw new Error(result.error || "Failed to fetch analytics");
      }
    } catch (error) {
      console.error("Fetch analytics error:", error);
      if (showToast) {
        toast.error("Failed to refresh dashboard");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Failed to load dashboard data</p>
      </div>
    );
  }

  const stats = [
    {
      name: "Active Jobs",
      value: analytics.stats.activeJobs.toString(),
      change: analytics.changes.jobs,
      changeType: "positive",
      icon: Briefcase,
      color: "blue",
    },
    {
      name: "Total Applications",
      value: analytics.stats.totalApplications.toString(),
      change: analytics.changes.applications,
      changeType: "positive",
      icon: Users,
      color: "emerald",
    },
    {
      name: "Profile Views",
      value: analytics.stats.profileViews.toLocaleString(),
      change: analytics.changes.views,
      changeType: "positive",
      icon: Eye,
      color: "purple",
    },
    {
      name: "Hire Rate",
      value: `${analytics.stats.hireRate}%`,
      change: analytics.changes.hireRate,
      changeType: "positive",
      icon: TrendingUp,
      color: "amber",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{greeting}!</h1>
          <p className="text-gray-600 mt-1">
            Here&apos;s what&apos;s happening with your job postings today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchAnalytics(true)}
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button asChild>
            <Link href="/employer/jobs/new">Post New Job</Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  stat.color === "blue"
                    ? "bg-blue-100"
                    : stat.color === "emerald"
                    ? "bg-emerald-100"
                    : stat.color === "purple"
                    ? "bg-purple-100"
                    : "bg-amber-100"
                }`}
              >
                <stat.icon
                  className={`w-6 h-6 ${
                    stat.color === "blue"
                      ? "text-blue-600"
                      : stat.color === "emerald"
                      ? "text-emerald-600"
                      : stat.color === "purple"
                      ? "text-purple-600"
                      : "text-amber-600"
                  }`}
                />
              </div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stat.changeType === "positive"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600 mt-1">{stat.name}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Applications */}
        <div className="bg-white rounded-xl border">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="font-semibold text-gray-900">Recent Applications</h2>
            <Link
              href="/employer/applications"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y">
            {analytics.recentApplications.map((application) => (
              <div
                key={application.id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <Image
                    src={application.avatar}
                    alt={application.candidate}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-gray-900">
                          {application.candidate}
                        </p>
                        <p className="text-sm text-gray-600">
                          {application.position}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          statusColors[application.status]?.bg || "bg-gray-100"
                        } ${statusColors[application.status]?.text || "text-gray-700"}`}
                      >
                        {statusColors[application.status]?.label || application.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        {application.experience}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {application.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(application.appliedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Jobs */}
        <div className="bg-white rounded-xl border">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="font-semibold text-gray-900">Active Job Postings</h2>
            <Link
              href="/employer/jobs"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              Manage jobs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y">
            {analytics.activeJobs.map((job) => (
              <div
                key={job.id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{job.title}</p>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                        Active
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" />
                        {job.salary}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Posted {formatDate(job.postedAt)}
                      </span>
                    </div>
                  </div>
                  <button className="p-2 rounded-lg hover:bg-gray-100">
                    <MoreHorizontal className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                <div className="flex items-center gap-6 mt-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-900 font-medium">{job.applications}</span>
                    <span className="text-gray-500">applications</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Eye className="w-4 h-4 text-purple-600" />
                    <span className="text-gray-900 font-medium">{job.views}</span>
                    <span className="text-gray-500">views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold">Ready to find your next great hire?</h2>
            <p className="text-blue-100 mt-2">
              Post a new job and reach thousands of qualified candidates.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" asChild>
              <Link href="/employer/jobs/new">Post a Job</Link>
            </Button>
            <Button
              variant="outline"
              className="bg-transparent border-white/30 text-white hover:bg-white/10"
              asChild
            >
              <Link href="/employers/pricing">View Plans</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
