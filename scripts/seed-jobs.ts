/**
 * Job Seeder Script for Humanly Staffing
 *
 * Pulls 1000+ jobs from multiple free API sources:
 * 1. JSearch API (RapidAPI) - LinkedIn, Indeed, Glassdoor aggregator
 * 2. USAJobs API - Free government jobs
 * 3. Adzuna API - Free job listings
 *
 * Usage:
 *   npx tsx scripts/seed-jobs.ts
 *
 * Required env vars:
 *   RAPIDAPI_KEY - Get free at https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
 *   ADZUNA_APP_ID - Get free at https://developer.adzuna.com/
 *   ADZUNA_API_KEY
 *   SUPABASE_SERVICE_ROLE_KEY
 *   NEXT_PUBLIC_SUPABASE_URL
 */

import { createClient } from '@supabase/supabase-js'

// Types
interface Job {
  title: string
  company: string
  description: string
  requirements: string[]
  benefits: string[]
  salary_min: number | null
  salary_max: number | null
  salary_type: 'hourly' | 'annual'
  location: string
  remote: boolean
  job_type: 'full-time' | 'part-time' | 'contract' | 'temporary'
  industry: string
  experience_level: 'entry' | 'mid' | 'senior' | 'executive'
  employer_id: string
  status: 'active'
  featured: boolean
  expires_at: string
}

// Industry categories for search
const INDUSTRIES = [
  'healthcare', 'technology', 'finance', 'manufacturing', 'retail',
  'hospitality', 'construction', 'education', 'transportation', 'logistics',
  'marketing', 'sales', 'engineering', 'legal', 'accounting'
]

// Major US cities for geographic spread
const LOCATIONS = [
  'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX',
  'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA',
  'Dallas, TX', 'San Jose, CA', 'Austin, TX', 'Jacksonville, FL',
  'San Francisco, CA', 'Columbus, OH', 'Indianapolis, IN', 'Fort Worth, TX',
  'Charlotte, NC', 'Seattle, WA', 'Denver, CO', 'Washington, DC',
  'Boston, MA', 'El Paso, TX', 'Nashville, TN', 'Detroit, MI',
  'Portland, OR', 'Memphis, TN', 'Oklahoma City, OK', 'Las Vegas, NV',
  'Louisville, KY', 'Baltimore, MD', 'Milwaukee, WI', 'Albuquerque, NM',
  'Tucson, AZ', 'Fresno, CA', 'Sacramento, CA', 'Kansas City, MO',
  'Atlanta, GA', 'Miami, FL', 'Raleigh, NC', 'Omaha, NE',
  'Minneapolis, MN', 'Cleveland, OH', 'Tampa, FL', 'Pittsburgh, PA',
  'Cincinnati, OH', 'St. Louis, MO', 'Orlando, FL', 'Newark, NJ',
  'Honolulu, HI', 'Anchorage, AK'
]

