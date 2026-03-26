import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  monthlyNeed: z.string().min(1, "Monthly need is required"),
  monthlyWant: z.string().min(1, "Monthly want is required"),
  startDate: z.string().min(1, "Start date is required"),
  hoursPerWeek: z.string().min(1, "Hours per week is required"),
  workPreference: z.string().min(1, "Work preference is required"),
  profileComplete: z.boolean().default(true),
});

export type ProfileData = z.infer<typeof profileSchema>;

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const profile = user.unsafeMetadata?.profile as ProfileData | undefined;

    if (!profile) {
      return NextResponse.json({
        success: true,
        data: null,
      });
    }

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("Fetch profile error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

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
    const validatedData = profileSchema.parse({
      ...body,
      profileComplete: true,
    });

    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      unsafeMetadata: {
        profile: validatedData,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile saved successfully",
      data: validatedData,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid form data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Save profile error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save profile" },
      { status: 500 }
    );
  }
}
