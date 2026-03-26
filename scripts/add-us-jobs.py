#!/usr/bin/env python3
"""Generate 1000 US-focused jobs and import to database"""

import random
from datetime import datetime, timedelta

# US Locations - All 50 states represented
US_LOCATIONS = [
    # Major metros
    "New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Phoenix, AZ",
    "Philadelphia, PA", "San Antonio, TX", "San Diego, CA", "Dallas, TX", "San Jose, CA",
    "Austin, TX", "Jacksonville, FL", "San Francisco, CA", "Columbus, OH", "Indianapolis, IN",
    "Fort Worth, TX", "Charlotte, NC", "Seattle, WA", "Denver, CO", "Washington, DC",
    "Boston, MA", "Nashville, TN", "Detroit, MI", "Portland, OR", "Las Vegas, NV",
    "Memphis, TN", "Louisville, KY", "Baltimore, MD", "Milwaukee, WI", "Albuquerque, NM",
    "Atlanta, GA", "Miami, FL", "Raleigh, NC", "Minneapolis, MN", "Cleveland, OH",
    "Tampa, FL", "Pittsburgh, PA", "St. Louis, MO", "Orlando, FL", "Newark, NJ",
    # Additional cities for diversity
    "Omaha, NE", "Tulsa, OK", "Kansas City, MO", "Boise, ID", "Salt Lake City, UT",
    "Richmond, VA", "Charleston, SC", "Birmingham, AL", "Honolulu, HI", "Anchorage, AK",
    "Burlington, VT", "Portland, ME", "Providence, RI", "Hartford, CT", "Wilmington, DE",
    "Cheyenne, WY", "Fargo, ND", "Sioux Falls, SD", "Billings, MT", "Jackson, MS",
    "Little Rock, AR", "Des Moines, IA", "Madison, WI", "Grand Rapids, MI", "Rochester, NY"
]

INDUSTRIES = ['healthcare', 'technology', 'finance', 'manufacturing', 'retail',
              'hospitality', 'construction', 'education', 'transportation', 'logistics',
              'marketing', 'sales', 'engineering', 'legal', 'accounting']

