"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Building2,
  MapPin,
  Globe,
  Users,
  Calendar,
  Edit,
  Upload,
  Save,
  Check,
  Linkedin,
  Twitter,
  Instagram,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface SocialLinks {
  linkedin: string;
  twitter: string;
  instagram: string;
}

interface Company {
  name: string;
  logoUrl: string;
  bannerUrl: string;
  tagline: string;
  website: string;
  industry: string;
  size: string;
  founded: string;
  headquarters: string;
  locations: string[];
  about: string;
  culture: string;
  benefits: string[];
  socialLinks: SocialLinks;
}

const defaultCompany: Company = {
  name: "",
  logoUrl: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=200&h=200&fit=crop",
  bannerUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=400&fit=crop",
  tagline: "",
  website: "",
  industry: "technology",
  size: "1-10",
  founded: "",
  headquarters: "",
  locations: [],
  about: "",
  culture: "",
  benefits: [],
  socialLinks: {
    linkedin: "",
    twitter: "",
    instagram: "",
  },
};

const industries = [
  { value: "technology", label: "Technology" },
  { value: "healthcare", label: "Healthcare" },
  { value: "finance", label: "Finance" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "retail", label: "Retail" },
  { value: "education", label: "Education" },
  { value: "other", label: "Other" },
];

const companySizes = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-500", label: "201-500 employees" },
  { value: "501-1000", label: "501-1000 employees" },
  { value: "1001+", label: "1001+ employees" },
];

