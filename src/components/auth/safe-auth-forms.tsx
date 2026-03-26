"use client";

import { useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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

// Dynamically import Clerk components with no SSR
const ClerkSignIn = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.SignIn),
  {
    ssr: false,
    loading: () => (
      <div className="w-full max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl animate-pulse">
        <div className="h-8 w-32 bg-gray-200 rounded mb-6" />
        <div className="space-y-4">
          <div className="h-12 bg-gray-200 rounded" />
          <div className="h-12 bg-gray-200 rounded" />
          <div className="h-12 bg-gray-200 rounded" />
        </div>
      </div>
    ),
  }
);

const ClerkSignUp = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.SignUp),
  {
    ssr: false,
    loading: () => (
      <div className="w-full max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl animate-pulse">
        <div className="h-8 w-32 bg-gray-200 rounded mb-6" />
        <div className="space-y-4">
          <div className="h-12 bg-gray-200 rounded" />
          <div className="h-12 bg-gray-200 rounded" />
          <div className="h-12 bg-gray-200 rounded" />
          <div className="h-12 bg-gray-200 rounded" />
        </div>
      </div>
    ),
  }
);

interface AuthFormProps {
  appearance?: Record<string, unknown>;
  routing?: "path" | "hash" | "virtual";
  path?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ClerkProps = any;

// Fallback component when Clerk is not configured
function AuthFallback({ mode }: { mode: "sign-in" | "sign-up" }) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === "sign-in" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-gray-600 mt-2">
            {mode === "sign-in"
              ? "Sign in to access your account"
              : "Join Humanly Hired today"}
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-amber-800">
            <strong>Authentication Setup Required</strong>
            <br />
            To enable sign-in functionality, please configure Clerk authentication
            with valid API keys.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="you@example.com"
                disabled
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                placeholder="••••••••"
                disabled
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>
          <Button disabled className="w-full py-6 opacity-50">
            {mode === "sign-in" ? "Sign In" : "Create Account"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          {mode === "sign-in" ? (
            <>
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/sign-in" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

// Loading skeleton
function LoadingSkeleton() {
  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl animate-pulse">
      <div className="h-8 w-32 bg-gray-200 rounded mb-6" />
      <div className="space-y-4">
        <div className="h-12 bg-gray-200 rounded" />
        <div className="h-12 bg-gray-200 rounded" />
        <div className="h-12 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export function SafeSignIn({ appearance, routing, path }: AuthFormProps) {
  const mounted = useIsMounted();
  const hasClerk = mounted ? checkHasClerk() : false;

  if (!mounted) {
    return <LoadingSkeleton />;
  }

  if (!hasClerk) {
    return <AuthFallback mode="sign-in" />;
  }

  const clerkProps: ClerkProps = {
    appearance,
    ...(routing === "path" && path ? { routing, path } : {}),
  };

  return <ClerkSignIn {...clerkProps} />;
}

export function SafeSignUp({ appearance, routing, path }: AuthFormProps) {
  const mounted = useIsMounted();
  const hasClerk = mounted ? checkHasClerk() : false;

  if (!mounted) {
    return (
      <div className="w-full max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl animate-pulse">
        <div className="h-8 w-32 bg-gray-200 rounded mb-6" />
        <div className="space-y-4">
          <div className="h-12 bg-gray-200 rounded" />
          <div className="h-12 bg-gray-200 rounded" />
          <div className="h-12 bg-gray-200 rounded" />
          <div className="h-12 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!hasClerk) {
    return <AuthFallback mode="sign-up" />;
  }

  const clerkProps: ClerkProps = {
    appearance,
    ...(routing === "path" && path ? { routing, path } : {}),
  };

  return <ClerkSignUp {...clerkProps} />;
}
