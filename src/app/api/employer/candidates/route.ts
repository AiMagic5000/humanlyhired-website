import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

// Demo candidates data for fallback
const demoCandidates = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    headline: "Senior Software Engineer",
    location: "San Francisco, CA",
    experience: "8 years",
    education: "MS Computer Science, Stanford",
    skills: ["JavaScript", "React", "Node.js", "AWS", "Python"],
    matchScore: 95,
    status: "Open to work",
    lastActive: "2 hours ago",
    starred: true,
  },
  {
    id: "2",
    name: "Michael Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    headline: "Full Stack Developer",
    location: "New York, NY",
    experience: "6 years",
    education: "BS Computer Science, MIT",
    skills: ["TypeScript", "React", "Go", "PostgreSQL", "Docker"],
    matchScore: 88,
    status: "Open to work",
    lastActive: "1 day ago",
    starred: false,
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    headline: "Product Manager",
    location: "Austin, TX",
    experience: "5 years",
    education: "MBA, Harvard Business School",
    skills: ["Product Strategy", "Agile", "Data Analysis", "User Research", "Roadmapping"],
    matchScore: 82,
    status: "Actively looking",
    lastActive: "3 hours ago",
    starred: true,
  },
  {
    id: "4",
    name: "David Kim",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    headline: "DevOps Engineer",
    location: "Seattle, WA",
    experience: "7 years",
    education: "BS Computer Engineering, UC Berkeley",
    skills: ["Kubernetes", "Terraform", "AWS", "CI/CD", "Python"],
    matchScore: 79,
    status: "Open to work",
    lastActive: "5 days ago",
    starred: false,
  },
  {
    id: "5",
    name: "Amanda Thompson",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
    headline: "UX Designer",
    location: "Remote",
    experience: "4 years",
    education: "BFA Design, RISD",
    skills: ["Figma", "User Research", "Prototyping", "Design Systems", "Accessibility"],
    matchScore: 76,
    status: "Passively looking",
    lastActive: "1 week ago",
    starred: false,
  },
];

const filterOptions = {
  experience: ["0-2 years", "3-5 years", "6-10 years", "10+ years"],
  location: ["Remote", "San Francisco, CA", "New York, NY", "Austin, TX", "Seattle, WA"],
  skills: ["JavaScript", "React", "Python", "AWS", "Node.js", "TypeScript", "Go", "Kubernetes"],
  education: ["High School", "Bachelor's", "Master's", "PhD"],
  status: ["Open to work", "Actively looking", "Passively looking"],
};

function formatLastActive(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "1 day ago";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} week${Math.floor(diffInDays / 7) > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

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
    const experience = searchParams.get("experience") || "";
    const location = searchParams.get("location") || "";
    const skill = searchParams.get("skill") || "";

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes("your-project");

    if (isSupabaseConfigured) {
      try {
        // Fetch profiles that are marked as job seekers
        let query = supabaseAdmin
          .from("profiles")
          .select(`
            user_id,
            full_name,
            avatar_url,
            headline,
            location,
            years_experience,
            education,
            skills,
            job_seeking_status,
            last_active_at,
            created_at
          `)
          .eq("is_job_seeker", true)
          .not("job_seeking_status", "is", null);

        // Apply search filter
        if (search) {
          query = query.or(`full_name.ilike.%${search}%,headline.ilike.%${search}%,skills.cs.{${search}}`);
        }

        // Apply location filter
        if (location) {
          query = query.ilike("location", `%${location}%`);
        }

        const { data: profiles, error } = await query.limit(20);

        if (!error && profiles && profiles.length > 0) {
          // Get employer's saved candidates (starred)
          const { data: savedCandidates } = await supabaseAdmin
            .from("saved_candidates")
            .select("candidate_id")
            .eq("employer_id", userId);

          const savedIds = new Set(savedCandidates?.map(sc => sc.candidate_id) || []);

          // Transform profiles to candidate format
          const candidates = profiles.map((profile) => ({
            id: profile.user_id,
            name: profile.full_name || "Unknown",
            avatar: profile.avatar_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
            headline: profile.headline || "Professional",
            location: profile.location || "Unknown",
            experience: `${profile.years_experience || 0} years`,
            education: profile.education || "Not specified",
            skills: profile.skills || [],
            matchScore: Math.floor(Math.random() * 30) + 70, // Simulated match score
            status: profile.job_seeking_status || "Open to work",
            lastActive: formatLastActive(profile.last_active_at || profile.created_at),
            starred: savedIds.has(profile.user_id),
          }));

          return NextResponse.json({
            success: true,
            data: {
              candidates,
              filterOptions,
              total: candidates.length,
            },
            source: "database",
          });
        }
      } catch (dbError) {
        console.log("Database query failed, using demo data:", dbError);
      }
    }

    // Filter demo data based on search params
    let filteredCandidates = [...demoCandidates];

    if (search) {
      const searchLower = search.toLowerCase();
      filteredCandidates = filteredCandidates.filter(c =>
        c.name.toLowerCase().includes(searchLower) ||
        c.headline.toLowerCase().includes(searchLower) ||
        c.skills.some(s => s.toLowerCase().includes(searchLower))
      );
    }

    if (location) {
      filteredCandidates = filteredCandidates.filter(c =>
        c.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (skill) {
      filteredCandidates = filteredCandidates.filter(c =>
        c.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        candidates: filteredCandidates,
        filterOptions,
        total: filteredCandidates.length,
      },
      source: "demo",
    });
  } catch (error) {
    console.error("Employer candidates error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch candidates" },
      { status: 500 }
    );
  }
}

// Save/unsave a candidate
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
    const { candidateId, action } = body;

    if (!candidateId || !action) {
      return NextResponse.json(
        { success: false, error: "Candidate ID and action are required" },
        { status: 400 }
      );
    }

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes("your-project");

    if (isSupabaseConfigured) {
      try {
        if (action === "star") {
          // Add to saved candidates
          await supabaseAdmin
            .from("saved_candidates")
            .upsert({
              employer_id: userId,
              candidate_id: candidateId,
              created_at: new Date().toISOString(),
            }, { onConflict: "employer_id,candidate_id" });
        } else if (action === "unstar") {
          // Remove from saved candidates
          await supabaseAdmin
            .from("saved_candidates")
            .delete()
            .eq("employer_id", userId)
            .eq("candidate_id", candidateId);
        }

        return NextResponse.json({
          success: true,
          message: action === "star" ? "Candidate saved" : "Candidate removed from saved",
        });
      } catch (dbError) {
        console.log("Database update failed:", dbError);
      }
    }

    // Demo mode response
    return NextResponse.json({
      success: true,
      message: action === "star" ? "Candidate saved" : "Candidate removed from saved",
    });
  } catch (error) {
    console.error("Update candidate error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update candidate" },
      { status: 500 }
    );
  }
}
