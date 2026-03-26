"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
  Building2,
  Calendar,
  ExternalLink,
  Eye,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Application {
  id: string;
  jobId: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  notes?: string;
  job: {
    id?: string;
    title: string;
    company: string;
    location: string;
    type?: string;
    logo?: string;
  };
}

const statusConfig: Record<string, { label: string; bg: string; text: string; icon: typeof Clock; note: string }> = {
  pending: { label: "Pending", bg: "bg-gray-100", text: "text-gray-700", icon: Clock, note: "Your application has been submitted and is waiting to be reviewed." },
  new: { label: "Submitted", bg: "bg-blue-100", text: "text-blue-700", icon: Clock, note: "Application submitted successfully." },
  reviewing: { label: "Under Review", bg: "bg-amber-100", text: "text-amber-700", icon: Eye, note: "Your application is being reviewed by the hiring team." },
  interview: { label: "Interview", bg: "bg-purple-100", text: "text-purple-700", icon: Calendar, note: "You have been selected for an interview. Check your email for details." },
  interviewing: { label: "Interviewing", bg: "bg-purple-100", text: "text-purple-700", icon: Calendar, note: "Interview process is in progress." },
  offered: { label: "Offer Received", bg: "bg-emerald-100", text: "text-emerald-700", icon: CheckCircle, note: "Congratulations! You have received an offer." },
  accepted: { label: "Accepted", bg: "bg-emerald-100", text: "text-emerald-700", icon: CheckCircle, note: "You have accepted the offer. Welcome aboard!" },
  rejected: { label: "Not Selected", bg: "bg-red-100", text: "text-red-700", icon: XCircle, note: "We have decided to move forward with other candidates." },
  withdrawn: { label: "Withdrawn", bg: "bg-gray-100", text: "text-gray-700", icon: XCircle, note: "You have withdrawn your application." },
};

// Default company logos based on company name hash
const getCompanyLogo = (company: string): string => {
  const logos = [
    "https://images.unsplash.com/photo-1549924231-f129b911e442?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=100&h=100&fit=crop",
  ];
  // Simple hash based on company name
  const hash = company.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return logos[hash % logos.length];
};

export default function CandidateApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);

      const response = await fetch("/api/applications");
      const result = await response.json();

      if (result.success && result.applications) {
        setApplications(result.applications);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Unknown date";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusConfig = (status: string) => {
    return statusConfig[status] || statusConfig.pending;
  };

  const statusCounts = Object.keys(statusConfig).reduce((acc, key) => {
    acc[key] = applications.filter(a => a.status === key).length;
    return acc;
  }, {} as Record<string, number>);

  // Get display stats (only show statuses with counts or main statuses)
  const displayStatuses = ["pending", "reviewing", "interview", "offered", "rejected"];

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
          <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-600 mt-1">Track and manage your job applications</p>
        </div>
        <div className="flex items-center gap-2">
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
          <Button asChild>
            <Link href="/jobs">Browse More Jobs</Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
          <p className="text-sm text-gray-600">Total</p>
        </div>
        {displayStatuses.map((key) => {
          const config = statusConfig[key];
          const count = statusCounts[key] || 0;
          return (
            <div key={key} className="bg-white rounded-xl border p-4 text-center">
              <p className={`text-2xl font-bold ${config.text}`}>{count}</p>
              <p className="text-sm text-gray-600">{config.label}</p>
            </div>
          );
        })}
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {applications.length === 0 ? (
          <div className="bg-white rounded-xl border p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">No applications yet</h3>
            <p className="text-gray-600 mt-2 mb-6">Start applying to jobs to track your progress here</p>
            <Button asChild>
              <Link href="/jobs">Browse Jobs</Link>
            </Button>
          </div>
        ) : (
          applications.map((application) => {
            const config = getStatusConfig(application.status);
            const StatusIcon = config.icon;
            const logo = application.job.logo || getCompanyLogo(application.job.company);
            const note = application.notes || config.note;

            return (
              <div key={application.id} className="bg-white rounded-xl border hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={logo}
                        alt={application.job.company}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{application.job.title}</h3>
                          <p className="text-gray-600">{application.job.company}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${config.bg} ${config.text}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {config.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          {application.job.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Building2 className="w-4 h-4" />
                          {application.job.type || "Full-time"}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          Applied {formatDate(application.createdAt)}
                        </span>
                      </div>
                      {note && (
                        <div className={`mt-4 p-3 rounded-lg ${
                          application.status === "offered" || application.status === "accepted" ? "bg-emerald-50" :
                          application.status === "interview" || application.status === "interviewing" ? "bg-purple-50" :
                          application.status === "rejected" ? "bg-red-50" :
                          "bg-gray-50"
                        }`}>
                          <p className="text-sm text-gray-700 flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            {note}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="px-6 py-3 border-t bg-gray-50 flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    Last updated: {formatDate(application.updatedAt || application.createdAt)}
                  </p>
                  <Button variant="outline" size="sm" className="gap-1.5" asChild>
                    <Link href={`/jobs/${application.jobId || application.job.id || application.id}`}>
                      View Job
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
