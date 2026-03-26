import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";
import { sendEmail, sendFormSubmissionEmail, emailTemplates } from "@/lib/email";

const applicationSchema = z.object({
  jobId: z.string(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  linkedin: z.string().url().optional().or(z.literal("")),
  portfolio: z.string().url().optional().or(z.literal("")),
  currentTitle: z.string().min(2),
  yearsExperience: z.string().min(1),
  coverLetter: z.string().min(50),
  whyInterested: z.string().min(20),
  salary: z.string().optional(),
  startDate: z.string().min(1),
  referral: z.string().optional(),
  resumeUrl: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = applicationSchema.parse(body);

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes("your-project");

    let application;

    if (isSupabaseConfigured) {
      // Create application in database
      const { data, error } = await supabaseAdmin
        .from("applications")
        .insert({
          job_id: validatedData.jobId,
          candidate_id: userId,
          status: "pending",
          cover_letter: validatedData.coverLetter,
          resume_url: validatedData.resumeUrl || null,
          answers: {
            firstName: validatedData.firstName,
            lastName: validatedData.lastName,
            email: validatedData.email,
            phone: validatedData.phone,
            linkedin: validatedData.linkedin || "",
            portfolio: validatedData.portfolio || "",
            currentTitle: validatedData.currentTitle,
            yearsExperience: validatedData.yearsExperience,
            whyInterested: validatedData.whyInterested,
            salary: validatedData.salary || "",
            startDate: validatedData.startDate,
            referral: validatedData.referral || "",
          },
        })
        .select()
        .single();

      if (error) {
        console.error("Database error:", error);
        throw new Error("Failed to save application to database");
      }

      application = data;

      // Create notification for the candidate
      await supabaseAdmin.from("notifications").insert({
        user_id: userId,
        type: "application_update",
        title: "Application Submitted",
        message: `Your application has been submitted successfully.`,
        link: `/dashboard/applications`,
        read: false,
      });
    } else {
      // Mock application when database not configured
      application = {
        id: `app_${Date.now()}`,
        job_id: validatedData.jobId,
        candidate_id: userId,
        status: "pending",
        created_at: new Date().toISOString(),
      };
      console.log("Database not configured, using mock application:", application);
    }

    // Send confirmation email to candidate
    try {
      await sendEmail({
        to: validatedData.email,
        ...emailTemplates.applicationConfirmation({
          firstName: validatedData.firstName,
          jobTitle: "Your Applied Position",
          company: "Humanly Hired Partner",
        }),
      });
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't fail the request if email fails
    }

    // Send notification email to admin with JSON attachment
    try {
      const adminEmailHtml = emailTemplates.newApplicationAdmin({
        candidateName: `${validatedData.firstName} ${validatedData.lastName}`,
        candidateEmail: validatedData.email,
        jobTitle: "Job Application",
        applicationId: application.id,
      }).html;

      await sendFormSubmissionEmail(
        "job-application",
        {
          ...validatedData,
          applicationId: application.id,
          submittedAt: new Date().toISOString(),
          formType: "Job Application",
        },
        `New Job Application: ${validatedData.firstName} ${validatedData.lastName}`,
        adminEmailHtml
      );
    } catch (emailError) {
      console.error("Failed to send admin notification:", emailError);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully",
        applicationId: application.id,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid form data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Application submission error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit application" },
      { status: 500 }
    );
  }
}

export async function GET(_request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes("your-project");

    if (isSupabaseConfigured) {
      // Fetch applications from database with job details
      const { data, error } = await supabaseAdmin
        .from("applications")
        .select(`
          id,
          job_id,
          status,
          cover_letter,
          answers,
          created_at,
          updated_at,
          jobs (
            id,
            title,
            company,
            location
          )
        `)
        .eq("candidate_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch applications");
      }

      const applications = data.map((app) => ({
        id: app.id,
        jobId: app.job_id,
        status: app.status,
        createdAt: app.created_at,
        job: app.jobs,
      }));

      return NextResponse.json({ success: true, applications }, { status: 200 });
    }

    // Mock data when database not configured
    const applications = [
      {
        id: "app_1",
        jobId: "1",
        status: "reviewing",
        createdAt: "2025-01-10",
        job: {
          title: "Senior Software Engineer",
          company: "TechCorp Inc.",
          location: "San Francisco, CA",
        },
      },
      {
        id: "app_2",
        jobId: "2",
        status: "interviewing",
        createdAt: "2025-01-08",
        job: {
          title: "Full Stack Developer",
          company: "StartupXYZ",
          location: "Remote",
        },
      },
    ];

    return NextResponse.json({ success: true, applications }, { status: 200 });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { applicationId, status } = body;

    if (!applicationId || !status) {
      return NextResponse.json(
        { success: false, error: "Application ID and status are required" },
        { status: 400 }
      );
    }

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes("your-project");

    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin
        .from("applications")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", applicationId)
        .select()
        .single();

      if (error) {
        console.error("Database error:", error);
        throw new Error("Failed to update application");
      }

      // Create notification for status change
      if (data.candidate_id) {
        await supabaseAdmin.from("notifications").insert({
          user_id: data.candidate_id,
          type: "application_update",
          title: "Application Status Updated",
          message: `Your application status has been updated to: ${status}`,
          link: `/dashboard/applications`,
          read: false,
        });
      }

      return NextResponse.json({ success: true, application: data }, { status: 200 });
    }

    // Mock response when database not configured
    return NextResponse.json(
      { success: true, application: { id: applicationId, status } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update application" },
      { status: 500 }
    );
  }
}