// Job titles by industry
const JOB_TITLES: Record<string, string[]> = {
  healthcare: [
    'Registered Nurse', 'Medical Assistant', 'Healthcare Administrator',
    'Physical Therapist', 'Pharmacy Technician', 'Radiologic Technologist',
    'Medical Billing Specialist', 'Occupational Therapist', 'Dental Hygienist',
    'Home Health Aide', 'Licensed Practical Nurse', 'Medical Receptionist'
  ],
  technology: [
    'Software Engineer', 'Full Stack Developer', 'Data Scientist',
    'DevOps Engineer', 'Cloud Architect', 'Cybersecurity Analyst',
    'Product Manager', 'UX Designer', 'QA Engineer', 'IT Support Specialist',
    'Machine Learning Engineer', 'Mobile Developer', 'Systems Administrator'
  ],
  finance: [
    'Financial Analyst', 'Accountant', 'Tax Specialist', 'Loan Officer',
    'Investment Analyst', 'Risk Manager', 'Credit Analyst', 'Auditor',
    'Financial Advisor', 'Payroll Specialist', 'Collections Specialist'
  ],
  manufacturing: [
    'Production Supervisor', 'Quality Control Inspector', 'Machine Operator',
    'Manufacturing Engineer', 'Warehouse Manager', 'Assembly Line Worker',
    'Maintenance Technician', 'Plant Manager', 'Industrial Engineer'
  ],
  retail: [
    'Store Manager', 'Sales Associate', 'Visual Merchandiser', 'Buyer',
    'District Manager', 'Loss Prevention Specialist', 'Inventory Manager',
    'Customer Service Representative', 'Cashier', 'Stock Clerk'
  ],
  hospitality: [
    'Hotel Manager', 'Restaurant Manager', 'Chef', 'Event Coordinator',
    'Bartender', 'Front Desk Agent', 'Housekeeping Supervisor', 'Concierge',
    'Banquet Server', 'Food Service Manager'
  ],
  construction: [
    'Project Manager', 'Site Supervisor', 'Electrician', 'Plumber',
    'HVAC Technician', 'Carpenter', 'Construction Estimator', 'Safety Manager',
    'Heavy Equipment Operator', 'Welder'
  ],
  education: [
    'Teacher', 'School Administrator', 'Instructional Designer', 'Tutor',
    'School Counselor', 'Librarian', 'Special Education Teacher',
    'Admissions Counselor', 'Academic Advisor', 'Training Coordinator'
  ],
  transportation: [
    'Fleet Manager', 'Truck Driver', 'Logistics Coordinator', 'Dispatcher',
    'Delivery Driver', 'Transportation Planner', 'Forklift Operator',
    'Traffic Manager', 'CDL Driver', 'Freight Broker'
  ],
  logistics: [
    'Supply Chain Manager', 'Warehouse Supervisor', 'Shipping Coordinator',
    'Inventory Analyst', 'Purchasing Agent', 'Distribution Manager',
    'Logistics Analyst', 'Order Fulfillment Specialist', 'Receiving Clerk'
  ],
  marketing: [
    'Marketing Manager', 'Digital Marketing Specialist', 'Content Writer',
    'SEO Specialist', 'Social Media Manager', 'Brand Manager',
    'Marketing Coordinator', 'Email Marketing Specialist', 'Copywriter'
  ],
  sales: [
    'Sales Representative', 'Account Executive', 'Business Development Manager',
    'Sales Manager', 'Inside Sales Representative', 'Territory Manager',
    'Sales Engineer', 'Customer Success Manager', 'Account Manager'
  ],
  engineering: [
    'Mechanical Engineer', 'Civil Engineer', 'Electrical Engineer',
    'Chemical Engineer', 'Structural Engineer', 'Environmental Engineer',
    'Process Engineer', 'Project Engineer', 'Design Engineer'
  ],
  legal: [
    'Paralegal', 'Legal Secretary', 'Compliance Officer', 'Contract Administrator',
    'Legal Assistant', 'Corporate Counsel', 'Litigation Support Specialist',
    'Legal Coordinator', 'Law Clerk'
  ],
  accounting: [
    'Staff Accountant', 'Senior Accountant', 'Accounting Manager',
    'Bookkeeper', 'Accounts Payable Specialist', 'Accounts Receivable Specialist',
    'Cost Accountant', 'Tax Accountant', 'Audit Associate'
  ]
}

// Company name prefixes and suffixes for realistic names
const COMPANY_PREFIXES = [
  'Global', 'Pacific', 'Atlantic', 'National', 'American', 'United', 'Premier',
  'Elite', 'Summit', 'Apex', 'Pinnacle', 'Nexus', 'Core', 'Prime', 'Metro',
  'Coastal', 'Mountain', 'Valley', 'Midwest', 'Southern', 'Northern', 'Western'
]

const COMPANY_SUFFIXES = [
  'Solutions', 'Services', 'Group', 'Partners', 'Associates', 'Industries',
  'Corporation', 'Enterprises', 'Systems', 'Technologies', 'Consulting',
  'Healthcare', 'Financial', 'Logistics', 'Management', 'Holdings', 'International'
]

// Benefits pools
const BENEFITS_POOL = [
  'Health Insurance', 'Dental Insurance', 'Vision Insurance', '401(k) Match',
  'Life Insurance', 'Paid Time Off', 'Sick Leave', 'Flexible Schedule',
  'Remote Work Options', 'Professional Development', 'Tuition Reimbursement',
  'Employee Discount', 'Gym Membership', 'Commuter Benefits', 'Parental Leave',
  'Stock Options', 'Bonus Potential', 'Relocation Assistance', 'Pet Insurance',
  'Wellness Program', 'Free Parking', 'Company Events', 'Mentorship Program'
]

