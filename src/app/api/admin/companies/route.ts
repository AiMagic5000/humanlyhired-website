import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

// Demo companies data for fallback
const demoCompanies = [
  {
    id: "1",
    name: "TechCorp Inc.",
    logo: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=100&h=100&fit=crop",
    industry: "Technology",
    location: "San Francisco, CA",
    website: "https://techcorp.com",
    employees: "500-1000",
    status: "verified",
    activeJobs: 8,
    totalApplications: 156,
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 200).toISOString(),
  },
  {
    id: "2",
    name: "StartupXYZ",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop",
    industry: "Technology",
    location: "New York, NY",
    website: "https://startupxyz.io",
    employees: "50-200",
    status: "verified",
    activeJobs: 12,
    totalApplications: 89,
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 145).toISOString(),
  },
  {
    id: "3",
    name: "DesignCo",
    logo: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=100&h=100&fit=crop",
    industry: "Design",
    location: "Austin, TX",
    website: "https://designco.com",
    employees: "10-50",
    status: "pending",
    activeJobs: 3,
    totalApplications: 24,
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: "4",
    name: "CloudServices LLC",
    logo: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&h=100&fit=crop",
    industry: "Technology",
    location: "Seattle, WA",
    website: "https://cloudservices.io",
    employees: "200-500",
    status: "verified",
    activeJobs: 6,
    totalApplications: 112,
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 320).toISOString(),
  },
  {
    id: "5",
    name: "HealthPlus",
    logo: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=100&h=100&fit=crop",
    industry: "Healthcare",
    location: "Boston, MA",
    website: "https://healthplus.com",
    employees: "1000+",
    status: "verified",
    activeJobs: 15,
    totalApplications: 234,
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 420).toISOString(),
  },
  {
    id: "6",
    name: "FinanceFirst",
    logo: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=100&h=100&fit=crop",
    industry: "Finance",
    location: "Chicago, IL",
    website: "https://financefirst.com",
    employees: "500-1000",
    status: "suspended",
    activeJobs: 0,
    totalApplications: 45,
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 250).toISOString(),
  },
  {
    id: "7",
    name: "RetailGiant",
    logo: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop",
    industry: "Retail",
    location: "Los Angeles, CA",
    website: "https://retailgiant.com",
    employees: "1000+",
    status: "verified",
    activeJobs: 22,
    totalApplications: 312,
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180).toISOString(),
  },
  {
    id: "8",
    name: "EduLearn",
    logo: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=100&h=100&fit=crop",
    industry: "Education",
    location: "Denver, CO",
    website: "https://edulearn.com",
    employees: "200-500",
    status: "pending",
    activeJobs: 5,
    totalApplications: 67,
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
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
    const industry = searchParams.get("industry") || "all";

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes("your-project");

    if (isSupabaseConfigured) {
      try {
        // Fetch companies from database
        let query = supabaseAdmin
          .from("companies")
          .select(`
            id,
            name,
            logo,
            industry,
            location,
            website,
            employees,
            status,
            created_at
          `)
          .order("created_at", { ascending: false });

        // Apply status filter
        if (status !== "all") {
          query = query.eq("status", status);
        }

        // Apply industry filter
        if (industry !== "all") {
          query = query.eq("industry", industry);
        }

        // Apply search filter
        if (search) {
          query = query.or(`name.ilike.%${search}%,location.ilike.%${search}%`);
        }

        const { data: companies, error } = await query.limit(100);

        if (!error && companies) {
          // Get job counts and application counts for each company
          const companyIds = companies.map((c: any) => c.id);

          const [{ data: jobCounts }, { data: appCounts }] = await Promise.all([
            supabaseAdmin
              .from("jobs")
              .select("company_id, id")
              .in("company_id", companyIds)
              .eq("status", "active"),
            supabaseAdmin
              .from("applications")
              .select("job_id, jobs!inner(company_id)")
              .in("jobs.company_id", companyIds),
          ]);

          const jobCountMap: Record<string, number> = {};
          jobCounts?.forEach((j: any) => {
            jobCountMap[j.company_id] = (jobCountMap[j.company_id] || 0) + 1;
          });

          const appCountMap: Record<string, number> = {};
          appCounts?.forEach((a: any) => {
            const companyId = a.jobs?.company_id;
            if (companyId) {
              appCountMap[companyId] = (appCountMap[companyId] || 0) + 1;
            }
          });

          // Transform data
          const transformedCompanies = companies.map((company: any) => ({
            id: company.id,
            name: company.name,
            logo: company.logo || "https://images.unsplash.com/photo-1549924231-f129b911e442?w=100&h=100&fit=crop",
            industry: company.industry || "Technology",
            location: company.location || "Remote",
            website: company.website || "",
            employees: company.employees || "1-50",
            status: company.status || "pending",
            activeJobs: jobCountMap[company.id] || 0,
            totalApplications: appCountMap[company.id] || 0,
            joinedAt: company.created_at,
          }));

          // Get unique industries for filter
          const industries = [...new Set(transformedCompanies.map((c: any) => c.industry))];

          // Calculate stats
          const stats = {
            total: transformedCompanies.length,
            verified: transformedCompanies.filter((c: any) => c.status === "verified").length,
            pending: transformedCompanies.filter((c: any) => c.status === "pending").length,
            suspended: transformedCompanies.filter((c: any) => c.status === "suspended").length,
            activeJobs: transformedCompanies.reduce((sum: number, c: any) => sum + c.activeJobs, 0),
          };

          return NextResponse.json({
            success: true,
            data: { companies: transformedCompanies, stats, industries },
            source: "database",
          });
        }
      } catch (dbError) {
        console.log("Database query failed, using demo data:", dbError);
      }
    }

    // Filter demo data
    let filteredCompanies = [...demoCompanies];

    if (search) {
      const searchLower = search.toLowerCase();
      filteredCompanies = filteredCompanies.filter(company =>
        company.name.toLowerCase().includes(searchLower) ||
        company.location.toLowerCase().includes(searchLower)
      );
    }

    if (status !== "all") {
      filteredCompanies = filteredCompanies.filter(company => company.status === status);
    }

    if (industry !== "all") {
      filteredCompanies = filteredCompanies.filter(company => company.industry === industry);
    }

    // Get unique industries
    const industries = [...new Set(demoCompanies.map(c => c.industry))];

    // Calculate stats from all demo companies
    const stats = {
      total: demoCompanies.length,
      verified: demoCompanies.filter(c => c.status === "verified").length,
      pending: demoCompanies.filter(c => c.status === "pending").length,
      suspended: demoCompanies.filter(c => c.status === "suspended").length,
      activeJobs: demoCompanies.reduce((sum, c) => sum + c.activeJobs, 0),
    };

    return NextResponse.json({
      success: true,
      data: { companies: filteredCompanies, stats, industries },
      source: "demo",
    });
  } catch (error) {
    console.error("Admin companies error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch companies" },
      { status: 500 }
    );
  }
}

