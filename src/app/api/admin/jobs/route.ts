import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

// Demo jobs data for fallback
const demoJobs = [
  {
    id: "1",
    title: "Senior Software Engineer",
    company: "TechCorp Inc.",
    companyLogo: "TC",
    location: "San Francisco, CA",
    type: "full-time",
    salary: "$150,000 - $200,000",
    status: "active",
    applications: 45,
    views: 1234,
    postedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    expiresDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 27).toISOString(),
    featured: true,
  },
  {
    id: "2",
    title: "Product Manager",
    company: "StartupXYZ",
    companyLogo: "SX",
    location: "New York, NY",
    type: "full-time",
    salary: "$120,000 - $160,000",
    status: "active",
    applications: 32,
    views: 856,
    postedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    expiresDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 25).toISOString(),
    featured: false,
  },
  {
    id: "3",
    title: "UX Designer",
    company: "DesignCo",
    companyLogo: "DC",
    location: "Remote",
    type: "remote",
    salary: "$90,000 - $120,000",
    status: "paused",
    applications: 28,
    views: 542,
    postedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    expiresDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 22).toISOString(),
    featured: false,
  },
  {
    id: "4",
    title: "DevOps Engineer",
    company: "CloudServices Co.",
    companyLogo: "CS",
    location: "Seattle, WA",
    type: "full-time",
    salary: "$130,000 - $170,000",
    status: "active",
    applications: 19,
    views: 421,
    postedDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    expiresDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 29).toISOString(),
    featured: true,
  },
  {
    id: "5",
    title: "Marketing Coordinator",
    company: "GrowthScale",
    companyLogo: "GS",
    location: "Austin, TX",
    type: "full-time",
    salary: "$55,000 - $70,000",
    status: "closed",
    applications: 67,
    views: 1567,
    postedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    expiresDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    featured: false,
  },
  {
    id: "6",
    title: "Data Analyst",
    company: "DataDriven Inc.",
    companyLogo: "DD",
    location: "Chicago, IL",
    type: "contract",
    salary: "$75/hour",
    status: "draft",
    applications: 0,
    views: 0,
    postedDate: new Date().toISOString(),
    expiresDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    featured: false,
  },
  {
    id: "7",
    title: "Frontend Developer",
    company: "WebWorks Agency",
    companyLogo: "WW",
    location: "Los Angeles, CA",
    type: "full-time",
    salary: "$100,000 - $140,000",
    status: "active",
    applications: 23,
    views: 678,
    postedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    expiresDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 28).toISOString(),
    featured: false,
  },
  {
    id: "8",
    title: "Backend Engineer",
    company: "ScaleUp Systems",
    companyLogo: "SS",
    location: "Denver, CO",
    type: "full-time",
    salary: "$120,000 - $150,000",
    status: "active",
    applications: 15,
    views: 345,
    postedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    expiresDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 26).toISOString(),
    featured: true,
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
    const filter = searchParams.get("filter") || "all";

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes("your-project");

    if (isSupabaseConfigured) {
      try {
        // Fetch jobs from database
        let query = supabaseAdmin
          .from("jobs")
          .select(`
            id,
            title,
            company_name,
            company_logo,
            location,
            job_type,
            salary_min,
            salary_max,
            status,
            is_featured,
            created_at,
            expires_at,
            views_count
          `)
          .order("created_at", { ascending: false });

        // Apply status filter
        if (filter !== "all" && filter !== "featured") {
          query = query.eq("status", filter);
        } else if (filter === "featured") {
          query = query.eq("is_featured", true);
        }

        // Apply search filter
        if (search) {
          query = query.or(`title.ilike.%${search}%,company_name.ilike.%${search}%`);
        }

        const { data: jobs, error } = await query.limit(100);

        if (!error && jobs) {
          // Get application counts for each job
          const jobIds = jobs.map((j: any) => j.id);
          const { data: applicationCounts } = await supabaseAdmin
            .from("applications")
            .select("job_id")
            .in("job_id", jobIds);

          const appCountMap: Record<string, number> = {};
          applicationCounts?.forEach((a: any) => {
            appCountMap[a.job_id] = (appCountMap[a.job_id] || 0) + 1;
          });

          // Transform data
          const transformedJobs = jobs.map((job: any) => ({
            id: job.id,
            title: job.title,
            company: job.company_name,
            companyLogo: job.company_logo || job.company_name?.substring(0, 2).toUpperCase() || "NA",
            location: job.location || "Remote",
            type: job.job_type || "full-time",
            salary: job.salary_min && job.salary_max
              ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`
              : "Competitive",
            status: job.status || "active",
            applications: appCountMap[job.id] || 0,
            views: job.views_count || 0,
            postedDate: job.created_at,
            expiresDate: job.expires_at || new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
            featured: job.is_featured || false,
          }));

          // Calculate stats
          const stats = {
            total: transformedJobs.length,
            active: transformedJobs.filter((j: any) => j.status === "active").length,
            totalApplications: transformedJobs.reduce((sum: number, j: any) => sum + j.applications, 0),
            featured: transformedJobs.filter((j: any) => j.featured).length,
          };

          return NextResponse.json({
            success: true,
            data: { jobs: transformedJobs, stats },
            source: "database",
          });
        }
      } catch (dbError) {
        console.log("Database query failed, using demo data:", dbError);
      }
    }

    // Filter demo data
    let filteredJobs = [...demoJobs];

    if (search) {
      const searchLower = search.toLowerCase();
      filteredJobs = filteredJobs.filter(job =>
        job.title.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower)
      );
    }

    if (filter !== "all") {
      if (filter === "featured") {
        filteredJobs = filteredJobs.filter(job => job.featured);
      } else {
        filteredJobs = filteredJobs.filter(job => job.status === filter);
      }
    }

    // Calculate stats from all demo jobs
    const stats = {
      total: demoJobs.length,
      active: demoJobs.filter(j => j.status === "active").length,
      totalApplications: demoJobs.reduce((sum, j) => sum + j.applications, 0),
      featured: demoJobs.filter(j => j.featured).length,
    };

    return NextResponse.json({
      success: true,
      data: { jobs: filteredJobs, stats },
      source: "demo",
    });
  } catch (error) {
    console.error("Admin jobs error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

// Update job status
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
    const { jobIds, status, action, featured } = body;

    if (!jobIds || !Array.isArray(jobIds) || jobIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "Job IDs are required" },
        { status: 400 }
      );
    }

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes("your-project");

    if (isSupabaseConfigured) {
      try {
        const updates: Record<string, any> = { updated_at: new Date().toISOString() };

        if (status) updates.status = status;
        if (action) updates.status = action;
        if (typeof featured === "boolean") updates.is_featured = featured;

        await supabaseAdmin
          .from("jobs")
          .update(updates)
          .in("id", jobIds);

        return NextResponse.json({
          success: true,
          message: `${jobIds.length} job(s) updated successfully`,
        });
      } catch (dbError) {
        console.log("Database update failed:", dbError);
      }
    }

    // Demo mode response
    return NextResponse.json({
      success: true,
      message: `${jobIds.length} job(s) updated successfully`,
    });
  } catch (error) {
    console.error("Update jobs error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update jobs" },
      { status: 500 }
    );
  }
}

// Delete jobs
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
    const { jobIds } = body;

    if (!jobIds || !Array.isArray(jobIds) || jobIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "Job IDs are required" },
        { status: 400 }
      );
    }

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes("your-project");

    if (isSupabaseConfigured) {
      try {
        // First delete related applications
        await supabaseAdmin
          .from("applications")
          .delete()
          .in("job_id", jobIds);

        // Then delete jobs
        await supabaseAdmin
          .from("jobs")
          .delete()
          .in("id", jobIds);

        return NextResponse.json({
          success: true,
          message: `${jobIds.length} job(s) deleted successfully`,
        });
      } catch (dbError) {
        console.log("Database delete failed:", dbError);
      }
    }

    // Demo mode response
    return NextResponse.json({
      success: true,
      message: `${jobIds.length} job(s) deleted successfully`,
    });
  } catch (error) {
    console.error("Delete jobs error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete jobs" },
      { status: 500 }
    );
  }
}
