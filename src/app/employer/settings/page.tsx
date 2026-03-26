"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Bell,
  Mail,
  CreditCard,
  Shield,
  Users,
  Save,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const settingsTabs = [
  { id: "general", label: "General", icon: Settings },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "team", label: "Team Members", icon: Users },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "security", label: "Security", icon: Shield },
];

interface NotificationSettings {
  newApplications: boolean;
  applicationStatusChanges: boolean;
  jobExpirationReminders: boolean;
  weeklySummaryReports: boolean;
  platformUpdates: boolean;
}

interface EmployerSettings {
  language: string;
  timezone: string;
  dateFormat: string;
  defaultJobDuration: number;
  notifications: NotificationSettings;
  twoFactorEnabled: boolean;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Pending";
}

export default function EmployerSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState<EmployerSettings>({
    language: "en",
    timezone: "America/Los_Angeles",
    dateFormat: "mdy",
    defaultJobDuration: 30,
    notifications: {
      newApplications: true,
      applicationStatusChanges: true,
      jobExpirationReminders: true,
      weeklySummaryReports: false,
      platformUpdates: false,
    },
    twoFactorEnabled: false,
  });

  const [teamMembers] = useState<TeamMember[]>([
    { id: "1", name: "John Smith", email: "john@techcorp.com", role: "Admin", status: "Active" },
    { id: "2", name: "Emily Chen", email: "emily@techcorp.com", role: "Recruiter", status: "Active" },
    { id: "3", name: "Michael Brown", email: "michael@techcorp.com", role: "Hiring Manager", status: "Active" },
    { id: "4", name: "Sarah Davis", email: "sarah@techcorp.com", role: "Recruiter", status: "Pending" },
  ]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      const result = await response.json();

      if (result.success && result.data) {
        setSettings({
          language: result.data.language || "en",
          timezone: result.data.timezone || "America/Los_Angeles",
          dateFormat: result.data.dateFormat || "mdy",
          defaultJobDuration: result.data.defaultJobDuration || 30,
          notifications: {
            newApplications: result.data.notifications?.newApplications ?? true,
            applicationStatusChanges: result.data.notifications?.applicationStatusChanges ?? true,
            jobExpirationReminders: result.data.notifications?.jobExpirationReminders ?? true,
            weeklySummaryReports: result.data.notifications?.weeklySummaryReports ?? false,
            platformUpdates: result.data.notifications?.platformUpdates ?? false,
          },
          twoFactorEnabled: result.data.twoFactorEnabled || false,
        });
      }
    } catch (error) {
      console.error("Fetch settings error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save settings");
      }

      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Save settings error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const updateNotification = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }));
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
          <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-1">Manage your company account preferences</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Tabs */}
        <div className="lg:w-64 flex-shrink-0">
          <nav className="space-y-1">
            {settingsTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl border p-6">
          {activeTab === "general" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Email
                    </label>
                    <Input defaultValue="hr@techcorp.com" type="email" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <Input defaultValue="+1 (555) 123-4567" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Owner
                    </label>
                    <Input defaultValue="John Smith" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select
                      value={settings.language}
                      onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Format
                    </label>
                    <select
                      value={settings.dateFormat}
                      onChange={(e) => setSettings(prev => ({ ...prev, dateFormat: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="mdy">MM/DD/YYYY</option>
                      <option value="dmy">DD/MM/YYYY</option>
                      <option value="ymd">YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Job Duration
                    </label>
                    <select
                      value={settings.defaultJobDuration}
                      onChange={(e) => setSettings(prev => ({ ...prev, defaultJobDuration: Number(e.target.value) }))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={30}>30 days</option>
                      <option value={60}>60 days</option>
                      <option value={90}>90 days</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h3>
                <div className="space-y-4">
                  {[
                    { key: "newApplications" as const, label: "New applications", description: "Get notified when candidates apply to your jobs" },
                    { key: "applicationStatusChanges" as const, label: "Application status changes", description: "When candidate status is updated" },
                    { key: "jobExpirationReminders" as const, label: "Job expiration reminders", description: "Remind before jobs expire" },
                    { key: "weeklySummaryReports" as const, label: "Weekly summary reports", description: "Receive weekly hiring activity summary" },
                    { key: "platformUpdates" as const, label: "Platform updates", description: "News and feature updates from Humanly Hired" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 rounded-lg border">
                      <div>
                        <p className="font-medium text-gray-900">{item.label}</p>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications[item.key]}
                          onChange={(e) => updateNotification(item.key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Recipients</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">hr@techcorp.com</p>
                        <p className="text-sm text-gray-500">Primary</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                  <Button variant="outline" className="w-full">Add Another Recipient</Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "team" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
                  <p className="text-sm text-gray-600">Manage who has access to your company account</p>
                </div>
                <Button className="gap-2">
                  <Users className="w-4 h-4" />
                  Invite Member
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Member
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Role
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
                    {teamMembers.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{member.name}</p>
                            <p className="text-sm text-gray-500">{member.email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-gray-700">{member.role}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            member.status === "Active"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}>
                            {member.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Button variant="outline" size="sm">Edit</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "billing" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Plan</h3>
                <div className="p-6 rounded-xl border-2 border-blue-200 bg-blue-50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">Professional Plan</h4>
                      <p className="text-sm text-gray-600">Unlimited job postings, up to 10 team members</p>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">$299<span className="text-sm font-normal text-gray-500">/mo</span></span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button variant="outline">Change Plan</Button>
                    <span className="text-sm text-gray-500">Next billing date: Feb 1, 2025</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Visa ending in 4242</p>
                      <p className="text-sm text-gray-500">Expires 12/2026</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Update</Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing History</h3>
                <div className="space-y-2">
                  {[
                    { date: "Jan 1, 2025", amount: "$299.00", status: "Paid" },
                    { date: "Dec 1, 2024", amount: "$299.00", status: "Paid" },
                    { date: "Nov 1, 2024", amount: "$299.00", status: "Paid" },
                  ].map((invoice) => (
                    <div key={invoice.date} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">{invoice.date}</span>
                        <span className="font-medium text-gray-900">{invoice.amount}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-emerald-600">{invoice.status}</span>
                        <Button variant="outline" size="sm">Download</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Password</h3>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <Input type="password" placeholder="Enter current password" />
                  </div>
                  <div></div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <Input type="password" placeholder="Enter new password" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <Input type="password" placeholder="Confirm new password" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setSettings(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }))}
                  >
                    {settings.twoFactorEnabled ? "Disable" : "Enable"}
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Sessions</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium text-gray-900">Current Session</p>
                      <p className="text-sm text-gray-500">Chrome on Windows - San Francisco, CA</p>
                      <p className="text-xs text-gray-400">Last active: Just now</p>
                    </div>
                    <span className="text-xs text-emerald-600 font-medium">Current</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium text-gray-900">Safari on iPhone</p>
                      <p className="text-sm text-gray-500">San Francisco, CA</p>
                      <p className="text-xs text-gray-400">Last active: 2 hours ago</p>
                    </div>
                    <Button variant="outline" size="sm" className="text-red-600">Revoke</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
