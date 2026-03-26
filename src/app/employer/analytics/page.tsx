"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  FileText,
  UserCheck,
  Clock,
  Briefcase,
  Users,
  BarChart3,
  Calendar,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface OverviewStat {
  label: string;
  value: number;
  change: string;
  changeType: "positive" | "negative";
  description: string;
}

interface JobPerformance {
  title: string;
  views: number;
  applications: number;
  conversion: string;
  status: string;
}

interface WeeklyData {
  day: string;
  views: number;
  applications: number;
}

interface SourceData {
  source: string;
  applications: number;
  percentage: number;
}

interface PipelineData {
  stage: string;
  count: number;
  color: string;
}

interface QuickStats {
  activeJobs: number;
  avgDaysToHire: number;
  offerAcceptRate: number;
  avgConversion: number;
}

interface AnalyticsData {
  overviewStats: OverviewStat[];
  jobPerformance: JobPerformance[];
  weeklyData: WeeklyData[];
  sourceData: SourceData[];
  pipelineData: PipelineData[];
  quickStats: QuickStats;
}

const iconMap: Record<string, React.ElementType> = {
  "Total Views": Eye,
  "Applications": FileText,
  "Interviews": Calendar,
  "Hires": UserCheck,
};

export default function EmployerAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState("30d");

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
  };

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const maxViews = Math.max(...analytics.weeklyData.map(d => d.views));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Track your recruiting performance</p>
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
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
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
        {analytics.overviewStats.map((stat) => {
          const Icon = iconMap[stat.label] || Eye;
          return (
            <div key={stat.label} className="bg-white rounded-xl border p-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-blue-600" />
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
                <p className="text-3xl font-bold text-gray-900">
                  {stat.value.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hiring Pipeline */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-semibold text-gray-900">Hiring Pipeline</h2>
            <p className="text-sm text-gray-600">Current candidate distribution</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
            <Users className="w-5 h-5 text-purple-600" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {analytics.pipelineData.map((stage, index) => (
            <div key={stage.stage} className="flex-1">
              <div className="relative">
                <div className={`h-16 ${stage.color} rounded-lg flex items-center justify-center`}>
                  <span className="text-white font-bold text-xl">{stage.count}</span>
                </div>
                {index < analytics.pipelineData.length - 1 && (
                  <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center z-10">
                    <span className="text-gray-400 text-xs">→</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-600 text-center mt-2">{stage.stage}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Weekly Performance */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-gray-900">Weekly Performance</h2>
              <p className="text-sm text-gray-600">Views and applications this week</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="space-y-4">
            {analytics.weeklyData.map((data) => (
              <div key={data.day} className="flex items-center gap-4">
                <span className="w-10 text-sm text-gray-600">{data.day}</span>
                <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg transition-all"
                    style={{ width: `${(data.views / maxViews) * 100}%` }}
                  />
                </div>
                <div className="flex items-center gap-4 w-28">
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">{data.views}</span>
                  <span className="text-sm text-gray-500 w-8 text-right">{data.applications}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-end gap-6 mt-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-500" />
              <span className="text-xs text-gray-600">Views</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gray-400" />
              <span className="text-xs text-gray-600">Applications</span>
            </div>
          </div>
        </div>

        {/* Application Sources */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-gray-900">Application Sources</h2>
              <p className="text-sm text-gray-600">Where candidates find your jobs</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Eye className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="space-y-4">
            {analytics.sourceData.map((source, index) => {
              const colors = [
                "bg-blue-500",
                "bg-purple-500",
                "bg-amber-500",
                "bg-emerald-500",
              ];
              return (
                <div key={source.source} className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${colors[index]}`} />
                  <span className="flex-1 text-sm text-gray-700">{source.source}</span>
                  <span className="text-sm text-gray-500">{source.applications} apps</span>
                  <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${colors[index]} rounded-full`}
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                  <span className="w-10 text-sm font-medium text-gray-900 text-right">
                    {source.percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Job Performance Table */}
      <div className="bg-white rounded-xl border">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="font-semibold text-gray-900">Job Performance</h2>
            <p className="text-sm text-gray-600">Individual job listing metrics</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-amber-600" />
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
                  Views
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Applications
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Conversion
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {analytics.jobPerformance.map((job, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{job.title}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-gray-900">{job.views.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-gray-900 font-medium">{job.applications}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                      {job.conversion}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      job.status === "Active"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {job.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <Briefcase className="w-8 h-8 mb-4 opacity-80" />
          <p className="text-3xl font-bold">{analytics.quickStats.activeJobs}</p>
          <p className="text-sm text-blue-100 mt-1">Active Jobs</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <Clock className="w-8 h-8 mb-4 opacity-80" />
          <p className="text-3xl font-bold">{analytics.quickStats.avgDaysToHire}</p>
          <p className="text-sm text-purple-100 mt-1">Avg. Days to Hire</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
          <UserCheck className="w-8 h-8 mb-4 opacity-80" />
          <p className="text-3xl font-bold">{analytics.quickStats.offerAcceptRate}%</p>
          <p className="text-sm text-emerald-100 mt-1">Offer Accept Rate</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white">
          <TrendingUp className="w-8 h-8 mb-4 opacity-80" />
          <p className="text-3xl font-bold">{analytics.quickStats.avgConversion}%</p>
          <p className="text-sm text-amber-100 mt-1">Avg. Conversion</p>
        </div>
      </div>
    </div>
  );
}
