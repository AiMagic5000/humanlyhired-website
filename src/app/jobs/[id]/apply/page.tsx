"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSafeUser } from "@/hooks/use-safe-clerk";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  ArrowLeft,
  CheckCircle2,
  Briefcase,
  Send,
  Loader2,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { jobs } from "@/data/jobs";
import { cn } from "@/lib/utils";

interface JobData {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string | null;
  industry: string;
  description: string;
  requirements: string[];
  benefits: string[];
}

const applicationSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  monthlyNeed: z.string().min(1, "This field is required"),
  monthlyWant: z.string().min(1, "This field is required"),
  startDate: z.string().min(1, "Start date is required"),
  hoursPerWeek: z.string().min(1, "Hours per week is required"),
  workPreference: z.string().min(1, "Work preference is required"),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

export default function ApplyPage() {
  const params = useParams();
  const { user, isLoaded, isSignedIn } = useSafeUser();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isComplete, setIsComplete] = React.useState(false);
  const [job, setJob] = React.useState<JobData | null>(null);
  const [jobLoading, setJobLoading] = React.useState(true);

  // Fetch job data - first check mock data, then database
  React.useEffect(() => {
    const fetchJob = async () => {
      const jobId = params.id as string;

      // Check mock data first
      const mockJob = jobs.find((j) => j.id === jobId);
      if (mockJob) {
        setJob(mockJob);
        setJobLoading(false);
        return;
      }

      // Fetch from database via API
      try {
        const response = await fetch(`/api/jobs/${jobId}`);
        const data = await response.json();

        if (data.success && data.job) {
          setJob({
            id: data.job.id || data.job.externalId,
            title: data.job.title,
            company: data.job.company,
            location: data.job.location,
            type: data.job.type || data.job.job_type,
            salary: data.job.salary,
            industry: data.job.industry,
            description: data.job.description,
            requirements: data.job.requirements || [],
            benefits: data.job.benefits || [],
          });
        }
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setJobLoading(false);
      }
    };

    if (params.id) {
      fetchJob();
    }
  }, [params.id]);

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      monthlyNeed: "",
      monthlyWant: "",
      startDate: "",
      hoursPerWeek: "",
      workPreference: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = form;

  // Pre-fill form when user data loads
  React.useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      setValue("email", user.primaryEmailAddress.emailAddress);
    }
    if (user?.firstName) setValue("firstName", user.firstName);
    if (user?.lastName) setValue("lastName", user.lastName);
  }, [user, setValue]);

  // Loading state
  if (jobLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Job Not Found</h1>
          <Button asChild className="mt-4">
            <Link href="/jobs">Browse All Jobs</Link>
          </Button>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId: job.id,
          ...data,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit application");
      }

      setIsComplete(true);
      toast.success("Application submitted successfully!");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit application. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-2xl px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-gray-900">
              Application Submitted!
            </h1>
            <p className="mt-4 text-gray-600">
              Thank you for applying to <strong>{job.title}</strong> at{" "}
              <strong>{job.company}</strong>. We&apos;ve received your
              application and will review it shortly.
            </p>
            <div className="mt-8 p-4 bg-emerald-50 rounded-xl">
              <h3 className="font-semibold text-emerald-900">
                What happens next?
              </h3>
              <ul className="mt-3 text-sm text-emerald-800 space-y-2 text-left">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    You&apos;ll receive a confirmation email shortly
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    Our team will review your application within 3-5 business
                    days
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    If selected, we&apos;ll contact you to schedule an interview
                  </span>
                </li>
              </ul>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Link href="/jobs">Browse More Jobs</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard/applications">
                  View My Applications
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  if (isLoaded && !isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-2xl px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Sign In Required
            </h1>
            <p className="mt-4 text-gray-600">
              Please sign in or create an account to apply for this position.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href={`/sign-in?redirect_url=/jobs/${job.id}/apply`}>
                  Sign In
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/sign-up?redirect_url=/jobs/${job.id}/apply`}>
                  Create Account
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-2xl px-4">
        {/* Back Link */}
        <Link
          href={`/jobs/${job.id}`}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Job Details
        </Link>

        {/* Job Summary Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{job.title}</h2>
              <p className="text-sm text-gray-600">
                {job.company} -- {job.location}
              </p>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Apply for this Position
              </h2>
              <p className="text-gray-600 mt-1">
                Fill out the form below and we&apos;ll be in touch.
              </p>
            </div>

            <div className="space-y-5">
              {/* First Name / Last Name - two columns */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <Input
                    {...register("firstName")}
                    placeholder="John"
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <Input
                    {...register("lastName")}
                    placeholder="Doe"
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="john@example.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <Input
                  {...register("phone")}
                  type="tel"
                  placeholder="(555) 123-4567"
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Monthly Need / Monthly Want - two columns */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    How much do you NEED to make per month? *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      {...register("monthlyNeed")}
                      placeholder="3,000"
                      className={cn(
                        "pl-8",
                        errors.monthlyNeed ? "border-red-500" : ""
                      )}
                    />
                  </div>
                  {errors.monthlyNeed && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.monthlyNeed.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    How much do you WANT to make per month? *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      {...register("monthlyWant")}
                      placeholder="5,000"
                      className={cn(
                        "pl-8",
                        errors.monthlyWant ? "border-red-500" : ""
                      )}
                    />
                  </div>
                  {errors.monthlyWant && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.monthlyWant.message}
                    </p>
                  )}
                </div>
              </div>

              {/* When can you start? */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  When can you start? *
                </label>
                <select
                  {...register("startDate")}
                  className={cn(
                    "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white",
                    errors.startDate ? "border-red-500" : "border-gray-300"
                  )}
                >
                  <option value="">Select...</option>
                  <option value="immediately">Immediately</option>
                  <option value="within-1-week">Within 1 week</option>
                  <option value="within-2-weeks">Within 2 weeks</option>
                  <option value="within-1-month">Within 1 month</option>
                  <option value="1-2-months">1-2 months</option>
                  <option value="3-plus-months">3+ months</option>
                </select>
                {errors.startDate && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              {/* Hours per week */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  How many hours per week can you work? *
                </label>
                <select
                  {...register("hoursPerWeek")}
                  className={cn(
                    "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white",
                    errors.hoursPerWeek ? "border-red-500" : "border-gray-300"
                  )}
                >
                  <option value="">Select...</option>
                  <option value="less-than-10">Less than 10</option>
                  <option value="10-20">10-20</option>
                  <option value="20-30">20-30</option>
                  <option value="30-40">30-40</option>
                  <option value="40-plus">40+ (Full-time)</option>
                </select>
                {errors.hoursPerWeek && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.hoursPerWeek.message}
                  </p>
                )}
              </div>

              {/* Work preference */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Work preference *
                </label>
                <select
                  {...register("workPreference")}
                  className={cn(
                    "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white",
                    errors.workPreference
                      ? "border-red-500"
                      : "border-gray-300"
                  )}
                >
                  <option value="">Select...</option>
                  <option value="on-location">On-location only</option>
                  <option value="remote">Remote only</option>
                  <option value="hybrid">Hybrid (mix of both)</option>
                  <option value="no-preference">No preference</option>
                </select>
                {errors.workPreference && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.workPreference.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-base font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <Send className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
