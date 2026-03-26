"use client";

import { useUser as useClerkUser, useAuth as useClerkAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";

// Safe wrapper for useUser that doesn't throw when ClerkProvider is missing
export function useSafeUser() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Try to use Clerk's useUser, but catch any errors
  try {
    const user = useClerkUser();
    if (!mounted) {
      return { user: null, isLoaded: false, isSignedIn: false };
    }
    return user;
  } catch {
    return { user: null, isLoaded: true, isSignedIn: false };
  }
}

// Safe wrapper for useAuth
export function useSafeAuth() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  try {
    const auth = useClerkAuth();
    if (!mounted) {
      return { isLoaded: false, isSignedIn: false, userId: null };
    }
    return auth;
  } catch {
    return { isLoaded: true, isSignedIn: false, userId: null };
  }
}
