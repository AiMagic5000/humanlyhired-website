import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";
import { sendEmail, emailTemplates } from "@/lib/email";

const applicationSchema = z.object({
  jobId: z.string(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  monthlyNeed: z.string().min(1),
  monthlyWant: z.string().min(1),
  startDate: z.string().min(1),
  hoursPerWeek: z.string().min(1),
  workPreference: z.string().min(1),
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
      try {
        const { data, error } = await supabaseAdmin
          .from("applications")
          .insert({
            job_id: validatedData.jobId,
            candidate_id: userId,
            status: "pending",
            cover_letter: null,
            resume_url: null,
            answers: {
              firstName: validatedData.firstName,
              lastName: validatedData.lastName,
              email: validatedData.email,
              phone: validatedData.phone,
              monthlyNeed: validatedData.monthlyNeed,
              monthlyWant: validatedData.monthlyWant,
              startDate: validatedData.startDate,
              hoursPerWeek: validatedData.hoursPerWeek,
              workPreference: validatedData.workPreference,
            },
          })
          .select()
          .single();

        if (!error && data) {
          application = data;
        } else {
          console.error("Database insert failed (table may not exist):", error);
          application = {
            id: `app_${Date.now()}`,
            job_id: validatedData.jobId,
            candidate_id: userId,
            status: "pending",
            created_at: new Date().toISOString(),
          };
        }
      } catch (dbErr) {
        console.error("Database error:", dbErr);
        application = {
          id: `app_${Date.now()}`,
          job_id: validatedData.jobId,
          candidate_id: userId,
          status: "pending",
          created_at: new Date().toISOString(),
        };
      }
    } else {
      application = {
        id: `app_${Date.now()}`,
        job_id: validatedData.jobId,
        candidate_id: userId,
        status: "pending",
        created_at: new Date().toISOString(),
      };
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

    // Send admin notification with all application data
    try {
      const adminHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #059669; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">New Job Application</h1>
          </div>
          <div style="background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
            <h2 style="color: #1f2937; margin-top: 0;">Applicant Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold; width: 40%;">Name</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${validatedData.firstName} ${validatedData.lastName}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Email</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${validatedData.email}">${validatedData.email}</a></td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Phone</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><a href="tel:${validatedData.phone}">${validatedData.phone}</a></td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Monthly Need</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${validatedData.monthlyNeed}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Monthly Want</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${validatedData.monthlyWant}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Start Date</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${validatedData.startDate}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Hours/Week</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${validatedData.hoursPerWeek}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Work Preference</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${validatedData.workPreference}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Job Applied For</td><td style="padding: 8px;">${validatedData.jobId}</td></tr>
            </table>
            <p style="color: #6b7280; font-size: 12px; margin-top: 16px;">Submitted: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `;

      await sendEmail({
        to: "support@humanlyhired.com",
        subject: "New Application: " + validatedData.firstName + " " + validatedData.lastName,
        html: adminHtml,
      });
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
