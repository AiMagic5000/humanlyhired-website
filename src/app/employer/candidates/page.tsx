"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  Filter,
  MapPin,
  Briefcase,
  GraduationCap,
  Star,
  StarOff,
  Eye,
  MessageSquare,
  Download,
  ChevronDown,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Candidate {
  id: string;
  name: string;
  avatar: string;
  headline: string;
  location: string;
  experience: string;
  education: string;
  skills: string[];
  matchScore: number;
  status: string;
  lastActive: string;
  starred: boolean;
}

interface FilterOptions {
  experience: string[];
  location: string[];
  skills: string[];
  education: string[];
  status: string[];
}

export default function CandidateSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    experience: [],
    location: [],
    skills: [],
    education: [],
    status: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    experience: "",
    location: "",
    skill: "",
    education: "",
    status: "",
  });
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);

      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (selectedFilters.experience) params.append("experience", selectedFilters.experience);
      if (selectedFilters.location) params.append("location", selectedFilters.location);
      if (selectedFilters.skill) params.append("skill", selectedFilters.skill);

      const response = await fetch(`/api/employer/candidates?${params.toString()}`);
      const result = await response.json();

      if (result.success && result.data) {
        setCandidates(result.data.candidates);
        if (result.data.filterOptions) {
          setFilterOptions(result.data.filterOptions);
        }
        if (showToast) {
          toast.success("Candidates refreshed");
        }
      } else {
        throw new Error(result.error || "Failed to fetch candidates");
      }
    } catch (error) {
      console.error("Fetch candidates error:", error);
      if (showToast) {
        toast.error("Failed to refresh candidates");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = () => {
    setLoading(true);
    fetchCandidates(true);
  };

  const toggleStar = async (id: string) => {
    const candidate = candidates.find(c => c.id === id);
    if (!candidate) return;

    setActionLoading(id);

    // Optimistic update
    setCandidates(candidates.map(c =>
      c.id === id ? { ...c, starred: !c.starred } : c
    ));

    try {
      const response = await fetch("/api/employer/candidates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateId: id,
          action: candidate.starred ? "unstar" : "star",
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success(candidate.starred ? "Candidate removed from saved" : "Candidate saved");
      } else {
        // Revert on error
        setCandidates(candidates.map(c =>
          c.id === id ? { ...c, starred: candidate.starred } : c
        ));
        toast.error("Failed to update candidate");
      }
    } catch (error) {
      console.error("Toggle star error:", error);
      // Revert on error
      setCandidates(candidates.map(c =>
        c.id === id ? { ...c, starred: candidate.starred } : c
      ));
      toast.error("Failed to update candidate");
    } finally {
      setActionLoading(null);
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "bg-emerald-100 text-emerald-700";
    if (score >= 75) return "bg-blue-100 text-blue-700";
    if (score >= 60) return "bg-amber-100 text-amber-700";
    return "bg-gray-100 text-gray-700";
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Find Candidates</h1>
          <p className="text-gray-600 mt-1">Search and discover talent for your open positions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchCandidates(true)}
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <span className="text-sm text-gray-600">
            {candidates.filter(c => c.starred).length} saved candidates
          </span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search by name, skills, title..."
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </Button>
          <Button onClick={handleSearch} className="gap-2">
            <Search className="w-4 h-4" />
            Search
          </Button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Experience</label>
              <select
                value={selectedFilters.experience}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, experience: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any experience</option>
                {filterOptions.experience.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
              <select
                value={selectedFilters.location}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any location</option>
                {filterOptions.location.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Skills</label>
              <select
                value={selectedFilters.skill}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, skill: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any skills</option>
                {filterOptions.skills.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Education</label>
              <select
                value={selectedFilters.education}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, education: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any education</option>
                {filterOptions.education.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
              <select
                value={selectedFilters.status}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any status</option>
                {filterOptions.status.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          <span className="font-medium">{candidates.length}</span> candidates found
        </p>
        <select className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="match">Sort by: Best Match</option>
          <option value="recent">Most Recent</option>
          <option value="experience">Experience</option>
        </select>
      </div>

      {/* Candidates List */}
      {candidates.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No candidates found</h3>
          <p className="text-gray-600 mt-2">
            Try adjusting your search criteria or filters
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="bg-white rounded-xl border hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <Image
                      src={candidate.avatar}
                      alt={candidate.name}
                      width={80}
                      height={80}
                      className="rounded-xl object-cover"
                    />
                  </div>

                  {/* Main Info */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getMatchScoreColor(candidate.matchScore)}`}>
                            {candidate.matchScore}% Match
                          </span>
                        </div>
                        <p className="text-gray-600">{candidate.headline}</p>
                      </div>
                      <button
                        onClick={() => toggleStar(candidate.id)}
                        disabled={actionLoading === candidate.id}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                      >
                        {actionLoading === candidate.id ? (
                          <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                        ) : candidate.starred ? (
                          <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                        ) : (
                          <StarOff className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {candidate.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4" />
                        {candidate.experience}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4" />
                        {candidate.education}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {candidate.skills.slice(0, 5).map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {candidate.skills.length > 5 && (
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                          +{candidate.skills.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="px-6 py-3 border-t bg-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                    candidate.status === "Actively looking"
                      ? "bg-emerald-100 text-emerald-700"
                      : candidate.status === "Open to work"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {candidate.status}
                  </span>
                  <span>Active {candidate.lastActive}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Eye className="w-4 h-4" />
                    View Profile
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Download className="w-4 h-4" />
                    Resume
                  </Button>
                  <Button size="sm" className="gap-1.5">
                    <MessageSquare className="w-4 h-4" />
                    Contact
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {candidates.length > 0 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm" className="bg-blue-50 text-blue-700">1</Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <span className="text-gray-400">...</span>
          <Button variant="outline" size="sm">12</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      )}
    </div>
  );
}