JOB_TITLES = {
    'healthcare': [
        'Registered Nurse', 'Medical Assistant', 'Healthcare Administrator', 'Physical Therapist',
        'Pharmacy Technician', 'Radiologic Technologist', 'Occupational Therapist', 'Dental Hygienist',
        'Home Health Aide', 'Licensed Practical Nurse', 'Nurse Practitioner', 'Physician Assistant',
        'Medical Billing Specialist', 'Clinical Research Coordinator', 'Healthcare Recruiter'
    ],
    'technology': [
        'Software Engineer', 'Full Stack Developer', 'Data Scientist', 'DevOps Engineer',
        'Cloud Architect', 'Cybersecurity Analyst', 'Product Manager', 'UX Designer',
        'QA Engineer', 'IT Support Specialist', 'Machine Learning Engineer', 'Mobile Developer',
        'Systems Administrator', 'Database Administrator', 'Technical Project Manager'
    ],
    'finance': [
        'Financial Analyst', 'Accountant', 'Tax Specialist', 'Loan Officer', 'Investment Analyst',
        'Risk Manager', 'Credit Analyst', 'Auditor', 'Financial Advisor', 'Payroll Specialist',
        'Collections Specialist', 'Compliance Officer', 'Treasury Analyst', 'Portfolio Manager'
    ],
    'manufacturing': [
        'Production Supervisor', 'Quality Control Inspector', 'Machine Operator', 'Manufacturing Engineer',
        'Warehouse Manager', 'Assembly Line Worker', 'Maintenance Technician', 'Plant Manager',
        'Industrial Engineer', 'Supply Chain Analyst', 'Production Planner', 'Process Engineer'
    ],
    'retail': [
        'Store Manager', 'Sales Associate', 'Visual Merchandiser', 'Buyer', 'District Manager',
        'Loss Prevention Specialist', 'Inventory Manager', 'Customer Service Representative',
        'E-commerce Manager', 'Retail Operations Manager', 'Category Manager'
    ],
    'hospitality': [
        'Hotel Manager', 'Restaurant Manager', 'Executive Chef', 'Event Coordinator', 'Bartender',
        'Front Desk Agent', 'Housekeeping Supervisor', 'Concierge', 'Banquet Captain', 'Food Service Director'
    ],
    'construction': [
        'Project Manager', 'Site Supervisor', 'Electrician', 'Plumber', 'HVAC Technician',
        'Carpenter', 'Construction Estimator', 'Safety Manager', 'Heavy Equipment Operator',
        'Welder', 'Project Engineer', 'Construction Superintendent'
    ],
    'education': [
        'Teacher', 'School Administrator', 'Instructional Designer', 'Tutor', 'School Counselor',
        'Special Education Teacher', 'Academic Advisor', 'Training Coordinator', 'Curriculum Developer'
    ],
    'transportation': [
        'Fleet Manager', 'CDL Truck Driver', 'Logistics Coordinator', 'Dispatcher', 'Delivery Driver',
        'Transportation Planner', 'Forklift Operator', 'Traffic Manager', 'Freight Broker'
    ],
    'logistics': [
        'Supply Chain Manager', 'Warehouse Supervisor', 'Shipping Coordinator', 'Inventory Analyst',
        'Purchasing Agent', 'Distribution Manager', 'Logistics Analyst', 'Import/Export Specialist'
    ],
    'marketing': [
        'Marketing Manager', 'Digital Marketing Specialist', 'Content Writer', 'SEO Specialist',
        'Social Media Manager', 'Brand Manager', 'Marketing Coordinator', 'Email Marketing Specialist',
        'Marketing Analyst', 'PR Coordinator'
    ],
    'sales': [
        'Sales Representative', 'Account Executive', 'Business Development Manager', 'Sales Manager',
        'Inside Sales Representative', 'Territory Manager', 'Sales Engineer', 'Account Manager',
        'Regional Sales Director', 'Sales Operations Manager'
    ],
    'engineering': [
        'Mechanical Engineer', 'Civil Engineer', 'Electrical Engineer', 'Chemical Engineer',
        'Structural Engineer', 'Environmental Engineer', 'Process Engineer', 'Project Engineer',
        'Design Engineer', 'Quality Engineer'
    ],
    'legal': [
        'Paralegal', 'Legal Secretary', 'Compliance Officer', 'Contract Administrator',
        'Legal Assistant', 'Litigation Support Specialist', 'Legal Coordinator', 'Corporate Counsel'
    ],
    'accounting': [
        'Staff Accountant', 'Senior Accountant', 'Accounting Manager', 'Bookkeeper',
        'Accounts Payable Specialist', 'Accounts Receivable Specialist', 'Tax Accountant',
        'Cost Accountant', 'Audit Associate', 'Controller'
    ]
}

COMPANY_PREFIXES = ['Global', 'Pacific', 'National', 'American', 'United', 'Premier', 'Elite',
                    'Summit', 'Apex', 'Pinnacle', 'Nexus', 'Core', 'Prime', 'Metro', 'Allied',
                    'Coastal', 'Mountain', 'Valley', 'Midwest', 'Southern', 'Northern', 'Western']

COMPANY_SUFFIXES = ['Solutions', 'Services', 'Group', 'Partners', 'Industries', 'Corporation',
                    'Enterprises', 'Systems', 'Technologies', 'Consulting', 'Healthcare',
                    'Financial', 'Logistics', 'Management', 'Holdings', 'International', 'Associates']

BENEFITS = ['Health Insurance', 'Dental Insurance', 'Vision Insurance', '401(k) with Match',
            'Life Insurance', 'Paid Time Off', 'Flexible Schedule', 'Remote Work Options',
            'Professional Development', 'Tuition Reimbursement', 'Employee Discount',
            'Wellness Program', 'Parental Leave', 'Stock Options', 'Commuter Benefits']

SALARY_RANGES = {
    'entry': {'technology': (55000, 75000), 'healthcare': (45000, 60000), 'finance': (50000, 65000), 'default': (40000, 55000)},
    'mid': {'technology': (85000, 130000), 'healthcare': (65000, 95000), 'finance': (75000, 110000), 'default': (60000, 85000)},
    'senior': {'technology': (130000, 180000), 'healthcare': (95000, 140000), 'finance': (110000, 160000), 'default': (90000, 130000)},
    'executive': {'technology': (180000, 280000), 'healthcare': (150000, 220000), 'finance': (160000, 250000), 'default': (140000, 200000)}
}

