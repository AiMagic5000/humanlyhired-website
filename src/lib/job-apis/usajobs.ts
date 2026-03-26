// USAJobs API Integration
// Free API for US government jobs
// Docs: https://developer.usajobs.gov/

import type { ExternalJob, USAJobsPosition, JobSearchParams, JobApiResponse } from './types';

const USAJOBS_API_KEY = process.env.USAJOBS_API_KEY || '';
const USAJOBS_EMAIL = process.env.USAJOBS_EMAIL || '';
const USAJOBS_BASE_URL = 'https://data.usajobs.gov/api/search';

function mapUSAJobsPosition(position: USAJobsPosition): ExternalJob {
  const remuneration = position.PositionRemuneration?.[0];
  let salary: string | null = null;
  let salaryMin: number | null = null;
  let salaryMax: number | null = null;

  if (remuneration) {
    salaryMin = parseFloat(remuneration.MinimumRange) || null;
    salaryMax = parseFloat(remuneration.MaximumRange) || null;

    if (salaryMin && salaryMax) {
      const period = remuneration.RateIntervalCode === 'PA' ? '/year' : '/hour';
      salary = `$${Math.round(salaryMin).toLocaleString()} - $${Math.round(salaryMax).toLocaleString()}${period}`;
    }
  }

  const isRemote = position.PositionLocationDisplay?.toLowerCase().includes('remote') ||
                   position.PositionLocationDisplay?.toLowerCase().includes('telework');

  // Map job category to industry
  const category = position.JobCategory?.[0]?.Name || '';
  let industry = 'Government';
  if (category.toLowerCase().includes('information technology')) industry = 'Technology';
  else if (category.toLowerCase().includes('medical') || category.toLowerCase().includes('health')) industry = 'Healthcare';
  else if (category.toLowerCase().includes('accounting') || category.toLowerCase().includes('financial')) industry = 'Finance';
  else if (category.toLowerCase().includes('engineering')) industry = 'Technology';

  const details = position.UserArea?.Details || {};

  return {
    id: `usajobs_${position.PositionID}`,
    source: 'usajobs',
    externalId: position.PositionID,
    title: position.PositionTitle,
    company: position.OrganizationName || 'U.S. Government',
    location: position.PositionLocationDisplay || 'Washington, DC',
    locationType: isRemote ? 'remote' : 'onsite',
    type: 'Full-time',
    salary,
    salaryMin,
    salaryMax,
    currency: 'USD',
    industry,
    description: details.JobSummary || '',
    requirements: details.Requirements ? [details.Requirements] : [],
    benefits: [
      'Federal employee benefits',
      'Health insurance',
      'Retirement plan',
      'Paid time off',
    ],
    skills: [],
    applyUrl: position.ApplyOnlineUrl || `https://www.usajobs.gov/job/${position.PositionID}`,
    companyLogo: null,
    postedDate: position.PositionStartDate,
    expiresDate: position.PositionEndDate || null,
    featured: false,
  };
}

export async function searchUSAJobs(params: JobSearchParams): Promise<JobApiResponse> {
  if (!USAJOBS_API_KEY || !USAJOBS_EMAIL) {
    console.log('USAJobs API not configured, skipping...');
    return { jobs: [], total: 0, page: 1, totalPages: 0, source: 'usajobs' };
  }

  try {
    const page = params.page || 1;
    const resultsPerPage = Math.min(params.limit || 50, 500);

    const searchParams = new URLSearchParams({
      ResultsPerPage: resultsPerPage.toString(),
      Page: page.toString(),
    });

    if (params.query) {
      searchParams.append('Keyword', params.query);
    }
    if (params.location) {
      searchParams.append('LocationName', params.location);
    }
    if (params.remote) {
      searchParams.append('RemoteIndicator', 'True');
    }
    if (params.salaryMin) {
      searchParams.append('RemunerationMinimumAmount', params.salaryMin.toString());
    }
    if (params.salaryMax) {
      searchParams.append('RemunerationMaximumAmount', params.salaryMax.toString());
    }

    const url = `${USAJOBS_BASE_URL}?${searchParams}`;

    const response = await fetch(url, {
      headers: {
        'Authorization-Key': USAJOBS_API_KEY,
        'User-Agent': USAJOBS_EMAIL,
        'Host': 'data.usajobs.gov',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error(`USAJobs API error: ${response.status}`);
      return { jobs: [], total: 0, page: 1, totalPages: 0, source: 'usajobs' };
    }

    const data = await response.json();
    const searchResult = data.SearchResult || {};
    const positions = searchResult.SearchResultItems || [];

    const jobs = positions.map((item: { MatchedObjectDescriptor: USAJobsPosition }) =>
      mapUSAJobsPosition(item.MatchedObjectDescriptor)
    );

    const total = parseInt(searchResult.SearchResultCount) || 0;

    return {
      jobs,
      total,
      page,
      totalPages: Math.ceil(total / resultsPerPage),
      source: 'usajobs',
    };
  } catch (error) {
    console.error('USAJobs API error:', error);
    return { jobs: [], total: 0, page: 1, totalPages: 0, source: 'usajobs' };
  }
}
