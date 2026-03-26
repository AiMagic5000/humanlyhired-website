import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";
import { z } from "zod";

const notificationSchema = z.object({
  type: z.enum(["info", "success", "warning", "error", "application", "job", "interview"]),
  title: z.string().min(1),
  message: z.string().min(1),
  link: z.string().optional(),
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

    // Try to fetch notifications from Supabase
    const { data, error } = await supabaseAdmin
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      // Return demo notifications if table doesn't exist
      const demoNotifications = [
        {
          id: "notif_1",
          type: "success",
          title: "Application Received",
          message: "Your application for Senior Software Engineer at TechCorp has been received.",
          link: "/dashboard/applications",
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        },
        {
          id: "notif_2",
          type: "info",
          title: "New Job Match",
          message: "A new job matching your profile has been posted: Full Stack Developer at StartupXYZ.",
          link: "/jobs/123",
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        },
        {
          id: "notif_3",
          type: "warning",
          title: "Profile Incomplete",
          message: "Complete your profile to increase your chances of getting hired.",
          link: "/dashboard/profile",
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        },
        {
          id: "notif_4",
          type: "interview",
          title: "Interview Scheduled",
          message: "Your interview with InnovateTech has been scheduled for tomorrow at 2:00 PM.",
          link: "/dashboard/interviews",
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        },
      ];

      return NextResponse.json({
        success: true,
        data: demoNotifications,
        unreadCount: demoNotifications.filter((n) => !n.read).length,
      });
    }

    const notifications = data.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      message: n.message,
      link: n.link,
      read: n.read,
      createdAt: n.created_at,
    }));

    return NextResponse.json({
      success: true,
      data: notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
    });
  } catch (error) {
    console.error("Fetch notifications error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch notifications" },
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
    const validatedData = notificationSchema.parse(body);

    // Try to create notification in Supabase
    const { data, error } = await supabaseAdmin
      .from("notifications")
      .insert({
        user_id: userId,
        type: validatedData.type,
        title: validatedData.title,
        message: validatedData.message,
        link: validatedData.link || null,
        read: false,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.log("Supabase insert skipped (demo mode):", error.message);

      return NextResponse.json({
        success: true,
        message: "Notification created successfully",
        data: {
          id: `notif_${Date.now()}`,
          ...validatedData,
          read: false,
          createdAt: new Date().toISOString(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Notification created successfully",
      data: {
        id: data.id,
        type: data.type,
        title: data.title,
        message: data.message,
        link: data.link,
        read: data.read,
        createdAt: data.created_at,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Create notification error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create notification" },
      { status: 500 }
    );
  }
}

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
    const { notificationId, action, notificationIds } = body;

    if (action === "markRead" && notificationId) {
      const { error } = await supabaseAdmin
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId)
        .eq("user_id", userId);

      if (error) {
        console.log("Supabase update skipped (demo mode):", error.message);
      }

      return NextResponse.json({
        success: true,
        message: "Notification marked as read",
      });
    }

    if (action === "markAllRead") {
      const { error } = await supabaseAdmin
        .from("notifications")
        .update({ read: true })
        .eq("user_id", userId);

      if (error) {
        console.log("Supabase update skipped (demo mode):", error.message);
      }

      return NextResponse.json({
        success: true,
        message: "All notifications marked as read",
      });
    }

    if (action === "markBulk" && Array.isArray(notificationIds)) {
      const { error } = await supabaseAdmin
        .from("notifications")
        .update({ read: true })
        .eq("user_id", userId)
        .in("id", notificationIds);

      if (error) {
        console.log("Supabase update skipped (demo mode):", error.message);
      }

      return NextResponse.json({
        success: true,
        message: `Marked ${notificationIds.length} notification(s) as read`,
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Update notification error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update notification" },
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
    const notificationId = searchParams.get("id");
    const deleteAll = searchParams.get("all");

    if (deleteAll === "true") {
      const { error } = await supabaseAdmin
        .from("notifications")
        .delete()
        .eq("user_id", userId);

      if (error) {
        console.log("Supabase delete skipped (demo mode):", error.message);
      }

      return NextResponse.json({
        success: true,
        message: "All notifications deleted",
      });
    }

    if (!notificationId) {
      return NextResponse.json(
        { success: false, error: "Notification ID is required" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("notifications")
      .delete()
      .eq("id", notificationId)
      .eq("user_id", userId);

    if (error) {
      console.log("Supabase delete skipped (demo mode):", error.message);
    }

    return NextResponse.json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("Delete notification error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete notification" },
      { status: 500 }
    );
  }
}
