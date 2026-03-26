import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

// Demo applications data for fallback
const demoApplications = [
  {
    id: "1",
    candidate: {
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      location: "San Francisco, CA",
    },
    job: {
      id: "1",
      title: "Senior Software Engineer",
      company: "TechCorp Inc.",
    },
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    status: "new",
  },
  {
    id: "2",
    candidate: {
      name: "Michael Chen",
      email: "michael.chen@email.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      location: "New York, NY",
    },
    job: {
      id: "2",
      title: "Product Manager",
      company: "StartupXYZ",
    },
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    status: "reviewing",
  },
  {
    id: "3",
    candidate: {
      name: "Emily Rodriguez",
      email: "emily.rodriguez@email.com",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      location: "Austin, TX",
    },
    job: {
      id: "3",
      title: "UX Designer",
      company: "DesignCo",
    },
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    status: "shortlisted",
  },
  {
    id: "4",
    candidate: {
      name: "David Kim",
      email: "david.kim@email.com",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      location: "Seattle, WA",
    },
    job: {
      id: "1",
      title: "Senior Software Engineer",
      company: "TechCorp Inc.",
    },
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    status: "interviewed",
  },
  {
    id: "5",
    candidate: {
      name: "Jennifer Lee",
      email: "jennifer.lee@email.com",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      location: "Los Angeles, CA",
    },
    job: {
      id: "4",
      title: "Marketing Manager",
      company: "BrandBoost",
    },
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    status: "hired",
  },
  {
    id: "6",
    candidate: {
      name: "Robert Wilson",
      email: "robert.wilson@email.com",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      location: "Chicago, IL",
    },
    job: {
      id: "5",
      title: "Data Analyst",
      company: "DataDriven",
    },
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(),
    status: "rejected",
  },
  {
    id: "7",
    candidate: {
      name: "Lisa Anderson",
      email: "lisa.anderson@email.com",
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop",
      location: "Denver, CO",
    },
    job: {
      id: "2",
      title: "Product Manager",
      company: "StartupXYZ",
    },
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    status: "new",
  },
  {
    id: "8",
    candidate: {
      name: "James Martinez",
      email: "james.martinez@email.com",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop",
      location: "Miami, FL",
    },
    job: {
      id: "3",
      title: "UX Designer",
      company: "DesignCo",
    },
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    status: "offered",
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
    const status = searchParams.get("status") || "all";

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes("your-project");

    if (isSupabaseConfigured) {
      try {
        // Fetch applications from database with joins
        let query = supabaseAdmin
          .from("applications")
          .select(`
            id,
            status,
            created_at,
            user_id,
            job_id,
            profiles!applications_user_id_fkey (
              full_name,
              email,
              avatar_url,
              location
            ),
            jobs!applications_job_id_fkey (
              id,
              title,
              company_name
            )
          `)
          .order("created_at", { ascending: false });

        // Apply status filter
        if (status !== "all") {
          query = query.eq("status", status);
        }

        const { data: applications, error } = await query.limit(100);

        if (!error && applications) {
          // Transform data
          const transformedApplications = applications.map((app: any) => ({
            id: app.id,
            candidate: {
              name: app.profiles?.full_name || "Unknown",
              email: app.profiles?.email || "",
              avatar: app.profiles?.avatar_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
              location: app.profiles?.location || "Unknown",
            },
            job: {
              id: app.jobs?.id || "",
              title: app.jobs?.title || "Unknown Position",
              company: app.jobs?.company_name || "Unknown Company",
            },
            appliedAt: app.created_at,
            status: app.status || "new",
          }));

          // Filter by search if provided
          let filteredApplications = transformedApplications;
          if (search) {
            const searchLower = search.toLowerCase();
            filteredApplications = transformedApplications.filter((app: any) =>
              app.candidate.name.toLowerCase().includes(searchLower) ||
              app.candidate.email.toLowerCase().includes(searchLower) ||
              app.job.title.toLowerCase().includes(searchLower) ||
              app.job.company.toLowerCase().includes(searchLower)
            );
          }

          // Calculate stats
          const stats = {
            total: transformedApplications.length,
            new: transformedApplications.filter((a: any) => a.status === "new").length,
            reviewing: transformedApplications.filter((a: any) => a.status === "reviewing").length,
            shortlisted: transformedApplications.filter((a: any) => a.status === "shortlisted").length,
            interviewed: transformedApplications.filter((a: any) => a.status === "interviewed").length,
            offered: transformedApplications.filter((a: any) => a.status === "offered").length,
            hired: transformedApplications.filter((a: any) => a.status === "hired").length,
            rejected: transformedApplications.filter((a: any) => a.status === "rejected").length,
          };

          return NextResponse.json({
            success: true,
            data: { applications: filteredApplications, stats },
            source: "database",
          });
        }
      } catch (dbError) {
        console.log("Database query failed, using demo data:", dbError);
      }
    }

    // Filter demo data
    let filteredApplications = [...demoApplications];

    if (search) {
      const searchLower = search.toLowerCase();
      filteredApplications = filteredApplications.filter(app =>
        app.candidate.name.toLowerCase().includes(searchLower) ||
        app.candidate.email.toLowerCase().includes(searchLower) ||
        app.job.title.toLowerCase().includes(searchLower) ||
        app.job.company.toLowerCase().includes(searchLower)
      );
    }

    if (status !== "all") {
      filteredApplications = filteredApplications.filter(app => app.status === status);
    }

    // Calculate stats from all demo applications
    const stats = {
      total: demoApplications.length,
      new: demoApplications.filter(a => a.status === "new").length,
      reviewing: demoApplications.filter(a => a.status === "reviewing").length,
      shortlisted: demoApplications.filter(a => a.status === "shortlisted").length,
      interviewed: demoApplications.filter(a => a.status === "interviewed").length,
      offered: demoApplications.filter(a => a.status === "offered").length,
      hired: demoApplications.filter(a => a.status === "hired").length,
      rejected: demoApplications.filter(a => a.status === "rejected").length,
    };

    return NextResponse.json({
      success: true,
      data: { applications: filteredApplications, stats },
      source: "demo",
    });
  } catch (error) {
    console.error("Admin applications error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

// Update application status
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
    const { applicationIds, status, action } = body;

    if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "Application IDs are required" },
        { status: 400 }
      );
    }

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes("your-project");

    if (isSupabaseConfigured) {
      try {
        const newStatus = status || action;
        if (newStatus) {
          await supabaseAdmin
            .from("applications")
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .in("id", applicationIds);
        }

        return NextResponse.json({
          success: true,
          message: `${applicationIds.length} application(s) updated successfully`,
        });
      } catch (dbError) {
        console.log("Database update failed:", dbError);
      }
    }

    // Demo mode response
    return NextResponse.json({
      success: true,
      message: `${applicationIds.length} application(s) updated successfully`,
    });
  } catch (error) {
    console.error("Update applications error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update applications" },
      { status: 500 }
    );
  }
}

// Delete applications
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { applicationIds } = body;

    if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "Application IDs are required" },
        { status: 400 }
      );
    }

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes("your-project");

    if (isSupabaseConfigured) {
      try {
        await supabaseAdmin
          .from("applications")
          .delete()
          .in("id", applicationIds);

        return NextResponse.json({
          success: true,
          message: `${applicationIds.length} application(s) deleted successfully`,
        });
      } catch (dbError) {
        console.log("Database delete failed:", dbError);
      }
    }

    // Demo mode response
    return NextResponse.json({
      success: true,
      message: `${applicationIds.length} application(s) deleted successfully`,
    });
  } catch (error) {
    console.error("Delete applications error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete applications" },
      { status: 500 }
    );
  }
}
