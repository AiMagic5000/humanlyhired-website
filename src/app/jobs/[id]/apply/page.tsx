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
  ArrowRight,
  Upload,
  CheckCircle2,
  Briefcase,
  User,
  FileText,
  Send,
  Loader2
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
  linkedin: z.string().url().optional().or(z.literal("")),
  portfolio: z.string().url().optional().or(z.literal("")),
  currentTitle: z.string().min(2, "Current job title is required"),
  yearsExperience: z.string().min(1, "Years of experience is required"),
  coverLetter: z.string().min(50, "Cover letter must be at least 50 characters"),
  whyInterested: z.string().min(20, "Please tell us why you're interested"),
  salary: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  referral: z.string().optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

const steps = [
  { id: 1, name: "Personal Info", icon: User },
  { id: 2, name: "Experience", icon: Briefcase },
  { id: 3, name: "Cover Letter", icon: FileText },
  { id: 4, name: "Review", icon: Send },
];

export default function ApplyPage() {
  const params = useParams();
  const { user, isLoaded, isSignedIn } = useSafeUser();
  const [currentStep, setCurrentStep] = React.useState(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [resumeFile, setResumeFile] = React.useState<File | null>(null);
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
    setValue,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.primaryEmailAddress?.emailAddress || "",
    },
  });

  // Pre-fill form when user data loads
  React.useEffect(() => {
    if (user) {
      setValue("firstName", user.firstName || "");
      setValue("lastName", user.lastName || "");
      setValue("email", user.primaryEmailAddress?.emailAddress || "");
    }
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

  const validateStep = async (step: number) => {
    let fieldsToValidate: (keyof ApplicationFormData)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = ["firstName", "lastName", "email", "phone"];
        break;
      case 2:
        fieldsToValidate = ["currentTitle", "yearsExperience", "startDate"];
        break;
      case 3:
        fieldsToValidate = ["coverLetter", "whyInterested"];
        break;
    }

    const isValid = await trigger(fieldsToValidate);
    return isValid;
  };

  const nextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);

    try {
      // Submit application to API
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId: job.id,
          ...data,
          resumeUrl: resumeFile ? `resume_${Date.now()}_${resumeFile.name}` : undefined,
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
      toast.error(error instanceof Error ? error.message : "Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setResumeFile(file);
      toast.success("Resume uploaded successfully");
    }
  };

  // Success state
  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-2xl px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-gray-900">
              Application Submitted!
            </h1>
            <p className="mt-4 text-gray-600">
              Thank you for applying to <strong>{job.title}</strong> at{" "}
              <strong>{job.company}</strong>. We&apos;ve received your application and
              will review it shortly.
            </p>
            <div className="mt-8 p-4 bg-blue-50 rounded-xl">
              <h3 className="font-semibold text-blue-900">What happens next?</h3>
              <ul className="mt-3 text-sm text-blue-800 space-y-2 text-left">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>You&apos;ll receive a confirmation email shortly</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Our team will review your application within 3-5 business days</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>If selected, we&apos;ll contact you to schedule an interview</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/dashboard/applications">View My Applications</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/jobs">Browse More Jobs</Link>
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
            <h1 className="text-2xl font-bold text-gray-900">Sign In Required</h1>
            <p className="mt-4 text-gray-600">
              Please sign in or create an account to apply for this position.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href={`/sign-in?redirect_url=/jobs/${job.id}/apply`}>Sign In</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/sign-up?redirect_url=/jobs/${job.id}/apply`}>Create Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formValues = getValues();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-3xl px-4">
        {/* Back Link */}
        <Link
          href={`/jobs/${job.id}`}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Job Details
        </Link>

        {/* Job Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{job.title}</h2>
              <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                    currentStep > step.id
                      ? "bg-green-500 border-green-500 text-white"
                      : currentStep === step.id
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  )}
                >
                  {currentStep > step.id ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-16 sm:w-24 h-1 mx-2",
                      currentStep > step.id ? "bg-green-500" : "bg-gray-200"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((step) => (
              <span
                key={step.id}
                className={cn(
                  "text-xs font-medium",
                  currentStep >= step.id ? "text-gray-900" : "text-gray-400"
                )}
              >
                {step.name}
              </span>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                  <p className="text-gray-600 mt-1">Tell us about yourself</p>
                </div>

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
                      <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>
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
                      <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

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
                    <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                  )}
                </div>

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
                    <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      LinkedIn Profile
                    </label>
                    <Input
                      {...register("linkedin")}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Portfolio/Website
                    </label>
                    <Input
                      {...register("portfolio")}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Experience */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Experience & Availability</h2>
                  <p className="text-gray-600 mt-1">Tell us about your background</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Job Title *
                  </label>
                  <Input
                    {...register("currentTitle")}
                    placeholder="Senior Software Engineer"
                    className={errors.currentTitle ? "border-red-500" : ""}
                  />
                  {errors.currentTitle && (
                    <p className="text-sm text-red-500 mt-1">{errors.currentTitle.message}</p>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Years of Experience *
                    </label>
                    <select
                      {...register("yearsExperience")}
                      className={cn(
                        "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                        errors.yearsExperience ? "border-red-500" : "border-gray-300"
                      )}
                    >
                      <option value="">Select...</option>
                      <option value="0-1">0-1 years</option>
                      <option value="2-4">2-4 years</option>
                      <option value="5-7">5-7 years</option>
                      <option value="8-10">8-10 years</option>
                      <option value="10+">10+ years</option>
                    </select>
                    {errors.yearsExperience && (
                      <p className="text-sm text-red-500 mt-1">{errors.yearsExperience.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Earliest Start Date *
                    </label>
                    <select
                      {...register("startDate")}
                      className={cn(
                        "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                        errors.startDate ? "border-red-500" : "border-gray-300"
                      )}
                    >
                      <option value="">Select...</option>
                      <option value="immediately">Immediately</option>
                      <option value="2-weeks">2 weeks notice</option>
                      <option value="1-month">1 month</option>
                      <option value="2-months">2 months</option>
                      <option value="3-months+">3+ months</option>
                    </select>
                    {errors.startDate && (
                      <p className="text-sm text-red-500 mt-1">{errors.startDate.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Desired Salary (Optional)
                  </label>
                  <Input
                    {...register("salary")}
                    placeholder="$120,000 - $150,000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resume/CV *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      id="resume"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="resume" className="cursor-pointer">
                      {resumeFile ? (
                        <div className="flex items-center justify-center gap-3">
                          <FileText className="w-8 h-8 text-blue-600" />
                          <div className="text-left">
                            <p className="font-medium text-gray-900">{resumeFile.name}</p>
                            <p className="text-sm text-gray-500">
                              {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-10 h-10 text-gray-400 mx-auto" />
                          <p className="mt-2 text-sm text-gray-600">
                            <span className="text-blue-600 font-medium">Click to upload</span> or drag and drop
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            PDF, DOC, DOCX up to 5MB
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    How did you hear about us?
                  </label>
                  <select
                    {...register("referral")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select...</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="indeed">Indeed</option>
                    <option value="google">Google Search</option>
                    <option value="referral">Employee Referral</option>
                    <option value="website">Company Website</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 3: Cover Letter */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Tell Us More</h2>
                  <p className="text-gray-600 mt-1">Help us understand why you&apos;re a great fit</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cover Letter *
                  </label>
                  <textarea
                    {...register("coverLetter")}
                    rows={6}
                    placeholder="Tell us about your relevant experience and why you'd be great for this role..."
                    className={cn(
                      "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none",
                      errors.coverLetter ? "border-red-500" : "border-gray-300"
                    )}
                  />
                  {errors.coverLetter && (
                    <p className="text-sm text-red-500 mt-1">{errors.coverLetter.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Why are you interested in this position? *
                  </label>
                  <textarea
                    {...register("whyInterested")}
                    rows={4}
                    placeholder="What excites you about this opportunity and our company?"
                    className={cn(
                      "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none",
                      errors.whyInterested ? "border-red-500" : "border-gray-300"
                    )}
                  />
                  {errors.whyInterested && (
                    <p className="text-sm text-red-500 mt-1">{errors.whyInterested.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Review Your Application</h2>
                  <p className="text-gray-600 mt-1">Please confirm all information is correct</p>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Personal Information</h3>
                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Name:</span>
                        <span className="ml-2 text-gray-900">{formValues.firstName} {formValues.lastName}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Email:</span>
                        <span className="ml-2 text-gray-900">{formValues.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Phone:</span>
                        <span className="ml-2 text-gray-900">{formValues.phone}</span>
                      </div>
                      {formValues.linkedin && (
                        <div>
                          <span className="text-gray-500">LinkedIn:</span>
                          <span className="ml-2 text-blue-600 truncate">{formValues.linkedin}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Experience</h3>
                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Current Title:</span>
                        <span className="ml-2 text-gray-900">{formValues.currentTitle}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Experience:</span>
                        <span className="ml-2 text-gray-900">{formValues.yearsExperience} years</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Start Date:</span>
                        <span className="ml-2 text-gray-900">{formValues.startDate}</span>
                      </div>
                      {resumeFile && (
                        <div>
                          <span className="text-gray-500">Resume:</span>
                          <span className="ml-2 text-gray-900">{resumeFile.name}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Cover Letter</h3>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{formValues.coverLetter}</p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-800">
                    By submitting this application, you agree to our{" "}
                    <Link href="/terms" className="underline">Terms of Service</Link> and{" "}
                    <Link href="/privacy" className="underline">Privacy Policy</Link>.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={currentStep === 1 ? "invisible" : ""}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep < 4 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
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
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
