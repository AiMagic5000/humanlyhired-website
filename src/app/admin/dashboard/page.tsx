"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  Briefcase,
  Building2,
  FileText,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Mail,
  AlertCircle,
  Activity,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Analytics {
  overview: {
    totalUsers: number;
    activeJobs: number;
    totalApplications: number;
    totalCompanies: number;
    totalCandidates: number;
    totalPlacements: number;
    totalRevenue: number;
  };
  changes: {
    users: number;
    jobs: number;
    applications: number;
    companies: number;
    placements: number;
    revenue: number;
  };
  recentApplications: {
    id: string;
    candidate: string;
    avatar: string;
    job: string;
    company: string;
    appliedAt: string;
    status: string;
  }[];
  newUsers: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    type: string;
    joinedAt: string;
  }[];
  pendingActions: {
    companyVerifications: number;
    jobReviews: number;
    supportTickets: number;
  };
}

// Calculate greeting based on time of day
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  new: { bg: "bg-blue-100", text: "text-blue-700", label: "New" },
  reviewing: { bg: "bg-amber-100", text: "text-amber-700", label: "Reviewing" },
  shortlisted: { bg: "bg-purple-100", text: "text-purple-700", label: "Shortlisted" },
  interviewed: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Interviewed" },
  hired: { bg: "bg-green-100", text: "text-green-700", label: "Hired" },
};

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const greeting = getGreeting();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);

      const response = await fetch("/api/admin/analytics");
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
      name: "Total Users",
      value: analytics.overview.totalUsers.toLocaleString(),
      change: `+${analytics.changes.users}%`,
      changeType: "positive",
      icon: Users,
      href: "/admin/users",
    },
    {
      name: "Active Jobs",
      value: analytics.overview.activeJobs.toLocaleString(),
      change: `+${analytics.changes.jobs}%`,
      changeType: "positive",
      icon: Briefcase,
      href: "/admin/jobs",
    },
    {
      name: "Applications",
      value: analytics.overview.totalApplications.toLocaleString(),
      change: `+${analytics.changes.applications}%`,
      changeType: "positive",
      icon: FileText,
      href: "/admin/applications",
    },
    {
      name: "Companies",
      value: analytics.overview.totalCompanies.toLocaleString(),
      change: `+${analytics.changes.companies}%`,
      changeType: "positive",
      icon: Building2,
      href: "/admin/companies",
    },
  ];

  const pendingActions = [
    {
      id: 1,
      type: "company_verification",
      title: "Company Verification Required",
      description: `${analytics.pendingActions.companyVerifications} compan${analytics.pendingActions.companyVerifications > 1 ? "ies" : "y"} need${analytics.pendingActions.companyVerifications === 1 ? "s" : ""} verification`,
      priority: "high",
      icon: Building2,
    },
    {
      id: 2,
      type: "job_review",
      title: "Job Posting Review",
      description: `${analytics.pendingActions.jobReviews} new job postings awaiting approval`,
      priority: "medium",
      icon: Briefcase,
    },
    {
      id: 3,
      type: "support_ticket",
      title: "Support Tickets",
      description: `${analytics.pendingActions.supportTickets} unresolved support requests`,
      priority: "medium",
      icon: Mail,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{greeting}, Admin!</h1>
          <p className="text-gray-600 mt-1">
            Here&apos;s what&apos;s happening on your platform today.
          </p>
        </div>
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
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-blue-600" />
              </div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${
                  stat.changeType === "positive"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {stat.changeType === "positive" ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600 mt-1">{stat.name}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Pending Actions */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-500" />
          Pending Actions
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {pendingActions.map((action) => (
            <div
              key={action.id}
              className={`p-4 rounded-lg border-l-4 ${
                action.priority === "high"
                  ? "border-l-red-500 bg-red-50"
                  : "border-l-amber-500 bg-amber-50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    action.priority === "high" ? "bg-red-100" : "bg-amber-100"
                  }`}
                >
                  <action.icon
                    className={`w-5 h-5 ${
                      action.priority === "high" ? "text-red-600" : "text-amber-600"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{action.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Applications */}
        <div className="bg-white rounded-xl border">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="font-semibold text-gray-900">Recent Applications</h2>
            <Link
              href="/admin/applications"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y">
            {analytics.recentApplications.map((application) => (
              <div key={application.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <Image
                    src={application.avatar}
                    alt={application.candidate}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{application.candidate}</p>
                    <p className="text-sm text-gray-600 truncate">
                      {application.job} at {application.company}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${
                        statusConfig[application.status]?.bg || "bg-gray-100"
                      } ${statusConfig[application.status]?.text || "text-gray-700"}`}
                    >
                      {statusConfig[application.status]?.label || application.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(application.appliedAt)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New Users */}
        <div className="bg-white rounded-xl border">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="font-semibold text-gray-900">New Users</h2>
            <Link
              href="/admin/users"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y">
            {analytics.newUsers.map((user) => (
              <div key={user.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{user.name}</p>
                    <p className="text-sm text-gray-600 truncate">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${
                        user.type === "employer"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {user.type === "employer" ? "Employer" : "Candidate"}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(user.joinedAt)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Chart Placeholder */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-gray-900">Platform Activity</h2>
          <select className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm bg-white">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
          </select>
        </div>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">Activity chart would be displayed here</p>
            <p className="text-sm text-gray-500 mt-1">Integrate with a charting library like Recharts</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
          <Link href="/admin/jobs">
            <Briefcase className="w-6 h-6 text-blue-600" />
            <span>Manage Jobs</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
          <Link href="/admin/users">
            <Users className="w-6 h-6 text-blue-600" />
            <span>Manage Users</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
          <Link href="/admin/companies">
            <Building2 className="w-6 h-6 text-blue-600" />
            <span>Manage Companies</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
          <Link href="/admin/settings">
            <Mail className="w-6 h-6 text-blue-600" />
            <span>Email Settings</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
