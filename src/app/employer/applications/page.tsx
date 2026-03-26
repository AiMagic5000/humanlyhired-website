"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Star,
  ExternalLink,
  Loader2,
  RefreshCw,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Candidate {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  location: string;
  currentTitle: string;
  experience: string;
  linkedin?: string;
  portfolio?: string;
}

interface Application {
  id: string;
  candidate: Candidate;
  job: {
    id: string;
    title: string;
    department: string;
  };
  appliedAt: string;
  status: string;
  rating: number;
  notes: string;
  coverLetter: string;
  resumeUrl: string;
}

interface ApplicationStats {
  total: number;
  new: number;
  reviewing: number;
  shortlisted: number;
  interviewed: number;
  offered: number;
  hired: number;
  rejected: number;
}

const statusConfig: Record<string, { label: string; bg: string; text: string; icon: React.ElementType }> = {
  new: { label: "New", bg: "bg-blue-100", text: "text-blue-700", icon: Clock },
  reviewing: { label: "Reviewing", bg: "bg-amber-100", text: "text-amber-700", icon: Eye },
  shortlisted: { label: "Shortlisted", bg: "bg-purple-100", text: "text-purple-700", icon: Star },
  interviewed: { label: "Interviewed", bg: "bg-emerald-100", text: "text-emerald-700", icon: MessageSquare },
  offered: { label: "Offered", bg: "bg-green-100", text: "text-green-700", icon: CheckCircle },
  rejected: { label: "Rejected", bg: "bg-red-100", text: "text-red-700", icon: XCircle },
  hired: { label: "Hired", bg: "bg-green-100", text: "text-green-700", icon: CheckCircle },
};

