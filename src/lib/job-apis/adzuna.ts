// Adzuna Job API Integration
// Free tier: 250 requests/day
// Docs: https://developer.adzuna.com/

import type { ExternalJob, AdzunaJob, JobSearchParams, JobApiResponse } from './types';

const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID || '';
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY || '';
const ADZUNA_BASE_URL = 'https://api.adzuna.com/v1/api/jobs';

// Map Adzuna categories to our industries
const categoryToIndustry: Record<string, string> = {
  'it-jobs': 'Technology',
  'engineering-jobs': 'Technology',
  'healthcare-nursing-jobs': 'Healthcare',
  'accounting-finance-jobs': 'Finance',
  'manufacturing-jobs': 'Manufacturing',
  'retail-jobs': 'Retail',
  'logistics-warehouse-jobs': 'Logistics',
  'hr-jobs': 'Human Resources',
  'legal-jobs': 'Legal',
  'marketing-jobs': 'Marketing',
  'sales-jobs': 'Sales',
  'admin-jobs': 'Administrative',
  'customer-services-jobs': 'Customer Service',
  'hospitality-catering-jobs': 'Hospitality',
  'construction-jobs': 'Construction',
  'energy-oil-gas-jobs': 'Energy',
  'graduate-jobs': 'Entry Level',
  'consultancy-jobs': 'Consulting',
  'scientific-qa-jobs': 'Science',
  'creative-design-jobs': 'Creative',
};

function mapContractType(contract_time?: string, contract_type?: string): ExternalJob['type'] {
  if (contract_type === 'contract') return 'Contract';
  if (contract_type === 'permanent') {
    if (contract_time === 'part_time') return 'Part-time';
    return 'Full-time';
  }
  if (contract_time === 'part_time') return 'Part-time';
  return 'Full-time';
}

function mapAdzunaJob(job: AdzunaJob): ExternalJob {
  const salaryMin = job.salary_min || null;
  const salaryMax = job.salary_max || null;

  let salary: string | null = null;
  if (salaryMin && salaryMax) {
    salary = `$${Math.round(salaryMin).toLocaleString()} - $${Math.round(salaryMax).toLocaleString()}`;
  } else if (salaryMin) {
    salary = `From $${Math.round(salaryMin).toLocaleString()}`;
  } else if (salaryMax) {
    salary = `Up to $${Math.round(salaryMax).toLocaleString()}`;
  }

  const isRemote = job.location?.display_name?.toLowerCase().includes('remote') ||
                   job.title?.toLowerCase().includes('remote');

  return {
    id: `adzuna_${job.id}`,
    source: 'adzuna',
    externalId: job.id,
    title: job.title,
    company: job.company?.display_name || 'Company Not Listed',
    location: job.location?.display_name || 'Location Not Specified',
    locationType: isRemote ? 'remote' : 'onsite',
    type: mapContractType(job.contract_time, job.contract_type),
    salary,
    salaryMin,
    salaryMax,
    currency: 'USD',
    industry: categoryToIndustry[job.category?.tag] || 'Other',
    description: job.description || '',
    requirements: [], // Adzuna doesn't provide structured requirements
    benefits: [],
    skills: [],
    applyUrl: job.redirect_url,
    companyLogo: null,
    postedDate: job.created,
    expiresDate: null,
    featured: false,
  };
}

export async function searchAdzunaJobs(params: JobSearchParams): Promise<JobApiResponse> {
  if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) {
    console.log('Adzuna API not configured, skipping...');
    return { jobs: [], total: 0, page: 1, totalPages: 0, source: 'adzuna' };
  }

  try {
    const country = 'us';
    const page = params.page || 1;
    const resultsPerPage = Math.min(params.limit || 50, 50);

    const searchParams = new URLSearchParams({
      app_id: ADZUNA_APP_ID,
      app_key: ADZUNA_APP_KEY,
      results_per_page: resultsPerPage.toString(),
      what: params.query || '',
      where: params.location || '',
      content_type: 'application/json',
    });

    // Add salary filters if provided
    if (params.salaryMin) {
      searchParams.append('salary_min', params.salaryMin.toString());
    }
    if (params.salaryMax) {
      searchParams.append('salary_max', params.salaryMax.toString());
    }

    const url = `${ADZUNA_BASE_URL}/${country}/search/${page}?${searchParams}`;

    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error(`Adzuna API error: ${response.status}`);
      return { jobs: [], total: 0, page: 1, totalPages: 0, source: 'adzuna' };
    }

    const data = await response.json();
    const jobs = (data.results || []).map(mapAdzunaJob);
    const total = data.count || 0;

    return {
      jobs,
      total,
      page,
      totalPages: Math.ceil(total / resultsPerPage),
      source: 'adzuna',
    };
  } catch (error) {
    console.error('Adzuna API error:', error);
    return { jobs: [], total: 0, page: 1, totalPages: 0, source: 'adzuna' };
  }
}

// Fetch jobs by category for homepage featured sections
export async function fetchAdzunaByCategory(category: string, limit: number = 10): Promise<ExternalJob[]> {
  const response = await searchAdzunaJobs({
    query: category,
    limit,
    page: 1,
  });
  return response.jobs;
}
