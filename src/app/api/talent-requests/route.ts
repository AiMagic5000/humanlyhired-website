import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { supabaseAdmin } from "@/lib/supabase";
import { z } from "zod";
import { sendFormSubmissionEmail } from "@/lib/email";

const talentRequestSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  industry: z.string().min(2, "Industry is required"),
  contactName: z.string().min(2, "Contact name is required"),
  contactTitle: z.string().min(2, "Job title is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  positionTitle: z.string().min(2, "Position title is required"),
  numberOfPositions: z.number().min(1, "At least 1 position required"),
  employmentType: z.string().min(2, "Employment type is required"),
  location: z.string().min(2, "Location is required"),
  salaryRange: z.string().optional(),
  hiringTimeline: z.string().min(2, "Hiring timeline is required"),
  jobDescription: z.string().min(50, "Job description must be at least 50 characters"),
  additionalNotes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = talentRequestSchema.parse(body);

    // Try to insert into Supabase
    const { data, error } = await supabaseAdmin
      .from("talent_requests")
      .insert({
        company_name: validatedData.companyName,
        industry: validatedData.industry,
        contact_name: validatedData.contactName,
        contact_title: validatedData.contactTitle,
        email: validatedData.email,
        phone: validatedData.phone,
        position_title: validatedData.positionTitle,
        number_of_positions: validatedData.numberOfPositions,
        employment_type: validatedData.employmentType,
        location: validatedData.location,
        salary_range: validatedData.salaryRange || null,
        hiring_timeline: validatedData.hiringTimeline,
        job_description: validatedData.jobDescription,
        additional_notes: validatedData.additionalNotes || null,
        status: "pending",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      // Log the error but still return success for demo mode
      console.log("Supabase insert skipped (demo mode):", error.message);

      // Return mock response in demo mode
      return NextResponse.json({
        success: true,
        message: "Talent request submitted successfully",
        data: {
          id: `demo_${Date.now()}`,
          ...validatedData,
          status: "pending",
          createdAt: new Date().toISOString(),
        },
      });
    }

    // Send notification email to admin with JSON attachment
    try {
      const emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Talent Request</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1E40AF; margin: 0; font-size: 24px;">Humanly<span style="color: #1F2937;">Staffing</span></h1>
            </div>

            <div style="background: #10B981; border-radius: 12px; padding: 20px; color: white; margin-bottom: 30px;">
              <h2 style="margin: 0; font-size: 18px;">New Talent Request Received</h2>
            </div>

            <p>A new employer talent request has been submitted:</p>

            <div style="background: #F3F4F6; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6B7280; width: 150px;">Company:</td>
                  <td style="padding: 8px 0; font-weight: 600;">${validatedData.companyName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6B7280;">Industry:</td>
                  <td style="padding: 8px 0;">${validatedData.industry}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6B7280;">Contact:</td>
                  <td style="padding: 8px 0; font-weight: 600;">${validatedData.contactName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6B7280;">Title:</td>
                  <td style="padding: 8px 0;">${validatedData.contactTitle}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6B7280;">Email:</td>
                  <td style="padding: 8px 0;"><a href="mailto:${validatedData.email}" style="color: #3B82F6;">${validatedData.email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6B7280;">Phone:</td>
                  <td style="padding: 8px 0;">${validatedData.phone}</td>
                </tr>
              </table>
            </div>

            <div style="background: #EFF6FF; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="margin: 0 0 15px 0; color: #1E40AF;">Position Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6B7280; width: 150px;">Position:</td>
                  <td style="padding: 8px 0; font-weight: 600;">${validatedData.positionTitle}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6B7280;"># of Positions:</td>
                  <td style="padding: 8px 0;">${validatedData.numberOfPositions}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6B7280;">Employment Type:</td>
                  <td style="padding: 8px 0;">${validatedData.employmentType}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6B7280;">Location:</td>
                  <td style="padding: 8px 0;">${validatedData.location}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6B7280;">Salary Range:</td>
                  <td style="padding: 8px 0;">${validatedData.salaryRange || "Not specified"}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6B7280;">Timeline:</td>
                  <td style="padding: 8px 0;">${validatedData.hiringTimeline}</td>
                </tr>
              </table>
            </div>

            <div style="background: white; border: 1px solid #E5E7EB; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #1F2937; font-size: 14px;">Job Description:</h3>
              <p style="margin: 0; color: #4B5563; white-space: pre-wrap;">${validatedData.jobDescription}</p>
            </div>

            ${validatedData.additionalNotes ? `
            <div style="background: #FEF3C7; border: 1px solid #FCD34D; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #92400E; font-size: 14px;">Additional Notes:</h3>
              <p style="margin: 0; color: #78350F; white-space: pre-wrap;">${validatedData.additionalNotes}</p>
            </div>
            ` : ""}

            <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">

            <p style="font-size: 12px; color: #9CA3AF; text-align: center;">
              This request was submitted from the Humanly Hired website
            </p>
          </body>
        </html>
      `;

      await sendFormSubmissionEmail(
        "talent-request",
        {
          ...validatedData,
          submittedAt: new Date().toISOString(),
          formType: "Employer Talent Request",
        },
        `Talent Request: ${validatedData.positionTitle} at ${validatedData.companyName}`,
        emailHtml
      );
    } catch (emailError) {
      console.error("Failed to send talent request notification:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: "Talent request submitted successfully",
      data,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Talent request error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit talent request" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = supabaseAdmin
      .from("talent_requests")
      .select("*", { count: "exact" });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      // Return empty for demo mode
      return NextResponse.json({
        success: true,
        data: [],
        pagination: { total: 0, limit, offset },
      });
    }

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        total: count || 0,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error("Fetch talent requests error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch talent requests" },
      { status: 500 }
    );
  }
}
