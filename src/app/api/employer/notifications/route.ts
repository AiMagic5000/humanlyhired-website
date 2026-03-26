import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

interface Notification {
  id: string;
  type: "application" | "interview" | "job" | "message" | "billing" | "analytics";
  title: string;
  description: string;
  time: string;
  date: string;
  read: boolean;
  link?: string;
}

// Demo notifications for employers
const demoEmployerNotifications: Notification[] = [
  {
    id: "1",
    type: "application",
    title: "New Application Received",
    description: "John Smith applied for Senior Software Engineer position.",
    time: "10:30 AM",
    date: "Today",
    read: false,
    link: "/employer/applications",
  },
  {
    id: "2",
    type: "application",
    title: "Application Update",
    description: "Sarah Johnson accepted your interview invitation for Product Manager.",
    time: "9:15 AM",
    date: "Today",
    read: false,
    link: "/employer/applications",
  },
  {
    id: "3",
    type: "interview",
    title: "Interview Scheduled",
    description: "Interview with Michael Chen for DevOps Engineer is confirmed for tomorrow at 2:00 PM.",
    time: "8:00 AM",
    date: "Today",
    read: true,
    link: "/employer/applications",
  },
  {
    id: "4",
    type: "message",
    title: "New Message",
    description: "Emily Rodriguez sent you a message about the UX Designer position.",
    time: "4:30 PM",
    date: "Yesterday",
    read: true,
    link: "/employer/messages",
  },
  {
    id: "5",
    type: "job",
    title: "Job Posting Expiring Soon",
    description: "Your Senior Software Engineer posting will expire in 3 days. Renew to continue receiving applications.",
    time: "2:15 PM",
    date: "Yesterday",
    read: true,
    link: "/employer/jobs",
  },
  {
    id: "6",
    type: "analytics",
    title: "Weekly Performance Report",
    description: "Your job postings received 156 views and 23 applications this week.",
    time: "11:00 AM",
    date: "Jan 11, 2025",
    read: true,
    link: "/employer/analytics",
  },
  {
    id: "7",
    type: "billing",
    title: "Payment Successful",
    description: "Your monthly subscription payment of $299 was processed successfully.",
    time: "9:00 AM",
    date: "Jan 11, 2025",
    read: true,
    link: "/employer/settings",
  },
  {
    id: "8",
    type: "application",
    title: "Candidate Withdrew",
    description: "David Kim withdrew their application for Full Stack Developer position.",
    time: "3:45 PM",
    date: "Jan 10, 2025",
    read: true,
    link: "/employer/applications",
  },
];

function formatNotificationDate(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const notificationDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (notificationDate.getTime() === today.getTime()) {
    return "Today";
  } else if (notificationDate.getTime() === yesterday.getTime()) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }
}

function formatNotificationTime(date: Date): string {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
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
          // Fetch notifications for this employer
          const { data: notifications, error } = await supabaseAdmin
            .from("notifications")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(50);

          if (!error && notifications) {
            const transformedNotifications: Notification[] = notifications.map((n) => ({
              id: n.id,
              type: n.type || "application",
              title: n.title,
              description: n.message || n.description || "",
              time: formatNotificationTime(new Date(n.created_at)),
              date: formatNotificationDate(new Date(n.created_at)),
              read: n.read || false,
              link: n.link || n.action_url,
            }));

            // Calculate stats
            const stats = {
              total: transformedNotifications.length,
              unread: transformedNotifications.filter((n) => !n.read).length,
              application: transformedNotifications.filter((n) => n.type === "application").length,
              interview: transformedNotifications.filter((n) => n.type === "interview").length,
              message: transformedNotifications.filter((n) => n.type === "message").length,
              job: transformedNotifications.filter((n) => n.type === "job").length,
              billing: transformedNotifications.filter((n) => n.type === "billing").length,
              analytics: transformedNotifications.filter((n) => n.type === "analytics").length,
            };

            return NextResponse.json({
              success: true,
              data: {
                notifications: transformedNotifications,
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

    // Return demo data
    const stats = {
      total: demoEmployerNotifications.length,
      unread: demoEmployerNotifications.filter((n) => !n.read).length,
      application: demoEmployerNotifications.filter((n) => n.type === "application").length,
      interview: demoEmployerNotifications.filter((n) => n.type === "interview").length,
      message: demoEmployerNotifications.filter((n) => n.type === "message").length,
      job: demoEmployerNotifications.filter((n) => n.type === "job").length,
      billing: demoEmployerNotifications.filter((n) => n.type === "billing").length,
      analytics: demoEmployerNotifications.filter((n) => n.type === "analytics").length,
    };

    return NextResponse.json({
      success: true,
      data: {
        notifications: demoEmployerNotifications,
        stats,
      },
      source: "demo",
    });
  } catch (error) {
    console.error("Employer notifications error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// Mark notification as read or delete
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

    // Validate action
    const validActions = ["markRead", "markAllRead", "delete", "deleteRead", "markBulk"];
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { success: false, error: "Invalid action" },
        { status: 400 }
      );
    }

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes("your-project");

    if (isSupabaseConfigured) {
      try {
        if (action === "markRead" && notificationId) {
          await supabaseAdmin
            .from("notifications")
            .update({ read: true })
            .eq("id", notificationId)
            .eq("user_id", userId);
        } else if (action === "markAllRead") {
          await supabaseAdmin
            .from("notifications")
            .update({ read: true })
            .eq("user_id", userId);
        } else if (action === "markBulk" && notificationIds?.length) {
          await supabaseAdmin
            .from("notifications")
            .update({ read: true })
            .in("id", notificationIds)
            .eq("user_id", userId);
        } else if (action === "delete" && notificationId) {
          await supabaseAdmin
            .from("notifications")
            .delete()
            .eq("id", notificationId)
            .eq("user_id", userId);
        } else if (action === "deleteRead") {
          await supabaseAdmin
            .from("notifications")
            .delete()
            .eq("user_id", userId)
            .eq("read", true);
        }
      } catch (dbError) {
        console.log("Database update failed:", dbError);
      }
    }

    const messages: Record<string, string> = {
      markRead: "Notification marked as read",
      markAllRead: "All notifications marked as read",
      markBulk: "Notifications marked as read",
      delete: "Notification deleted",
      deleteRead: "Read notifications deleted",
    };

    return NextResponse.json({
      success: true,
      message: messages[action] || "Action completed",
    });
  } catch (error) {
    console.error("Update notification error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update notification" },
      { status: 500 }
    );
  }
}
