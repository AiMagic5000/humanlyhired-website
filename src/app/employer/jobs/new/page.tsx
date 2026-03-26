"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Users,
  FileText,
  Eye,
  Loader2,
  Building2,
  X,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const jobSchema = z.object({
  title: z.string().min(5, "Job title must be at least 5 characters"),
  department: z.string().min(2, "Department is required"),
  location: z.string().min(3, "Location is required"),
  locationType: z.enum(["onsite", "remote", "hybrid"]),
  type: z.enum(["full-time", "part-time", "contract", "temporary", "internship"]),
  salaryMin: z.string().optional(),
  salaryMax: z.string().optional(),
  salaryType: z.enum(["year", "hour", "project"]),
  showSalary: z.boolean(),
  experienceLevel: z.enum(["entry", "mid", "senior", "executive"]),
  description: z.string().min(100, "Description must be at least 100 characters"),
  requirements: z.string().min(50, "Requirements must be at least 50 characters"),
  benefits: z.string().optional(),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  applicationDeadline: z.string().optional(),
  startDate: z.string().optional(),
});

type JobFormData = z.infer<typeof jobSchema>;

const steps = [
  { id: 1, name: "Job Details", icon: Briefcase },
  { id: 2, name: "Description", icon: FileText },
  { id: 3, name: "Requirements", icon: Users },
  { id: 4, name: "Review", icon: Eye },
];

const departments = [
  "Engineering",
  "Product",
  "Design",
  "Marketing",
  "Sales",
  "Customer Success",
  "Operations",
  "Finance",
  "HR",
  "Legal",
  "Other",
];

const commonSkills = [
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "Python",
  "Java",
  "SQL",
  "AWS",
  "Docker",
  "Kubernetes",
  "Git",
  "Agile",
  "Scrum",
  "Project Management",
  "Communication",
  "Leadership",
  "Problem Solving",
  "Data Analysis",
  "Machine Learning",
  "UI/UX Design",
];

