#!/bin/bash
# Direct database import script for Humanly jobs
# Bypasses API and inserts directly to PostgreSQL

set -e

JSON_FILE="/mnt/c/Users/flowc/Documents/humanly-staffing-website/scripts/generated-jobs.json"

if [ ! -f "$JSON_FILE" ]; then
    echo "ERROR: $JSON_FILE not found"
    exit 1
fi

echo "Converting JSON to SQL insert statements..."

# Create SQL file from JSON
python3 << 'PYTHON_SCRIPT'
import json
import uuid
from datetime import datetime

with open("/mnt/c/Users/flowc/Documents/humanly-staffing-website/scripts/generated-jobs.json") as f:
    jobs = json.load(f)

print(f"Found {len(jobs)} jobs to import")

# Generate SQL
sql_file = "/tmp/humanly_jobs_import.sql"
with open(sql_file, "w") as f:
    f.write("-- Auto-generated job import\n")
    f.write("-- Jobs: {}\n\n".format(len(jobs)))

    for i, job in enumerate(jobs):
        # Escape single quotes
        title = job.get('title', '').replace("'", "''")
        company = job.get('company', '').replace("'", "''")
        description = job.get('description', '').replace("'", "''")[:5000]
        location = job.get('location', '').replace("'", "''")
        industry = job.get('industry', 'general').replace("'", "''")

        # Arrays
        requirements = job.get('requirements', [])
        benefits = job.get('benefits', [])
        req_arr = "ARRAY[" + ",".join(["'{}'".format(r.replace("'", "''")) for r in requirements]) + "]::text[]" if requirements else "'{}'::text[]"
        ben_arr = "ARRAY[" + ",".join(["'{}'".format(b.replace("'", "''")) for b in benefits]) + "]::text[]" if benefits else "'{}'::text[]"

        # Numeric fields
        salary_min = job.get('salary_min')
        salary_max = job.get('salary_max')
        salary_min_sql = str(salary_min) if salary_min else "NULL"
        salary_max_sql = str(salary_max) if salary_max else "NULL"

        # Boolean
        remote = "true" if job.get('remote') else "false"
        featured = "true" if job.get('featured') else "false"

        # Enums
        job_type = job.get('job_type', 'full-time')
        exp_level = job.get('experience_level', 'mid')
        salary_type = job.get('salary_type', 'annual')

        sql = f"""INSERT INTO humanly_jobs (title, company, description, requirements, benefits, salary_min, salary_max, salary_type, location, remote, job_type, industry, experience_level, employer_id, status, featured, expires_at)
VALUES ('{title}', '{company}', '{description}', {req_arr}, {ben_arr}, {salary_min_sql}, {salary_max_sql}, '{salary_type}', '{location}', {remote}, '{job_type}', '{industry}', '{exp_level}', 'system', 'active', {featured}, NOW() + INTERVAL '60 days');\n"""
        f.write(sql)

        if (i + 1) % 100 == 0:
            print(f"  Processed {i + 1}/{len(jobs)}")

print(f"SQL file created: {sql_file}")
print(f"Total jobs: {len(jobs)}")
PYTHON_SCRIPT

echo ""
echo "Importing to database via SSH..."
ssh admin1@10.28.28.95 "docker exec -i supabase-db-r8woc8gk8gcsg8ksc4sgckgw psql -U postgres" < /tmp/humanly_jobs_import.sql 2>&1 | tail -20

echo ""
echo "Verifying import..."
ssh admin1@10.28.28.95 "docker exec supabase-db-r8woc8gk8gcsg8ksc4sgckgw psql -U postgres -c 'SELECT COUNT(*) as total_jobs FROM humanly_jobs;'"

echo ""
echo "Done!"
