"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Bell,
  CheckCheck,
  FileText,
  Briefcase,
  MessageSquare,
  X,
} from "lucide-react";

interface Notification {
  id: string;
  type: "application" | "job" | "message" | "system";
  title: string;
  description: string;
  time: string;
  read: boolean;
  avatar?: string;
  link?: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "application",
    title: "New Application Received",
    description: "Sarah Johnson applied for Senior Software Engineer",
    time: "2 minutes ago",
    read: false,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    link: "/employer/applications",
  },
  {
    id: "2",
    type: "job",
    title: "Job Posted Successfully",
    description: "Your job 'Product Manager' is now live",
    time: "1 hour ago",
    read: false,
    link: "/employer/jobs",
  },
  {
    id: "3",
    type: "message",
    title: "New Message",
    description: "You have a new message from TechCorp HR",
    time: "3 hours ago",
    read: true,
    link: "/messages",
  },
  {
    id: "4",
    type: "application",
    title: "Application Status Updated",
    description: "Your application for UX Designer has been reviewed",
    time: "1 day ago",
    read: true,
    link: "/dashboard",
  },
  {
    id: "5",
    type: "system",
    title: "Complete Your Profile",
    description: "Add your skills to get better job matches",
    time: "2 days ago",
    read: true,
    link: "/profile",
  },
];

const iconMap = {
  application: FileText,
  job: Briefcase,
  message: MessageSquare,
  system: Bell,
};

const colorMap = {
  application: "bg-blue-100 text-blue-600",
  job: "bg-emerald-100 text-emerald-600",
  message: "bg-purple-100 text-purple-600",
  system: "bg-amber-100 text-amber-600",
};

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[60]"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-[60] w-96 bg-white rounded-xl shadow-lg border overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <CheckCheck className="w-4 h-4" />
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const Icon = iconMap[notification.type];
                  return (
                    <div
                      key={notification.id}
                      className={`relative px-4 py-3 hover:bg-gray-50 transition-colors ${
                        !notification.read ? "bg-blue-50/50" : ""
                      }`}
                    >
                      <Link
                        href={notification.link || "#"}
                        onClick={() => {
                          markAsRead(notification.id);
                          setIsOpen(false);
                        }}
                        className="flex items-start gap-3"
                      >
                        {notification.avatar ? (
                          <Image
                            src={notification.avatar}
                            alt=""
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              colorMap[notification.type]
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0 pr-6">
                          <p
                            className={`text-sm ${
                              !notification.read
                                ? "font-semibold text-gray-900"
                                : "font-medium text-gray-700"
                            }`}
                          >
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 truncate">
                            {notification.description}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {notification.time}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full" />
                          </div>
                        )}
                      </Link>
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="absolute right-2 top-2 p-1 rounded hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3 text-gray-400" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t bg-gray-50">
              <Link
                href="/notifications"
                onClick={() => setIsOpen(false)}
                className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View all notifications
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