export default function NewJobPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      locationType: "onsite",
      type: "full-time",
      salaryType: "year",
      showSalary: true,
      experienceLevel: "mid",
      skills: [],
    },
  });

  const watchedValues = watch();

  const addSkill = (skill: string) => {
    if (skill && !selectedSkills.includes(skill)) {
      const newSkills = [...selectedSkills, skill];
      setSelectedSkills(newSkills);
      setValue("skills", newSkills);
    }
    setNewSkill("");
  };

  const removeSkill = (skill: string) => {
    const newSkills = selectedSkills.filter((s) => s !== skill);
    setSelectedSkills(newSkills);
    setValue("skills", newSkills);
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof JobFormData)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = ["title", "department", "location", "locationType", "type"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["description"];
    } else if (currentStep === 3) {
      fieldsToValidate = ["requirements", "skills"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: JobFormData) => {
    setIsSubmitting(true);

    try {
      // Submit job to API
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to post job");
      }

      toast.success("Job posted successfully!");
      router.push("/employer/jobs");
    } catch (error) {
      console.error("Error posting job:", error);
      toast.error(error instanceof Error ? error.message : "Failed to post job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/employer/jobs"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Post a New Job</h1>
        <p className="text-gray-600 mt-1">
          Fill in the details below to create your job posting.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                    currentStep >= step.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={`hidden sm:block text-sm font-medium ${
                    currentStep >= step.id ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-4 rounded-full ${
                    currentStep > step.id ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white rounded-xl border p-6 md:p-8">
          {/* Step 1: Job Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Job Details</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Provide the basic information about the position.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title *
                  </label>
                  <Input
                    {...register("title")}
                    placeholder="e.g., Senior Software Engineer"
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department *
                  </label>
                  <select
                    {...register("department")}
                    className={`w-full rounded-lg border ${
                      errors.department ? "border-red-500" : "border-gray-300"
                    } bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="">Select department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  {errors.department && (
                    <p className="text-sm text-red-500 mt-1">{errors.department.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level *
                  </label>
                  <select
                    {...register("experienceLevel")}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior Level</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <Input
                    {...register("location")}
                    placeholder="e.g., San Francisco, CA"
                    className={errors.location ? "border-red-500" : ""}
                  />
                  {errors.location && (
                    <p className="text-sm text-red-500 mt-1">{errors.location.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location Type *
                  </label>
                  <div className="flex gap-3">
                    {[
                      { value: "onsite", label: "On-site" },
                      { value: "remote", label: "Remote" },
                      { value: "hybrid", label: "Hybrid" },
                    ].map((option) => (
                      <label key={option.value} className="flex-1">
                        <input
                          type="radio"
                          {...register("locationType")}
                          value={option.value}
                          className="sr-only peer"
                        />
                        <div className="text-center py-2.5 px-3 border border-gray-300 rounded-lg cursor-pointer peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:text-blue-600 hover:bg-gray-50 transition-colors text-sm font-medium">
                          {option.label}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employment Type *
                  </label>
                  <select
                    {...register("type")}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="temporary">Temporary</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salary Range
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        {...register("salaryMin")}
                        placeholder="Min"
                        className="pl-8"
                      />
                    </div>
                    <span className="text-gray-400">-</span>
                    <div className="relative flex-1">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        {...register("salaryMax")}
                        placeholder="Max"
                        className="pl-8"
                      />
                    </div>
                    <select
                      {...register("salaryType")}
                      className="w-24 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="year">/year</option>
                      <option value="hour">/hour</option>
                      <option value="project">total</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("showSalary")}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Show salary on job posting</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Description */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Job Description</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Describe the role and what makes it a great opportunity.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  {...register("description")}
                  rows={10}
                  placeholder="Describe the role, responsibilities, and what a typical day looks like..."
                  className={`w-full rounded-lg border ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  } bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Tip: Include information about your team culture, growth opportunities, and what makes this role unique.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Benefits & Perks
                </label>
                <textarea
                  {...register("benefits")}
                  rows={5}
                  placeholder="List the benefits, perks, and compensation beyond salary..."
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Step 3: Requirements */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Requirements & Skills</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Define the qualifications and skills needed for this role.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requirements *
                </label>
                <textarea
                  {...register("requirements")}
                  rows={8}
                  placeholder="List the required qualifications, experience, and education..."
                  className={`w-full rounded-lg border ${
                    errors.requirements ? "border-red-500" : "border-gray-300"
                  } bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.requirements && (
                  <p className="text-sm text-red-500 mt-1">{errors.requirements.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills *
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:text-blue-900"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill(newSkill);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addSkill(newSkill)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-gray-500">Suggestions:</span>
                  {commonSkills
                    .filter((s) => !selectedSkills.includes(s))
                    .slice(0, 10)
                    .map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => addSkill(skill)}
                        className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                      >
                        + {skill}
                      </button>
                    ))}
                </div>
                {errors.skills && (
                  <p className="text-sm text-red-500 mt-2">{errors.skills.message}</p>
                )}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application Deadline
                  </label>
                  <Input type="date" {...register("applicationDeadline")} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Start Date
                  </label>
                  <Input type="date" {...register("startDate")} />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Review Your Job Posting</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Review all the details before publishing.
                </p>
              </div>

              <div className="border rounded-xl divide-y">
                {/* Job Header */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">{watchedValues.title || "Job Title"}</h3>
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {watchedValues.department || "Department"}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {watchedValues.location || "Location"} ({watchedValues.locationType})
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {watchedValues.type}
                    </span>
                    {watchedValues.showSalary && watchedValues.salaryMin && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        ${watchedValues.salaryMin} - ${watchedValues.salaryMax}/{watchedValues.salaryType}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Description</h4>
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {watchedValues.description || "No description provided"}
                  </p>
                </div>

                {/* Requirements */}
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Requirements</h4>
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {watchedValues.requirements || "No requirements provided"}
                  </p>
                </div>

                {/* Skills */}
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkills.length > 0 ? (
                      selectedSkills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">No skills added</span>
                    )}
                  </div>
                </div>

                {/* Benefits */}
                {watchedValues.benefits && (
                  <div className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Benefits & Perks</h4>
                    <p className="text-gray-600 whitespace-pre-wrap">{watchedValues.benefits}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <Button
              type="button"
              variant="ghost"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {currentStep < 4 ? (
              <Button type="button" onClick={nextStep}>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Publish Job
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
