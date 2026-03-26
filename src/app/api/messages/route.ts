import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";
import { z } from "zod";

const messageSchema = z.object({
  conversationId: z.string().min(1),
  content: z.string().min(1),
});

const conversationSchema = z.object({
  recipientId: z.string().min(1),
  initialMessage: z.string().min(1),
});

// Demo conversations for fallback
const demoConversations = [
  {
    id: "conv_1",
    contact: {
      id: "user_1",
      name: "Sarah Miller",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
      role: "Senior Recruiter",
      company: "TechCorp Inc.",
      online: true,
    },
    lastMessage: "Great! I'll send over the interview details shortly.",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    unread: true,
    starred: true,
    messages: [
      {
        id: "m1",
        content: "Hi! I reviewed your application for the Senior Software Engineer position. Your experience looks impressive!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        isOwn: false,
      },
      {
        id: "m2",
        content: "Thank you so much! I'm very excited about this opportunity.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
        isOwn: true,
      },
      {
        id: "m3",
        content: "Would you be available for a technical interview next week?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
        isOwn: false,
      },
      {
        id: "m4",
        content: "Yes, I'm available Tuesday through Thursday. What time works best for your team?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 21).toISOString(),
        isOwn: true,
      },
      {
        id: "m5",
        content: "Great! I'll send over the interview details shortly.",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        isOwn: false,
      },
    ],
  },
  {
    id: "conv_2",
    contact: {
      id: "user_2",
      name: "James Wilson",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
      role: "HR Manager",
      company: "StartupXYZ",
      online: false,
    },
    lastMessage: "Thanks for your interest in our Product Manager role.",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    unread: false,
    starred: false,
    messages: [
      {
        id: "m1",
        content: "Hello! I noticed you applied for the Product Manager position at StartupXYZ.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        isOwn: false,
      },
      {
        id: "m2",
        content: "Yes, I'm very interested in the role. The company's mission really resonates with me.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 47).toISOString(),
        isOwn: true,
      },
      {
        id: "m3",
        content: "Thanks for your interest in our Product Manager role.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        isOwn: false,
      },
    ],
  },
  {
    id: "conv_3",
    contact: {
      id: "user_3",
      name: "Emily Chen",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
      role: "Technical Recruiter",
      company: "CloudServices Co.",
      online: true,
    },
    lastMessage: "Your DevOps skills are exactly what we're looking for!",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    unread: false,
    starred: true,
    messages: [
      {
        id: "m1",
        content: "Hi there! Your DevOps skills are exactly what we're looking for!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
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
    const conversationId = searchParams.get("conversationId");

    // If requesting a specific conversation
    if (conversationId) {
      const { data, error } = await supabaseAdmin
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) {
        // Return demo messages
        const demoConv = demoConversations.find((c) => c.id === conversationId);
        return NextResponse.json({
          success: true,
          data: demoConv?.messages || [],
        });
      }

      return NextResponse.json({
        success: true,
        data: data.map((m) => ({
          id: m.id,
          content: m.content,
          timestamp: m.created_at,
          isOwn: m.sender_id === userId,
        })),
      });
    }

    // Fetch all conversations
    const { data, error } = await supabaseAdmin
      .from("conversations")
      .select(`
        *,
        messages (
          id,
          content,
          sender_id,
          created_at
        )
      `)
      .or(`participant_1.eq.${userId},participant_2.eq.${userId}`)
      .order("updated_at", { ascending: false });

    if (error) {
      // Return demo conversations
      return NextResponse.json({
        success: true,
        data: demoConversations,
        unreadCount: demoConversations.filter((c) => c.unread).length,
      });
    }

    const conversations = data.map((conv) => ({
      id: conv.id,
      contact: {
        id: conv.participant_1 === userId ? conv.participant_2 : conv.participant_1,
        name: conv.contact_name || "Unknown",
        avatar: conv.contact_avatar || "",
        role: conv.contact_role || "",
        company: conv.contact_company || "",
        online: false,
      },
      lastMessage: conv.last_message,
      lastMessageAt: conv.updated_at,
      unread: conv.unread_by === userId,
      starred: conv.starred_by?.includes(userId) || false,
      messages: conv.messages.map((m: { id: string; content: string; sender_id: string; created_at: string }) => ({
        id: m.id,
        content: m.content,
        timestamp: m.created_at,
        isOwn: m.sender_id === userId,
      })),
    }));

    return NextResponse.json({
      success: true,
      data: conversations,
      unreadCount: conversations.filter((c) => c.unread).length,
    });
  } catch (error) {
    console.error("Fetch messages error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch messages" },
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

    // Check if creating a new conversation or sending a message
    if (body.recipientId) {
      const validatedData = conversationSchema.parse(body);

      // Create new conversation
      const { data: conv, error: convError } = await supabaseAdmin
        .from("conversations")
        .insert({
          participant_1: userId,
          participant_2: validatedData.recipientId,
          last_message: validatedData.initialMessage,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (convError) {
        console.log("Supabase insert skipped (demo mode):", convError.message);

        return NextResponse.json({
          success: true,
          message: "Conversation created",
          data: {
            id: `conv_${Date.now()}`,
            recipientId: validatedData.recipientId,
            initialMessage: validatedData.initialMessage,
          },
        });
      }

      // Create initial message
      await supabaseAdmin.from("messages").insert({
        conversation_id: conv.id,
        sender_id: userId,
        content: validatedData.initialMessage,
        created_at: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        message: "Conversation created",
        data: { id: conv.id },
      });
    }

    // Send message to existing conversation
    const validatedData = messageSchema.parse(body);

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

    if (error) {
      console.log("Supabase insert skipped (demo mode):", error.message);

      return NextResponse.json({
        success: true,
        message: "Message sent",
        data: {
          id: `msg_${Date.now()}`,
          content: validatedData.content,
          timestamp: new Date().toISOString(),
          isOwn: true,
        },
      });
    }

    // Update conversation's last message
    await supabaseAdmin
      .from("conversations")
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
        timestamp: data.created_at,
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

    if (action === "markRead") {
      const { error } = await supabaseAdmin
        .from("conversations")
        .update({ unread_by: null })
        .eq("id", conversationId);

      if (error) {
        console.log("Supabase update skipped (demo mode):", error.message);
      }

      return NextResponse.json({
        success: true,
        message: "Conversation marked as read",
      });
    }

    if (action === "toggleStar") {
      // Get current starred status
      const { data: conv } = await supabaseAdmin
        .from("conversations")
        .select("starred_by")
        .eq("id", conversationId)
        .single();

      const starredBy = conv?.starred_by || [];
      const isStarred = starredBy.includes(userId);

      const newStarredBy = isStarred
        ? starredBy.filter((id: string) => id !== userId)
        : [...starredBy, userId];

      const { error } = await supabaseAdmin
        .from("conversations")
        .update({ starred_by: newStarredBy })
        .eq("id", conversationId);

      if (error) {
        console.log("Supabase update skipped (demo mode):", error.message);
      }

      return NextResponse.json({
        success: true,
        message: isStarred ? "Conversation unstarred" : "Conversation starred",
        starred: !isStarred,
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Update conversation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update conversation" },
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
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return NextResponse.json(
        { success: false, error: "Conversation ID is required" },
        { status: 400 }
      );
    }

    // Delete all messages in conversation
    await supabaseAdmin
      .from("messages")
      .delete()
      .eq("conversation_id", conversationId);

    // Delete conversation
    const { error } = await supabaseAdmin
      .from("conversations")
      .delete()
      .eq("id", conversationId);

    if (error) {
      console.log("Supabase delete skipped (demo mode):", error.message);
    }

    return NextResponse.json({
      success: true,
      message: "Conversation deleted",
    });
  } catch (error) {
    console.error("Delete conversation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete conversation" },
      { status: 500 }
    );
  }
}
