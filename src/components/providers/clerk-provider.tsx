"use client";

import { ClerkProvider as BaseClerkProvider } from "@clerk/nextjs";

interface ClerkProviderProps {
  children: React.ReactNode;
}

export function ClerkProvider({ children }: ClerkProviderProps) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // If no valid publishable key (placeholder or missing), render without ClerkProvider
  // This allows the build to succeed without valid Clerk credentials
  const isValidKey = publishableKey && !publishableKey.includes("placeholder") && publishableKey.startsWith("pk_");

  if (!isValidKey) {
    return <>{children}</>;
  }

  // Always wrap with BaseClerkProvider when we have a valid key
  // The key validation is handled by Clerk itself
  return (
    <BaseClerkProvider
      publishableKey={publishableKey}
      appearance={{
        elements: {
          formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-sm",
          footerActionLink: "text-blue-600 hover:text-blue-700",
          card: "shadow-xl",
        },
      }}
    >
      {children}
    </BaseClerkProvider>
  );
}
