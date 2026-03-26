// JoinRise Job API Integration
// Free API - No API key required
// 10,000+ US jobs with salary data
// Docs: https://www.freepublicapis.com/free-jobs-api

import type { ExternalJob, JobSearchParams, JobApiResponse } from './types';

const JOINRISE_BASE_URL = 'https://api.joinrise.io/api/v1/jobs/public';

interface JoinRiseJob {
  _id: string;
  title: string;
  type: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  locationAddress: string;
  locationCoordinates?: { lon: number; lat: number };
  department?: string;
  seniority?: string;
  skills_suggest?: string[];
  descriptionBreakdown?: {
    oneSentenceJobSummary?: string;
    keywords?: string[];
    employmentType?: string;
    workModel?: string;
    salaryRangeMinYearly?: number;
    salaryRangeMaxYearly?: number;
    skillRequirements?: string[];
  };
  owner?: {
    companyName?: string;
    photo?: string;
    rating?: string;
    locationAddress?: string;
    teamSize?: number;
    sector?: string;
    funding?: string;
  };
}

function mapJobType(type: string, workModel?: string): ExternalJob['type'] {
  const typeStr = (type || workModel || '').toLowerCase();
  if (typeStr.includes('full')) return 'Full-time';
  if (typeStr.includes('part')) return 'Part-time';
  if (typeStr.includes('contract') || typeStr.includes('freelance')) return 'Contract';
  if (typeStr.includes('intern')) return 'Internship';
  return 'Full-time';
}

function mapLocationType(type: string, workModel?: string): 'remote' | 'hybrid' | 'onsite' {
  const typeStr = (type || workModel || '').toLowerCase();
  if (typeStr.includes('remote')) return 'remote';
  if (typeStr.includes('hybrid')) return 'hybrid';
  return 'onsite';
}

function inferIndustryFromDepartment(department?: string, sector?: string): string {
  const text = `${department || ''} ${sector || ''}`.toLowerCase();

  if (text.includes('software') || text.includes('engineer') || text.includes('tech') || text.includes('data')) {
    return 'Technology';
  }
  if (text.includes('marketing') || text.includes('seo') || text.includes('content')) {
    return 'Marketing';
  }
  if (text.includes('sales') || text.includes('business development')) {
    return 'Sales';
  }
  if (text.includes('finance') || text.includes('accounting') || text.includes('banking')) {
    return 'Finance';
  }
  if (text.includes('design') || text.includes('creative') || text.includes('ux') || text.includes('ui')) {
    return 'Creative';
  }
  if (text.includes('hr') || text.includes('human resources') || text.includes('recruiting')) {
    return 'Human Resources';
  }
  if (text.includes('customer') || text.includes('support')) {
    return 'Customer Service';
  }
  if (text.includes('healthcare') || text.includes('medical') || text.includes('health') || text.includes('life sciences')) {
    return 'Healthcare';
  }
  if (text.includes('legal') || text.includes('compliance')) {
    return 'Legal';
  }
  if (text.includes('consulting')) {
    return 'Consulting';
  }

  return 'Other';
}

function isUSLocation(location: string): boolean {
  if (!location) return false;
  const loc = location.toLowerCase();

  // Check for US indicators
  const usIndicators = [
    'usa', 'united states', ', us', 'u.s.',
    // US States
    'alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado', 'connecticut',
    'delaware', 'florida', 'georgia', 'hawaii', 'idaho', 'illinois', 'indiana', 'iowa',
    'kansas', 'kentucky', 'louisiana', 'maine', 'maryland', 'massachusetts', 'michigan',
    'minnesota', 'mississippi', 'missouri', 'montana', 'nebraska', 'nevada', 'new hampshire',
    'new jersey', 'new mexico', 'new york', 'north carolina', 'north dakota', 'ohio',
    'oklahoma', 'oregon', 'pennsylvania', 'rhode island', 'south carolina', 'south dakota',
    'tennessee', 'texas', 'utah', 'vermont', 'virginia', 'washington', 'west virginia',
    'wisconsin', 'wyoming',
    // State abbreviations with comma
    ', al', ', ak', ', az', ', ar', ', ca', ', co', ', ct', ', de', ', fl', ', ga',
    ', hi', ', id', ', il', ', in', ', ia', ', ks', ', ky', ', la', ', me', ', md',
    ', ma', ', mi', ', mn', ', ms', ', mo', ', mt', ', ne', ', nv', ', nh', ', nj',
    ', nm', ', ny', ', nc', ', nd', ', oh', ', ok', ', or', ', pa', ', ri', ', sc',
    ', sd', ', tn', ', tx', ', ut', ', vt', ', va', ', wa', ', wv', ', wi', ', wy',
    // Major US cities
    'new york city', 'los angeles', 'chicago', 'houston', 'phoenix', 'philadelphia',
    'san antonio', 'san diego', 'dallas', 'san jose', 'austin', 'jacksonville',
    'san francisco', 'seattle', 'denver', 'boston', 'nashville', 'baltimore',
    'portland', 'las vegas', 'atlanta', 'miami', 'minneapolis', 'detroit'
  ];

  // Check for non-US indicators
  const nonUSIndicators = [
    'canada', 'uk', 'united kingdom', 'germany', 'france', 'spain', 'italy',
    'netherlands', 'belgium', 'australia', 'india', 'china', 'japan', 'brazil',
    'mexico', 'argentina', 'ireland', 'sweden', 'norway', 'denmark', 'finland',
    'poland', 'czech', 'austria', 'switzerland', 'portugal', 'singapore',
    'hong kong', 'south korea', 'taiwan', 'philippines', 'indonesia', 'thailand',
    'vietnam', 'malaysia', 'new zealand', 'south africa', 'nigeria', 'kenya',
    'egypt', 'israel', 'uae', 'dubai', 'saudi', 'pakistan', 'bangladesh',
    'london', 'toronto', 'vancouver', 'montreal', 'sydney', 'melbourne', 'berlin',
    'paris', 'amsterdam', 'dublin', 'mumbai', 'bangalore', 'delhi', 'tokyo'
  ];

  // Check for non-US first
  for (const indicator of nonUSIndicators) {
    if (loc.includes(indicator)) return false;
  }

  // Check for US indicators
  for (const indicator of usIndicators) {
    if (loc.includes(indicator)) return true;
  }

  // If location says "Remote" or "United States" without country, assume US
  if (loc === 'remote' || loc === 'united states') return true;

  return false;
}

