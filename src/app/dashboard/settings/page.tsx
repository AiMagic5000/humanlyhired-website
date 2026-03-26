"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  Lock,
  User,
  Eye,
  EyeOff,
  Shield,
  LogOut,
  Save,
  Check,
  Trash2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface NotificationSettings {
  applicationStatusUpdates: boolean;
  newJobRecommendations: boolean;
  weeklyJobDigest: boolean;
  interviewReminders: boolean;
  marketingEmails: boolean;
}

interface PrivacySettings {
  profileVisibility: "public" | "employers" | "private";
  resumeVisibility: "applied" | "all" | "none";
}

interface Settings {
  language: string;
  timezone: string;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  twoFactorEnabled: boolean;
}

export default function CandidateSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeSection, setActiveSection] = useState("account");

  const [settings, setSettings] = useState<Settings>({
    language: "en",
    timezone: "America/Los_Angeles",
    notifications: {
      applicationStatusUpdates: true,
      newJobRecommendations: true,
      weeklyJobDigest: false,
      interviewReminders: true,
      marketingEmails: false,
    },
    privacy: {
      profileVisibility: "public",
      resumeVisibility: "applied",
    },
    twoFactorEnabled: false,
  });

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
          notifications: {
            applicationStatusUpdates: result.data.notifications?.applicationStatusUpdates ?? true,
            newJobRecommendations: result.data.notifications?.newJobRecommendations ?? true,
            weeklyJobDigest: result.data.notifications?.weeklyJobDigest ?? false,
            interviewReminders: result.data.notifications?.interviewReminders ?? true,
            marketingEmails: result.data.notifications?.marketingEmails ?? false,
          },
          privacy: {
            profileVisibility: result.data.privacy?.profileVisibility || "public",
            resumeVisibility: result.data.privacy?.resumeVisibility || "applied",
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

  const updatePrivacy = (key: keyof PrivacySettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account preferences</p>
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

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Navigation */}
        <div className="space-y-2">
          <button
            onClick={() => setActiveSection("account")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
              activeSection === "account"
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <User className="w-5 h-5" />
            Account
          </button>
          <button
            onClick={() => setActiveSection("notifications")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
              activeSection === "notifications"
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Bell className="w-5 h-5" />
            Notifications
          </button>
          <button
            onClick={() => setActiveSection("security")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
              activeSection === "security"
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Lock className="w-5 h-5" />
            Security
          </button>
          <button
            onClick={() => setActiveSection("privacy")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
              activeSection === "privacy"
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Eye className="w-5 h-5" />
            Privacy
          </button>
        </div>

        {/* Right Column - Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account Settings */}
          {activeSection === "account" && (
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-gray-400" />
                Account Settings
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="en">English (US)</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
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
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeSection === "notifications" && (
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Bell className="w-5 h-5 text-gray-400" />
                Email Notifications
              </h3>
              <div className="space-y-4">
                {[
                  { key: "applicationStatusUpdates" as const, label: "Application status updates", description: "Get notified when your application status changes" },
                  { key: "newJobRecommendations" as const, label: "New job recommendations", description: "Receive personalized job suggestions" },
                  { key: "weeklyJobDigest" as const, label: "Weekly job digest", description: "Get a weekly summary of relevant jobs" },
                  { key: "interviewReminders" as const, label: "Interview reminders", description: "Receive reminders before scheduled interviews" },
                  { key: "marketingEmails" as const, label: "Marketing emails", description: "Tips, news, and updates from Humanly Hired" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.description}</p>
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
          )}

          {/* Security Settings */}
          {activeSection === "security" && (
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Lock className="w-5 h-5 text-gray-400" />
                Password & Security
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
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
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">Add an extra layer of security</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSettings(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }))}
                  >
                    {settings.twoFactorEnabled ? "Disable" : "Enable"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Settings */}
          {activeSection === "privacy" && (
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Eye className="w-5 h-5 text-gray-400" />
                Privacy Settings
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium text-gray-900">Profile Visibility</p>
                    <p className="text-sm text-gray-500">Allow employers to find your profile</p>
                  </div>
                  <select
                    value={settings.privacy.profileVisibility}
                    onChange={(e) => updatePrivacy("profileVisibility", e.target.value)}
                    className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="public">Public</option>
                    <option value="employers">Employers Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium text-gray-900">Resume Visibility</p>
                    <p className="text-sm text-gray-500">Control who can download your resume</p>
                  </div>
                  <select
                    value={settings.privacy.resumeVisibility}
                    onChange={(e) => updatePrivacy("resumeVisibility", e.target.value)}
                    className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="applied">Applied Employers Only</option>
                    <option value="all">All Employers</option>
                    <option value="none">Nobody</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Danger Zone */}
          {activeSection === "privacy" && (
            <div className="bg-white rounded-xl border border-red-200 p-6">
              <h3 className="font-semibold text-red-600 mb-6 flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                Danger Zone
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-red-200 bg-red-50">
                  <div>
                    <p className="font-medium text-gray-900">Sign Out Everywhere</p>
                    <p className="text-sm text-gray-500">Sign out from all devices</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out All
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-red-200 bg-red-50">
                  <div>
                    <p className="font-medium text-gray-900">Delete Account</p>
                    <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
