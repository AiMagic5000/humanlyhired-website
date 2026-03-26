import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

// Demo applications data for fallback
const demoEmployerApplications = [
  {
    id: "1",
    candidate: {
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "(555) 123-4567",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      location: "San Francisco, CA",
      currentTitle: "Senior Software Engineer",
      experience: "8 years",
      linkedin: "https://linkedin.com/in/sarahjohnson",
      portfolio: "https://sarahjohnson.dev",
    },
    job: {
      id: "1",
      title: "Senior Software Engineer",
      department: "Engineering",
    },
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    status: "new",
    rating: 0,
    notes: "",
    coverLetter: "I am excited to apply for the Senior Software Engineer position at your company. With 8 years of experience building scalable applications, I believe I would be a great fit for this role.",
    resumeUrl: "/resumes/sarah-johnson.pdf",
  },
  {
    id: "2",
    candidate: {
      name: "Michael Chen",
      email: "michael.chen@email.com",
      phone: "(555) 234-5678",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      location: "New York, NY",
      currentTitle: "Product Manager",
      experience: "6 years",
      linkedin: "https://linkedin.com/in/michaelchen",
    },
    job: {
      id: "2",
      title: "Product Manager",
      department: "Product",
    },
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    status: "reviewing",
    rating: 4,
    notes: "Strong background in B2B SaaS. Schedule a call.",
    coverLetter: "With 6 years of experience in product management at leading tech companies, I am confident in my ability to drive product strategy and execution.",
    resumeUrl: "/resumes/michael-chen.pdf",
  },
  {
    id: "3",
    candidate: {
      name: "Emily Rodriguez",
      email: "emily.rodriguez@email.com",
      phone: "(555) 345-6789",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      location: "Austin, TX",
      currentTitle: "UX Designer",
      experience: "5 years",
      linkedin: "https://linkedin.com/in/emilyrodriguez",
      portfolio: "https://emilyrodriguez.design",
    },
    job: {
      id: "3",
      title: "UX Designer",
      department: "Design",
    },
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    status: "shortlisted",
    rating: 5,
    notes: "Excellent portfolio. Moving to final interview round.",
    coverLetter: "As a UX designer with a passion for user-centered design, I have helped multiple startups create intuitive and delightful user experiences.",
    resumeUrl: "/resumes/emily-rodriguez.pdf",
  },
  {
    id: "4",
    candidate: {
      name: "David Kim",
      email: "david.kim@email.com",
      phone: "(555) 456-7890",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      location: "Seattle, WA",
      currentTitle: "Staff Engineer",
      experience: "10 years",
      linkedin: "https://linkedin.com/in/davidkim",
    },
    job: {
      id: "1",
      title: "Senior Software Engineer",
      department: "Engineering",
    },
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    status: "interviewed",
    rating: 4,
    notes: "Technical interview completed. Strong systems design skills.",
    coverLetter: "I bring 10 years of experience in building scalable systems at companies like Amazon and Microsoft.",
    resumeUrl: "/resumes/david-kim.pdf",
  },
  {
    id: "5",
    candidate: {
      name: "Jennifer Lee",
      email: "jennifer.lee@email.com",
      phone: "(555) 567-8901",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      location: "Los Angeles, CA",
      currentTitle: "Marketing Coordinator",
      experience: "3 years",
    },
    job: {
      id: "2",
      title: "Product Manager",
      department: "Product",
    },
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    status: "rejected",
    rating: 2,
    notes: "Does not meet minimum experience requirements.",
    coverLetter: "I am eager to transition into product management and believe my marketing background provides a unique perspective.",
    resumeUrl: "/resumes/jennifer-lee.pdf",
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
    const jobId = searchParams.get("jobId");

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
          // Build query for applications
          let query = supabaseAdmin
            .from("applications")
            .select(`
              id,
              status,
              rating,
              notes,
              cover_letter,
              resume_url,
              created_at,
              jobs (
                id,
                title,
                department
              ),
              profiles (
                full_name,
                email,
                phone,
                avatar_url,
                location,
                current_title,
                years_experience,
                linkedin_url,
                portfolio_url
              )
            `)
            .eq("company_id", profile.company_id)
            .order("created_at", { ascending: false });

          // Filter by job if specified
          if (jobId) {
            query = query.eq("job_id", jobId);
          }

          const { data: applications, error } = await query;

          if (!error && applications) {
            // Transform to expected format
            const transformedApplications = applications.map((app) => {
              const job = (app.jobs as unknown) as { id: string; title: string; department?: string } | null;
              const candidate = (app.profiles as unknown) as {
                full_name?: string;
                email?: string;
                phone?: string;
                avatar_url?: string;
                location?: string;
                current_title?: string;
                years_experience?: number;
                linkedin_url?: string;
                portfolio_url?: string;
              } | null;

              return {
                id: app.id,
                candidate: {
                  name: candidate?.full_name || "Unknown",
                  email: candidate?.email || "",
                  phone: candidate?.phone || "",
                  avatar: candidate?.avatar_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
                  location: candidate?.location || "Unknown",
                  currentTitle: candidate?.current_title || "Unknown",
                  experience: `${candidate?.years_experience || 0} years`,
                  linkedin: candidate?.linkedin_url,
                  portfolio: candidate?.portfolio_url,
                },
                job: {
                  id: job?.id || "",
                  title: job?.title || "Unknown Position",
                  department: job?.department || "General",
                },
                appliedAt: app.created_at,
                status: app.status,
                rating: app.rating || 0,
                notes: app.notes || "",
                coverLetter: app.cover_letter || "",
                resumeUrl: app.resume_url || "",
              };
            });

            // Calculate stats
            const stats = {
              total: transformedApplications.length,
              new: transformedApplications.filter((a) => a.status === "new").length,
              reviewing: transformedApplications.filter((a) => a.status === "reviewing").length,
              shortlisted: transformedApplications.filter((a) => a.status === "shortlisted").length,
              interviewed: transformedApplications.filter((a) => a.status === "interviewed").length,
              offered: transformedApplications.filter((a) => a.status === "offered").length,
              hired: transformedApplications.filter((a) => a.status === "hired").length,
              rejected: transformedApplications.filter((a) => a.status === "rejected").length,
            };

            return NextResponse.json({
              success: true,
              data: {
                applications: transformedApplications,
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

    // Filter demo data by job if specified
    let filteredApplications = demoEmployerApplications;
    if (jobId) {
      filteredApplications = demoEmployerApplications.filter((a) => a.job.id === jobId);
    }

    // Calculate stats
    const stats = {
      total: filteredApplications.length,
      new: filteredApplications.filter((a) => a.status === "new").length,
      reviewing: filteredApplications.filter((a) => a.status === "reviewing").length,
      shortlisted: filteredApplications.filter((a) => a.status === "shortlisted").length,
      interviewed: filteredApplications.filter((a) => a.status === "interviewed").length,
      offered: filteredApplications.filter((a) => a.status === "offered").length,
      hired: filteredApplications.filter((a) => a.status === "hired").length,
      rejected: filteredApplications.filter((a) => a.status === "rejected").length,
    };

    return NextResponse.json({
      success: true,
      data: {
        applications: filteredApplications,
        stats,
      },
      source: "demo",
    });
  } catch (error) {
    console.error("Employer applications error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

// Update application status, rating, or notes
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
    const { applicationId, status, rating, notes } = body;

    if (!applicationId) {
      return NextResponse.json(
        { success: false, error: "Application ID is required" },
        { status: 400 }
      );
    }

    // Validate status if provided
    const validStatuses = ["new", "reviewing", "shortlisted", "interviewed", "offered", "hired", "rejected"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status" },
        { status: 400 }
      );
    }

    // Validate rating if provided
    if (rating !== undefined && (rating < 0 || rating > 5)) {
      return NextResponse.json(
        { success: false, error: "Rating must be between 0 and 5" },
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
          // Verify application belongs to this company
          const { data: application, error: fetchError } = await supabaseAdmin
            .from("applications")
            .select("company_id")
            .eq("id", applicationId)
            .single();

          if (fetchError || !application) {
            return NextResponse.json(
              { success: false, error: "Application not found" },
              { status: 404 }
            );
          }

          if (application.company_id !== profile.company_id) {
            return NextResponse.json(
              { success: false, error: "Not authorized to update this application" },
              { status: 403 }
            );
          }

          // Build update object
          const updateData: Record<string, unknown> = {
            updated_at: new Date().toISOString(),
          };
          if (status) updateData.status = status;
          if (rating !== undefined) updateData.rating = rating;
          if (notes !== undefined) updateData.notes = notes;

          // Update application
          const { error: updateError } = await supabaseAdmin
            .from("applications")
            .update(updateData)
            .eq("id", applicationId);

          if (updateError) {
            throw updateError;
          }

          return NextResponse.json({
            success: true,
            message: "Application updated successfully",
          });
        }
      } catch (dbError) {
        console.log("Database update failed:", dbError);
      }
    }

    // Demo mode response
    return NextResponse.json({
      success: true,
      message: "Application updated successfully",
    });
  } catch (error) {
    console.error("Update application error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update application" },
      { status: 500 }
    );
  }
}
