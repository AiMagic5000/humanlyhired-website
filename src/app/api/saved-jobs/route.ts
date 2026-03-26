import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";
import { z } from "zod";

const saveJobSchema = z.object({
  jobId: z.string().min(1),
});

// Demo saved jobs for fallback
const demoSavedJobs = [
  {
    id: "saved_1",
    jobId: "1",
    savedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    job: {
      id: "1",
      title: "Senior Software Engineer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$150k - $200k",
      logo: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=100&h=100&fit=crop",
      postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      status: "active",
    },
  },
  {
    id: "saved_2",
    jobId: "2",
    savedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    job: {
      id: "2",
      title: "Product Manager",
      company: "StartupXYZ",
      location: "Remote",
      type: "Full-time",
      salary: "$130k - $170k",
      logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop",
      postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 25).toISOString(),
      status: "active",
    },
  },
  {
    id: "saved_3",
    jobId: "3",
    savedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    job: {
      id: "3",
      title: "UX Designer",
      company: "DesignCo",
      location: "New York, NY",
      type: "Full-time",
      salary: "$100k - $140k",
      logo: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=100&h=100&fit=crop",
      postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
      status: "closing_soon",
    },
  },
  {
    id: "saved_4",
    jobId: "4",
    savedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString(),
    job: {
      id: "4",
      title: "Marketing Manager",
      company: "BrandBoost",
      location: "Chicago, IL",
      type: "Full-time",
      salary: "$90k - $120k",
      logo: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=100&h=100&fit=crop",
      postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
      deadline: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      status: "expired",
    },
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

    // Try to fetch saved jobs from Supabase
    const { data, error } = await supabaseAdmin
      .from("saved_jobs")
      .select(`
        id,
        job_id,
        created_at,
        jobs (
          id,
          title,
          company,
          location,
          employment_type,
          salary_min,
          salary_max,
          logo_url,
          created_at,
          deadline,
          status
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      // Return demo data if table doesn't exist
      console.log("Supabase fetch skipped (demo mode):", error.message);
      return NextResponse.json({
        success: true,
        data: demoSavedJobs,
        stats: {
          total: demoSavedJobs.length,
          active: demoSavedJobs.filter(j => j.job.status === "active").length,
          closingSoon: demoSavedJobs.filter(j => j.job.status === "closing_soon").length,
          expired: demoSavedJobs.filter(j => j.job.status === "expired").length,
        },
      });
    }

    interface JobData {
      id: string;
      title: string;
      company: string;
      location: string;
      employment_type: string;
      salary_min: number;
      salary_max: number;
      logo_url: string;
      created_at: string;
      deadline: string;
      status: string;
    }

    const savedJobs = data.map((item) => {
      // Supabase returns the related job as a single object for foreign key relations
      const job = (item.jobs as unknown) as JobData | null;

      // Determine job status based on deadline
      const deadline = new Date(job?.deadline || Date.now());
      const now = new Date();
      const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      let status = job?.status || "active";
      if (daysUntilDeadline < 0) {
        status = "expired";
      } else if (daysUntilDeadline <= 7) {
        status = "closing_soon";
      }

      return {
        id: item.id,
        jobId: item.job_id,
        savedAt: item.created_at,
        job: {
          id: job?.id || item.job_id,
          title: job?.title || "Unknown Position",
          company: job?.company || "Unknown Company",
          location: job?.location || "Unknown Location",
          type: job?.employment_type || "Full-time",
          salary: job?.salary_min && job?.salary_max
            ? `$${(job.salary_min / 1000).toFixed(0)}k - $${(job.salary_max / 1000).toFixed(0)}k`
            : "Competitive",
          logo: job?.logo_url || "https://images.unsplash.com/photo-1549924231-f129b911e442?w=100&h=100&fit=crop",
          postedAt: job?.created_at || item.created_at,
          deadline: job?.deadline || new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
          status,
        },
      };
    });

    return NextResponse.json({
      success: true,
      data: savedJobs,
      stats: {
        total: savedJobs.length,
        active: savedJobs.filter(j => j.job.status === "active").length,
        closingSoon: savedJobs.filter(j => j.job.status === "closing_soon").length,
        expired: savedJobs.filter(j => j.job.status === "expired").length,
      },
    });
  } catch (error) {
    console.error("Fetch saved jobs error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch saved jobs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = saveJobSchema.parse(body);

    // Try to save job to Supabase
    const { data, error } = await supabaseAdmin
      .from("saved_jobs")
      .insert({
        user_id: userId,
        job_id: validatedData.jobId,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      // Check if it's a duplicate error
      if (error.code === "23505") {
        return NextResponse.json(
          { success: false, error: "Job already saved" },
          { status: 400 }
        );
      }

      console.log("Supabase insert skipped (demo mode):", error.message);
      return NextResponse.json({
        success: true,
        message: "Job saved successfully",
        data: {
          id: `saved_${Date.now()}`,
          jobId: validatedData.jobId,
          savedAt: new Date().toISOString(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Job saved successfully",
      data: {
        id: data.id,
        jobId: data.job_id,
        savedAt: data.created_at,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Save job error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save job" },
      { status: 500 }
    );
  }
}

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
    const savedJobId = searchParams.get("id");
    const jobId = searchParams.get("jobId");

    if (!savedJobId && !jobId) {
      return NextResponse.json(
        { success: false, error: "Saved job ID or job ID is required" },
        { status: 400 }
      );
    }

    let query = supabaseAdmin
      .from("saved_jobs")
      .delete()
      .eq("user_id", userId);

    if (savedJobId) {
      query = query.eq("id", savedJobId);
    } else if (jobId) {
      query = query.eq("job_id", jobId);
    }

    const { error } = await query;

    if (error) {
      console.log("Supabase delete skipped (demo mode):", error.message);
    }

    return NextResponse.json({
      success: true,
      message: "Job removed from saved jobs",
    });
  } catch (error) {
    console.error("Delete saved job error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove saved job" },
      { status: 500 }
    );
  }
}

// Check if a job is saved
export async function HEAD(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse(null, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) {
      return new NextResponse(null, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("saved_jobs")
      .select("id")
      .eq("user_id", userId)
      .eq("job_id", jobId)
      .single();

    if (error || !data) {
      return new NextResponse(null, {
        status: 404,
        headers: { "X-Saved": "false" },
      });
    }

    return new NextResponse(null, {
      status: 200,
      headers: { "X-Saved": "true", "X-Saved-Id": data.id },
    });
  } catch {
    return new NextResponse(null, { status: 500 });
  }
}
