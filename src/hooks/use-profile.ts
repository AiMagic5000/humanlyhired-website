"use client";

import { useState, useEffect, useCallback } from "react";

export interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  monthlyNeed: string;
  monthlyWant: string;
  startDate: string;
  hoursPerWeek: string;
  workPreference: string;
  profileComplete: boolean;
}

export function useProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/profile");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch profile");
      }

      setProfile(result.data || null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch profile";
      setError(message);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const saveProfile = useCallback(async (data: Omit<ProfileData, "profileComplete">) => {
    try {
      setError(null);
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save profile");
      }

      setProfile(result.data);
      return result.data as ProfileData;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save profile";
      setError(message);
      throw err;
    }
  }, []);

  return {
    profile,
    loading,
    error,
    saveProfile,
    refetch: fetchProfile,
    hasProfile: !!profile?.profileComplete,
  };
}
