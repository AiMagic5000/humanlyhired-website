"use client";

import { useState, useEffect } from "react";
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
  Filter,
  Flag,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  RefreshCw,
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

interface SupportTicket {
  id: string;
  contact: {
    name: string;
    avatar: string;
    email: string;
    type: "candidate" | "employer";
    company?: string;
  };
  subject: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  starred: boolean;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "pending" | "resolved" | "closed";
  messages: Message[];
}

interface Stats {
  open: number;
  pending: number;
  urgent: number;
  resolved: number;
}

type FilterType = "all" | "open" | "pending" | "resolved" | "urgent";

export default function AdminMessagesPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [stats, setStats] = useState<Stats>({ open: 0, pending: 0, urgent: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [showMobileConversation, setShowMobileConversation] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);

      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (filter !== "all") params.append("status", filter);

      const response = await fetch(`/api/admin/messages?${params.toString()}`);
      const result = await response.json();

      if (result.success && result.data) {
        setTickets(result.data.tickets);
        setStats(result.data.stats);
        if (showToast) {
          toast.success("Tickets refreshed");
        }
      } else {
        throw new Error(result.error || "Failed to fetch tickets");
      }
    } catch (error) {
      console.error("Fetch tickets error:", error);
      if (showToast) {
        toast.error("Failed to refresh tickets");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = () => {
    fetchTickets(true);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes} min ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return `Today ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
    } else if (diffInHours < 48) {
      return `Yesterday ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    }
  };

  const toggleStar = async (id: string) => {
    const ticket = tickets.find(t => t.id === id);
    if (!ticket) return;

    const newStarred = !ticket.starred;

    // Optimistic update
    setTickets(tickets.map((t) => (t.id === id ? { ...t, starred: newStarred } : t)));
    if (selectedTicket?.id === id) {
      setSelectedTicket({ ...selectedTicket, starred: newStarred });
    }

    try {
      await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId: id, starred: newStarred }),
      });
    } catch (error) {
      console.error("Toggle star error:", error);
      // Revert on error
      setTickets(tickets.map((t) => (t.id === id ? { ...t, starred: !newStarred } : t)));
    }
  };

  const selectTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setShowMobileConversation(true);
    if (ticket.unread) {
      setTickets(tickets.map((t) => (t.id === ticket.id ? { ...t, unread: false } : t)));
    }
  };

  const updateStatus = async (status: SupportTicket["status"]) => {
    if (!selectedTicket) return;

    const updated = { ...selectedTicket, status };
    setTickets(tickets.map((t) => (t.id === selectedTicket.id ? updated : t)));
    setSelectedTicket(updated);

    try {
      await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId: selectedTicket.id, status }),
      });
      toast.success(`Ticket marked as ${status}`);
    } catch (error) {
      console.error("Update status error:", error);
      toast.error("Failed to update status");
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;

    setSendingMessage(true);

    const newMsg: Message = {
      id: `m${Date.now()}`,
      content: newMessage,
      timestamp: new Date().toISOString(),
      isOwn: true,
    };

    const updatedTicket = {
      ...selectedTicket,
      messages: [...selectedTicket.messages, newMsg],
      lastMessage: newMessage,
      timestamp: new Date().toISOString(),
    };

    // Optimistic update
    setTickets(tickets.map((t) => (t.id === selectedTicket.id ? updatedTicket : t)));
    setSelectedTicket(updatedTicket);
    setNewMessage("");

    try {
      await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId: selectedTicket.id, message: newMessage }),
      });
    } catch (error) {
      console.error("Send message error:", error);
      toast.error("Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  const getPriorityBadge = (priority: SupportTicket["priority"]) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-700";
      case "high":
        return "bg-orange-100 text-orange-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusBadge = (status: SupportTicket["status"]) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "resolved":
        return "bg-emerald-100 text-emerald-700";
      default:
        return "bg-gray-100 text-gray-700";
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
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
          <p className="text-gray-600 mt-1">Manage customer support requests</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchTickets(true)}
          disabled={refreshing}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.open}</p>
              <p className="text-sm text-gray-500">Open Tickets</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <Flag className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.urgent}</p>
              <p className="text-sm text-gray-500">Urgent</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
              <p className="text-sm text-gray-500">Resolved</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="h-[calc(100vh-24rem)] bg-white rounded-xl border overflow-hidden flex">
        {/* Tickets list */}
        <div
          className={cn(
            "w-full md:w-80 lg:w-96 border-r flex flex-col",
            showMobileConversation && "hidden md:flex"
          )}
        >
          {/* Search and Filter */}
          <div className="p-4 border-b space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search tickets..."
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value as FilterType);
                  setTimeout(() => handleSearch(), 0);
                }}
                className="flex-1 px-2 py-1.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Tickets</option>
                <option value="open">Open</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="urgent">Urgent Only</option>
              </select>
            </div>
          </div>

          {/* Ticket list */}
          <div className="flex-1 overflow-y-auto">
            {tickets.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No tickets found</div>
            ) : (
              tickets.map((ticket) => (
                <button
                  key={ticket.id}
                  onClick={() => selectTicket(ticket)}
                  className={cn(
                    "w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b text-left",
                    selectedTicket?.id === ticket.id && "bg-blue-50",
                    ticket.unread && "bg-blue-50/50"
                  )}
                >
                  <div className="relative flex-shrink-0">
                    <Image
                      src={ticket.contact.avatar}
                      alt={ticket.contact.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                    {ticket.priority === "urgent" && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <Flag className="w-2.5 h-2.5 text-white" />
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={cn(
                          "font-medium text-gray-900 truncate text-sm",
                          ticket.unread && "font-semibold"
                        )}
                      >
                        {ticket.contact.name}
                      </p>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {formatTimestamp(ticket.timestamp)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-500">{ticket.id}</span>
                      <span
                        className={cn(
                          "text-xs px-1.5 py-0.5 rounded capitalize",
                          ticket.contact.type === "employer"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        )}
                      >
                        {ticket.contact.type}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-700 truncate mt-1">
                      {ticket.subject}
                    </p>
                    <p
                      className={cn(
                        "text-xs text-gray-500 truncate mt-0.5",
                        ticket.unread && "text-gray-700"
                      )}
                    >
                      {ticket.lastMessage}
                    </p>
                  </div>
                  {ticket.starred && (
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500 flex-shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Conversation view */}
        <div
          className={cn("flex-1 flex flex-col", !showMobileConversation && "hidden md:flex")}
        >
          {selectedTicket ? (
            <>
              {/* Ticket header */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowMobileConversation(false)}
                      className="md:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="relative">
                      <Image
                        src={selectedTicket.contact.avatar}
                        alt={selectedTicket.contact.name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">
                          {selectedTicket.contact.name}
                        </p>
                        <span
                          className={cn(
                            "text-xs px-1.5 py-0.5 rounded capitalize",
                            selectedTicket.contact.type === "employer"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                          )}
                        >
                          {selectedTicket.contact.type}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {selectedTicket.contact.email}
                        {selectedTicket.contact.company &&
                          ` • ${selectedTicket.contact.company}`}
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
                      onClick={() => toggleStar(selectedTicket.id)}
                      className="p-2 rounded-lg hover:bg-gray-100"
                    >
                      {selectedTicket.starred ? (
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

                {/* Ticket info bar */}
                <div className="flex flex-wrap items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Ticket:</span>
                    <span className="text-xs font-medium">{selectedTicket.id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Priority:</span>
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full capitalize font-medium",
                        getPriorityBadge(selectedTicket.priority)
                      )}
                    >
                      {selectedTicket.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Status:</span>
                    <select
                      value={selectedTicket.status}
                      onChange={(e) =>
                        updateStatus(e.target.value as SupportTicket["status"])
                      }
                      className={cn(
                        "text-xs px-2 py-1 rounded-full capitalize font-medium border-0 cursor-pointer",
                        getStatusBadge(selectedTicket.status)
                      )}
                    >
                      <option value="open">Open</option>
                      <option value="pending">Pending</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <div className="flex-1 text-right">
                    <span className="text-xs text-gray-500">
                      Subject: <span className="text-gray-700">{selectedTicket.subject}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedTicket.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn("flex", msg.isOwn ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[70%] rounded-2xl px-4 py-2",
                        msg.isOwn ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                      )}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p
                        className={cn(
                          "text-xs mt-1",
                          msg.isOwn ? "text-blue-200" : "text-gray-500"
                        )}
                      >
                        {formatMessageTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
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
                    placeholder="Type a response..."
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sendingMessage}
                    size="icon"
                  >
                    {sendingMessage ? (
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
                <p className="font-medium">Select a support ticket</p>
                <p className="text-sm mt-1">Choose a ticket from the list to respond</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
