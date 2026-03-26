// Job API Types - Unified interface for multiple job board APIs

export interface ExternalJob {
  id: string;
  source: 'database' | 'adzuna' | 'usajobs' | 'remotive' | 'arbeitnow' | 'joinrise' | 'internal';
  externalId: string;
  title: string;
  company: string;
  location: string;
  locationType: 'onsite' | 'remote' | 'hybrid';
  type: 'full-time' | 'part-time' | 'contract' | 'temporary' | 'internship' | 'Full-time' | 'Part-time' | 'Contract' | 'Temporary' | 'Internship';
  salary: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string;
  industry: string;
  description: string;
  requirements: string[];
  benefits: string[];
  skills: string[];
  applyUrl: string;
  companyLogo: string | null;
  postedDate: string;
  expiresDate: string | null;
  featured: boolean;
}

export interface JobSearchParams {
  query?: string;
  location?: string;
  industry?: string;
  type?: string;
  remote?: boolean;
  salaryMin?: number;
  salaryMax?: number;
  page?: number;
  limit?: number;
}

export interface JobApiResponse {
  jobs: ExternalJob[];
  total: number;
  page: number;
  totalPages: number;
  source: string;
}

export interface JobApiConfig {
  enabled: boolean;
  apiKey?: string;
  baseUrl: string;
  rateLimit: number; // requests per minute
}

// API-specific response types

export interface AdzunaJob {
  id: string;
  title: string;
  description: string;
  company: { display_name: string };
  location: { display_name: string; area: string[] };
  salary_min?: number;
  salary_max?: number;
  contract_type?: string;
  contract_time?: string;
  category: { label: string; tag: string };
  created: string;
  redirect_url: string;
}

export interface USAJobsPosition {
  PositionID: string;
  PositionTitle: string;
  OrganizationName: string;
  PositionLocationDisplay: string;
  PositionRemuneration: Array<{
    MinimumRange: string;
    MaximumRange: string;
    RateIntervalCode: string;
  }>;
  UserArea: {
    Details: {
      JobSummary: string;
      MajorDuties: string[];
      Requirements: string;
    };
  };
  PositionStartDate: string;
  PositionEndDate: string;
  ApplyOnlineUrl: string;
  JobCategory: Array<{ Name: string; Code: string }>;
}

export interface RemotiveJob {
  id: number;
  url: string;
  title: string;
  company_name: string;
  company_logo: string;
  category: string;
  job_type: string;
  publication_date: string;
  candidate_required_location: string;
  salary: string;
  description: string;
}

export interface ArbeitnowJob {
  slug: string;
  company_name: string;
  title: string;
  description: string;
  remote: boolean;
  url: string;
  tags: string[];
  job_types: string[];
  location: string;
  created_at: number;
}