export default function CompanyProfilePage() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<Company>(defaultCompany);
  const [newBenefit, setNewBenefit] = useState("");
  const [newLocation, setNewLocation] = useState("");

  // Load company on mount
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await fetch("/api/companies");
        const result = await response.json();

        if (result.success && result.data) {
          setCompany({
            ...defaultCompany,
            ...result.data,
            socialLinks: {
              ...defaultCompany.socialLinks,
              ...result.data.socialLinks,
            },
          });
        }
      } catch (error) {
        console.error("Failed to fetch company:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, []);

  const handleSave = async () => {
    if (!company.name.trim()) {
      toast.error("Company name is required");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/companies", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(company),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save company");
      }

      setSaved(true);
      toast.success("Company profile saved successfully!");
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save company");
    } finally {
      setSaving(false);
    }
  };

  const addBenefit = () => {
    if (newBenefit.trim() && !company.benefits.includes(newBenefit.trim())) {
      setCompany({
        ...company,
        benefits: [...company.benefits, newBenefit.trim()],
      });
      setNewBenefit("");
    }
  };

  const removeBenefit = (benefitToRemove: string) => {
    setCompany({
      ...company,
      benefits: company.benefits.filter((b) => b !== benefitToRemove),
    });
  };

  const addLocation = () => {
    if (newLocation.trim() && !company.locations.includes(newLocation.trim())) {
      setCompany({
        ...company,
        locations: [...company.locations, newLocation.trim()],
      });
      setNewLocation("");
    }
  };

  const removeLocation = (locationToRemove: string) => {
    setCompany({
      ...company,
      locations: company.locations.filter((l) => l !== locationToRemove),
    });
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Company Profile</h1>
          <p className="text-gray-600 mt-1">Manage how candidates see your company</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <a href={`/company/${company.name.toLowerCase().replace(/\s+/g, "-")}`} target="_blank">
              Preview Profile
            </a>
          </Button>
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
      </div>

      {/* Banner & Logo */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="relative h-48 bg-gradient-to-r from-blue-600 to-blue-800">
          <Image
            src={company.bannerUrl || defaultCompany.bannerUrl}
            alt="Company banner"
            fill
            className="object-cover opacity-80"
          />
          <button className="absolute top-4 right-4 p-2 bg-white/90 rounded-lg text-gray-700 hover:bg-white transition-colors">
            <Edit className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 relative z-10">
            <div className="relative">
              <Image
                src={company.logoUrl || defaultCompany.logoUrl}
                alt={company.name || "Company logo"}
                width={100}
                height={100}
                className="rounded-xl border-4 border-white shadow-lg object-cover"
              />
              <button className="absolute -bottom-2 -right-2 p-1.5 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors">
                <Edit className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{company.name || "Your Company"}</h2>
              <p className="text-gray-600">{company.tagline || "Add a tagline"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold text-gray-900 mb-6">Basic Information</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <Input
                  value={company.name}
                  onChange={(e) => setCompany({ ...company, name: e.target.value })}
                  placeholder="Your company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    value={company.website}
                    onChange={(e) => setCompany({ ...company, website: e.target.value })}
                    className="pl-10"
                    placeholder="https://yourcompany.com"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tagline
                </label>
                <Input
                  value={company.tagline}
                  onChange={(e) => setCompany({ ...company, tagline: e.target.value })}
                  placeholder="A short description of your company"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry
                </label>
                <select
                  value={company.industry}
                  onChange={(e) => setCompany({ ...company, industry: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {industries.map((ind) => (
                    <option key={ind.value} value={ind.value}>
                      {ind.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Size
                </label>
                <select
                  value={company.size}
                  onChange={(e) => setCompany({ ...company, size: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {companySizes.map((size) => (
                    <option key={size.value} value={size.value}>
                      {size.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Founded Year
                </label>
                <Input
                  value={company.founded}
                  onChange={(e) => setCompany({ ...company, founded: e.target.value })}
                  placeholder="2020"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Headquarters
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    value={company.headquarters}
                    onChange={(e) => setCompany({ ...company, headquarters: e.target.value })}
                    className="pl-10"
                    placeholder="City, State"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold text-gray-900 mb-6">About the Company</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Description
                </label>
                <textarea
                  value={company.about}
                  onChange={(e) => setCompany({ ...company, about: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell candidates about your company's mission, products, and what makes you unique..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Culture
                </label>
                <textarea
                  value={company.culture}
                  onChange={(e) => setCompany({ ...company, culture: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your company culture and work environment..."
                />
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900">Benefits & Perks</h3>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Add a benefit"
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addBenefit()}
                  className="w-40"
                />
                <Button variant="outline" size="sm" onClick={addBenefit}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {company.benefits.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No benefits added yet. Add benefits to attract top talent.
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {company.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <span className="text-gray-700">{benefit}</span>
                    <button
                      onClick={() => removeBenefit(benefit)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Office Locations */}
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900">Office Locations</h3>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Add a location"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addLocation()}
                  className="w-40"
                />
                <Button variant="outline" size="sm" onClick={addLocation}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {company.locations.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No locations added yet. Add your office locations.
              </p>
            ) : (
              <div className="space-y-3">
                {company.locations.map((location, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">{location}</span>
                      {index === 0 && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                          Headquarters
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => removeLocation(location)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Stats */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Company Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">Employees</span>
                </div>
                <span className="font-medium text-gray-900">
                  {company.size || "Not set"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">Offices</span>
                </div>
                <span className="font-medium text-gray-900">{company.locations.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">Founded</span>
                </div>
                <span className="font-medium text-gray-900">{company.founded || "Not set"}</span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Social Links</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn
                </label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    value={company.socialLinks.linkedin}
                    onChange={(e) =>
                      setCompany({
                        ...company,
                        socialLinks: { ...company.socialLinks, linkedin: e.target.value },
                      })
                    }
                    className="pl-10"
                    placeholder="https://linkedin.com/company/..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Twitter / X
                </label>
                <div className="relative">
                  <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    value={company.socialLinks.twitter}
                    onChange={(e) =>
                      setCompany({
                        ...company,
                        socialLinks: { ...company.socialLinks, twitter: e.target.value },
                      })
                    }
                    className="pl-10"
                    placeholder="https://twitter.com/..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram
                </label>
                <div className="relative">
                  <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    value={company.socialLinks.instagram}
                    onChange={(e) =>
                      setCompany({
                        ...company,
                        socialLinks: { ...company.socialLinks, instagram: e.target.value },
                      })
                    }
                    className="pl-10"
                    placeholder="https://instagram.com/..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Media Gallery */}
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Photos & Media</h3>
              <Button variant="outline" size="sm" className="gap-2">
                <Upload className="w-4 h-4" />
                Upload
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=200&h=200&fit=crop",
                "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=200&h=200&fit=crop",
                "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&h=200&fit=crop",
                "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=200&h=200&fit=crop",
              ].map((img, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                  <Image
                    src={img}
                    alt={`Office photo ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="p-1.5 bg-white rounded-full text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
