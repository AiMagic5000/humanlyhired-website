"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Bookmark,
  MapPin,
  DollarSign,
  Clock,
  Building2,
  ExternalLink,
  Trash2,
  BellRing,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SavedJob {
  id: string;
  jobId: string;
  savedAt: string;
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    salary: string;
    logo: string;
    postedAt: string;
    deadline: string;
    status: string;
  };
}

interface Stats {
  total: number;
  active: number;
  closingSoon: number;
  expired: number;
}

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, closingSoon: 0, expired: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);

      const response = await fetch("/api/saved-jobs");
      const result = await response.json();

      if (result.success) {
        setSavedJobs(result.data || []);
        setStats(result.stats || { total: 0, active: 0, closingSoon: 0, expired: 0 });
        if (showToast) {
          toast.success("Saved jobs refreshed");
        }
      } else {
        throw new Error(result.error || "Failed to fetch saved jobs");
      }
    } catch (error) {
      console.error("Fetch saved jobs error:", error);
      if (showToast) {
        toast.error("Failed to refresh saved jobs");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const removeSavedJob = async (savedJobId: string) => {
    setRemovingId(savedJobId);
    try {
      const response = await fetch(`/api/saved-jobs?id=${savedJobId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        setSavedJobs(prev => prev.filter(job => job.id !== savedJobId));
        setStats(prev => {
          const removedJob = savedJobs.find(j => j.id === savedJobId);
          if (!removedJob) return prev;

          return {
            total: prev.total - 1,
            active: removedJob.job.status === "active" ? prev.active - 1 : prev.active,
            closingSoon: removedJob.job.status === "closing_soon" ? prev.closingSoon - 1 : prev.closingSoon,
            expired: removedJob.job.status === "expired" ? prev.expired - 1 : prev.expired,
          };
        });
        toast.success("Job removed from saved jobs");
      } else {
        throw new Error(result.error || "Failed to remove job");
      }
    } catch (error) {
      console.error("Remove saved job error:", error);
      toast.error("Failed to remove job");
    } finally {
      setRemovingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Unknown date";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) return 0;
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const activeJobs = savedJobs.filter(job => job.job.status !== "expired");
  const expiredJobs = savedJobs.filter(job => job.job.status === "expired");

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
          <h1 className="text-2xl font-bold text-gray-900">Saved Jobs</h1>
          <p className="text-gray-600 mt-1">Jobs you&apos;ve bookmarked for later</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchSavedJobs(true)}
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button asChild>
            <Link href="/jobs">Browse More Jobs</Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-4 text-center">
          <Bookmark className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-600">Total Saved</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <Clock className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
          <p className="text-sm text-gray-600">Still Open</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <BellRing className="w-6 h-6 text-amber-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-amber-600">{stats.closingSoon}</p>
          <p className="text-sm text-gray-600">Closing Soon</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <Clock className="w-6 h-6 text-gray-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-400">{stats.expired}</p>
          <p className="text-sm text-gray-600">Expired</p>
        </div>
      </div>

      {/* Active Jobs */}
      {activeJobs.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Listings</h2>
          <div className="space-y-4">
            {activeJobs.map((savedJob) => {
              const daysLeft = getDaysUntilDeadline(savedJob.job.deadline);
              const isRemoving = removingId === savedJob.id;
              return (
                <div key={savedJob.id} className="bg-white rounded-xl border hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={savedJob.job.logo}
                          alt={savedJob.job.company}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">{savedJob.job.title}</h3>
                            <p className="text-gray-600">{savedJob.job.company}</p>
                          </div>
                          {savedJob.job.status === "closing_soon" && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-amber-100 text-amber-700">
                              <BellRing className="w-3.5 h-3.5" />
                              {daysLeft} days left
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            {savedJob.job.location}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <DollarSign className="w-4 h-4" />
                            {savedJob.job.salary}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Building2 className="w-4 h-4" />
                            {savedJob.job.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-3 border-t bg-gray-50 flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      Saved on {formatDate(savedJob.savedAt)}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-red-600 hover:text-red-700"
                        onClick={() => removeSavedJob(savedJob.id)}
                        disabled={isRemoving}
                      >
                        {isRemoving ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                        Remove
                      </Button>
                      <Button size="sm" className="gap-1.5" asChild>
                        <Link href={`/jobs/${savedJob.jobId}/apply`}>
                          Apply Now
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Expired Jobs */}
      {expiredJobs.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Expired Listings</h2>
          <div className="space-y-4">
            {expiredJobs.map((savedJob) => {
              const isRemoving = removingId === savedJob.id;
              return (
                <div key={savedJob.id} className="bg-white rounded-xl border opacity-60">
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 grayscale">
                        <Image
                          src={savedJob.job.logo}
                          alt={savedJob.job.company}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">{savedJob.job.title}</h3>
                            <p className="text-gray-600">{savedJob.job.company}</p>
                          </div>
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 text-gray-500">
                            Expired
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-400">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            {savedJob.job.location}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <DollarSign className="w-4 h-4" />
                            {savedJob.job.salary}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-3 border-t bg-gray-50 flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                      Expired on {formatDate(savedJob.job.deadline)}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-gray-500"
                      onClick={() => removeSavedJob(savedJob.id)}
                      disabled={isRemoving}
                    >
                      {isRemoving ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                      Remove
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {savedJobs.length === 0 && (
        <div className="bg-white rounded-xl border p-12 text-center">
          <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No saved jobs yet</h3>
          <p className="text-gray-600 mt-2 mb-6">Save jobs you&apos;re interested in to apply later</p>
          <Button asChild>
            <Link href="/jobs">Browse Jobs</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