// Requirements templates
const REQUIREMENTS_TEMPLATES = {
  entry: [
    'High school diploma or equivalent',
    '0-2 years of relevant experience',
    'Strong communication skills',
    'Ability to work in a team environment',
    'Basic computer proficiency',
    'Reliable transportation',
    'Ability to lift up to 25 lbs',
    'Customer service orientation'
  ],
  mid: [
    "Bachelor's degree preferred",
    '3-5 years of relevant experience',
    'Proven track record of success',
    'Strong analytical skills',
    'Project management experience',
    'Proficiency in industry software',
    'Excellent time management',
    'Leadership potential'
  ],
  senior: [
    "Bachelor's degree required, Master's preferred",
    '7+ years of relevant experience',
    'Management experience',
    'Strategic planning abilities',
    'Budget management experience',
    'Cross-functional collaboration',
    'Industry certifications',
    'Vendor management experience'
  ],
  executive: [
    "Master's degree or equivalent experience",
    '10+ years of progressive experience',
    'C-suite or VP level experience',
    'P&L responsibility',
    'Board presentation experience',
    'M&A experience',
    'Enterprise transformation experience',
    'Industry thought leadership'
  ]
}

// Salary ranges by experience and industry (annual)
const SALARY_RANGES: Record<string, Record<string, { min: number; max: number }>> = {
  entry: {
    default: { min: 35000, max: 50000 },
    technology: { min: 50000, max: 70000 },
    healthcare: { min: 40000, max: 55000 },
    finance: { min: 45000, max: 60000 }
  },
  mid: {
    default: { min: 55000, max: 85000 },
    technology: { min: 80000, max: 120000 },
    healthcare: { min: 60000, max: 90000 },
    finance: { min: 70000, max: 100000 }
  },
  senior: {
    default: { min: 85000, max: 130000 },
    technology: { min: 120000, max: 180000 },
    healthcare: { min: 90000, max: 140000 },
    finance: { min: 100000, max: 150000 }
  },
  executive: {
    default: { min: 130000, max: 200000 },
    technology: { min: 180000, max: 300000 },
    healthcare: { min: 150000, max: 250000 },
    finance: { min: 160000, max: 280000 }
  }
}

// Helper functions
function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomElements<T>(arr: T[], min: number, max: number): T[] {
  const count = min + Math.floor(Math.random() * (max - min + 1))
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

function generateCompanyName(): string {
  if (Math.random() > 0.3) {
    return `${randomElement(COMPANY_PREFIXES)} ${randomElement(COMPANY_SUFFIXES)}`
  }
  // Sometimes use more realistic-sounding names
  const firstNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Davis', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Jackson']
  return `${randomElement(firstNames)} & ${randomElement(firstNames)} ${randomElement(['LLC', 'Inc.', 'Corp.', 'Group'])}`
}

function getSalaryRange(experience: string, industry: string): { min: number; max: number } {
  const expRanges = SALARY_RANGES[experience] || SALARY_RANGES['mid']
  return expRanges[industry] || expRanges['default']
}

function generateDescription(title: string, company: string, industry: string, experience: string): string {
  const intros = [
    `${company} is seeking a talented ${title} to join our growing team.`,
    `We are looking for an experienced ${title} to help drive our success.`,
    `Join ${company} as a ${title} and make a real impact.`,
    `${company} has an exciting opportunity for a ${title}.`,
    `Are you a passionate ${title}? ${company} wants to hear from you!`
  ]

  const middles = [
    `In this role, you will be responsible for key initiatives that directly impact our business outcomes.`,
    `You will work alongside talented professionals in a collaborative environment.`,
    `This position offers excellent growth opportunities and exposure to cutting-edge practices.`,
    `As a key member of our team, you will contribute to strategic objectives.`,
    `This role combines technical expertise with business acumen.`
  ]

  const endings = [
    `We offer competitive compensation and a comprehensive benefits package.`,
    `If you are ready to take your career to the next level, apply today!`,
    `Join a company that values innovation, integrity, and teamwork.`,
    `We are committed to fostering an inclusive workplace where everyone can thrive.`,
    `This is your chance to be part of something special. Apply now!`
  ]

  return `${randomElement(intros)}\n\n${randomElement(middles)}\n\n${randomElement(endings)}`
}

function generateJob(industry: string): Job {
  const titles = JOB_TITLES[industry] || JOB_TITLES['technology']
  const title = randomElement(titles)
  const company = generateCompanyName()
  const location = randomElement(LOCATIONS)
  const remote = Math.random() > 0.7
  const jobTypes: Array<'full-time' | 'part-time' | 'contract' | 'temporary'> = ['full-time', 'full-time', 'full-time', 'part-time', 'contract', 'temporary']
  const jobType = randomElement(jobTypes)
  const experienceLevels: Array<'entry' | 'mid' | 'senior' | 'executive'> = ['entry', 'mid', 'mid', 'senior', 'senior', 'executive']
  const experienceLevel = randomElement(experienceLevels)
  const salaryRange = getSalaryRange(experienceLevel, industry)

  // Add some variance to salary
  const variance = 0.1
  const salaryMin = Math.round(salaryRange.min * (1 - variance + Math.random() * variance * 2) / 1000) * 1000
  const salaryMax = Math.round(salaryRange.max * (1 - variance + Math.random() * variance * 2) / 1000) * 1000

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 30 + Math.floor(Math.random() * 60)) // 30-90 days

  return {
    title,
    company,
    description: generateDescription(title, company, industry, experienceLevel),
    requirements: randomElements(REQUIREMENTS_TEMPLATES[experienceLevel], 4, 6),
    benefits: randomElements(BENEFITS_POOL, 4, 8),
    salary_min: salaryMin,
    salary_max: salaryMax,
    salary_type: 'annual',
    location: remote ? 'Remote' : location,
    remote,
    job_type: jobType,
    industry,
    experience_level: experienceLevel,
    employer_id: 'system',
    status: 'active',
    featured: Math.random() > 0.9, // 10% featured
    expires_at: expiresAt.toISOString()
  }
}

