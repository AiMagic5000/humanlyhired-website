"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  MoreHorizontal,
  Building2,
  Users,
  Briefcase,
  MapPin,
  Globe,
  CheckCircle,
  Clock,
  XCircle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  location: string;
  website: string;
  employees: string;
  status: string;
  activeJobs: number;
  totalApplications: number;
  joinedAt: string;
}

interface Stats {
  total: number;
  verified: number;
  pending: number;
  suspended: number;
  activeJobs: number;
}

const statusConfig: Record<string, { label: string; bg: string; text: string; icon: React.ElementType }> = {
  verified: { label: "Verified", bg: "bg-emerald-100", text: "text-emerald-700", icon: CheckCircle },
  pending: { label: "Pending", bg: "bg-amber-100", text: "text-amber-700", icon: Clock },
  suspended: { label: "Suspended", bg: "bg-red-100", text: "text-red-700", icon: XCircle },
};

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    verified: 0,
    pending: 0,
    suspended: 0,
    activeJobs: 0,
  });
  const [industries, setIndustries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);

      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (industryFilter !== "all") params.append("industry", industryFilter);

      const response = await fetch(`/api/admin/companies?${params.toString()}`);
      const result = await response.json();

      if (result.success && result.data) {
        setCompanies(result.data.companies);
        setStats(result.data.stats);
        setIndustries(result.data.industries || []);
        if (showToast) {
          toast.success("Companies refreshed");
        }
      } else {
        throw new Error(result.error || "Failed to fetch companies");
      }
    } catch (error) {
      console.error("Fetch companies error:", error);
      if (showToast) {
        toast.error("Failed to refresh companies");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = () => {
    setLoading(true);
    fetchCompanies(true);
  };

  const handleStatusChange = async (companyId: string, newStatus: string) => {
    setActionLoading(companyId);

    try {
      const response = await fetch("/api/admin/companies", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyIds: [companyId], status: newStatus }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success(`Company ${newStatus === "verified" ? "verified" : newStatus === "suspended" ? "suspended" : "updated"} successfully`);
        // Update local state
        setCompanies(companies.map(c =>
          c.id === companyId ? { ...c, status: newStatus } : c
        ));
        // Update stats
        setStats(prev => {
          const oldStatus = companies.find(c => c.id === companyId)?.status || "";
          return {
            ...prev,
            [oldStatus]: Math.max(0, (prev[oldStatus as keyof Stats] as number || 0) - 1),
            [newStatus]: ((prev[newStatus as keyof Stats] as number) || 0) + 1,
          };
        });
      } else {
        toast.error(result.error || "Action failed");
      }
    } catch (error) {
      console.error("Status change error:", error);
      toast.error("Failed to update company status");
    } finally {
      setActionLoading(null);
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
          <p className="text-gray-600 mt-1">Manage employer accounts and company profiles</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchCompanies(true)}
          disabled={refreshing}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">Total Companies</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">{stats.verified}</p>
              <p className="text-sm text-gray-600">Verified</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
              <p className="text-sm text-gray-600">Pending Review</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{stats.activeJobs}</p>
              <p className="text-sm text-gray-600">Active Jobs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search by company name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setTimeout(() => handleSearch(), 0);
          }}
          className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
        </select>
        <select
          value={industryFilter}
          onChange={(e) => {
            setIndustryFilter(e.target.value);
            setTimeout(() => handleSearch(), 0);
          }}
          className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Industries</option>
          {industries.map((industry) => (
            <option key={industry} value={industry}>
              {industry}
            </option>
          ))}
        </select>
      </div>

      {/* Companies Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {companies.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white rounded-xl border">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-900 font-medium">No companies found</p>
            <p className="text-gray-600 text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          companies.map((company) => {
            const statusInfo = statusConfig[company.status] || statusConfig.pending;
            const StatusIcon = statusInfo.icon;
            return (
              <div
                key={company.id}
                className="bg-white rounded-xl border overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100">
                        <Image
                          src={company.logo}
                          alt={company.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{company.name}</h3>
                        <p className="text-sm text-gray-600">{company.industry}</p>
                      </div>
                    </div>
                    <button className="p-1 rounded hover:bg-gray-100">
                      <MoreHorizontal className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {company.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      {company.employees} employees
                    </div>
                    {company.website && (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                      >
                        <Globe className="w-4 h-4" />
                        {company.website.replace("https://", "")}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-600">
                        <strong className="text-gray-900">{company.activeJobs}</strong> jobs
                      </span>
                      <span className="text-gray-600">
                        <strong className="text-gray-900">{company.totalApplications}</strong> apps
                      </span>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${statusInfo.bg} ${statusInfo.text}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {statusInfo.label}
                    </span>
                  </div>
                </div>

                {company.status === "pending" && (
                  <div className="px-6 py-3 bg-amber-50 border-t border-amber-100 flex items-center justify-between">
                    <span className="text-sm text-amber-700">Awaiting verification</span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() => handleStatusChange(company.id, "suspended")}
                        disabled={actionLoading === company.id}
                      >
                        {actionLoading === company.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          "Reject"
                        )}
                      </Button>
                      <Button
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => handleStatusChange(company.id, "verified")}
                        disabled={actionLoading === company.id}
                      >
                        {actionLoading === company.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          "Verify"
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing <span className="font-medium">1</span> to{" "}
          <span className="font-medium">{companies.length}</span> of{" "}
          <span className="font-medium">{stats.total}</span> companies
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
  );
}
