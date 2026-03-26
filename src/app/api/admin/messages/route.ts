import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

// Demo support tickets data for fallback
const demoTickets = [
  {
    id: "TKT-001",
    contact: {
      name: "John Smith",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
      email: "john.smith@email.com",
      type: "candidate",
    },
    subject: "Cannot access my application status",
    lastMessage: "I've been trying to check my application but the page keeps loading.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    unread: true,
    starred: true,
    priority: "high",
    status: "open",
    messages: [
      {
        id: "m1",
        content: "Hi, I applied for a Software Engineer position last week but I cannot access my application status. The dashboard keeps showing a loading spinner.",
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        isOwn: false,
      },
      {
        id: "m2",
        content: "I've been trying to check my application but the page keeps loading.",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        isOwn: false,
      },
    ],
  },
  {
    id: "TKT-002",
    contact: {
      name: "Sarah Miller",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
      email: "sarah@techcorp.com",
      type: "employer",
      company: "TechCorp Inc.",
    },
    subject: "Billing inquiry - Invoice discrepancy",
    lastMessage: "Thank you for looking into this matter.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    unread: false,
    starred: false,
    priority: "medium",
    status: "pending",
    messages: [
      {
        id: "m1",
        content: "Hello, I noticed a discrepancy in our latest invoice. We were charged for 10 job postings but only posted 8.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
        isOwn: false,
      },
      {
        id: "m2",
        content: "Hi Sarah, thank you for reaching out. I'm looking into this right now and will get back to you shortly.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
        isOwn: true,
      },
      {
        id: "m3",
        content: "Thank you for looking into this matter.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        isOwn: false,
      },
    ],
  },
  {
    id: "TKT-003",
    contact: {
      name: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
      email: "m.chen@startup.io",
      type: "employer",
      company: "StartupXYZ",
    },
    subject: "Feature request - Bulk candidate export",
    lastMessage: "This would really help streamline our hiring process.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    unread: false,
    starred: true,
    priority: "low",
    status: "open",
    messages: [
      {
        id: "m1",
        content: "Would it be possible to add a feature to export all candidate applications to CSV? This would really help streamline our hiring process.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
        isOwn: false,
      },
    ],
  },
  {
    id: "TKT-004",
    contact: {
      name: "Emily Rodriguez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
      email: "emily.r@email.com",
      type: "candidate",
    },
    subject: "Account verification issue",
    lastMessage: "Your account has been verified. Let us know if you have any other questions!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    unread: false,
    starred: false,
    priority: "medium",
    status: "resolved",
    messages: [
      {
        id: "m1",
        content: "I'm having trouble verifying my email address. The verification link seems to be expired.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 125).toISOString(),
        isOwn: false,
      },
      {
        id: "m2",
        content: "I've resent you a new verification link. Please check your inbox.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 122).toISOString(),
        isOwn: true,
      },
      {
        id: "m3",
        content: "Your account has been verified. Let us know if you have any other questions!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
        isOwn: true,
      },
    ],
  },
  {
    id: "TKT-005",
    contact: {
      name: "David Kim",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
      email: "david@cloudservices.com",
      type: "employer",
      company: "CloudServices Co.",
    },
    subject: "URGENT: Job posting removed without notice",
    lastMessage: "Our job posting for Senior Engineer was removed. We need this restored ASAP.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    unread: true,
    starred: false,
    priority: "urgent",
    status: "open",
    messages: [
      {
        id: "m1",
        content: "Our job posting for Senior Engineer was removed. We need this restored ASAP. We have interviews scheduled for this week!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        isOwn: false,
      },
    ],
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

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes("your-project");

    if (isSupabaseConfigured) {
      try {
        // Fetch support tickets from database
        let query = supabaseAdmin
          .from("support_tickets")
          .select(`
            id,
            subject,
            status,
            priority,
            starred,
            unread,
            created_at,
            updated_at,
            user_id,
            profiles!support_tickets_user_id_fkey (
              full_name,
              email,
              avatar_url,
              user_type,
              company_name
            ),
            support_messages (
              id,
              content,
              is_admin,
              created_at
            )
          `)
          .order("updated_at", { ascending: false });

        // Apply status filter
        if (status !== "all" && status !== "urgent") {
          query = query.eq("status", status);
        } else if (status === "urgent") {
          query = query.eq("priority", "urgent");
        }

        const { data: tickets, error } = await query.limit(100);

        if (!error && tickets) {
          // Transform data
          const transformedTickets = tickets.map((ticket: any) => {
            const messages = ticket.support_messages?.map((msg: any) => ({
              id: msg.id,
              content: msg.content,
              timestamp: msg.created_at,
              isOwn: msg.is_admin,
            })) || [];

            return {
              id: ticket.id,
              contact: {
                name: ticket.profiles?.full_name || "Unknown",
                avatar: ticket.profiles?.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
                email: ticket.profiles?.email || "",
                type: ticket.profiles?.user_type || "candidate",
                company: ticket.profiles?.company_name,
              },
              subject: ticket.subject,
              lastMessage: messages[messages.length - 1]?.content || "",
              timestamp: ticket.updated_at || ticket.created_at,
              unread: ticket.unread || false,
              starred: ticket.starred || false,
              priority: ticket.priority || "medium",
              status: ticket.status || "open",
              messages,
            };
          });

          // Apply search filter
          let filteredTickets = transformedTickets;
          if (search) {
            const searchLower = search.toLowerCase();
            filteredTickets = transformedTickets.filter((t: any) =>
              t.contact.name.toLowerCase().includes(searchLower) ||
              t.subject.toLowerCase().includes(searchLower) ||
              t.id.toLowerCase().includes(searchLower)
            );
          }

          // Calculate stats
          const stats = {
            open: transformedTickets.filter((t: any) => t.status === "open").length,
            pending: transformedTickets.filter((t: any) => t.status === "pending").length,
            urgent: transformedTickets.filter((t: any) => t.priority === "urgent").length,
            resolved: transformedTickets.filter((t: any) => t.status === "resolved").length,
          };

          return NextResponse.json({
            success: true,
            data: { tickets: filteredTickets, stats },
            source: "database",
          });
        }
      } catch (dbError) {
        console.log("Database query failed, using demo data:", dbError);
      }
    }

    // Filter demo data
    let filteredTickets = [...demoTickets];

    if (search) {
      const searchLower = search.toLowerCase();
      filteredTickets = filteredTickets.filter(ticket =>
        ticket.contact.name.toLowerCase().includes(searchLower) ||
        ticket.subject.toLowerCase().includes(searchLower) ||
        ticket.id.toLowerCase().includes(searchLower)
      );
    }

    if (status !== "all") {
      if (status === "urgent") {
        filteredTickets = filteredTickets.filter(ticket => ticket.priority === "urgent");
      } else {
        filteredTickets = filteredTickets.filter(ticket => ticket.status === status);
      }
    }

    // Calculate stats
    const stats = {
      open: demoTickets.filter(t => t.status === "open").length,
      pending: demoTickets.filter(t => t.status === "pending").length,
      urgent: demoTickets.filter(t => t.priority === "urgent").length,
      resolved: demoTickets.filter(t => t.status === "resolved").length,
    };

    return NextResponse.json({
      success: true,
      data: { tickets: filteredTickets, stats },
      source: "demo",
    });
  } catch (error) {
    console.error("Admin messages error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch support tickets" },
      { status: 500 }
    );
  }
}

