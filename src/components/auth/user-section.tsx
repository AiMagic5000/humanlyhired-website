"use client";

import { useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { User } from "lucide-react";

// Dynamically import Clerk components with no SSR
const ClerkUserButton = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.UserButton),
  {
    ssr: false,
    loading: () => (
      <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
    ),
  }
);

// Custom hook to check if component is mounted (client-side)
function useIsMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

// Check if Clerk is properly configured
function checkHasClerk(): boolean {
  if (typeof window === "undefined") return false;
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  return !!publishableKey && !publishableKey.includes("placeholder") && publishableKey.startsWith("pk_");
}

interface UserSectionProps {
  afterSignOutUrl?: string;
  showDetails?: boolean;
}

export function UserSection({ afterSignOutUrl = "/", showDetails = true }: UserSectionProps) {
  const mounted = useIsMounted();
  const hasClerk = mounted ? checkHasClerk() : false;

  if (!mounted) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
        {showDetails && (
          <div className="flex-1 min-w-0">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-32 bg-gray-200 rounded mt-1 animate-pulse" />
          </div>
        )}
      </div>
    );
  }

  if (!hasClerk) {
    // Fallback when Clerk is not configured
    return (
      <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          <User className="w-5 h-5 text-gray-500" />
        </div>
        {showDetails && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Guest User</p>
            <p className="text-xs text-gray-500 truncate">Sign in to continue</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
      <ClerkUserButton
        afterSignOutUrl={afterSignOutUrl}
        appearance={{
          elements: {
            avatarBox: "w-10 h-10",
          }
        }}
      />
      {showDetails && <UserDetails />}
    </div>
  );
}

// Separate component for user details
function UserDetails() {
  const mounted = useIsMounted();

  if (!mounted) {
    return (
      <div className="flex-1 min-w-0">
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        <div className="h-3 w-32 bg-gray-200 rounded mt-1 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-900 truncate">User</p>
      <p className="text-xs text-gray-500 truncate">Account</p>
    </div>
  );
}

// Simple UserButton wrapper
export function SafeUserButton({ afterSignOutUrl = "/" }: { afterSignOutUrl?: string }) {
  const mounted = useIsMounted();
  const hasClerk = mounted ? checkHasClerk() : false;

  if (!mounted) {
    return <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />;
  }

  if (!hasClerk) {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
        <User className="w-4 h-4 text-gray-500" />
      </div>
    );
  }

  return <ClerkUserButton afterSignOutUrl={afterSignOutUrl} />;
}