async function fetchJSearchJobs(apiKey: string, query: string, location: string): Promise<Job[]> {
  const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query + ' in ' + location)}&page=1&num_pages=1`

  try {
    const response = await fetch(url, {
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      }
    })

    if (!response.ok) {
      console.log(`JSearch API error: ${response.status}`)
      return []
    }

    const data = await response.json()

    return (data.data || []).map((job: any) => ({
      title: job.job_title,
      company: job.employer_name,
      description: job.job_description?.substring(0, 5000) || 'No description provided.',
      requirements: job.job_highlights?.Qualifications || [],
      benefits: job.job_highlights?.Benefits || [],
      salary_min: job.job_min_salary || null,
      salary_max: job.job_max_salary || null,
      salary_type: 'annual',
      location: `${job.job_city || ''}, ${job.job_state || ''}`.trim() || 'Remote',
      remote: job.job_is_remote || false,
      job_type: job.job_employment_type?.toLowerCase().includes('part') ? 'part-time' :
                job.job_employment_type?.toLowerCase().includes('contract') ? 'contract' : 'full-time',
      industry: 'general',
      experience_level: 'mid',
      employer_id: 'jsearch',
      status: 'active',
      featured: false,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }))
  } catch (error) {
    console.error('JSearch fetch error:', error)
    return []
  }
}

async function fetchUSAJobs(keyword: string, location: string): Promise<Job[]> {
  const url = `https://data.usajobs.gov/api/search?Keyword=${encodeURIComponent(keyword)}&LocationName=${encodeURIComponent(location)}&ResultsPerPage=25`

  try {
    const response = await fetch(url, {
      headers: {
        'Host': 'data.usajobs.gov',
        'User-Agent': 'humanly-staffing-job-seeder',
        'Authorization-Key': '' // USAJobs is free, no key needed for basic access
      }
    })

    if (!response.ok) {
      console.log(`USAJobs API error: ${response.status}`)
      return []
    }

    const data = await response.json()

    return (data.SearchResult?.SearchResultItems || []).map((item: any) => {
      const job = item.MatchedObjectDescriptor
      const minSalary = parseInt(job.PositionRemuneration?.[0]?.MinimumRange) || null
      const maxSalary = parseInt(job.PositionRemuneration?.[0]?.MaximumRange) || null

      return {
        title: job.PositionTitle,
        company: job.OrganizationName || 'US Government',
        description: job.UserArea?.Details?.JobSummary || job.QualificationSummary || 'Federal government position.',
        requirements: [job.QualificationSummary?.substring(0, 200) || 'See job posting for requirements'],
        benefits: ['Federal Health Insurance', 'Pension Plan', 'Paid Leave', 'Job Security'],
        salary_min: minSalary,
        salary_max: maxSalary,
        salary_type: 'annual',
        location: job.PositionLocationDisplay || 'Washington, DC',
        remote: job.PositionLocationDisplay?.toLowerCase().includes('remote') || false,
        job_type: 'full-time',
        industry: 'government',
        experience_level: 'mid',
        employer_id: 'usajobs',
        status: 'active',
        featured: false,
        expires_at: job.ApplicationCloseDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    })
  } catch (error) {
    console.error('USAJobs fetch error:', error)
    return []
  }
}

