"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  Download,
  Mail,
  MoreHorizontal,
  UserPlus,
  Shield,
  ChevronLeft,
  ChevronRight,
  User,
  Building2,
  Ban,
  CheckCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface UserData {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  company?: string;
  status: string;
  joinedAt: string;
  lastActive: string;
  applications?: number;
  jobsPosted?: number;
}

interface Stats {
  total: number;
  candidates: number;
  employers: number;
  active: number;
}

const roleConfig: Record<string, { label: string; bg: string; text: string; icon: React.ElementType }> = {
  candidate: { label: "Candidate", bg: "bg-blue-100", text: "text-blue-700", icon: User },
  employer: { label: "Employer", bg: "bg-purple-100", text: "text-purple-700", icon: Building2 },
  admin: { label: "Admin", bg: "bg-amber-100", text: "text-amber-700", icon: Shield },
};

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  active: { label: "Active", bg: "bg-emerald-100", text: "text-emerald-700" },
  pending: { label: "Pending", bg: "bg-amber-100", text: "text-amber-700" },
  suspended: { label: "Suspended", bg: "bg-red-100", text: "text-red-700" },
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, candidates: 0, employers: 0, active: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);

      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (roleFilter !== "all") params.append("role", roleFilter);
      if (statusFilter !== "all") params.append("status", statusFilter);

      const response = await fetch(`/api/admin/users?${params.toString()}`);
      const result = await response.json();

      if (result.success && result.data) {
        setUsers(result.data.users);
        setStats(result.data.stats);
        if (showToast) {
          toast.success("Users refreshed");
        }
      } else {
        throw new Error(result.error || "Failed to fetch users");
      }
    } catch (error) {
      console.error("Fetch users error:", error);
      if (showToast) {
        toast.error("Failed to refresh users");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = () => {
    setLoading(true);
    fetchUsers(true);
  };

  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) return;

    setActionLoading(true);

    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds: selectedUsers, action }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
        setSelectedUsers([]);
        fetchUsers();
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
    });
  };

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Online";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return formatDate(dateString);
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((u) => u.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
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
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-1">Manage all platform users</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchUsers(true)}
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
          <Button className="gap-2">
            <UserPlus className="w-4 h-4" />
            Invite User
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-600">Total Users</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-2xl font-bold text-blue-600">{stats.candidates}</p>
          <p className="text-sm text-gray-600">Candidates</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-2xl font-bold text-purple-600">{stats.employers}</p>
          <p className="text-sm text-gray-600">Employers</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
          <p className="text-sm text-gray-600">Active</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setTimeout(() => handleSearch(), 0);
          }}
          className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Roles</option>
          <option value="candidate">Candidates</option>
          <option value="employer">Employers</option>
          <option value="admin">Admins</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setTimeout(() => handleSearch(), 0);
          }}
          className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
          <span className="text-sm text-blue-700 font-medium">
            {selectedUsers.length} selected
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={actionLoading}
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Email
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction("activate")}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              Activate
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 hover:text-red-700"
              onClick={() => handleBulkAction("suspend")}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Ban className="w-4 h-4 mr-2" />
              )}
              Suspend
            </Button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === users.length && users.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-900 font-medium">No users found</p>
                    <p className="text-gray-600 text-sm">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const role = roleConfig[user.role] || roleConfig.candidate;
                  const RoleIcon = role.icon;
                  const status = statusConfig[user.status] || statusConfig.active;
                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => toggleSelect(user.id)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <Image
                            src={user.avatar}
                            alt={user.name}
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${role.bg} ${role.text}`}
                        >
                          <RoleIcon className="w-3.5 h-3.5" />
                          {role.label}
                        </span>
                        {user.company && (
                          <p className="text-xs text-gray-500 mt-1">{user.company}</p>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${status.bg} ${status.text}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-600">{formatDate(user.joinedAt)}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-600">{formatLastActive(user.lastActive)}</p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
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
            <span className="font-medium">{users.length}</span> of{" "}
            <span className="font-medium">{stats.total}</span> users
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
