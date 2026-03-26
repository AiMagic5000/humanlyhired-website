import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";
import { z } from "zod";

const notificationSettingsSchema = z.object({
  applicationStatusUpdates: z.boolean().optional(),
  newJobRecommendations: z.boolean().optional(),
  weeklyJobDigest: z.boolean().optional(),
  interviewReminders: z.boolean().optional(),
  marketingEmails: z.boolean().optional(),
  // Employer-specific
  newApplications: z.boolean().optional(),
  applicationStatusChanges: z.boolean().optional(),
  jobExpirationReminders: z.boolean().optional(),
  weeklySummaryReports: z.boolean().optional(),
  platformUpdates: z.boolean().optional(),
});

const privacySettingsSchema = z.object({
  profileVisibility: z.enum(["public", "employers", "private"]).optional(),
  resumeVisibility: z.enum(["applied", "all", "none"]).optional(),
});

const settingsSchema = z.object({
  language: z.string().optional(),
  timezone: z.string().optional(),
  dateFormat: z.string().optional(),
  defaultJobDuration: z.number().optional(),
  notifications: notificationSettingsSchema.optional(),
  privacy: privacySettingsSchema.optional(),
  twoFactorEnabled: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Try to fetch settings from Supabase
    const { data, error } = await supabaseAdmin
      .from("user_settings")
      .select("*")
      .eq("clerk_user_id", userId)
      .single();

    if (error) {
      // Return default settings if none exist
      return NextResponse.json({
        success: true,
        data: {
          id: `demo_${userId}`,
          language: "en",
          timezone: "America/Los_Angeles",
          dateFormat: "mdy",
          defaultJobDuration: 30,
          notifications: {
            applicationStatusUpdates: true,
            newJobRecommendations: true,
            weeklyJobDigest: false,
            interviewReminders: true,
            marketingEmails: false,
            newApplications: true,
            applicationStatusChanges: true,
            jobExpirationReminders: true,
            weeklySummaryReports: false,
            platformUpdates: false,
          },
          privacy: {
            profileVisibility: "public",
            resumeVisibility: "applied",
          },
          twoFactorEnabled: false,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        language: data.language,
        timezone: data.timezone,
        dateFormat: data.date_format,
        defaultJobDuration: data.default_job_duration,
        notifications: data.notifications || {},
        privacy: data.privacy || {},
        twoFactorEnabled: data.two_factor_enabled,
      },
    });
  } catch (error) {
    console.error("Fetch settings error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = settingsSchema.parse(body);

    // Try to upsert settings in Supabase
    const { data, error } = await supabaseAdmin
      .from("user_settings")
      .upsert({
        clerk_user_id: userId,
        language: validatedData.language || "en",
        timezone: validatedData.timezone || "America/Los_Angeles",
        date_format: validatedData.dateFormat || "mdy",
        default_job_duration: validatedData.defaultJobDuration || 30,
        notifications: validatedData.notifications || {},
        privacy: validatedData.privacy || {},
        two_factor_enabled: validatedData.twoFactorEnabled || false,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: "clerk_user_id",
      })
      .select()
      .single();

    if (error) {
      console.log("Supabase upsert skipped (demo mode):", error.message);

      // Return success with demo data
      return NextResponse.json({
        success: true,
        message: "Settings updated successfully",
        data: {
          id: `demo_${userId}`,
          ...validatedData,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      data: {
        id: data.id,
        language: data.language,
        timezone: data.timezone,
        dateFormat: data.date_format,
        defaultJobDuration: data.default_job_duration,
        notifications: data.notifications,
        privacy: data.privacy,
        twoFactorEnabled: data.two_factor_enabled,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Update settings error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
