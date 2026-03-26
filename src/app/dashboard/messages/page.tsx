"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Star,
  StarOff,
  ChevronLeft,
  Phone,
  Video,
  Info,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

interface Contact {
  id: string;
  name: string;
  avatar: string;
  role: string;
  company: string;
  online: boolean;
}

interface Conversation {
  id: string;
  contact: Contact;
  lastMessage: string;
  lastMessageAt: string;
  unread: boolean;
  starred: boolean;
  messages: Message[];
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else if (days === 1) {
    return "Yesterday";
  } else if (days < 7) {
    return date.toLocaleDateString([], { weekday: "short" });
  } else {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [showMobileConversation, setShowMobileConversation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async () => {
    try {
      const response = await fetch("/api/messages");
      const result = await response.json();

      if (result.success && result.data) {
        setConversations(result.data);
      }
    } catch (error) {
      console.error("Fetch conversations error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.contact.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = conversations.filter((c) => c.unread).length;

  const toggleStar = async (id: string) => {
    try {
      const response = await fetch("/api/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: id, action: "toggleStar" }),
      });

      const result = await response.json();

      if (result.success) {
        setConversations(
          conversations.map((c) =>
            c.id === id ? { ...c, starred: result.starred } : c
          )
        );
        if (selectedConversation?.id === id) {
          setSelectedConversation({
            ...selectedConversation,
            starred: result.starred,
          });
        }
      }
    } catch (error) {
      console.error("Toggle star error:", error);
    }
  };

  const selectConversation = async (conv: Conversation) => {
    setSelectedConversation(conv);
    setShowMobileConversation(true);

    // Mark as read
    if (conv.unread) {
      try {
        await fetch("/api/messages", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ conversationId: conv.id, action: "markRead" }),
        });

        setConversations(
          conversations.map((c) =>
            c.id === conv.id ? { ...c, unread: false } : c
          )
        );
      } catch (error) {
        console.error("Mark read error:", error);
      }
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sending) return;

    setSending(true);
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: selectedConversation.id,
          content: newMessage,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send message");
      }

      const newMsg: Message = result.data || {
        id: `m${Date.now()}`,
        content: newMessage,
        timestamp: new Date().toISOString(),
        isOwn: true,
      };

      const updatedConversation = {
        ...selectedConversation,
        messages: [...selectedConversation.messages, newMsg],
        lastMessage: newMessage,
        lastMessageAt: new Date().toISOString(),
      };

      setConversations(
        conversations.map((c) =>
          c.id === selectedConversation.id ? updatedConversation : c
        )
      );
      setSelectedConversation(updatedConversation);
      setNewMessage("");
    } catch (error) {
      console.error("Send message error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">
            {unreadCount > 0
              ? `${unreadCount} unread message${unreadCount > 1 ? "s" : ""}`
              : "All messages read"}
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 bg-white rounded-xl border overflow-hidden flex">
        {/* Conversations list */}
        <div
          className={cn(
            "w-full md:w-80 lg:w-96 border-r flex flex-col",
            showMobileConversation && "hidden md:flex"
          )}
        >
          {/* Search */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages..."
                className="pl-9"
              />
            </div>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {searchQuery ? "No conversations found" : "No messages yet"}
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => selectConversation(conv)}
                  className={cn(
                    "w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b text-left",
                    selectedConversation?.id === conv.id && "bg-blue-50",
                    conv.unread && "bg-blue-50/50"
                  )}
                >
                  <div className="relative flex-shrink-0">
                    <Image
                      src={conv.contact.avatar}
                      alt={conv.contact.name}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                    {conv.contact.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={cn(
                          "font-medium text-gray-900 truncate",
                          conv.unread && "font-semibold"
                        )}
                      >
                        {conv.contact.name}
                      </p>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {formatTimestamp(conv.lastMessageAt)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {conv.contact.role} at {conv.contact.company}
                    </p>
                    <p
                      className={cn(
                        "text-sm text-gray-600 truncate mt-1",
                        conv.unread && "font-medium text-gray-900"
                      )}
                    >
                      {conv.lastMessage}
                    </p>
                  </div>
                  {conv.starred && (
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500 flex-shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Conversation view */}
        <div
          className={cn(
            "flex-1 flex flex-col",
            !showMobileConversation && "hidden md:flex"
          )}
        >
          {selectedConversation ? (
            <>
              {/* Conversation header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowMobileConversation(false)}
                    className="md:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="relative">
                    <Image
                      src={selectedConversation.contact.avatar}
                      alt={selectedConversation.contact.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                    {selectedConversation.contact.online && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {selectedConversation.contact.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {selectedConversation.contact.role} at{" "}
                      {selectedConversation.contact.company}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
                    <Video className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => toggleStar(selectedConversation.id)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    {selectedConversation.starred ? (
                      <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    ) : (
                      <StarOff className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
                    <Info className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedConversation.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex",
                      msg.isOwn ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[70%] rounded-2xl px-4 py-2",
                        msg.isOwn
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      )}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p
                        className={cn(
                          "text-xs mt-1",
                          msg.isOwn ? "text-blue-200" : "text-gray-500"
                        )}
                      >
                        {formatTimestamp(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message input */}
              <div className="p-4 border-t">
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    disabled={sending}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sending}
                    size="icon"
                  >
                    {sending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-gray-400" />
                </div>
                <p className="font-medium">Select a conversation</p>
                <p className="text-sm mt-1">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
