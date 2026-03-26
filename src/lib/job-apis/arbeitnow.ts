// Arbeitnow Job API Integration
// Free API - No API key required
// Docs: https://www.arbeitnow.com/api

import type { ExternalJob, ArbeitnowJob, JobSearchParams, JobApiResponse } from './types';

const ARBEITNOW_BASE_URL = 'https://www.arbeitnow.com/api/job-board-api';

function mapJobType(jobTypes: string[]): ExternalJob['type'] {
  const types = jobTypes.map(t => t.toLowerCase());
  if (types.includes('full time') || types.includes('full-time')) return 'Full-time';
  if (types.includes('part time') || types.includes('part-time')) return 'Part-time';
  if (types.includes('contract') || types.includes('freelance')) return 'Contract';
  if (types.includes('internship') || types.includes('intern')) return 'Internship';
  return 'Full-time';
}

function inferIndustryFromTags(tags: string[], title: string): string {
  const allText = [...tags, title].join(' ').toLowerCase();

  if (allText.includes('software') || allText.includes('developer') || allText.includes('engineer') || allText.includes('devops') || allText.includes('data')) {
    return 'Technology';
  }
  if (allText.includes('marketing') || allText.includes('seo') || allText.includes('content')) {
    return 'Marketing';
  }
  if (allText.includes('sales') || allText.includes('business development')) {
    return 'Sales';
  }
  if (allText.includes('finance') || allText.includes('accounting') || allText.includes('financial')) {
    return 'Finance';
  }
  if (allText.includes('design') || allText.includes('ux') || allText.includes('ui') || allText.includes('creative')) {
    return 'Creative';
  }
  if (allText.includes('hr') || allText.includes('human resources') || allText.includes('recruiting')) {
    return 'Human Resources';
  }
  if (allText.includes('customer') || allText.includes('support')) {
    return 'Customer Service';
  }
  if (allText.includes('healthcare') || allText.includes('medical') || allText.includes('health')) {
    return 'Healthcare';
  }

  return 'Other';
}

function mapArbeitnowJob(job: ArbeitnowJob): ExternalJob {
  const isRemote = job.remote || job.location?.toLowerCase().includes('remote');

  return {
    id: `arbeitnow_${job.slug}`,
    source: 'arbeitnow',
    externalId: job.slug,
    title: job.title,
    company: job.company_name || 'Company Not Listed',
    location: job.location || (isRemote ? 'Remote' : 'Not Specified'),
    locationType: isRemote ? 'remote' : 'onsite',
    type: mapJobType(job.job_types || []),
    salary: null, // Arbeitnow doesn't provide salary info
    salaryMin: null,
    salaryMax: null,
    currency: 'USD',
    industry: inferIndustryFromTags(job.tags || [], job.title),
    description: job.description || '',
    requirements: [],
    benefits: [],
    skills: job.tags || [],
    applyUrl: job.url,
    companyLogo: null,
    postedDate: new Date(job.created_at * 1000).toISOString(),
    expiresDate: null,
    featured: false,
  };
}

export async function searchArbeitnowJobs(params: JobSearchParams): Promise<JobApiResponse> {
  try {
    const page = params.page || 1;

    const url = `${ARBEITNOW_BASE_URL}?page=${page}`;

    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error(`Arbeitnow API error: ${response.status}`);
      return { jobs: [], total: 0, page: 1, totalPages: 0, source: 'arbeitnow' };
    }

    const data = await response.json();
    let jobs = (data.data || []).map(mapArbeitnowJob);

    // Apply client-side filtering
    if (params.query) {
      const query = params.query.toLowerCase();
      jobs = jobs.filter((job: ExternalJob) =>
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query)
      );
    }

    if (params.location) {
      const loc = params.location.toLowerCase();
      jobs = jobs.filter((job: ExternalJob) =>
        job.location.toLowerCase().includes(loc)
      );
    }

    if (params.remote) {
      jobs = jobs.filter((job: ExternalJob) => job.locationType === 'remote');
    }

    if (params.industry) {
      jobs = jobs.filter((job: ExternalJob) => job.industry === params.industry);
    }

    // Apply limit
    const limit = params.limit || 50;
    const paginatedJobs = jobs.slice(0, limit);

    return {
      jobs: paginatedJobs,
      total: data.meta?.total || jobs.length,
      page,
      totalPages: data.meta?.last_page || Math.ceil(jobs.length / limit),
      source: 'arbeitnow',
    };
  } catch (error) {
    console.error('Arbeitnow API error:', error);
    return { jobs: [], total: 0, page: 1, totalPages: 0, source: 'arbeitnow' };
  }
}