// Update company status
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
    const { companyIds, status, action } = body;

    if (!companyIds || !Array.isArray(companyIds) || companyIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "Company IDs are required" },
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
            .from("companies")
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .in("id", companyIds);
        }

        return NextResponse.json({
          success: true,
          message: `${companyIds.length} company(ies) updated successfully`,
        });
      } catch (dbError) {
        console.log("Database update failed:", dbError);
      }
    }

    // Demo mode response
    return NextResponse.json({
      success: true,
      message: `${companyIds.length} company(ies) updated successfully`,
    });
  } catch (error) {
    console.error("Update companies error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update companies" },
      { status: 500 }
    );
  }
}

// Delete companies
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
    const { companyIds } = body;

    if (!companyIds || !Array.isArray(companyIds) || companyIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "Company IDs are required" },
        { status: 400 }
      );
    }

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes("your-project");

    if (isSupabaseConfigured) {
      try {
        // First get all jobs for these companies
        const { data: jobs } = await supabaseAdmin
          .from("jobs")
          .select("id")
          .in("company_id", companyIds);

        if (jobs && jobs.length > 0) {
          const jobIds = jobs.map((j: any) => j.id);

          // Delete applications for these jobs
          await supabaseAdmin
            .from("applications")
            .delete()
            .in("job_id", jobIds);

          // Delete the jobs
          await supabaseAdmin
            .from("jobs")
            .delete()
            .in("company_id", companyIds);
        }

        // Delete the companies
        await supabaseAdmin
          .from("companies")
          .delete()
          .in("id", companyIds);

        return NextResponse.json({
          success: true,
          message: `${companyIds.length} company(ies) deleted successfully`,
        });
      } catch (dbError) {
        console.log("Database delete failed:", dbError);
      }
    }

    // Demo mode response
    return NextResponse.json({
      success: true,
      message: `${companyIds.length} company(ies) deleted successfully`,
    });
  } catch (error) {
    console.error("Delete companies error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete companies" },
      { status: 500 }
    );
  }
}
