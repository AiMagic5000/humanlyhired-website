import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Building2,
  ArrowLeft,
  Share2,
  Heart,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { jobs } from "@/data/jobs";
import { supabaseAdmin } from "@/lib/supabase";

// Force dynamic rendering to avoid Clerk issues during static generation
export const dynamic = "force-dynamic";

interface JobData {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string | null;
  industry: string;
  description: string;
  requirements: string[];
  benefits: string[];
  featured?: boolean;
  postedDate: string;
  applyUrl?: string;  // External apply URL for external jobs
  source?: string;    // Job source (database, joinrise, etc.)
  skills?: string[];  // Skills from external jobs
}

// Fetch job from external API by ID
async function getExternalJob(id: string): Promise<JobData | null> {
  try {
    // Get the base URL from environment or use relative URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';
    const response = await fetch(`${baseUrl}/api/jobs?limit=500`, {
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!response.ok) return null;

    const data = await response.json();
    const job = data.jobs?.find((j: any) => j.id === id);

    if (!job) return null;

    return {
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      salary: job.salary,
      industry: job.industry || 'Other',
      description: job.description || 'No description available.',
      requirements: job.requirements || [],
      benefits: job.benefits || [],
      featured: job.featured || false,
      postedDate: job.postedDate,
      applyUrl: job.applyUrl,
      source: job.source,
      skills: job.skills || [],
    };
  } catch (error) {
    console.error('Error fetching external job:', error);
    return null;
  }
}

async function getJob(id: string): Promise<JobData | null> {
  // Check if this is an external job (prefixed with source like joinrise_, db_, etc.)
  const isExternalJob = id.includes('_') && !id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-/);

  if (isExternalJob) {
    return getExternalJob(id);
  }

  // Check mock data first
  const mockJob = jobs.find((j) => j.id === id);
  if (mockJob) {
    return { ...mockJob, applyUrl: `/jobs/${id}/apply`, source: 'internal' };
  }

  // Fetch from database
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl || supabaseUrl.includes("your-project")) {
    return null;
  }

  try {
    // Try humanly_jobs table first
    const { data: humanlyJob, error } = await supabaseAdmin
      .from("humanly_jobs")
      .select("*")
      .eq("id", id)
      .eq("status", "active")
      .single();

    if (humanlyJob && !error) {
      return {
        id: humanlyJob.id,
        title: humanlyJob.title,
        company: humanlyJob.company,
        location: humanlyJob.location,
        type: humanlyJob.job_type || "full-time",
        salary: humanlyJob.salary_min && humanlyJob.salary_max
          ? `$${humanlyJob.salary_min.toLocaleString()} - $${humanlyJob.salary_max.toLocaleString()}`
          : null,
        industry: humanlyJob.industry || "general",
        description: humanlyJob.description || "",
        requirements: humanlyJob.requirements || [],
        benefits: humanlyJob.benefits || [],
        featured: humanlyJob.featured || false,
        postedDate: humanlyJob.created_at,
        applyUrl: `/jobs/${humanlyJob.id}/apply`,
        source: 'database',
      };
    }

    // Try jobs table (employer-posted)
    const { data: employerJob, error: employerError } = await supabaseAdmin
      .from("jobs")
      .select("*")
      .eq("id", id)
      .single();

    if (employerJob && !employerError) {
      return {
        id: employerJob.id,
        title: employerJob.title,
        company: employerJob.company || "Unknown Company",
        location: employerJob.location,
        type: employerJob.type || employerJob.job_type || "full-time",
        salary: employerJob.salary_range || null,
        industry: employerJob.industry || "general",
        description: employerJob.description || "",
        requirements: employerJob.requirements ?
          (typeof employerJob.requirements === 'string' ?
            employerJob.requirements.split('\n').filter(Boolean) :
            employerJob.requirements) : [],
        benefits: employerJob.benefits ?
          (typeof employerJob.benefits === 'string' ?
            employerJob.benefits.split('\n').filter(Boolean) :
            employerJob.benefits) : [],
        featured: employerJob.featured || false,
        postedDate: employerJob.created_at,
        applyUrl: `/jobs/${employerJob.id}/apply`,
        source: 'database',
      };
    }
  } catch (error) {
    console.error("Error fetching job from database:", error);
  }

  return null;
}

interface JobPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) {
    return {
      title: "Job Not Found",
    };
  }

  return {
    title: `${job.title} at ${job.company}`,
    description: job.description,
  };
}

export default async function JobDetailPage({ params }: JobPageProps) {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) {
    notFound();
  }

  // Get similar jobs from mock data for now
  const similarJobs = jobs
    .filter((j) => j.industry === job.industry && j.id !== job.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge>{job.industry}</Badge>
                {job.featured && <Badge variant="success">Featured</Badge>}
                <Badge variant="outline">{job.type}</Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                {job.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-gray-600">
                <span className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {job.company}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {job.location}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Posted {new Date(job.postedDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" size="lg">
                <Heart className="h-5 w-5 mr-2" />
                Save Job
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="h-5 w-5 mr-2" />
                Share
              </Button>
              <Button asChild size="lg">
                <Link href={`/jobs/${id}/apply`}>Apply Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Job Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">{job.description}</p>
              </CardContent>
            </Card>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Skills (for external jobs) */}
            {job.skills && job.skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-sm py-1.5 px-3">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {job.benefits.map((benefit, index) => (
                      <Badge key={index} variant="secondary" className="text-sm py-1.5 px-3">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Job Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Job Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Salary</p>
                    <p className="font-medium text-gray-900">{job.salary}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-emerald-100 p-2 text-emerald-600">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Job Type</p>
                    <p className="font-medium text-gray-900">{job.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-purple-100 p-2 text-purple-600">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium text-gray-900">{job.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-amber-100 p-2 text-amber-600">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Industry</p>
                    <p className="font-medium text-gray-900">{job.industry}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Apply CTA */}
            <Card className="bg-blue-600 text-white border-0">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold">Ready to Apply?</h3>
                <p className="mt-2 text-blue-100 text-sm">
                  Submit your application and take the next step in your career.
                </p>
                <Button
                  asChild
                  variant="secondary"
                  className="w-full mt-4 bg-white text-blue-600 hover:bg-blue-50"
                >
                  <Link href={`/jobs/${id}/apply`}>Apply Now</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Similar Jobs */}
            {similarJobs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Similar Jobs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {similarJobs.map((similarJob) => (
                    <Link
                      key={similarJob.id}
                      href={`/jobs/${similarJob.id}`}
                      className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <p className="font-medium text-gray-900 hover:text-blue-600">
                        {similarJob.title}
                      </p>
                      <p className="text-sm text-gray-500">{similarJob.company}</p>
                      <p className="text-sm text-gray-400 mt-1">{similarJob.location}</p>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
