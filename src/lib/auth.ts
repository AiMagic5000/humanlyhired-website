import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "./supabase";

export type UserRole = "candidate" | "employer" | "admin";

export interface AuthResult {
  userId: string | null;
  role: UserRole | null;
  isAdmin: boolean;
  isEmployer: boolean;
  isCandidate: boolean;
}

/**
 * Get the current user's authentication status and role
 */
export async function getAuthUser(): Promise<AuthResult> {
  const { userId } = await auth();

  if (!userId) {
    return {
      userId: null,
      role: null,
      isAdmin: false,
      isEmployer: false,
      isCandidate: false,
    };
  }

  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes("your-project");

  let role: UserRole = "candidate"; // Default role

  if (isSupabaseConfigured) {
    try {
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("role, user_type")
        .eq("user_id", userId)
        .single();

      if (profile) {
        role = (profile.role || profile.user_type || "candidate") as UserRole;
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  }

  return {
    userId,
    role,
    isAdmin: role === "admin",
    isEmployer: role === "employer",
    isCandidate: role === "candidate",
  };
}

/**
 * Verify that the current user has admin privileges
 * Returns the user ID if admin, throws error otherwise
 */
export async function requireAdmin(): Promise<string> {
  const { userId, isAdmin } = await getAuthUser();

  if (!userId) {
    throw new Error("Unauthorized: Not authenticated");
  }

  // In demo mode (no database), allow access for development
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes("your-project");

  if (!isSupabaseConfigured) {
    // Demo mode - allow any authenticated user
    return userId;
  }

  if (!isAdmin) {
    throw new Error("Forbidden: Admin access required");
  }

  return userId;
}

/**
 * Verify that the current user has employer privileges
 */
export async function requireEmployer(): Promise<string> {
  const { userId, isEmployer, isAdmin } = await getAuthUser();

  if (!userId) {
    throw new Error("Unauthorized: Not authenticated");
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes("your-project");

  if (!isSupabaseConfigured) {
    return userId;
  }

  if (!isEmployer && !isAdmin) {
    throw new Error("Forbidden: Employer access required");
  }

  return userId;
}