function ApplicationsContent() {
  const searchParams = useSearchParams();
  const jobIdParam = searchParams.get("job");

  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<ApplicationStats>({
    total: 0, new: 0, reviewing: 0, shortlisted: 0, interviewed: 0, offered: 0, hired: 0, rejected: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [updating, setUpdating] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string>("");
  const [pendingRating, setPendingRating] = useState<number>(0);
  const [pendingNotes, setPendingNotes] = useState<string>("");

  useEffect(() => {
    fetchApplications();
  }, [jobIdParam]);

  useEffect(() => {
    if (selectedApplication) {
      setPendingStatus(selectedApplication.status);
      setPendingRating(selectedApplication.rating);
      setPendingNotes(selectedApplication.notes);
    }
  }, [selectedApplication]);

  const fetchApplications = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);

      const url = jobIdParam
        ? `/api/employer/applications?jobId=${jobIdParam}`
        : "/api/employer/applications";
      const response = await fetch(url);
      const result = await response.json();

      if (result.success && result.data) {
        setApplications(result.data.applications);
        setStats(result.data.stats);
        if (showToast) {
          toast.success("Applications refreshed");
        }
      } else {
        throw new Error(result.error || "Failed to fetch applications");
      }
    } catch (error) {
      console.error("Fetch applications error:", error);
      if (showToast) {
        toast.error("Failed to refresh applications");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleUpdateApplication = async () => {
    if (!selectedApplication) return;

    setUpdating(true);

    try {
      const response = await fetch("/api/employer/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: selectedApplication.id,
          status: pendingStatus,
          rating: pendingRating,
          notes: pendingNotes,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Application updated");
        // Update local state
        setApplications((prev) =>
          prev.map((app) =>
            app.id === selectedApplication.id
              ? { ...app, status: pendingStatus, rating: pendingRating, notes: pendingNotes }
              : app
          )
        );
        setSelectedApplication((prev) =>
          prev ? { ...prev, status: pendingStatus, rating: pendingRating, notes: pendingNotes } : null
        );
        // Update stats if status changed
        if (pendingStatus !== selectedApplication.status) {
          setStats((prev) => ({
            ...prev,
            [selectedApplication.status]: prev[selectedApplication.status as keyof ApplicationStats] - 1,
            [pendingStatus]: prev[pendingStatus as keyof ApplicationStats] + 1,
          }));
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Update application error:", error);
      toast.error("Failed to update application");
    } finally {
      setUpdating(false);
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.job.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Unknown";

    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      {/* Applications List */}
      <div className={`flex-1 flex flex-col min-w-0 ${selectedApplication ? "hidden lg:flex" : ""}`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
            <p className="text-gray-600 mt-1">
              {filteredApplications.length} total applications
              {jobIdParam && " for this job"}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchApplications(true)}
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search candidates or jobs..."
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
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status ({stats.total})</option>
            <option value="new">New ({stats.new})</option>
            <option value="reviewing">Reviewing ({stats.reviewing})</option>
            <option value="shortlisted">Shortlisted ({stats.shortlisted})</option>
            <option value="interviewed">Interviewed ({stats.interviewed})</option>
            <option value="offered">Offered ({stats.offered})</option>
            <option value="hired">Hired ({stats.hired})</option>
            <option value="rejected">Rejected ({stats.rejected})</option>
          </select>
        </div>

        {/* Applications List */}
        <div className="flex-1 overflow-auto bg-white rounded-xl border divide-y">
          {filteredApplications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto mb-4 flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">No applications found</h3>
              <p className="text-gray-600 mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredApplications.map((application) => (
              <button
                key={application.id}
                onClick={() => setSelectedApplication(application)}
                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                  selectedApplication?.id === application.id ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <Image
                    src={application.candidate.avatar}
                    alt={application.candidate.name}
                    width={48}
                    height={48}
                    className="rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-gray-900">{application.candidate.name}</p>
                        <p className="text-sm text-gray-600">{application.job.title}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            statusConfig[application.status]?.bg || "bg-gray-100"
                          } ${statusConfig[application.status]?.text || "text-gray-700"}`}
                        >
                          {statusConfig[application.status]?.label || application.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(application.appliedAt)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        {application.candidate.experience}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {application.candidate.location}
                      </span>
                      {application.rating > 0 && (
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          {application.rating}/5
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Application Detail Panel */}
      {selectedApplication && (
        <div className="lg:w-[480px] bg-white rounded-xl border flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-start justify-between">
              <button
                onClick={() => setSelectedApplication(null)}
                className="lg:hidden text-sm text-gray-600 hover:text-gray-900 mb-4"
              >
                &larr; Back to list
              </button>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={`mailto:${selectedApplication.candidate.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </a>
                </Button>
                <Button size="sm">Schedule Interview</Button>
              </div>
            </div>

            <div className="flex items-start gap-4 mt-4">
              <Image
                src={selectedApplication.candidate.avatar}
                alt={selectedApplication.candidate.name}
                width={64}
                height={64}
                className="rounded-full object-cover"
              />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedApplication.candidate.name}
                </h2>
                <p className="text-gray-600">{selectedApplication.candidate.currentTitle}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      statusConfig[selectedApplication.status]?.bg || "bg-gray-100"
                    } ${statusConfig[selectedApplication.status]?.text || "text-gray-700"}`}
                  >
                    {statusConfig[selectedApplication.status]?.label || selectedApplication.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    Applied {formatDate(selectedApplication.appliedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6 space-y-6">
            {/* Contact Info */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Contact Information</h3>
              <div className="space-y-2">
                <a
                  href={`mailto:${selectedApplication.candidate.email}`}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
                >
                  <Mail className="w-4 h-4" />
                  {selectedApplication.candidate.email}
                </a>
                {selectedApplication.candidate.phone && (
                  <a
                    href={`tel:${selectedApplication.candidate.phone}`}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
                  >
                    <Phone className="w-4 h-4" />
                    {selectedApplication.candidate.phone}
                  </a>
                )}
                <p className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  {selectedApplication.candidate.location}
                </p>
              </div>
            </div>

            {/* Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Links</h3>
              <div className="flex flex-wrap gap-2">
                {selectedApplication.candidate.linkedin && (
                  <a
                    href={selectedApplication.candidate.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-700 hover:bg-gray-200"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    LinkedIn
                  </a>
                )}
                {selectedApplication.candidate.portfolio && (
                  <a
                    href={selectedApplication.candidate.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-700 hover:bg-gray-200"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Portfolio
                  </a>
                )}
                {selectedApplication.resumeUrl && (
                  <a
                    href={selectedApplication.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-700 hover:bg-gray-200"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Resume
                  </a>
                )}
              </div>
            </div>

            {/* Applied For */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Applied For</h3>
              <Link
                href={`/employer/jobs/${selectedApplication.job.id}`}
                className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <p className="font-medium text-gray-900">{selectedApplication.job.title}</p>
                <p className="text-sm text-gray-600">{selectedApplication.job.department}</p>
              </Link>
            </div>

            {/* Cover Letter */}
            {selectedApplication.coverLetter && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Cover Letter</h3>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {selectedApplication.coverLetter}
                </p>
              </div>
            )}

            {/* Rating */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Rating</h3>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setPendingRating(star === pendingRating ? 0 : star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= pendingRating
                          ? "text-amber-500 fill-amber-500"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Internal Notes</h3>
              <textarea
                value={pendingNotes}
                onChange={(e) => setPendingNotes(e.target.value)}
                placeholder="Add notes about this candidate..."
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex gap-2">
              <select
                value={pendingStatus}
                onChange={(e) => setPendingStatus(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="new">New</option>
                <option value="reviewing">Reviewing</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="interviewed">Interviewed</option>
                <option value="offered">Offered</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
              <Button
                onClick={handleUpdateApplication}
                disabled={updating}
              >
                {updating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Update"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EmployerApplicationsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <ApplicationsContent />
    </Suspense>
  );
}