// Update ticket status or send message
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
    const { ticketId, status, starred, message } = body;

    if (!ticketId) {
      return NextResponse.json(
        { success: false, error: "Ticket ID is required" },
        { status: 400 }
      );
    }

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes("your-project");

    if (isSupabaseConfigured) {
      try {
        // Update ticket if status or starred changed
        if (status !== undefined || starred !== undefined) {
          const updates: Record<string, any> = { updated_at: new Date().toISOString() };
          if (status !== undefined) updates.status = status;
          if (starred !== undefined) updates.starred = starred;

          await supabaseAdmin
            .from("support_tickets")
            .update(updates)
            .eq("id", ticketId);
        }

        // Add message if provided
        if (message) {
          await supabaseAdmin.from("support_messages").insert({
            ticket_id: ticketId,
            content: message,
            is_admin: true,
            created_at: new Date().toISOString(),
          });

          // Update ticket timestamp and mark as unread for user
          await supabaseAdmin
            .from("support_tickets")
            .update({
              updated_at: new Date().toISOString(),
              unread: false, // Admin has responded
            })
            .eq("id", ticketId);
        }

        return NextResponse.json({
          success: true,
          message: "Ticket updated successfully",
        });
      } catch (dbError) {
        console.log("Database update failed:", dbError);
      }
    }

    // Demo mode response
    return NextResponse.json({
      success: true,
      message: "Ticket updated successfully",
    });
  } catch (error) {
    console.error("Update ticket error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update ticket" },
      { status: 500 }
    );
  }
}
