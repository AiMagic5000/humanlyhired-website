"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Upload,
  Save,
  Check,
  Linkedin,
  Globe,
  FileText,
  Plus,
  Trash2,
  Edit,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  school: string;
  year: string;
}

interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  headline: string;
  about: string;
  linkedin: string;
  portfolio: string;
  avatarUrl: string;
  resumeUrl: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
}

// Default profile data for new users
const defaultProfile: Profile = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  location: "",
  headline: "",
  about: "",
  linkedin: "",
  portfolio: "",
  avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  resumeUrl: "",
  experience: [],
  education: [],
  skills: [],
};

export default function ProfilePage() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [newSkill, setNewSkill] = useState("");

  // Load profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profiles");
        const result = await response.json();

        if (result.success && result.data) {
          setProfile({
            ...defaultProfile,
            ...result.data,
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);

    try {
      const response = await fetch("/api/profiles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save profile");
      }

      setSaved(true);
      toast.success("Profile saved successfully!");
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: `exp_${Date.now()}`,
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: null,
      current: false,
      description: "",
    };
    setProfile({
      ...profile,
      experience: [...profile.experience, newExp],
    });
  };

  const removeExperience = (id: string) => {
    setProfile({
      ...profile,
      experience: profile.experience.filter((exp) => exp.id !== id),
    });
  };

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    setProfile({
      ...profile,
      experience: profile.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: `edu_${Date.now()}`,
      degree: "",
      school: "",
      year: "",
    };
    setProfile({
      ...profile,
      education: [...profile.education, newEdu],
    });
  };

  const removeEducation = (id: string) => {
    setProfile({
      ...profile,
      education: profile.education.filter((edu) => edu.id !== id),
    });
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setProfile({
      ...profile,
      education: profile.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  const calculateProfileStrength = () => {
    let score = 0;
    if (profile.firstName && profile.lastName) score += 15;
    if (profile.email) score += 15;
    if (profile.phone) score += 10;
    if (profile.location) score += 10;
    if (profile.headline) score += 10;
    if (profile.about) score += 10;
    if (profile.experience.length > 0) score += 15;
    if (profile.education.length > 0) score += 10;
    if (profile.skills.length >= 3) score += 5;
    return Math.min(score, 100);
  };

  const profileStrength = calculateProfileStrength();
  const strengthLabel = profileStrength >= 80 ? "Strong" : profileStrength >= 50 ? "Good" : "Needs Work";
  const strengthColor = profileStrength >= 80 ? "emerald" : profileStrength >= 50 ? "yellow" : "red";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your personal and professional information</p>
        </div>
        <Button onClick={handleSave} className="gap-2" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <Check className="w-4 h-4" />
              Saved
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Photo & Quick Info */}
        <div className="space-y-6">
          {/* Profile Photo */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Profile Photo</h3>
            <div className="flex flex-col items-center">
              <div className="relative">
                <Image
                  src={profile.avatarUrl || defaultProfile.avatarUrl}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  width={120}
                  height={120}
                  className="rounded-full object-cover"
                />
                <button className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-4 text-center">
                JPG or PNG. Max size 2MB.
              </p>
            </div>
          </div>

          {/* Resume */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Resume</h3>
            <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl text-center">
              <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-3">
                Upload your resume to apply faster
              </p>
              <Button variant="outline" size="sm" className="gap-2">
                <Upload className="w-4 h-4" />
                Upload Resume
              </Button>
            </div>
          </div>

          {/* Profile Completeness */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Profile Strength</h3>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">{profileStrength}% Complete</span>
                <span className={`text-sm font-medium text-${strengthColor}-600`}>{strengthLabel}</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className={`h-full bg-gradient-to-r from-${strengthColor}-500 to-${strengthColor}-400 rounded-full transition-all`}
                  style={{ width: `${profileStrength}%` }}
                />
              </div>
            </div>
            <ul className="text-sm space-y-2">
              <li className="flex items-center gap-2 text-gray-500">
                {profile.firstName && profile.lastName ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                )}
                Basic info completed
              </li>
              <li className="flex items-center gap-2 text-gray-500">
                {profile.experience.length > 0 ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                )}
                Work experience added
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                {profile.resumeUrl ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                )}
                Add a resume
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold text-gray-900 mb-6">Basic Information</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <Input
                  value={profile.firstName}
                  onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <Input
                  value={profile.lastName}
                  onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  placeholder="Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="pl-10"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="pl-10"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    className="pl-10"
                    placeholder="City, State"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Professional Headline
                </label>
                <Input
                  value={profile.headline}
                  onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                  placeholder="e.g., Senior Software Engineer at TechCorp"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About Me
                </label>
                <textarea
                  value={profile.about}
                  onChange={(e) => setProfile({ ...profile, about: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell employers about yourself..."
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold text-gray-900 mb-6">Online Presence</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn
                </label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="url"
                    value={profile.linkedin}
                    onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                    className="pl-10"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Portfolio / Website
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="url"
                    value={profile.portfolio}
                    onChange={(e) => setProfile({ ...profile, portfolio: e.target.value })}
                    className="pl-10"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Work Experience */}
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900">Work Experience</h3>
              <Button variant="outline" size="sm" className="gap-2" onClick={addExperience}>
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>
            <div className="space-y-6">
              {profile.experience.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No work experience added yet. Click &quot;Add&quot; to get started.
                </p>
              ) : (
                profile.experience.map((exp) => (
                  <div key={exp.id} className="p-4 rounded-lg border space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-6 h-6 text-blue-600" />
                      </div>
                      <button
                        onClick={() => removeExperience(exp.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input
                        placeholder="Job Title"
                        value={exp.title}
                        onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
                      />
                      <Input
                        placeholder="Company"
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                      />
                      <Input
                        placeholder="Location"
                        value={exp.location}
                        onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`current-${exp.id}`}
                          checked={exp.current}
                          onChange={(e) => updateExperience(exp.id, "current", e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <label htmlFor={`current-${exp.id}`} className="text-sm text-gray-600">
                          Currently working here
                        </label>
                      </div>
                      <Input
                        type="month"
                        placeholder="Start Date"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                      />
                      <Input
                        type="month"
                        placeholder="End Date"
                        value={exp.endDate || ""}
                        onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                        disabled={exp.current}
                      />
                      <div className="sm:col-span-2">
                        <textarea
                          placeholder="Description of your role and achievements..."
                          value={exp.description}
                          onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                          rows={3}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900">Education</h3>
              <Button variant="outline" size="sm" className="gap-2" onClick={addEducation}>
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>
            <div className="space-y-4">
              {profile.education.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No education added yet. Click &quot;Add&quot; to get started.
                </p>
              ) : (
                profile.education.map((edu) => (
                  <div key={edu.id} className="flex gap-4 p-4 rounded-lg border">
                    <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1 grid gap-4 sm:grid-cols-3">
                      <Input
                        placeholder="Degree"
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                      />
                      <Input
                        placeholder="School"
                        value={edu.school}
                        onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
                      />
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Year"
                          value={edu.year}
                          onChange={(e) => updateEducation(edu.id, "year", e.target.value)}
                        />
                        <button
                          onClick={() => removeEducation(edu.id)}
                          className="p-2 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900">Skills</h3>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Add a skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addSkill()}
                  className="w-40"
                />
                <Button variant="outline" size="sm" onClick={addSkill}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.skills.length === 0 ? (
                <p className="text-gray-500">No skills added yet. Add some skills to showcase your expertise.</p>
              ) : (
                profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium"
                  >
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="hover:text-blue-900">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
