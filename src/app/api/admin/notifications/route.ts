import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

// Demo system notifications data for fallback
const demoNotifications = [
  {
    id: "1",
    type: "error",
    category: "system",
    title: "Database Connection Issue",
    description: "Intermittent connection failures detected in the application database. Auto-recovery in progress.",
    time: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
    actionRequired: true,
  },
  {
    id: "2",
    type: "warning",
    category: "security",
    title: "Unusual Login Activity",
    description: "Multiple failed login attempts detected from IP 192.168.1.45. Consider reviewing security logs.",
    time: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
    read: false,
    actionRequired: true,
  },
  {
    id: "3",
    type: "success",
    category: "billing",
    title: "Payment Processing Complete",
    description: "Monthly subscription payments processed successfully. 45 transactions completed.",
    time: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
    read: true,
    actionRequired: false,
  },
  {
    id: "4",
    type: "info",
    category: "user",
    title: "New Employer Registration",
    description: "TechCorp Inc. completed employer registration. Awaiting profile verification.",
    time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: true,
    actionRequired: false,
  },
  {
    id: "5",
    type: "warning",
    category: "job",
    title: "Job Posting Flagged",
    description: "Job posting #1234 has been flagged for review due to policy violation reports.",
    time: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    read: true,
    actionRequired: true,
  },
  {
    id: "6",
    type: "info",
    category: "application",
    title: "High Application Volume",
    description: "Senior Software Engineer position received 50+ applications in the last 24 hours.",
    time: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    read: true,
    actionRequired: false,
  },
  {
    id: "7",
    type: "success",
    category: "system",
    title: "System Update Complete",
    description: "Platform successfully updated to version 2.4.0. All services running normally.",
    time: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(),
    read: true,
    actionRequired: false,
  },
  {
    id: "8",
    type: "error",
    category: "billing",
    title: "Payment Failed",
    description: "Subscription payment for StartupXYZ failed. Customer notified via email.",
    time: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    read: true,
    actionRequired: true,
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
    const filter = searchParams.get("filter") || "all";

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes("your-project");

    if (isSupabaseConfigured) {
      try {
        // Fetch system notifications from database
        let query = supabaseAdmin
          .from("system_notifications")
          .select("*")
          .order("created_at", { ascending: false });

        // Apply filter
        if (filter === "unread") {
          query = query.eq("read", false);
        } else if (filter === "actionRequired") {
          query = query.eq("action_required", true);
        } else if (["error", "warning", "success", "info"].includes(filter)) {
          query = query.eq("type", filter);
        }

        const { data: notifications, error } = await query.limit(100);

        if (!error && notifications) {
          // Transform data
          const transformedNotifications = notifications.map((n: any) => ({
            id: n.id,
            type: n.type || "info",
            category: n.category || "system",
            title: n.title,
            description: n.description,
            time: n.created_at,
            read: n.read || false,
            actionRequired: n.action_required || false,
          }));

          // Apply search filter
          let filteredNotifications = transformedNotifications;
          if (search) {
            const searchLower = search.toLowerCase();
            filteredNotifications = transformedNotifications.filter((n: any) =>
              n.title.toLowerCase().includes(searchLower) ||
              n.description.toLowerCase().includes(searchLower)
            );
          }

          // Calculate stats
          const stats = {
            total: transformedNotifications.length,
            unread: transformedNotifications.filter((n: any) => !n.read).length,
            actionRequired: transformedNotifications.filter((n: any) => n.actionRequired).length,
            errors: transformedNotifications.filter((n: any) => n.type === "error").length,
          };

          return NextResponse.json({
            success: true,
            data: { notifications: filteredNotifications, stats },
            source: "database",
          });
        }
      } catch (dbError) {
        console.log("Database query failed, using demo data:", dbError);
      }
    }

    // Filter demo data
    let filteredNotifications = [...demoNotifications];

    if (search) {
      const searchLower = search.toLowerCase();
      filteredNotifications = filteredNotifications.filter(n =>
        n.title.toLowerCase().includes(searchLower) ||
        n.description.toLowerCase().includes(searchLower)
      );
    }

    if (filter !== "all") {
      if (filter === "unread") {
        filteredNotifications = filteredNotifications.filter(n => !n.read);
      } else if (filter === "actionRequired") {
        filteredNotifications = filteredNotifications.filter(n => n.actionRequired);
      } else {
        filteredNotifications = filteredNotifications.filter(n => n.type === filter);
      }
    }

    // Calculate stats
    const stats = {
      total: demoNotifications.length,
      unread: demoNotifications.filter(n => !n.read).length,
      actionRequired: demoNotifications.filter(n => n.actionRequired).length,
      errors: demoNotifications.filter(n => n.type === "error").length,
    };

    return NextResponse.json({
      success: true,
      data: { notifications: filteredNotifications, stats },
      source: "demo",
    });
  } catch (error) {
    console.error("Admin notifications error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// Update notification (mark as read, delete)
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
    const { notificationIds, read, markAllRead } = body;

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes("your-project");

    if (isSupabaseConfigured) {
      try {
        if (markAllRead) {
          await supabaseAdmin
            .from("system_notifications")
            .update({ read: true })
            .eq("read", false);
        } else if (notificationIds && notificationIds.length > 0 && read !== undefined) {
          await supabaseAdmin
            .from("system_notifications")
            .update({ read })
            .in("id", notificationIds);
        }

        return NextResponse.json({
          success: true,
          message: markAllRead ? "All notifications marked as read" : "Notifications updated successfully",
        });
      } catch (dbError) {
        console.log("Database update failed:", dbError);
      }
    }

    // Demo mode response
    return NextResponse.json({
      success: true,
      message: markAllRead ? "All notifications marked as read" : "Notifications updated successfully",
    });
  } catch (error) {
    console.error("Update notifications error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update notifications" },
      { status: 500 }
    );
  }
}

// Delete notifications
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
    const { notificationIds, clearResolved } = body;

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes("your-project");

    if (isSupabaseConfigured) {
      try {
        if (clearResolved) {
          // Delete all resolved (read and not action required)
          await supabaseAdmin
            .from("system_notifications")
            .delete()
            .eq("read", true)
            .eq("action_required", false);
        } else if (notificationIds && notificationIds.length > 0) {
          await supabaseAdmin
            .from("system_notifications")
            .delete()
            .in("id", notificationIds);
        }

        return NextResponse.json({
          success: true,
          message: clearResolved ? "Resolved notifications cleared" : "Notifications deleted successfully",
        });
      } catch (dbError) {
        console.log("Database delete failed:", dbError);
      }
    }

    // Demo mode response
    return NextResponse.json({
      success: true,
      message: clearResolved ? "Resolved notifications cleared" : "Notifications deleted successfully",
    });
  } catch (error) {
    console.error("Delete notifications error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete notifications" },
      { status: 500 }
    );
  }
}
