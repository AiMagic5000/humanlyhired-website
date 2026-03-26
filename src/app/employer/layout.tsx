"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Menu,
  X,
  Building2,
  Plus,
  ChevronDown,
  BarChart3,
  Search,
  Settings,
  MessageSquare,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserSection } from "@/components/auth/user-section";
import { NotificationDropdown } from "@/components/notifications/notification-dropdown";

const navigation = [
  { name: "Dashboard", href: "/employer/dashboard", icon: LayoutDashboard },
  { name: "Job Postings", href: "/employer/jobs", icon: Briefcase },
  { name: "Applications", href: "/employer/applications", icon: Users },
  { name: "Find Candidates", href: "/employer/candidates", icon: Search },
  { name: "Messages", href: "/employer/messages", icon: MessageSquare },
  { name: "Notifications", href: "/employer/notifications", icon: Bell },
  { name: "Analytics", href: "/employer/analytics", icon: BarChart3 },
  { name: "Company Profile", href: "/employer/company", icon: Building2 },
  { name: "Settings", href: "/employer/settings", icon: Settings },
];

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-5 border-b">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">HS</span>
              </div>
              <span className="font-bold text-gray-900">Employer Portal</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Company selector */}
          <div className="px-4 py-4 border-b">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  Your Company
                </p>
                <p className="text-xs text-gray-500">Employer Account</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Quick actions */}
          <div className="px-4 py-4">
            <Button asChild className="w-full gap-2">
              <Link href="/employer/jobs/new">
                <Plus className="w-4 h-4" />
                Post New Job
              </Link>
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive ? "text-blue-600" : "text-gray-400")} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t">
            <UserSection afterSignOutUrl="/" />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white border-b lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1 lg:flex-none" />

          <div className="flex items-center gap-3">
            <NotificationDropdown />
            <Button variant="outline" size="sm" asChild>
              <Link href="/employer/jobs/new">
                <Plus className="w-4 h-4 mr-2" />
                Post Job
              </Link>
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