def generate_company():
    if random.random() > 0.3:
        return f"{random.choice(COMPANY_PREFIXES)} {random.choice(COMPANY_SUFFIXES)}"
    names = ['Smith', 'Johnson', 'Williams', 'Brown', 'Davis', 'Wilson', 'Anderson', 'Taylor', 'Thomas']
    return f"{random.choice(names)} & {random.choice(names)} {random.choice(['LLC', 'Inc.', 'Corp.', 'Group'])}"

def get_salary(exp, industry):
    ranges = SALARY_RANGES.get(exp, SALARY_RANGES['mid'])
    r = ranges.get(industry, ranges['default'])
    base = r[0] + random.random() * (r[1] - r[0]) * 0.5
    return round(base / 1000) * 1000, round((base * 1.25) / 1000) * 1000

def escape_sql(s):
    return s.replace("'", "''")

def main():
    jobs = []
    target = 1000

    print(f"Generating {target} US jobs...")

    for i in range(target):
        industry = random.choice(INDUSTRIES)
        titles = JOB_TITLES.get(industry, JOB_TITLES['technology'])
        title = random.choice(titles)
        company = generate_company()
        location = random.choice(US_LOCATIONS)
        remote = random.random() > 0.85  # 15% remote
        job_type = random.choices(['full-time', 'part-time', 'contract', 'temporary'], weights=[70, 10, 15, 5])[0]
        exp_level = random.choices(['entry', 'mid', 'senior', 'executive'], weights=[20, 45, 30, 5])[0]
        salary_min, salary_max = get_salary(exp_level, industry)
        featured = random.random() > 0.92
        benefits = random.sample(BENEFITS, k=random.randint(4, 8))

        jobs.append({
            'title': title,
            'company': company,
            'location': 'Remote (USA)' if remote else location,
            'remote': remote,
            'job_type': job_type,
            'industry': industry,
            'experience_level': exp_level,
            'salary_min': salary_min,
            'salary_max': salary_max,
            'benefits': benefits,
            'featured': featured
        })

        if (i + 1) % 200 == 0:
            print(f"  Generated {i + 1}/{target}")

    # Generate SQL
    sql_file = "/tmp/us_jobs_import.sql"
    with open(sql_file, "w") as f:
        f.write("-- US Jobs Import\n")
        f.write(f"-- Generated: {datetime.now().isoformat()}\n")
        f.write(f"-- Total: {len(jobs)} jobs\n\n")

        for job in jobs:
            title = escape_sql(job['title'])
            company = escape_sql(job['company'])
            location = escape_sql(job['location'])
            desc = escape_sql(f"{company} is seeking a skilled {job['title']} to join our team in {location}. We offer competitive compensation, excellent benefits, and opportunities for career growth. Join a company that values its employees and fosters a collaborative work environment.")
            benefits_arr = "ARRAY[" + ",".join([f"'{escape_sql(b)}'" for b in job['benefits']]) + "]::text[]"

            f.write(f"""INSERT INTO humanly_jobs (title, company, description, requirements, benefits, salary_min, salary_max, salary_type, location, remote, job_type, industry, experience_level, employer_id, status, featured, expires_at)
VALUES ('{title}', '{company}', '{desc}', ARRAY['Relevant experience required', 'Strong communication skills', 'Team player']::text[], {benefits_arr}, {job['salary_min']}, {job['salary_max']}, 'annual', '{location}', {str(job['remote']).lower()}, '{job['job_type']}', '{job['industry']}', '{job['experience_level']}', 'system', 'active', {str(job['featured']).lower()}, NOW() + INTERVAL '60 days');
""")

    print(f"\nSQL file created: {sql_file}")
    print(f"Total jobs: {len(jobs)}")
    print("\nTo import, run:")
    print(f"cat {sql_file} | ssh admin1@10.28.28.95 'docker exec -i supabase-db-r8woc8gk8gcsg8ksc4sgckgw psql -U postgres'")

if __name__ == "__main__":
    main()
