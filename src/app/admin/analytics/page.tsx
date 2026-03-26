"use client";

import { useState, useEffect, useCallback } from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Briefcase,
  FileText,
  Building2,
  DollarSign,
  Clock,
  Target,
  BarChart3,
  PieChart,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AnalyticsData {
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
  monthlyApplications: Array<{
    month: string;
    applications: number;
    placements: number;
  }>;
  topJobs: Array<{
    title: string;
    applications: number;
    views: number;
    conversion: number;
  }>;
  topIndustries: Array<{
    name: string;
    jobs: number;
    applications: number;
    percentage: number;
  }>;
  recentActivity: Array<{
    type: string;
    company?: string;
    candidate?: string;
    job?: string;
    time: string;
  }>;
}

const activityLabels: Record<string, string> = {
  employer_registered: "New employer registered",
  application_submitted: "Application submitted",
  job_approved: "Job posting approved",
  placement_confirmed: "Placement confirmed",
  candidate_registered: "New candidate registered",
};

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [period, setPeriod] = useState("30d");

  const fetchAnalytics = useCallback(async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);

      const response = await fetch(`/api/admin/analytics?period=${period}`);
      const result = await response.json();

      if (result.success && result.data) {
        setAnalytics(result.data);
        if (showToast) {
          toast.success("Analytics refreshed");
        }
      } else {
        throw new Error(result.error || "Failed to fetch analytics");
      }
    } catch (error) {
      console.error("Fetch analytics error:", error);
      if (showToast) {
        toast.error("Failed to refresh analytics");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [period]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
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
        <p className="text-gray-600">Failed to load analytics</p>
      </div>
    );
  }

  const overviewStats = [
    {
      label: "Total Revenue",
      value: `$${analytics.overview.totalRevenue.toLocaleString()}`,
      change: `+${analytics.changes.revenue}%`,
      changeType: "positive" as const,
      icon: DollarSign,
      description: "vs. last month",
    },
    {
      label: "Active Users",
      value: analytics.overview.totalUsers.toLocaleString(),
      change: `+${analytics.changes.users}%`,
      changeType: "positive" as const,
      icon: Users,
      description: "vs. last month",
    },
    {
      label: "Applications",
      value: analytics.overview.totalApplications.toLocaleString(),
      change: `+${analytics.changes.applications}%`,
      changeType: "positive" as const,
      icon: FileText,
      description: "vs. last month",
    },
    {
      label: "Placements",
      value: analytics.overview.totalPlacements.toLocaleString(),
      change: `+${analytics.changes.placements}%`,
      changeType: "positive" as const,
      icon: Target,
      description: "vs. last month",
    },
  ];

  const maxApplications = Math.max(...analytics.monthlyApplications.map(d => d.applications));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Platform performance and insights</p>
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
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="12m">Last 12 months</option>
          </select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-blue-600" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                stat.changeType === "positive" ? "text-emerald-600" : "text-red-600"
              }`}>
                {stat.changeType === "positive" ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Applications Chart */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-gray-900">Applications Over Time</h2>
              <p className="text-sm text-gray-600">Monthly application trends</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="space-y-4">
            {analytics.monthlyApplications.map((data) => (
              <div key={data.month} className="flex items-center gap-4">
                <span className="w-10 text-sm text-gray-600">{data.month}</span>
                <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg transition-all"
                    style={{ width: `${(data.applications / maxApplications) * 100}%` }}
                  />
                </div>
                <span className="w-16 text-sm font-medium text-gray-900 text-right">
                  {data.applications.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Industry Distribution */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-gray-900">Industry Distribution</h2>
              <p className="text-sm text-gray-600">Jobs by industry sector</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <PieChart className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="space-y-4">
            {analytics.topIndustries.map((industry, index) => {
              const colors = [
                "bg-blue-500",
                "bg-emerald-500",
                "bg-purple-500",
                "bg-amber-500",
                "bg-rose-500",
              ];
              return (
                <div key={industry.name} className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${colors[index]}`} />
                  <span className="flex-1 text-sm text-gray-700">{industry.name}</span>
                  <span className="text-sm text-gray-500">{industry.jobs} jobs</span>
                  <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${colors[index]} rounded-full`}
                      style={{ width: `${industry.percentage}%` }}
                    />
                  </div>
                  <span className="w-10 text-sm font-medium text-gray-900 text-right">
                    {industry.percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Top Jobs */}
        <div className="lg:col-span-2 bg-white rounded-xl border">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div>
              <h2 className="font-semibold text-gray-900">Top Performing Jobs</h2>
              <p className="text-sm text-gray-600">By application count</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Applications
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Conversion
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {analytics.topJobs.map((job, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{job.title}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-gray-900 font-medium">{job.applications}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-gray-600">{job.views.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                        {job.conversion}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div>
              <h2 className="font-semibold text-gray-900">Recent Activity</h2>
              <p className="text-sm text-gray-600">Platform events</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <div className="divide-y">
            {analytics.recentActivity.map((activity, index) => (
              <div key={index} className="px-6 py-4">
                <p className="text-sm font-medium text-gray-900">
                  {activityLabels[activity.type] || activity.type}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {activity.company || activity.candidate || activity.job}
                </p>
                <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(activity.time)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <Users className="w-8 h-8 mb-4 opacity-80" />
          <p className="text-3xl font-bold">{analytics.overview.totalCandidates.toLocaleString()}</p>
          <p className="text-sm text-blue-100 mt-1">Total Candidates</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <Building2 className="w-8 h-8 mb-4 opacity-80" />
          <p className="text-3xl font-bold">{analytics.overview.totalCompanies}</p>
          <p className="text-sm text-purple-100 mt-1">Total Companies</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
          <Briefcase className="w-8 h-8 mb-4 opacity-80" />
          <p className="text-3xl font-bold">{analytics.overview.activeJobs.toLocaleString()}</p>
          <p className="text-sm text-emerald-100 mt-1">Active Jobs</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white">
          <Target className="w-8 h-8 mb-4 opacity-80" />
          <p className="text-3xl font-bold">89%</p>
          <p className="text-sm text-amber-100 mt-1">Placement Rate</p>
        </div>
      </div>
    </div>
  );
}
