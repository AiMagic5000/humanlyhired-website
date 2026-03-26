"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
  Check,
  CheckCheck,
  Trash2,
  Filter,
  Search,
  RefreshCw,
  Settings,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SystemNotification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  category: "system" | "security" | "billing" | "user" | "job" | "application";
  title: string;
  description: string;
  time: string;
  read: boolean;
  actionRequired: boolean;
}

interface Stats {
  total: number;
  unread: number;
  actionRequired: number;
  errors: number;
}

const getTypeIcon = (type: SystemNotification["type"]) => {
  switch (type) {
    case "error":
      return XCircle;
    case "warning":
      return AlertTriangle;
    case "success":
      return CheckCircle;
    case "info":
    default:
      return Info;
  }
};

const getTypeColor = (type: SystemNotification["type"]) => {
  switch (type) {
    case "error":
      return "bg-red-100 text-red-600";
    case "warning":
      return "bg-amber-100 text-amber-600";
    case "success":
      return "bg-emerald-100 text-emerald-600";
    case "info":
    default:
      return "bg-blue-100 text-blue-600";
  }
};

const getCategoryLabel = (category: SystemNotification["category"]) => {
  switch (category) {
    case "system":
      return "System";
    case "security":
      return "Security";
    case "billing":
      return "Billing";
    case "user":
      return "Users";
    case "job":
      return "Jobs";
    case "application":
      return "Applications";
    default:
      return category;
  }
};

type FilterType = "all" | "unread" | "actionRequired" | "error" | "warning" | "success" | "info";

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, unread: 0, actionRequired: 0, errors: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);

      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (filter !== "all") params.append("filter", filter);

      const response = await fetch(`/api/admin/notifications?${params.toString()}`);
      const result = await response.json();

      if (result.success && result.data) {
        setNotifications(result.data.notifications);
        setStats(result.data.stats);
        if (showToast) {
          toast.success("Notifications refreshed");
        }
      } else {
        throw new Error(result.error || "Failed to fetch notifications");
      }
    } catch (error) {
      console.error("Fetch notifications error:", error);
      if (showToast) {
        toast.error("Failed to refresh notifications");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = () => {
    fetchNotifications(true);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return diffInMinutes <= 1 ? "Just now" : `${diffInMinutes} min ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    }
  };

  const getDateLabel = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  // Group notifications by date
  const groupedNotifications = notifications.reduce((groups, notification) => {
    const date = getDateLabel(notification.time);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
    return groups;
  }, {} as Record<string, SystemNotification[]>);

  const markAsRead = async (id: string) => {
    // Optimistic update
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setStats(prev => ({ ...prev, unread: Math.max(0, prev.unread - 1) }));

    try {
      await fetch("/api/admin/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds: [id], read: true }),
      });
    } catch (error) {
      console.error("Mark as read error:", error);
    }
  };

  const markAllAsRead = async () => {
    // Optimistic update
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    setStats(prev => ({ ...prev, unread: 0 }));

    try {
      await fetch("/api/admin/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Mark all as read error:", error);
      toast.error("Failed to mark all as read");
    }
  };

  const deleteNotification = async (id: string) => {
    const notification = notifications.find(n => n.id === id);

    // Optimistic update
    setNotifications(notifications.filter((n) => n.id !== id));
    setStats(prev => ({
      ...prev,
      total: prev.total - 1,
      unread: notification && !notification.read ? prev.unread - 1 : prev.unread,
      actionRequired: notification?.actionRequired ? prev.actionRequired - 1 : prev.actionRequired,
      errors: notification?.type === "error" ? prev.errors - 1 : prev.errors,
    }));

    try {
      await fetch("/api/admin/notifications", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds: [id] }),
      });
    } catch (error) {
      console.error("Delete notification error:", error);
    }
  };

  const clearResolved = async () => {
    // Optimistic update - filter out resolved notifications
    setNotifications(notifications.filter((n) => n.actionRequired || !n.read));

    try {
      await fetch("/api/admin/notifications", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clearResolved: true }),
      });
      toast.success("Resolved notifications cleared");
      fetchNotifications(); // Refresh stats
    } catch (error) {
      console.error("Clear resolved error:", error);
      toast.error("Failed to clear resolved");
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
          <h1 className="text-2xl font-bold text-gray-900">System Notifications</h1>
          <p className="text-gray-600 mt-1">Monitor platform alerts and system events</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => fetchNotifications(true)}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500">Total</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Info className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.unread}</p>
              <p className="text-sm text-gray-500">Unread</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.actionRequired}</p>
              <p className="text-sm text-gray-500">Action Required</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.errors}</p>
              <p className="text-sm text-gray-500">Errors</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search notifications..."
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value as FilterType);
                setTimeout(() => handleSearch(), 0);
              }}
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Notifications</option>
              <option value="unread">Unread Only</option>
              <option value="actionRequired">Action Required</option>
              <option value="error">Errors</option>
              <option value="warning">Warnings</option>
              <option value="success">Success</option>
              <option value="info">Info</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            {stats.unread > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead} className="gap-2">
                <CheckCheck className="w-4 h-4" />
                Mark all read
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={clearResolved} className="gap-2 text-gray-600">
              <Trash2 className="w-4 h-4" />
              Clear resolved
            </Button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      {Object.keys(groupedNotifications).length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No notifications</h3>
          <p className="text-gray-600 mt-2">
            {filter !== "all" || searchQuery
              ? "No notifications match your filter criteria"
              : "System is running smoothly. No alerts at this time."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedNotifications).map(([date, dateNotifications]) => (
            <div key={date}>
              <h3 className="text-sm font-semibold text-gray-500 mb-3">{date}</h3>
              <div className="bg-white rounded-xl border divide-y">
                {dateNotifications.map((notification) => {
                  const Icon = getTypeIcon(notification.type);
                  const colorClass = getTypeColor(notification.type);

                  return (
                    <div
                      key={notification.id}
                      className={cn(
                        "flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors",
                        !notification.read && "bg-blue-50/30"
                      )}
                    >
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", colorClass)}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={cn(
                            "text-sm",
                            notification.read ? "text-gray-700" : "text-gray-900 font-semibold"
                          )}>
                            {notification.title}
                          </p>
                          <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                            {getCategoryLabel(notification.category)}
                          </span>
                          {notification.actionRequired && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-600 rounded-full">
                              Action Required
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">{formatTime(notification.time)}</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-2 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-600"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-2 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
