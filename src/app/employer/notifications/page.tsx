"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  FileText,
  Calendar,
  MessageSquare,
  Star,
  Check,
  CheckCheck,
  Trash2,
  Filter,
  Search,
  DollarSign,
  TrendingUp,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: "application" | "interview" | "job" | "message" | "billing" | "analytics";
  title: string;
  description: string;
  time: string;
  date: string;
  read: boolean;
  link?: string;
}

interface NotificationStats {
  total: number;
  unread: number;
  application: number;
  interview: number;
  message: number;
  job: number;
  billing: number;
  analytics: number;
}

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "application":
      return FileText;
    case "interview":
      return Calendar;
    case "job":
      return Star;
    case "message":
      return MessageSquare;
    case "billing":
      return DollarSign;
    case "analytics":
      return TrendingUp;
    default:
      return Bell;
  }
};

const getNotificationColor = (type: Notification["type"]) => {
  switch (type) {
    case "application":
      return "bg-blue-100 text-blue-600";
    case "interview":
      return "bg-purple-100 text-purple-600";
    case "job":
      return "bg-emerald-100 text-emerald-600";
    case "message":
      return "bg-amber-100 text-amber-600";
    case "billing":
      return "bg-green-100 text-green-600";
    case "analytics":
      return "bg-indigo-100 text-indigo-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

type FilterType = "all" | "unread" | "application" | "interview" | "job" | "message" | "billing" | "analytics";

export default function EmployerNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
    application: 0,
    interview: 0,
    message: 0,
    job: 0,
    billing: 0,
    analytics: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);

      const response = await fetch("/api/employer/notifications");
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

  const filteredNotifications = notifications.filter((n) => {
    const matchesFilter = filter === "all" || filter === "unread" ? true : n.type === filter;
    const matchesUnread = filter === "unread" ? !n.read : true;
    const matchesSearch = searchQuery
      ? n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesFilter && matchesUnread && matchesSearch;
  });

  const groupedNotifications = filteredNotifications.reduce((groups, notification) => {
    const date = notification.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
    return groups;
  }, {} as Record<string, Notification[]>);

  const markAsRead = async (id: string) => {
    setActionLoading(id);

    // Optimistic update
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setStats((prev) => ({
      ...prev,
      unread: Math.max(0, prev.unread - 1),
    }));

    try {
      const response = await fetch("/api/employer/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id, action: "markRead" }),
      });

      const result = await response.json();
      if (!result.success) {
        // Revert on error
        setNotifications(
          notifications.map((n) => (n.id === id ? { ...n, read: false } : n))
        );
        setStats((prev) => ({
          ...prev,
          unread: prev.unread + 1,
        }));
        toast.error("Failed to mark as read");
      }
    } catch (error) {
      console.error("Mark as read error:", error);
      // Revert on error
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, read: false } : n))
      );
      setStats((prev) => ({
        ...prev,
        unread: prev.unread + 1,
      }));
      toast.error("Failed to mark as read");
    } finally {
      setActionLoading(null);
    }
  };

  const markAllAsRead = async () => {
    setActionLoading("all");

    // Store previous state for revert
    const previousNotifications = [...notifications];
    const previousStats = { ...stats };

    // Optimistic update
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    setStats((prev) => ({ ...prev, unread: 0 }));

    try {
      const response = await fetch("/api/employer/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "markAllRead" }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("All notifications marked as read");
      } else {
        // Revert on error
        setNotifications(previousNotifications);
        setStats(previousStats);
        toast.error("Failed to mark all as read");
      }
    } catch (error) {
      console.error("Mark all as read error:", error);
      setNotifications(previousNotifications);
      setStats(previousStats);
      toast.error("Failed to mark all as read");
    } finally {
      setActionLoading(null);
    }
  };

  const deleteNotification = async (id: string) => {
    setActionLoading(id);

    // Store for potential revert
    const notification = notifications.find((n) => n.id === id);
    const previousNotifications = [...notifications];
    const previousStats = { ...stats };

    // Optimistic update
    setNotifications(notifications.filter((n) => n.id !== id));
    if (notification) {
      setStats((prev) => ({
        ...prev,
        total: prev.total - 1,
        unread: notification.read ? prev.unread : prev.unread - 1,
        [notification.type]: (prev[notification.type as keyof NotificationStats] as number) - 1,
      }));
    }

    try {
      const response = await fetch("/api/employer/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id, action: "delete" }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Notification deleted");
      } else {
        // Revert on error
        setNotifications(previousNotifications);
        setStats(previousStats);
        toast.error("Failed to delete notification");
      }
    } catch (error) {
      console.error("Delete notification error:", error);
      setNotifications(previousNotifications);
      setStats(previousStats);
      toast.error("Failed to delete notification");
    } finally {
      setActionLoading(null);
    }
  };

  const deleteAllRead = async () => {
    setActionLoading("deleteRead");

    // Store for potential revert
    const previousNotifications = [...notifications];
    const previousStats = { ...stats };
    const readNotifications = notifications.filter((n) => n.read);

    // Optimistic update
    setNotifications(notifications.filter((n) => !n.read));

    // Recalculate stats
    const remainingNotifications = notifications.filter((n) => !n.read);
    setStats({
      total: remainingNotifications.length,
      unread: remainingNotifications.length,
      application: remainingNotifications.filter((n) => n.type === "application").length,
      interview: remainingNotifications.filter((n) => n.type === "interview").length,
      message: remainingNotifications.filter((n) => n.type === "message").length,
      job: remainingNotifications.filter((n) => n.type === "job").length,
      billing: remainingNotifications.filter((n) => n.type === "billing").length,
      analytics: remainingNotifications.filter((n) => n.type === "analytics").length,
    });

    try {
      const response = await fetch("/api/employer/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deleteRead" }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success(`Deleted ${readNotifications.length} read notification${readNotifications.length !== 1 ? "s" : ""}`);
      } else {
        // Revert on error
        setNotifications(previousNotifications);
        setStats(previousStats);
        toast.error("Failed to delete read notifications");
      }
    } catch (error) {
      console.error("Delete read notifications error:", error);
      setNotifications(previousNotifications);
      setStats(previousStats);
      toast.error("Failed to delete read notifications");
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
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">
            {stats.unread > 0
              ? `You have ${stats.unread} unread notification${stats.unread > 1 ? "s" : ""}`
              : "All caught up!"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchNotifications(true)}
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          {stats.unread > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              disabled={actionLoading === "all"}
              className="gap-2"
            >
              {actionLoading === "all" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCheck className="w-4 h-4" />
              )}
              Mark all read
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={deleteAllRead}
            disabled={actionLoading === "deleteRead" || notifications.filter((n) => n.read).length === 0}
            className="gap-2 text-gray-600"
          >
            {actionLoading === "deleteRead" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            Clear read
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.application}</p>
              <p className="text-sm text-gray-500">Applications</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.interview}</p>
              <p className="text-sm text-gray-500">Interviews</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.message}</p>
              <p className="text-sm text-gray-500">Messages</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <Bell className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.unread}</p>
              <p className="text-sm text-gray-500">Unread</p>
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
              placeholder="Search notifications..."
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Notifications</option>
              <option value="unread">Unread Only</option>
              <option value="application">Applications</option>
              <option value="interview">Interviews</option>
              <option value="job">Job Alerts</option>
              <option value="message">Messages</option>
              <option value="billing">Billing</option>
              <option value="analytics">Analytics</option>
            </select>
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
              : "You're all caught up! Check back later for updates."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedNotifications).map(([date, dateNotifications]) => (
            <div key={date}>
              <h3 className="text-sm font-semibold text-gray-500 mb-3">{date}</h3>
              <div className="bg-white rounded-xl border divide-y">
                {dateNotifications.map((notification) => {
                  const Icon = getNotificationIcon(notification.type);
                  const colorClass = getNotificationColor(notification.type);
                  const isLoading = actionLoading === notification.id;

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
                        {notification.link ? (
                          <Link
                            href={notification.link}
                            onClick={() => !notification.read && markAsRead(notification.id)}
                            className="block"
                          >
                            <p className={cn(
                              "text-sm",
                              notification.read ? "text-gray-700" : "text-gray-900 font-semibold"
                            )}>
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.description}
                            </p>
                          </Link>
                        ) : (
                          <>
                            <p className={cn(
                              "text-sm",
                              notification.read ? "text-gray-700" : "text-gray-900 font-semibold"
                            )}>
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.description}
                            </p>
                          </>
                        )}
                        <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            disabled={isLoading}
                            className="p-2 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                            title="Mark as read"
                          >
                            {isLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          disabled={isLoading}
                          className="p-2 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-red-600 disabled:opacity-50"
                          title="Delete"
                        >
                          {isLoading && notification.read ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
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

      {/* Notification Settings Link */}
      <div className="bg-gray-50 rounded-xl border p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Notification Settings</p>
            <p className="text-sm text-gray-600">Manage your email and push notification preferences</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/employer/settings">Settings</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