function mapJoinRiseJob(job: JoinRiseJob): ExternalJob {
  const breakdown = job.descriptionBreakdown || {};
  const owner = job.owner || {};

  let salary: string | null = null;
  let salaryMin: number | null = breakdown.salaryRangeMinYearly || null;
  let salaryMax: number | null = breakdown.salaryRangeMaxYearly || null;

  if (salaryMin && salaryMax) {
    salary = `$${salaryMin.toLocaleString()} - $${salaryMax.toLocaleString()}/year`;
  } else if (salaryMin) {
    salary = `$${salaryMin.toLocaleString()}+/year`;
  } else if (salaryMax) {
    salary = `Up to $${salaryMax.toLocaleString()}/year`;
  }

  const locationType = mapLocationType(job.type, breakdown.workModel);

  return {
    id: `joinrise_${job._id}`,
    source: 'joinrise',
    externalId: job._id,
    title: job.title,
    company: owner.companyName || 'Company Not Listed',
    location: job.locationAddress || 'United States',
    locationType,
    type: mapJobType(breakdown.employmentType || job.type, breakdown.workModel),
    salary,
    salaryMin,
    salaryMax,
    currency: 'USD',
    industry: inferIndustryFromDepartment(job.department, owner.sector),
    description: breakdown.oneSentenceJobSummary || '',
    requirements: breakdown.skillRequirements || [],
    benefits: [],
    skills: job.skills_suggest || breakdown.keywords || [],
    applyUrl: job.url,
    companyLogo: owner.photo && !owner.photo.includes('/avatar.jpg') ? owner.photo : null,
    postedDate: job.createdAt,
    expiresDate: null,
    featured: false,
  };
}

export async function searchJoinRiseJobs(params: JobSearchParams): Promise<JobApiResponse> {
  try {
    const page = params.page || 1;
    const limit = params.limit || 50;

    // Fetch more jobs to filter for US-only
    const fetchLimit = Math.min(limit * 3, 100); // Fetch extra to compensate for filtering

    const url = `${JOINRISE_BASE_URL}?page=${page}&limit=${fetchLimit}&sort=desc&sortedBy=createdAt`;

    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 1800 }, // Cache for 30 minutes
    });

    if (!response.ok) {
      console.error(`JoinRise API error: ${response.status}`);
      return { jobs: [], total: 0, page: 1, totalPages: 0, source: 'joinrise' };
    }

    const data = await response.json();
    const rawJobs = data.result?.jobs || [];

    // Filter for US jobs only and convert
    let jobs = rawJobs
      .filter((job: JoinRiseJob) => isUSLocation(job.locationAddress))
      .map(mapJoinRiseJob);

    // Apply additional filters
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
    const paginatedJobs = jobs.slice(0, limit);

    // JoinRise has 10,000+ jobs total
    const total = data.result?.count || 10000;

    return {
      jobs: paginatedJobs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      source: 'joinrise',
    };
  } catch (error) {
    console.error('JoinRise API error:', error);
    return { jobs: [], total: 0, page: 1, totalPages: 0, source: 'joinrise' };
  }
}

// Fetch multiple pages for maximum coverage
export async function searchJoinRiseJobsMultiPage(params: JobSearchParams, pages: number = 50): Promise<JobApiResponse> {
  try {
    const limit = params.limit || 5000;
    const allJobs: ExternalJob[] = [];

    // Fetch pages in batches to avoid overwhelming the API
    const batchSize = 10;
    const batches = Math.ceil(pages / batchSize);

    for (let batch = 0; batch < batches; batch++) {
      const startPage = batch * batchSize + 1;
      const endPage = Math.min(startPage + batchSize, pages + 1);

      const pagePromises = Array.from({ length: endPage - startPage }, (_, i) =>
        searchJoinRiseJobs({ ...params, page: startPage + i, limit: 100 })
      );

      const results = await Promise.all(pagePromises);

      for (const result of results) {
        allJobs.push(...result.jobs);
      }

      // Stop if we've got enough jobs or no more results
      if (allJobs.length >= limit) break;
      const lastResult = results[results.length - 1];
      if (lastResult.jobs.length === 0) break;
    }

    // Deduplicate by ID
    const uniqueJobs = Array.from(
      new Map(allJobs.map(job => [job.id, job])).values()
    );

    // Apply final limit only if specified and less than total
    const finalJobs = limit > 0 ? uniqueJobs.slice(0, limit) : uniqueJobs;

    console.log(`JoinRise: Fetched ${finalJobs.length} unique US jobs from ${pages} pages`);

    return {
      jobs: finalJobs,
      total: uniqueJobs.length,
      page: params.page || 1,
      totalPages: Math.ceil(uniqueJobs.length / (params.limit || 50)),
      source: 'joinrise',
    };
  } catch (error) {
    console.error('JoinRise multi-page fetch error:', error);
    return { jobs: [], total: 0, page: 1, totalPages: 0, source: 'joinrise' };
  }
}
