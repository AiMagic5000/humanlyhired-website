// Remotive Job API Integration
// Free API - No API key required
// Docs: https://remotive.com/api-documentation

import type { ExternalJob, RemotiveJob, JobSearchParams, JobApiResponse } from './types';

const REMOTIVE_BASE_URL = 'https://remotive.com/api/remote-jobs';

// Map Remotive categories to our industries
const categoryToIndustry: Record<string, string> = {
  'software-dev': 'Technology',
  'customer-support': 'Customer Service',
  'design': 'Creative',
  'marketing': 'Marketing',
  'sales': 'Sales',
  'product': 'Technology',
  'business': 'Business',
  'data': 'Technology',
  'devops': 'Technology',
  'finance-legal': 'Finance',
  'hr': 'Human Resources',
  'qa': 'Technology',
  'writing': 'Creative',
  'all-others': 'Other',
};

function mapJobType(jobType: string): ExternalJob['type'] {
  const type = jobType?.toLowerCase() || '';
  if (type.includes('full')) return 'Full-time';
  if (type.includes('part')) return 'Part-time';
  if (type.includes('contract') || type.includes('freelance')) return 'Contract';
  if (type.includes('intern')) return 'Internship';
  return 'Full-time';
}

function mapRemotiveJob(job: RemotiveJob): ExternalJob {
  // Parse salary if available
  let salary: string | null = null;
  let salaryMin: number | null = null;
  let salaryMax: number | null = null;

  if (job.salary) {
    salary = job.salary;
    // Try to extract numbers from salary string
    const numbers = job.salary.match(/\d+/g);
    if (numbers && numbers.length >= 2) {
      salaryMin = parseInt(numbers[0]) * 1000; // Assuming K notation
      salaryMax = parseInt(numbers[1]) * 1000;
    }
  }

  // Extract skills from description (basic extraction)
  const skillKeywords = ['JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'Kubernetes', 'SQL', 'PostgreSQL', 'MongoDB', 'Git', 'CI/CD', 'Agile', 'Scrum'];
  const skills = skillKeywords.filter(skill =>
    job.description?.toLowerCase().includes(skill.toLowerCase())
  );

  return {
    id: `remotive_${job.id}`,
    source: 'remotive',
    externalId: job.id.toString(),
    title: job.title,
    company: job.company_name || 'Company Not Listed',
    location: job.candidate_required_location || 'Worldwide',
    locationType: 'remote',
    type: mapJobType(job.job_type),
    salary,
    salaryMin,
    salaryMax,
    currency: 'USD',
    industry: categoryToIndustry[job.category] || 'Technology',
    description: job.description || '',
    requirements: [],
    benefits: [],
    skills,
    applyUrl: job.url,
    companyLogo: job.company_logo || null,
    postedDate: job.publication_date,
    expiresDate: null,
    featured: false,
  };
}

export async function searchRemotiveJobs(params: JobSearchParams): Promise<JobApiResponse> {
  try {
    const searchParams = new URLSearchParams();

    if (params.query) {
      searchParams.append('search', params.query);
    }

    // Map industry to Remotive category
    if (params.industry) {
      const categoryMap: Record<string, string> = {
        'Technology': 'software-dev',
        'Marketing': 'marketing',
        'Sales': 'sales',
        'Finance': 'finance-legal',
        'Creative': 'design',
        'Customer Service': 'customer-support',
        'Human Resources': 'hr',
      };
      const category = categoryMap[params.industry];
      if (category) {
        searchParams.append('category', category);
      }
    }

    const limit = params.limit || 50;

    searchParams.append('limit', limit.toString());

    const url = `${REMOTIVE_BASE_URL}?${searchParams}`;

    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error(`Remotive API error: ${response.status}`);
      return { jobs: [], total: 0, page: 1, totalPages: 0, source: 'remotive' };
    }

    const data = await response.json();
    const jobs = (data.jobs || []).map(mapRemotiveJob);

    // Apply pagination manually since Remotive doesn't support it natively
    const page = params.page || 1;
    const startIndex = (page - 1) * limit;
    const paginatedJobs = jobs.slice(startIndex, startIndex + limit);

    return {
      jobs: paginatedJobs,
      total: data['job-count'] || jobs.length,
      page,
      totalPages: Math.ceil((data['job-count'] || jobs.length) / limit),
      source: 'remotive',
    };
  } catch (error) {
    console.error('Remotive API error:', error);
    return { jobs: [], total: 0, page: 1, totalPages: 0, source: 'remotive' };
  }
}

// Get all remote job categories
export async function getRemotiveCategories(): Promise<string[]> {
  return Object.values(categoryToIndustry);
}
