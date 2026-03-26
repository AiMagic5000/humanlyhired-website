import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

// Demo users data for fallback
const demoUsers = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    role: "candidate",
    status: "active",
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    applications: 5,
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@techcorp.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    role: "employer",
    company: "TechCorp Inc.",
    status: "active",
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    jobsPosted: 8,
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@email.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    role: "candidate",
    status: "active",
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    applications: 3,
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.kim@startupxyz.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    role: "employer",
    company: "StartupXYZ",
    status: "active",
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    jobsPosted: 12,
  },
  {
    id: "5",
    name: "Jennifer Lee",
    email: "jennifer.lee@email.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    role: "candidate",
    status: "suspended",
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 50).toISOString(),
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40).toISOString(),
    applications: 0,
  },
  {
    id: "6",
    name: "Robert Wilson",
    email: "robert.wilson@email.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    role: "candidate",
    status: "active",
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    applications: 2,
  },
  {
    id: "7",
    name: "Lisa Anderson",
    email: "lisa@designco.com",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop",
    role: "employer",
    company: "DesignCo",
    status: "pending",
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    jobsPosted: 0,
  },
  {
    id: "8",
    name: "Admin User",
    email: "admin@humanlyhired.com",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop",
    role: "admin",
    status: "active",
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365).toISOString(),
    lastActive: new Date().toISOString(),
  },
];

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "all";
    const status = searchParams.get("status") || "all";

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes("your-project");

    if (isSupabaseConfigured) {
      try {
        // Fetch profiles from database
        let query = supabaseAdmin
          .from("profiles")
          .select(`
            user_id,
            full_name,
            email,
            avatar_url,
            role,
            status,
            created_at,
            last_active_at,
            company_name
          `)
          .order("created_at", { ascending: false });

        // Apply search filter
        if (search) {
          query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
        }

        // Apply role filter
        if (role !== "all") {
          query = query.eq("role", role);
        }

        // Apply status filter
        if (status !== "all") {
          query = query.eq("status", status);
        }

        const { data: profiles, error } = await query.limit(50);

        if (!error && profiles) {
          // Get application/job counts
          const userIds = profiles.map(p => p.user_id);

          const [applicationsResult, jobsResult] = await Promise.all([
            supabaseAdmin
              .from("applications")
              .select("user_id")
              .in("user_id", userIds),
            supabaseAdmin
              .from("jobs")
              .select("created_by")
              .in("created_by", userIds),
          ]);

          const applicationCounts: Record<string, number> = {};
          const jobCounts: Record<string, number> = {};

          applicationsResult.data?.forEach(a => {
            applicationCounts[a.user_id] = (applicationCounts[a.user_id] || 0) + 1;
          });

          jobsResult.data?.forEach(j => {
            jobCounts[j.created_by] = (jobCounts[j.created_by] || 0) + 1;
          });

          const users = profiles.map(profile => ({
            id: profile.user_id,
            name: profile.full_name || "Unknown",
            email: profile.email || "",
            avatar: profile.avatar_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
            role: profile.role || "candidate",
            company: profile.company_name,
            status: profile.status || "active",
            joinedAt: profile.created_at,
            lastActive: profile.last_active_at || profile.created_at,
            applications: applicationCounts[profile.user_id] || 0,
            jobsPosted: jobCounts[profile.user_id] || 0,
          }));

          // Calculate stats
          const stats = {
            total: users.length,
            candidates: users.filter(u => u.role === "candidate").length,
            employers: users.filter(u => u.role === "employer").length,
            active: users.filter(u => u.status === "active").length,
          };

          return NextResponse.json({
            success: true,
            data: { users, stats },
            source: "database",
          });
        }
      } catch (dbError) {
        console.log("Database query failed, using demo data:", dbError);
      }
    }

    // Filter demo data
    let filteredUsers = [...demoUsers];

    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(u =>
        u.name.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower)
      );
    }

    if (role !== "all") {
      filteredUsers = filteredUsers.filter(u => u.role === role);
    }

    if (status !== "all") {
      filteredUsers = filteredUsers.filter(u => u.status === status);
    }

    // Calculate stats from all users (not filtered)
    const stats = {
      total: demoUsers.length,
      candidates: demoUsers.filter(u => u.role === "candidate").length,
      employers: demoUsers.filter(u => u.role === "employer").length,
      active: demoUsers.filter(u => u.status === "active").length,
    };

    return NextResponse.json({
      success: true,
      data: { users: filteredUsers, stats },
      source: "demo",
    });
  } catch (error) {
    console.error("Admin users error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// Update user status
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { userIds, action, status } = body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "User IDs are required" },
        { status: 400 }
      );
    }

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes("your-project");

    if (isSupabaseConfigured) {
      try {
        let newStatus = status;
        if (action === "activate") newStatus = "active";
        if (action === "suspend") newStatus = "suspended";

        if (newStatus) {
          await supabaseAdmin
            .from("profiles")
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .in("user_id", userIds);
        }

        return NextResponse.json({
          success: true,
          message: `${userIds.length} user(s) updated successfully`,
        });
      } catch (dbError) {
        console.log("Database update failed:", dbError);
      }
    }

    // Demo mode response
    return NextResponse.json({
      success: true,
      message: `${userIds.length} user(s) updated successfully`,
    });
  } catch (error) {
    console.error("Update users error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update users" },
      { status: 500 }
    );
  }
}
