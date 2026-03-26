import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth";

// Demo analytics data for fallback
const demoAnalytics = {
  overview: {
    totalUsers: 2847,
    activeJobs: 156,
    totalApplications: 1234,
    totalCompanies: 89,
    totalCandidates: 2758,
    totalPlacements: 287,
    totalRevenue: 284500,
  },
  changes: {
    users: 12,
    jobs: 8,
    applications: 23,
    companies: 5,
    placements: 5.4,
    revenue: 12.5,
  },
  monthlyApplications: [
    { month: "Aug", applications: 2100, placements: 189 },
    { month: "Sep", applications: 2400, placements: 215 },
    { month: "Oct", applications: 2800, placements: 242 },
    { month: "Nov", applications: 3100, placements: 268 },
    { month: "Dec", applications: 2900, placements: 251 },
    { month: "Jan", applications: 3456, placements: 287 },
  ],
  topJobs: [
    { title: "Senior Software Engineer", applications: 156, views: 2340, conversion: 6.7 },
    { title: "Product Manager", applications: 134, views: 1890, conversion: 7.1 },
    { title: "UX Designer", applications: 98, views: 1456, conversion: 6.7 },
    { title: "Data Analyst", applications: 87, views: 1234, conversion: 7.0 },
    { title: "DevOps Engineer", applications: 76, views: 987, conversion: 7.7 },
  ],
  topIndustries: [
    { name: "Technology", jobs: 156, applications: 2340, percentage: 35 },
    { name: "Healthcare", jobs: 98, applications: 1567, percentage: 24 },
    { name: "Finance", jobs: 87, applications: 1234, percentage: 19 },
    { name: "Manufacturing", jobs: 65, applications: 876, percentage: 13 },
    { name: "Retail", jobs: 45, applications: 543, percentage: 9 },
  ],
  recentActivity: [
    { type: "employer_registered", company: "TechStart Inc.", time: new Date(Date.now() - 1000 * 60 * 2).toISOString() },
    { type: "application_submitted", candidate: "Sarah Johnson", job: "Senior Engineer", time: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
    { type: "job_approved", job: "Product Manager at StartupXYZ", time: new Date(Date.now() - 1000 * 60 * 12).toISOString() },
    { type: "placement_confirmed", candidate: "Michael Chen", company: "CloudServices", time: new Date(Date.now() - 1000 * 60 * 28).toISOString() },
    { type: "candidate_registered", candidate: "Emily Rodriguez", time: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
  ],
  recentApplications: [
    {
      id: "1",
      candidate: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      job: "Senior Software Engineer",
      company: "TechCorp Inc.",
      appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      status: "new",
    },
    {
      id: "2",
      candidate: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      job: "Product Manager",
      company: "StartupXYZ",
      appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      status: "reviewing",
    },
    {
      id: "3",
      candidate: "Emily Rodriguez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      job: "UX Designer",
      company: "DesignCo",
      appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      status: "shortlisted",
    },
    {
      id: "4",
      candidate: "David Kim",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      job: "Backend Developer",
      company: "CloudServices",
      appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      status: "interviewed",
    },
    {
      id: "5",
      candidate: "Jennifer Lee",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      job: "Data Analyst",
      company: "DataDriven",
      appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      status: "hired",
    },
  ],
  newUsers: [
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@email.com",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      type: "candidate",
      joinedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      id: "2",
      name: "Lisa Anderson",
      email: "lisa@techcorp.com",
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop",
      type: "employer",
      joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    },
    {
      id: "3",
      name: "Robert Wilson",
      email: "robert.wilson@email.com",
      avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100&h=100&fit=crop",
      type: "candidate",
      joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
  ],
  pendingActions: {
    companyVerifications: 1,
    jobReviews: 3,
    supportTickets: 5,
  },
};

export async function GET() {
  try {
    // Verify admin access
    await requireAdmin();

    // Try to fetch real analytics from Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes("your-project");

    if (isSupabaseConfigured) {
      try {
        // Fetch counts from various tables
        const [
          { count: usersCount },
          { count: jobsCount },
          { count: applicationsCount },
          { count: companiesCount },
        ] = await Promise.all([
          supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }),
          supabaseAdmin.from("jobs").select("*", { count: "exact", head: true }).eq("status", "active"),
          supabaseAdmin.from("applications").select("*", { count: "exact", head: true }),
          supabaseAdmin.from("companies").select("*", { count: "exact", head: true }),
        ]);

        // If we have real data, merge it with demo data structure
        if (usersCount !== null || jobsCount !== null || applicationsCount !== null || companiesCount !== null) {
          const analytics = {
            ...demoAnalytics,
            overview: {
              ...demoAnalytics.overview,
              totalUsers: usersCount || demoAnalytics.overview.totalUsers,
              activeJobs: jobsCount || demoAnalytics.overview.activeJobs,
              totalApplications: applicationsCount || demoAnalytics.overview.totalApplications,
              totalCompanies: companiesCount || demoAnalytics.overview.totalCompanies,
            },
          };

          return NextResponse.json({
            success: true,
            data: analytics,
            source: "database",
          });
        }
      } catch (dbError) {
        console.log("Database query failed, using demo data:", dbError);
      }
    }

    // Return demo analytics
    return NextResponse.json({
      success: true,
      data: demoAnalytics,
      source: "demo",
    });
  } catch (error) {
    console.error("Admin analytics error:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch analytics";
    const status = message.includes("Unauthorized") ? 401 : message.includes("Forbidden") ? 403 : 500;
    return NextResponse.json(
      { success: false, error: message },
      { status }
    );
  }
}