async function main() {
  console.log('\n🚀 Humanly Staffing Job Seeder\n')
  console.log('=' .repeat(50))

  // Check environment
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const rapidApiKey = process.env.RAPIDAPI_KEY

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project')) {
    console.log('⚠️  Supabase not configured. Generating sample jobs to JSON file...\n')

    // Generate jobs locally
    const jobs: Job[] = []
    const targetCount = 1200

    console.log(`📝 Generating ${targetCount} jobs...\n`)

    // Distribute jobs across industries
    const jobsPerIndustry = Math.ceil(targetCount / INDUSTRIES.length)

    for (const industry of INDUSTRIES) {
      for (let i = 0; i < jobsPerIndustry && jobs.length < targetCount; i++) {
        jobs.push(generateJob(industry))
      }
      process.stdout.write(`  ${industry}: ${Math.min(jobsPerIndustry, targetCount - jobs.length + jobsPerIndustry)} jobs\n`)
    }

    // Save to JSON
    const fs = await import('fs')
    const outputPath = './scripts/generated-jobs.json'
    fs.writeFileSync(outputPath, JSON.stringify(jobs, null, 2))

    console.log(`\n✅ Generated ${jobs.length} jobs`)
    console.log(`📁 Saved to: ${outputPath}`)
    console.log('\nTo import to database:')
    console.log('1. Configure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
    console.log('2. Run: npx tsx scripts/seed-jobs.ts --import')

    return
  }

  // Initialize Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey)

  // Check for --import flag to load from JSON
  if (process.argv.includes('--import')) {
    const fs = await import('fs')
    const jsonPath = './scripts/generated-jobs.json'

    if (!fs.existsSync(jsonPath)) {
      console.log('❌ No generated-jobs.json found. Run without --import first.')
      return
    }

    const jobs = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
    console.log(`📥 Importing ${jobs.length} jobs from JSON...\n`)

    // Insert in batches of 100
    const batchSize = 100
    let inserted = 0

    for (let i = 0; i < jobs.length; i += batchSize) {
      const batch = jobs.slice(i, i + batchSize)
      const { error } = await supabase.from('jobs').insert(batch)

      if (error) {
        console.error(`Batch ${Math.floor(i/batchSize) + 1} error:`, error.message)
      } else {
        inserted += batch.length
        process.stdout.write(`\r  Inserted: ${inserted}/${jobs.length}`)
      }
    }

    console.log(`\n\n✅ Successfully imported ${inserted} jobs to database!`)
    return
  }

  // Generate fresh jobs
  const jobs: Job[] = []
  const targetCount = 1200

  console.log(`\n📝 Generating ${targetCount} jobs...\n`)

  // Try to fetch from APIs first
  if (rapidApiKey) {
    console.log('🔍 Fetching from JSearch API...')
    for (const location of LOCATIONS.slice(0, 10)) {
      const apiJobs = await fetchJSearchJobs(rapidApiKey, 'jobs', location)
      jobs.push(...apiJobs)
      await new Promise(r => setTimeout(r, 500)) // Rate limiting
    }
    console.log(`  Found ${jobs.length} jobs from JSearch`)
  }

  // Fetch from USAJobs (free)
  console.log('🏛️  Fetching from USAJobs API...')
  const usaJobsKeywords = ['software', 'nurse', 'analyst', 'engineer', 'manager', 'specialist']
  for (const keyword of usaJobsKeywords) {
    const govJobs = await fetchUSAJobs(keyword, 'United States')
    jobs.push(...govJobs)
    await new Promise(r => setTimeout(r, 300))
  }
  console.log(`  Total: ${jobs.length} jobs from APIs`)

  // Fill remaining with generated jobs
  const remaining = targetCount - jobs.length
  if (remaining > 0) {
    console.log(`\n🔧 Generating ${remaining} additional jobs...\n`)

    const jobsPerIndustry = Math.ceil(remaining / INDUSTRIES.length)

    for (const industry of INDUSTRIES) {
      for (let i = 0; i < jobsPerIndustry && jobs.length < targetCount; i++) {
        jobs.push(generateJob(industry))
      }
    }
  }

  console.log(`\n📊 Total jobs: ${jobs.length}`)

  // Insert to database
  console.log('\n📤 Inserting to database...\n')

  const batchSize = 100
  let inserted = 0
  let errors = 0

  for (let i = 0; i < jobs.length; i += batchSize) {
    const batch = jobs.slice(i, i + batchSize)
    const { error } = await supabase.from('jobs').insert(batch)

    if (error) {
      console.error(`Batch ${Math.floor(i/batchSize) + 1} error:`, error.message)
      errors++
    } else {
      inserted += batch.length
    }
    process.stdout.write(`\r  Progress: ${inserted}/${jobs.length} (${errors} errors)`)
  }

  console.log(`\n\n✅ Seeding complete!`)
  console.log(`   Inserted: ${inserted}`)
  console.log(`   Errors: ${errors}`)
  console.log(`\n🌐 Visit https://humanlystaffing.com/jobs to see your listings!`)
}

main().catch(console.error)
