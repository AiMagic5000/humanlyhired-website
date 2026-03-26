import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";
import { z } from "zod";

const messageSchema = z.object({
  conversationId: z.string().min(1),
  content: z.string().min(1),
});

interface Message {
  id: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

interface Conversation {
  id: string;
  contact: {
    name: string;
    avatar: string;
    role: string;
    appliedFor: string;
    online: boolean;
  };
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  starred: boolean;
  status: "active" | "interviewing" | "hired" | "archived";
  messages: Message[];
}

// Demo conversations for employer view (with candidates)
const demoEmployerConversations: Conversation[] = [
  {
    id: "1",
    contact: {
      name: "John Smith",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
      role: "Senior Software Engineer",
      appliedFor: "Full Stack Developer",
      online: true,
    },
    lastMessage: "Thank you for the opportunity! I'm available for the interview.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    unread: true,
    starred: true,
    status: "interviewing",
    messages: [
      {
        id: "m1",
        content: "Hi John! We've reviewed your application for the Full Stack Developer position and we're impressed with your experience.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        isOwn: true,
      },
      {
        id: "m2",
        content: "Thank you so much for reaching out! I'm very excited about this opportunity.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
        isOwn: false,
      },
      {
        id: "m3",
        content: "Would you be available for a technical interview next Tuesday at 2 PM PST?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
        isOwn: true,
      },
      {
        id: "m4",
        content: "Thank you for the opportunity! I'm available for the interview.",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        isOwn: false,
      },
    ],
  },
  {
    id: "2",
    contact: {
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
      role: "Product Manager",
      appliedFor: "Senior Product Manager",
      online: false,
    },
    lastMessage: "I have attached my portfolio for your review.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    unread: false,
    starred: false,
    status: "active",
    messages: [
      {
        id: "m1",
        content: "Hello Sarah, thank you for applying to our Senior Product Manager position.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        isOwn: true,
      },
      {
        id: "m2",
        content: "I have attached my portfolio for your review.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        isOwn: false,
      },
    ],
  },
  {
    id: "3",
    contact: {
      name: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
      role: "DevOps Engineer",
      appliedFor: "Cloud Infrastructure Engineer",
      online: true,
    },
    lastMessage: "Looking forward to hearing from you!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    unread: false,
    starred: true,
    status: "active",
    messages: [
      {
        id: "m1",
        content: "Looking forward to hearing from you!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
        isOwn: false,
      },
    ],
  },
  {
    id: "4",
    contact: {
      name: "Emily Rodriguez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
      role: "UX Designer",
      appliedFor: "Lead UX Designer",
      online: false,
    },
    lastMessage: "Welcome aboard! We're excited to have you join the team.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    unread: false,
    starred: false,
    status: "hired",
    messages: [
      {
        id: "m1",
        content: "Welcome aboard! We're excited to have you join the team.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
        isOwn: true,
      },
    ],
  },
];

function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "Unknown";

  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);

  if (diffInHours < 1) {
    const minutes = Math.floor(diffInMs / (1000 * 60));
    return `${minutes} min ago`;
  }
  if (diffInHours < 24) {
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }
  if (diffInHours < 48) {
    return "Yesterday";
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
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
          // Fetch conversations for this employer
          const { data: conversations, error } = await supabaseAdmin
            .from("employer_conversations")
            .select(`
              *,
              messages (
                id,
                content,
                sender_id,
                created_at
              ),
              profiles!candidate_id (
                full_name,
                avatar_url,
                current_title
              ),
              applications!application_id (
                jobs (title)
              )
            `)
            .eq("employer_id", userId)
            .order("updated_at", { ascending: false });

          if (!error && conversations) {
            const transformedConversations = conversations.map((conv) => {
              const candidate = conv.profiles as { full_name?: string; avatar_url?: string; current_title?: string } | null;
              const application = conv.applications as { jobs?: { title?: string } } | null;

              return {
                id: conv.id,
                contact: {
                  name: candidate?.full_name || "Unknown",
                  avatar: candidate?.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
                  role: candidate?.current_title || "Job Seeker",
                  appliedFor: application?.jobs?.title || "Unknown Position",
                  online: false,
                },
                lastMessage: conv.last_message || "",
                timestamp: formatTimestamp(conv.updated_at),
                unread: conv.unread,
                starred: conv.starred,
                status: conv.status || "active",
                messages: (conv.messages || []).map((m: { id: string; content: string; sender_id: string; created_at: string }) => ({
                  id: m.id,
                  content: m.content,
                  timestamp: formatTimestamp(m.created_at),
                  isOwn: m.sender_id === userId,
                })),
              };
            });

            return NextResponse.json({
              success: true,
              data: {
                conversations: transformedConversations,
                unreadCount: transformedConversations.filter((c) => c.unread).length,
              },
              source: "database",
            });
          }
        }
      } catch (dbError) {
        console.log("Database query failed, using demo data:", dbError);
      }
    }

    // Return demo data with formatted timestamps
    const formattedConversations = demoEmployerConversations.map((conv) => ({
      ...conv,
      timestamp: formatTimestamp(conv.timestamp),
      messages: conv.messages.map((m) => ({
        ...m,
        timestamp: formatTimestamp(m.timestamp),
      })),
    }));

    return NextResponse.json({
      success: true,
      data: {
        conversations: formattedConversations,
        unreadCount: formattedConversations.filter((c) => c.unread).length,
      },
      source: "demo",
    });
  } catch (error) {
    console.error("Employer messages error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// Send a message
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
    const validatedData = messageSchema.parse(body);

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes("your-project");

    if (isSupabaseConfigured) {
      try {
        // Insert message
        const { data, error } = await supabaseAdmin
          .from("messages")
          .insert({
            conversation_id: validatedData.conversationId,
            sender_id: userId,
            content: validatedData.content,
            created_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (!error && data) {
          // Update conversation's last message
          await supabaseAdmin
            .from("employer_conversations")
            .update({
              last_message: validatedData.content,
              updated_at: new Date().toISOString(),
            })
            .eq("id", validatedData.conversationId);

          return NextResponse.json({
            success: true,
            message: "Message sent",
            data: {
              id: data.id,
              content: data.content,
              timestamp: "Just now",
              isOwn: true,
            },
          });
        }
      } catch (dbError) {
        console.log("Database insert failed:", dbError);
      }
    }

    // Demo mode response
    return NextResponse.json({
      success: true,
      message: "Message sent",
      data: {
        id: `msg_${Date.now()}`,
        content: validatedData.content,
        timestamp: "Just now",
        isOwn: true,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Send message error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send message" },
      { status: 500 }
    );
  }
}

// Update conversation (star, mark read)
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
    const { conversationId, action } = body;

    if (!conversationId) {
      return NextResponse.json(
        { success: false, error: "Conversation ID is required" },
        { status: 400 }
      );
    }

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes("your-project");

    if (isSupabaseConfigured) {
      try {
        if (action === "markRead") {
          await supabaseAdmin
            .from("employer_conversations")
            .update({ unread: false })
            .eq("id", conversationId)
            .eq("employer_id", userId);
        } else if (action === "toggleStar") {
          const { data: conv } = await supabaseAdmin
            .from("employer_conversations")
            .select("starred")
            .eq("id", conversationId)
            .single();

          await supabaseAdmin
            .from("employer_conversations")
            .update({ starred: !conv?.starred })
            .eq("id", conversationId)
            .eq("employer_id", userId);
        }
      } catch (dbError) {
        console.log("Database update failed:", dbError);
      }
    }

    return NextResponse.json({
      success: true,
      message: action === "markRead" ? "Marked as read" : "Star toggled",
    });
  } catch (error) {
    console.error("Update conversation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update conversation" },
      { status: 500 }
    );
  }
}
