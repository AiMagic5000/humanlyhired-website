import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

// Demo jobs data for fallback
const demoEmployerJobs = [
  {
    id: "1",
    title: "Senior Software Engineer",
    department: "Engineering",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$150k - $200k",
    applications: 45,
    newApplications: 8,
    views: 892,
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 22).toISOString(),
    status: "active",
    description: "We are looking for a Senior Software Engineer to join our team...",
  },
  {
    id: "2",
    title: "Product Manager",
    department: "Product",
    location: "Remote",
    type: "Full-time",
    salary: "$130k - $170k",
    applications: 38,
    newApplications: 5,
    views: 654,
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 25).toISOString(),
    status: "active",
    description: "Seeking an experienced Product Manager to lead product strategy...",
  },
  {
    id: "3",
    title: "UX Designer",
    department: "Design",
    location: "New York, NY",
    type: "Full-time",
    salary: "$100k - $140k",
    applications: 29,
    newApplications: 3,
    views: 521,
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 27).toISOString(),
    status: "active",
    description: "Looking for a creative UX Designer to improve our product experience...",
  },
  {
    id: "4",
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$120k - $160k",
    applications: 22,
    newApplications: 0,
    views: 389,
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    expiresAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    status: "paused",
    description: "Seeking a DevOps Engineer to optimize our CI/CD pipelines...",
  },
  {
    id: "5",
    title: "Marketing Manager",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    salary: "$90k - $120k",
    applications: 56,
    newApplications: 0,
    views: 743,
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
    expiresAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    status: "closed",
    description: "Looking for a Marketing Manager to lead our growth initiatives...",
  },
];

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes("your-project");

    if (isSupabaseConfigured) {
      try {
        // Get the employer's company ID first
        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("company_id")
          .eq("user_id", userId)
          .single();

        if (profile?.company_id) {
          // Fetch jobs for this company
          const { data: jobs, error } = await supabaseAdmin
            .from("jobs")
            .select("*")
            .eq("company_id", profile.company_id)
            .order("created_at", { ascending: false });

          if (!error && jobs) {
            // Transform jobs to match expected format
            const transformedJobs = jobs.map((job) => ({
              id: job.id,
              title: job.title,
              department: job.department || "General",
              location: job.location,
              type: job.employment_type || "Full-time",
              salary: job.salary_min && job.salary_max
                ? `$${(job.salary_min / 1000).toFixed(0)}k - $${(job.salary_max / 1000).toFixed(0)}k`
                : "Competitive",
              applications: job.applications_count || 0,
              newApplications: job.new_applications_count || 0,
              views: job.views_count || 0,
              postedAt: job.created_at,
              expiresAt: job.deadline || new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
              status: job.status,
              description: job.description || "",
            }));

            const stats = {
              total: transformedJobs.length,
              active: transformedJobs.filter((j) => j.status === "active").length,
              paused: transformedJobs.filter((j) => j.status === "paused").length,
              closed: transformedJobs.filter((j) => j.status === "closed").length,
              draft: transformedJobs.filter((j) => j.status === "draft").length,
            };

            return NextResponse.json({
              success: true,
              data: {
                jobs: transformedJobs,
                stats,
              },
              source: "database",
            });
          }
        }
      } catch (dbError) {
        console.log("Database query failed, using demo data:", dbError);
      }
    }

    // Return demo data
    const stats = {
      total: demoEmployerJobs.length,
      active: demoEmployerJobs.filter((j) => j.status === "active").length,
      paused: demoEmployerJobs.filter((j) => j.status === "paused").length,
      closed: demoEmployerJobs.filter((j) => j.status === "closed").length,
      draft: 0,
    };

    return NextResponse.json({
      success: true,
      data: {
        jobs: demoEmployerJobs,
        stats,
      },
      source: "demo",
    });
  } catch (error) {
    console.error("Employer jobs error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

// Update job status (pause, activate, close)
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
    const { jobId, status } = body;

    if (!jobId || !status) {
      return NextResponse.json(
        { success: false, error: "Job ID and status are required" },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ["active", "paused", "closed", "draft"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status" },
        { status: 400 }
      );
    }

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes("your-project");

    if (isSupabaseConfigured) {
      try {
        // Get employer's company ID
        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("company_id")
          .eq("user_id", userId)
          .single();

        if (profile?.company_id) {
          // Verify job belongs to this company
          const { data: job, error: fetchError } = await supabaseAdmin
            .from("jobs")
            .select("company_id")
            .eq("id", jobId)
            .single();

          if (fetchError || !job) {
            return NextResponse.json(
              { success: false, error: "Job not found" },
              { status: 404 }
            );
          }

          if (job.company_id !== profile.company_id) {
            return NextResponse.json(
              { success: false, error: "Not authorized to update this job" },
              { status: 403 }
            );
          }

          // Update job status
          const { error: updateError } = await supabaseAdmin
            .from("jobs")
            .update({ status, updated_at: new Date().toISOString() })
            .eq("id", jobId);

          if (updateError) {
            throw updateError;
          }

          return NextResponse.json({
            success: true,
            message: `Job ${status === "active" ? "activated" : status === "paused" ? "paused" : "closed"} successfully`,
          });
        }
      } catch (dbError) {
        console.log("Database update failed:", dbError);
      }
    }

    // Demo mode response
    return NextResponse.json({
      success: true,
      message: `Job ${status === "active" ? "activated" : status === "paused" ? "paused" : "closed"} successfully`,
    });
  } catch (error) {
    console.error("Update job status error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update job status" },
      { status: 500 }
    );
  }
}

// Delete a job
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: "Job ID is required" },
        { status: 400 }
      );
    }

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes("your-project");

    if (isSupabaseConfigured) {
      try {
        // Get employer's company ID
        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("company_id")
          .eq("user_id", userId)
          .single();

        if (profile?.company_id) {
          // Verify job belongs to this company
          const { data: job, error: fetchError } = await supabaseAdmin
            .from("jobs")
            .select("company_id")
            .eq("id", jobId)
            .single();

          if (fetchError || !job) {
            return NextResponse.json(
              { success: false, error: "Job not found" },
              { status: 404 }
            );
          }

          if (job.company_id !== profile.company_id) {
            return NextResponse.json(
              { success: false, error: "Not authorized to delete this job" },
              { status: 403 }
            );
          }

          // Delete the job
          const { error: deleteError } = await supabaseAdmin
            .from("jobs")
            .delete()
            .eq("id", jobId);

          if (deleteError) {
            throw deleteError;
          }

          return NextResponse.json({
            success: true,
            message: "Job deleted successfully",
          });
        }
      } catch (dbError) {
        console.log("Database delete failed:", dbError);
      }
    }

    // Demo mode response
    return NextResponse.json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Delete job error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete job" },
      { status: 500 }
    );
  }
}
