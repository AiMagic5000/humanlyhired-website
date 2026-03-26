"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Search,
  Filter,
  Download,
  Mail,
  Eye,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Application {
  id: string;
  candidate: {
    name: string;
    email: string;
    avatar: string;
    location: string;
  };
  job: {
    id: string;
    title: string;
    company: string;
  };
  appliedAt: string;
  status: string;
}

interface Stats {
  total: number;
  new: number;
  reviewing: number;
  shortlisted: number;
  interviewed: number;
  offered: number;
  hired: number;
  rejected: number;
}

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  new: { label: "New", bg: "bg-blue-100", text: "text-blue-700" },
  reviewing: { label: "Reviewing", bg: "bg-amber-100", text: "text-amber-700" },
  shortlisted: { label: "Shortlisted", bg: "bg-purple-100", text: "text-purple-700" },
  interviewed: { label: "Interviewed", bg: "bg-emerald-100", text: "text-emerald-700" },
  offered: { label: "Offered", bg: "bg-green-100", text: "text-green-700" },
  hired: { label: "Hired", bg: "bg-green-100", text: "text-green-700" },
  rejected: { label: "Rejected", bg: "bg-red-100", text: "text-red-700" },
};

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0, new: 0, reviewing: 0, shortlisted: 0,
    interviewed: 0, offered: 0, hired: 0, rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);

      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (statusFilter !== "all") params.append("status", statusFilter);

      const response = await fetch(`/api/admin/applications?${params.toString()}`);
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

  const handleSearch = () => {
    setLoading(true);
    fetchApplications(true);
  };

  const handleBulkAction = async (action: string) => {
    if (selectedApplications.length === 0) return;

    setActionLoading(true);

    try {
      const response = await fetch("/api/admin/applications", {
        method: action === "delete" ? "DELETE" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationIds: selectedApplications,
          status: action !== "delete" ? action : undefined,
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
        setSelectedApplications([]);
        fetchApplications();
      } else {
        toast.error(result.error || "Action failed");
      }
    } catch (error) {
      console.error("Bulk action error:", error);
      toast.error("Failed to perform action");
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleSelectAll = () => {
    if (selectedApplications.length === applications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(applications.map((a) => a.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedApplications((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
          <p className="text-gray-600 mt-1">
            Manage and review all job applications
          </p>
        </div>
        <div className="flex gap-2">
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
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        <button
          onClick={() => {
            setStatusFilter("all");
            setTimeout(() => handleSearch(), 0);
          }}
          className={`p-3 rounded-lg border text-center transition-all ${
            statusFilter === "all" ? "border-gray-900 bg-gray-50" : "bg-white hover:border-gray-300"
          }`}
        >
          <p className="text-lg font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-600">Total</p>
        </button>
        {Object.entries(statusConfig).map(([key, config]) => {
          const count = stats[key as keyof Stats] || 0;
          return (
            <button
              key={key}
              onClick={() => {
                setStatusFilter(key);
                setTimeout(() => handleSearch(), 0);
              }}
              className={`p-3 rounded-lg border text-center transition-all ${
                statusFilter === key
                  ? `${config.bg} border-current`
                  : "bg-white hover:border-gray-300"
              }`}
            >
              <p className={`text-lg font-bold ${statusFilter === key ? config.text : "text-gray-900"}`}>
                {count}
              </p>
              <p className={`text-xs ${statusFilter === key ? config.text : "text-gray-600"}`}>
                {config.label}
              </p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search by name, email, job, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2" onClick={handleSearch}>
          <Filter className="w-4 h-4" />
          Search
        </Button>
      </div>

      {/* Bulk Actions */}
      {selectedApplications.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
          <span className="text-sm text-blue-700 font-medium">
            {selectedApplications.length} selected
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction("reviewing")}
              disabled={actionLoading}
            >
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Mark Reviewing
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction("shortlisted")}
              disabled={actionLoading}
            >
              Shortlist
            </Button>
            <Button
              size="sm"
              variant="outline"
            >
              Send Email
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 hover:text-red-700"
              onClick={() => handleBulkAction("delete")}
              disabled={actionLoading}
            >
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Applications Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedApplications.length === applications.length && applications.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Applied For
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-900 font-medium">No applications found</p>
                    <p className="text-gray-600 text-sm">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                applications.map((application) => {
                  const status = statusConfig[application.status] || statusConfig.new;
                  return (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedApplications.includes(application.id)}
                          onChange={() => toggleSelect(application.id)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <Image
                            src={application.candidate.avatar}
                            alt={application.candidate.name}
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{application.candidate.name}</p>
                            <p className="text-sm text-gray-600">{application.candidate.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium text-gray-900">{application.job.title}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-gray-600">{application.job.company}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-600">{formatDate(application.appliedAt)}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${status.bg} ${status.text}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Mail className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">1</span> to{" "}
            <span className="font-medium">{applications.length}</span> of{" "}
            <span className="font-medium">{stats.total}</span> results
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" disabled>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
