"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useUser } from "@clerk/nextjs";
import {
  FileText,
  Bookmark,
  Eye,
  TrendingUp,
  Briefcase,
  Clock,
  ArrowRight,
  Bell,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DashboardStats {
  applications: number;
  savedJobs: number;
  profileViews: number;
  interviewInvites: number;
}

interface RecentApplication {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  appliedDate: string;
  status: string;
}

interface RecommendedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  posted: string;
}

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
  reviewing: { bg: "bg-blue-100", text: "text-blue-800", label: "Under Review" },
  interviewing: { bg: "bg-purple-100", text: "text-purple-800", label: "Interviewing" },
  offered: { bg: "bg-green-100", text: "text-green-800", label: "Offered" },
  hired: { bg: "bg-green-100", text: "text-green-800", label: "Hired" },
  rejected: { bg: "bg-red-100", text: "text-red-800", label: "Not Selected" },
};

function DashboardContent() {
  const { user, isLoaded: userLoaded } = useUser();
  const [stats, setStats] = useState<DashboardStats>({
    applications: 0,
    savedJobs: 0,
    profileViews: 0,
    interviewInvites: 0,
  });
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<RecommendedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);

      const response = await fetch("/api/dashboard");
      const result = await response.json();

      if (result.success && result.data) {
        setStats(result.data.stats);
        setRecentApplications(result.data.recentApplications);
        setRecommendedJobs(result.data.recommendedJobs);
        if (showToast) {
          toast.success("Dashboard refreshed");
        }
      } else {
        throw new Error(result.error || "Failed to fetch dashboard data");
      }
    } catch (error) {
      console.error("Fetch dashboard error:", error);
      if (showToast) {
        toast.error("Failed to refresh dashboard");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const statsConfig = [
    { name: "Applications", value: stats.applications, icon: FileText, change: "+3 this week", color: "blue" },
    { name: "Saved Jobs", value: stats.savedJobs, icon: Bookmark, change: "+2 this week", color: "indigo" },
    { name: "Profile Views", value: stats.profileViews, icon: Eye, change: "+12% vs last week", color: "green" },
    { name: "Interview Invites", value: stats.interviewInvites, icon: TrendingUp, change: "+1 this week", color: "purple" },
  ];

  if (loading || !userLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.firstName || "there"}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here&apos;s what&apos;s happening with your job search
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button asChild>
            <Link href="/jobs" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Browse Jobs
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsConfig.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl ${
                stat.color === "blue" ? "bg-blue-100" :
                stat.color === "indigo" ? "bg-indigo-100" :
                stat.color === "green" ? "bg-green-100" :
                "bg-purple-100"
              }`}>
                <stat.icon className={`w-6 h-6 ${
                  stat.color === "blue" ? "text-blue-600" :
                  stat.color === "indigo" ? "text-indigo-600" :
                  stat.color === "green" ? "text-green-600" :
                  "text-purple-600"
                }`} />
              </div>
              <span className="text-xs text-green-600 font-medium">{stat.change}</span>
            </div>
            <p className="mt-4 text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.name}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Applications */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
            <Link
              href="/dashboard/applications"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentApplications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No applications yet. Start browsing jobs!
              </div>
            ) : (
              recentApplications.map((application) => {
                const status = statusColors[application.status] || statusColors.pending;
                return (
                  <div key={application.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {application.jobTitle}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {application.company} • {application.location}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            Applied {application.appliedDate}
                          </span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recommended Jobs */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Recommended for You</h2>
            <Link
              href="/jobs"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              See more
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recommendedJobs.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No recommendations yet. Complete your profile to get personalized suggestions.
              </div>
            ) : (
              recommendedJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="block p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{job.title}</h3>
                      <p className="text-sm text-gray-600">
                        {job.company} • {job.location}
                      </p>
                      <p className="text-sm text-green-600 font-medium mt-1">{job.salary}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">
                        {job.type}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{job.posted}</p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <Bell className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">Complete Your Profile</h3>
            <p className="text-blue-100 mt-1">
              Profiles with complete information get 3x more views from recruiters.
              Add your skills, experience, and upload your resume to stand out.
            </p>
            <Button variant="secondary" className="mt-4 bg-white text-blue-600 hover:bg-blue-50" asChild>
              <Link href="/dashboard/profile">
                Complete Profile
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Use dynamic import with SSR disabled to prevent prerendering issues with Clerk
const DashboardPage = dynamic(() => Promise.resolve(DashboardContent), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  ),
});

export default DashboardPage;
