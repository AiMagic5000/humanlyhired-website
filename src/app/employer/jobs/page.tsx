"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Users,
  MapPin,
  DollarSign,
  Calendar,
  Edit,
  Trash2,
  Copy,
  Pause,
  Play,
  Loader2,
  RefreshCw,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  applications: number;
  newApplications: number;
  views: number;
  postedAt: string;
  expiresAt: string;
  status: string;
  description: string;
}

interface JobStats {
  total: number;
  active: number;
  paused: number;
  closed: number;
  draft: number;
}

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  active: { label: "Active", bg: "bg-emerald-100", text: "text-emerald-700" },
  paused: { label: "Paused", bg: "bg-amber-100", text: "text-amber-700" },
  closed: { label: "Closed", bg: "bg-gray-100", text: "text-gray-700" },
  draft: { label: "Draft", bg: "bg-blue-100", text: "text-blue-700" },
};

export default function EmployerJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<JobStats>({ total: 0, active: 0, paused: 0, closed: 0, draft: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);

      const response = await fetch("/api/employer/jobs");
      const result = await response.json();

      if (result.success && result.data) {
        setJobs(result.data.jobs);
        setStats(result.data.stats);
        if (showToast) {
          toast.success("Jobs refreshed");
        }
      } else {
        throw new Error(result.error || "Failed to fetch jobs");
      }
    } catch (error) {
      console.error("Fetch jobs error:", error);
      if (showToast) {
        toast.error("Failed to refresh jobs");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    setActionLoading(jobId);
    setOpenDropdown(null);

    try {
      const response = await fetch("/api/employer/jobs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, status: newStatus }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        // Update local state
        setJobs((prev) =>
          prev.map((job) => (job.id === jobId ? { ...job, status: newStatus } : job))
        );
        // Update stats
        setStats((prev) => {
          const oldJob = jobs.find((j) => j.id === jobId);
          if (!oldJob) return prev;
          const newStats = { ...prev };
          newStats[oldJob.status as keyof JobStats]--;
          newStats[newStatus as keyof JobStats]++;
          return newStats;
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Status change error:", error);
      toast.error("Failed to update job status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
      return;
    }

    setActionLoading(jobId);
    setOpenDropdown(null);

    try {
      const response = await fetch(`/api/employer/jobs?jobId=${jobId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Job deleted successfully");
        // Remove from local state
        const deletedJob = jobs.find((j) => j.id === jobId);
        setJobs((prev) => prev.filter((job) => job.id !== jobId));
        if (deletedJob) {
          setStats((prev) => ({
            ...prev,
            total: prev.total - 1,
            [deletedJob.status as keyof JobStats]: prev[deletedJob.status as keyof JobStats] - 1,
          }));
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete job");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Postings</h1>
          <p className="text-gray-600 mt-1">
            Manage your job listings and track applications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchJobs(true)}
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button asChild>
            <Link href="/employer/jobs/new">
              <Plus className="w-4 h-4 mr-2" />
              Post New Job
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => setStatusFilter("all")}
          className={`p-4 rounded-xl border text-left transition-all ${
            statusFilter === "all" ? "border-blue-500 bg-blue-50" : "bg-white hover:border-gray-300"
          }`}
        >
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-600">Total Jobs</p>
        </button>
        <button
          onClick={() => setStatusFilter("active")}
          className={`p-4 rounded-xl border text-left transition-all ${
            statusFilter === "active" ? "border-emerald-500 bg-emerald-50" : "bg-white hover:border-gray-300"
          }`}
        >
          <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
          <p className="text-sm text-gray-600">Active</p>
        </button>
        <button
          onClick={() => setStatusFilter("paused")}
          className={`p-4 rounded-xl border text-left transition-all ${
            statusFilter === "paused" ? "border-amber-500 bg-amber-50" : "bg-white hover:border-gray-300"
          }`}
        >
          <p className="text-2xl font-bold text-amber-600">{stats.paused}</p>
          <p className="text-sm text-gray-600">Paused</p>
        </button>
        <button
          onClick={() => setStatusFilter("closed")}
          className={`p-4 rounded-xl border text-left transition-all ${
            statusFilter === "closed" ? "border-gray-500 bg-gray-50" : "bg-white hover:border-gray-300"
          }`}
        >
          <p className="text-2xl font-bold text-gray-600">{stats.closed}</p>
          <p className="text-sm text-gray-600">Closed</p>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      {/* Jobs List */}
      <div className="bg-white rounded-xl border divide-y">
        {filteredJobs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto mb-4 flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No jobs found</h3>
            <p className="text-gray-600 mt-1">
              {searchQuery ? "Try a different search term" : "Post your first job to get started"}
            </p>
            {!searchQuery && (
              <Button className="mt-4" asChild>
                <Link href="/employer/jobs/new">Post a Job</Link>
              </Button>
            )}
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div key={job.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          href={`/employer/jobs/${job.id}`}
                          className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {job.title}
                        </Link>
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                            statusConfig[job.status]?.bg || "bg-gray-100"
                          } ${statusConfig[job.status]?.text || "text-gray-700"}`}
                        >
                          {statusConfig[job.status]?.label || job.status}
                        </span>
                        {job.newApplications > 0 && (
                          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-red-100 text-red-700">
                            {job.newApplications} new
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {job.salary}
                        </span>
                        <span>{job.type}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Posted {new Date(job.postedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-gray-900">{job.applications}</span>
                      <span className="text-gray-500">applications</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Eye className="w-4 h-4 text-purple-600" />
                      <span className="font-medium text-gray-900">{job.views}</span>
                      <span className="text-gray-500">views</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/employer/applications?job=${job.id}`}>
                      View Applications
                    </Link>
                  </Button>

                  <div className="relative">
                    <button
                      onClick={() => setOpenDropdown(openDropdown === job.id ? null : job.id)}
                      className="p-2 rounded-lg hover:bg-gray-100"
                      disabled={actionLoading === job.id}
                    >
                      {actionLoading === job.id ? (
                        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                      ) : (
                        <MoreHorizontal className="w-5 h-5 text-gray-400" />
                      )}
                    </button>

                    {openDropdown === job.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setOpenDropdown(null)}
                        />
                        <div className="absolute right-0 top-full mt-1 z-20 w-48 bg-white rounded-lg shadow-lg border py-1">
                          <Link
                            href={`/employer/jobs/${job.id}/edit`}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Edit className="w-4 h-4" />
                            Edit Job
                          </Link>
                          <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            <Copy className="w-4 h-4" />
                            Duplicate
                          </button>
                          {job.status === "active" ? (
                            <button
                              onClick={() => handleStatusChange(job.id, "paused")}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Pause className="w-4 h-4" />
                              Pause Job
                            </button>
                          ) : job.status === "paused" ? (
                            <button
                              onClick={() => handleStatusChange(job.id, "active")}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Play className="w-4 h-4" />
                              Reactivate
                            </button>
                          ) : null}
                          {job.status !== "closed" && (
                            <button
                              onClick={() => handleStatusChange(job.id, "closed")}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <X className="w-4 h-4" />
                              Close Job
                            </button>
                          )}
                          <hr className="my-1" />
                          <button
                            onClick={() => handleDelete(job.id)}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
