"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  FileText,
  Calendar,
  Briefcase,
  MessageSquare,
  Star,
  Check,
  CheckCheck,
  Trash2,
  Filter,
  Search,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: "application" | "interview" | "job" | "message" | "system" | "info" | "success" | "warning" | "error";
  title: string;
  description: string;
  time: string;
  date: string;
  read: boolean;
  link?: string;
}

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "application":
    case "success":
      return FileText;
    case "interview":
      return Calendar;
    case "job":
      return Briefcase;
    case "message":
      return MessageSquare;
    case "system":
    case "info":
    case "warning":
      return Star;
    default:
      return Bell;
  }
};

const getNotificationColor = (type: Notification["type"]) => {
  switch (type) {
    case "application":
    case "success":
      return "bg-blue-100 text-blue-600";
    case "interview":
      return "bg-purple-100 text-purple-600";
    case "job":
      return "bg-emerald-100 text-emerald-600";
    case "message":
      return "bg-amber-100 text-amber-600";
    case "warning":
      return "bg-orange-100 text-orange-600";
    case "error":
      return "bg-red-100 text-red-600";
    case "system":
    case "info":
    default:
      return "bg-gray-100 text-gray-600";
  }
};

function formatNotificationDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Unknown";

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const notificationDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (notificationDate.getTime() === today.getTime()) {
    return "Today";
  } else if (notificationDate.getTime() === yesterday.getTime()) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }
}

function formatNotificationTime(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

type FilterType = "all" | "unread" | "application" | "interview" | "job" | "message" | "system";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
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

      const response = await fetch("/api/notifications");
      const result = await response.json();

      if (result.success && result.data) {
        // Transform API response to match our interface
        const transformedNotifications: Notification[] = result.data.map((n: {
          id: string;
          type: string;
          title: string;
          message?: string;
          description?: string;
          link?: string;
          read: boolean;
          createdAt: string;
        }) => ({
          id: n.id,
          type: n.type,
          title: n.title,
          description: n.message || n.description || "",
          time: formatNotificationTime(n.createdAt),
          date: formatNotificationDate(n.createdAt),
          read: n.read,
          link: n.link,
        }));

        setNotifications(transformedNotifications);
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

  const unreadCount = notifications.filter((n) => !n.read).length;

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

    try {
      const response = await fetch("/api/notifications", {
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
        toast.error("Failed to mark as read");
      }
    } catch (error) {
      console.error("Mark as read error:", error);
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, read: false } : n))
      );
      toast.error("Failed to mark as read");
    } finally {
      setActionLoading(null);
    }
  };

  const markAllAsRead = async () => {
    setActionLoading("all");

    // Store previous state
    const previousNotifications = [...notifications];

    // Optimistic update
    setNotifications(notifications.map((n) => ({ ...n, read: true })));

    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "markAllRead" }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("All notifications marked as read");
      } else {
        setNotifications(previousNotifications);
        toast.error("Failed to mark all as read");
      }
    } catch (error) {
      console.error("Mark all as read error:", error);
      setNotifications(previousNotifications);
      toast.error("Failed to mark all as read");
    } finally {
      setActionLoading(null);
    }
  };

  const deleteNotification = async (id: string) => {
    setActionLoading(id);

    // Store for revert
    const previousNotifications = [...notifications];

    // Optimistic update
    setNotifications(notifications.filter((n) => n.id !== id));

    try {
      const response = await fetch(`/api/notifications?id=${id}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Notification deleted");
      } else {
        setNotifications(previousNotifications);
        toast.error("Failed to delete notification");
      }
    } catch (error) {
      console.error("Delete notification error:", error);
      setNotifications(previousNotifications);
      toast.error("Failed to delete notification");
    } finally {
      setActionLoading(null);
    }
  };

  const deleteAllRead = async () => {
    setActionLoading("deleteRead");

    // Store for revert
    const previousNotifications = [...notifications];
    const readCount = notifications.filter((n) => n.read).length;

    // Optimistic update
    setNotifications(notifications.filter((n) => !n.read));

    try {
      const response = await fetch("/api/notifications?all=true", {
        method: "DELETE",
      });

      const result = await response.json();
      if (result.success) {
        toast.success(`Deleted ${readCount} read notification${readCount !== 1 ? "s" : ""}`);
      } else {
        setNotifications(previousNotifications);
        toast.error("Failed to delete read notifications");
      }
    } catch (error) {
      console.error("Delete all read error:", error);
      setNotifications(previousNotifications);
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
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
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
          {unreadCount > 0 && (
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
              <option value="system">System</option>
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
            <Link href="/dashboard/settings">Settings</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
