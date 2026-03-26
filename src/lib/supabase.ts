import { createClient } from '@supabase/supabase-js';
import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Use placeholder URL for build time to prevent errors
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';

// Browser client for client-side operations
export function createBrowserSupabaseClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Server client for server-side operations
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  });
}

// Admin client for server-side admin operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Database types (to be generated from Supabase)
export interface Database {
  public: {
    Tables: {
      jobs: {
        Row: {
          id: string;
          title: string;
          company: string;
          description: string;
          requirements: string[];
          benefits: string[];
          salary_min: number | null;
          salary_max: number | null;
          salary_type: 'hourly' | 'annual';
          location: string;
          remote: boolean;
          job_type: 'full-time' | 'part-time' | 'contract' | 'temporary';
          industry: string;
          experience_level: 'entry' | 'mid' | 'senior' | 'executive';
          employer_id: string;
          status: 'draft' | 'active' | 'paused' | 'closed';
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['jobs']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['jobs']['Insert']>;
      };
      applications: {
        Row: {
          id: string;
          job_id: string;
          candidate_id: string;
          status: 'pending' | 'reviewing' | 'interviewing' | 'offered' | 'hired' | 'rejected' | 'withdrawn';
          cover_letter: string | null;
          resume_url: string | null;
          answers: Record<string, string> | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['applications']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['applications']['Insert']>;
      };
      profiles: {
        Row: {
          id: string;
          user_id: string;
          role: 'candidate' | 'employer' | 'admin';
          first_name: string;
          last_name: string;
          email: string;
          phone: string | null;
          avatar_url: string | null;
          headline: string | null;
          bio: string | null;
          location: string | null;
          resume_url: string | null;
          linkedin_url: string | null;
          website_url: string | null;
          skills: string[];
          experience_years: number | null;
          desired_salary: number | null;
          desired_job_types: string[];
          desired_industries: string[];
          open_to_remote: boolean;
          email_notifications: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      companies: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          slug: string;
          logo_url: string | null;
          cover_url: string | null;
          description: string | null;
          website: string | null;
          industry: string;
          size: string;
          founded: number | null;
          headquarters: string | null;
          locations: string[];
          benefits: string[];
          culture: string | null;
          verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['companies']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['companies']['Insert']>;
      };
      saved_jobs: {
        Row: {
          id: string;
          user_id: string;
          job_id: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['saved_jobs']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['saved_jobs']['Insert']>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: 'application_update' | 'new_job' | 'message' | 'system';
          title: string;
          message: string;
          link: string | null;
          read: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>;
      };
    };
  };
}

export type Job = Database['public']['Tables']['jobs']['Row'];
export type Application = Database['public']['Tables']['applications']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Company = Database['public']['Tables']['companies']['Row'];
export type SavedJob = Database['public']['Tables']['saved_jobs']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];
