import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

interface DashboardStats {
  applications: number;
  savedJobs: number;
  profileViews: number;
  interviewInvites: number;
}

interface RecentApplication {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  appliedDate: string;
  status: string;
}

interface RecommendedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  posted: string;
}

// Demo data for fallback
const demoStats: DashboardStats = {
  applications: 12,
  savedJobs: 8,
  profileViews: 47,
  interviewInvites: 3,
};

const demoRecentApplications: RecentApplication[] = [
  {
    id: "1",
    jobTitle: "Senior Software Engineer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    appliedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    status: "reviewing",
  },
  {
    id: "2",
    jobTitle: "Full Stack Developer",
    company: "StartupXYZ",
    location: "Remote",
    appliedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    status: "interviewing",
  },
  {
    id: "3",
    jobTitle: "Frontend Developer",
    company: "DesignHub",
    location: "New York, NY",
    appliedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    status: "pending",
  },
  {
    id: "4",
    jobTitle: "DevOps Engineer",
    company: "CloudSystems",
    location: "Seattle, WA",
    appliedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    status: "rejected",
  },
];

const demoRecommendedJobs: RecommendedJob[] = [
  {
    id: "1",
    title: "Senior React Developer",
    company: "InnovateTech",
    location: "Austin, TX",
    salary: "$140,000 - $180,000",
    type: "Full-time",
    posted: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: "2",
    title: "Lead Software Architect",
    company: "Enterprise Solutions",
    location: "Remote",
    salary: "$160,000 - $200,000",
    type: "Full-time",
    posted: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: "3",
    title: "Backend Engineer",
    company: "DataDriven Co",
    location: "Chicago, IL",
    salary: "$120,000 - $150,000",
    type: "Full-time",
    posted: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
  },
];

function formatPostedDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} week${Math.floor(diffInDays / 7) > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

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
        // Fetch user's stats
        const [applicationsResult, savedJobsResult, profileResult] = await Promise.all([
          supabaseAdmin
            .from("applications")
            .select("id, status")
            .eq("user_id", userId),
          supabaseAdmin
            .from("saved_jobs")
            .select("id")
            .eq("user_id", userId),
          supabaseAdmin
            .from("profiles")
            .select("profile_views")
            .eq("user_id", userId)
            .single(),
        ]);

        const applications = applicationsResult.data || [];
        const savedJobs = savedJobsResult.data || [];
        const profileViews = profileResult.data?.profile_views || 0;
        const interviewInvites = applications.filter((a) => a.status === "interviewing").length;

        // Fetch recent applications with job details
        const { data: recentApps } = await supabaseAdmin
          .from("applications")
          .select(`
            id,
            status,
            created_at,
            jobs (
              title,
              company_name,
              location
            )
          `)
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(4);

        const transformedApplications: RecentApplication[] = (recentApps || []).map((app) => {
          const job = (app.jobs as unknown) as { title?: string; company_name?: string; location?: string } | null;
          return {
            id: app.id,
            jobTitle: job?.title || "Unknown Position",
            company: job?.company_name || "Unknown Company",
            location: job?.location || "Unknown Location",
            appliedDate: app.created_at,
            status: app.status,
          };
        });

        // Fetch recommended jobs (active jobs)
        const { data: jobs } = await supabaseAdmin
          .from("jobs")
          .select("id, title, company_name, location, salary_range, employment_type, created_at")
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(3);

        const transformedJobs: RecommendedJob[] = (jobs || []).map((job) => ({
          id: job.id,
          title: job.title,
          company: job.company_name || "Unknown Company",
          location: job.location || "Unknown Location",
          salary: job.salary_range || "Competitive",
          type: job.employment_type || "Full-time",
          posted: formatPostedDate(job.created_at),
        }));

        return NextResponse.json({
          success: true,
          data: {
            stats: {
              applications: applications.length,
              savedJobs: savedJobs.length,
              profileViews,
              interviewInvites,
            },
            recentApplications: transformedApplications.length > 0 ? transformedApplications : demoRecentApplications.map((a) => ({
              ...a,
              appliedDate: formatPostedDate(a.appliedDate),
            })),
            recommendedJobs: transformedJobs.length > 0 ? transformedJobs : demoRecommendedJobs.map((j) => ({
              ...j,
              posted: formatPostedDate(j.posted),
            })),
          },
          source: "database",
        });
      } catch (dbError) {
        console.log("Database query failed, using demo data:", dbError);
      }
    }

    // Return demo data with formatted dates
    return NextResponse.json({
      success: true,
      data: {
        stats: demoStats,
        recentApplications: demoRecentApplications.map((a) => ({
          ...a,
          appliedDate: formatPostedDate(a.appliedDate),
        })),
        recommendedJobs: demoRecommendedJobs.map((j) => ({
          ...j,
          posted: formatPostedDate(j.posted),
        })),
      },
      source: "demo",
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
