"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const industries = [
  "Technology & IT",
  "Healthcare",
  "Finance & Accounting",
  "Manufacturing",
  "Retail & Hospitality",
  "Logistics & Warehouse",
  "Other",
];

const jobTypes = ["Full-time", "Part-time", "Contract", "Temporary", "Contract-to-Hire"];

const urgencyLevels = [
  "Immediately (1-2 weeks)",
  "Soon (2-4 weeks)",
  "Planning ahead (1-2 months)",
  "No rush (3+ months)",
];

const talentRequestSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  industry: z.string().min(2, "Industry is required"),
  contactName: z.string().min(2, "Contact name is required"),
  contactTitle: z.string().min(2, "Job title is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  positionTitle: z.string().min(2, "Position title is required"),
  numberOfPositions: z.number().min(1, "At least 1 position required"),
  employmentType: z.string().min(2, "Employment type is required"),
  location: z.string().min(2, "Location is required"),
  salaryRange: z.string().optional(),
  hiringTimeline: z.string().min(2, "Hiring timeline is required"),
  jobDescription: z.string().min(50, "Job description must be at least 50 characters"),
  additionalNotes: z.string().optional(),
});

type TalentRequestFormData = z.infer<typeof talentRequestSchema>;

export default function RequestTalentPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TalentRequestFormData>({
    resolver: zodResolver(talentRequestSchema),
    defaultValues: {
      numberOfPositions: 1,
    },
  });

  const onSubmit = async (data: TalentRequestFormData) => {
    try {
      const response = await fetch("/api/talent-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit request");
      }

      setSubmitted(true);
      toast.success("Talent request submitted successfully!");
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit request");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-6">
            <CheckCircle className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Request Submitted!</h1>
          <p className="mt-4 text-lg text-gray-600">
            Thank you for your talent request. Our team will review your requirements and
            reach out within 24 hours to discuss next steps.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild>
              <Link href="/employers">Back to Employers</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Link
            href="/employers"
            className="inline-flex items-center gap-2 text-sm text-blue-100 hover:text-white mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Employers
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Request Talent</h1>
          <p className="mt-4 text-lg text-blue-100 max-w-2xl">
            Tell us about your hiring needs and we&apos;ll connect you with qualified candidates.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Company Information</h2>

            <div className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <Input
                    {...register("companyName")}
                    placeholder="Acme Corporation"
                    className={errors.companyName ? "border-red-500" : ""}
                  />
                  {errors.companyName && (
                    <p className="mt-1 text-sm text-red-500">{errors.companyName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry *
                  </label>
                  <Select onValueChange={(value) => setValue("industry", value)}>
                    <SelectTrigger className={errors.industry ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.industry && (
                    <p className="mt-1 text-sm text-red-500">{errors.industry.message}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Name *
                  </label>
                  <Input
                    {...register("contactName")}
                    placeholder="John Smith"
                    className={errors.contactName ? "border-red-500" : ""}
                  />
                  {errors.contactName && (
                    <p className="mt-1 text-sm text-red-500">{errors.contactName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title *
                  </label>
                  <Input
                    {...register("contactTitle")}
                    placeholder="HR Manager"
                    className={errors.contactTitle ? "border-red-500" : ""}
                  />
                  {errors.contactTitle && (
                    <p className="mt-1 text-sm text-red-500">{errors.contactTitle.message}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <Input
                    type="email"
                    {...register("email")}
                    placeholder="john@company.com"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone *
                  </label>
                  <Input
                    type="tel"
                    {...register("phone")}
                    placeholder="(555) 123-4567"
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                  )}
                </div>
              </div>
            </div>

            <hr className="my-8" />

            <h2 className="text-xl font-semibold text-gray-900 mb-6">Position Details</h2>

            <div className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position Title *
                  </label>
                  <Input
                    {...register("positionTitle")}
                    placeholder="Software Engineer"
                    className={errors.positionTitle ? "border-red-500" : ""}
                  />
                  {errors.positionTitle && (
                    <p className="mt-1 text-sm text-red-500">{errors.positionTitle.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Positions *
                  </label>
                  <Input
                    type="number"
                    min="1"
                    {...register("numberOfPositions", { valueAsNumber: true })}
                    placeholder="1"
                    className={errors.numberOfPositions ? "border-red-500" : ""}
                  />
                  {errors.numberOfPositions && (
                    <p className="mt-1 text-sm text-red-500">{errors.numberOfPositions.message}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employment Type *
                  </label>
                  <Select onValueChange={(value) => setValue("employmentType", value)}>
                    <SelectTrigger className={errors.employmentType ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.employmentType && (
                    <p className="mt-1 text-sm text-red-500">{errors.employmentType.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <Input
                    {...register("location")}
                    placeholder="City, State or Remote"
                    className={errors.location ? "border-red-500" : ""}
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-500">{errors.location.message}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salary Range
                  </label>
                  <Input {...register("salaryRange")} placeholder="$80,000 - $100,000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hiring Timeline *
                  </label>
                  <Select onValueChange={(value) => setValue("hiringTimeline", value)}>
                    <SelectTrigger className={errors.hiringTimeline ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      {urgencyLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.hiringTimeline && (
                    <p className="mt-1 text-sm text-red-500">{errors.hiringTimeline.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description & Requirements *
                </label>
                <textarea
                  {...register("jobDescription")}
                  rows={6}
                  placeholder="Describe the role, responsibilities, required skills, and qualifications..."
                  className={`flex w-full rounded-lg border bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-transparent ${
                    errors.jobDescription ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.jobDescription && (
                  <p className="mt-1 text-sm text-red-500">{errors.jobDescription.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  {...register("additionalNotes")}
                  rows={3}
                  placeholder="Any other details that would help us find the right candidate..."
                  className="flex w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-transparent"
                />
              </div>
            </div>

            <div className="mt-8">
              <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
