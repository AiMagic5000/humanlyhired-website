# Humanly Staffing Database Setup

This directory contains database migrations and setup instructions for the Humanly Staffing platform.

## Database Provider

The platform uses **Cognabase** (self-hosted Supabase) or **Supabase** for the database backend.

## Setup Instructions

### 1. Create a Cognabase/Supabase Project

If using Cognabase (recommended for self-hosted):
- Access your Cognabase instance at https://studio.cognabase.com
- Create a new project or use an existing one

If using Supabase:
- Go to https://supabase.com
- Create a new project

### 2. Run the Migration

1. Open the SQL Editor in your Cognabase/Supabase dashboard
2. Copy the contents of `migrations/001_initial_schema.sql`
3. Paste and run the SQL

This will create all necessary tables:
- `profiles` - User profiles for candidates and employers
- `companies` - Employer company information
- `jobs` - Job postings
- `applications` - Job applications
- `saved_jobs` - Bookmarked jobs
- `notifications` - In-app notifications

### 3. Configure Environment Variables

Update your `.env.local` file with the following:

```env
# Supabase / Cognabase Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Find these values in your Cognabase/Supabase project settings under "API".

### 4. Verify Connection

After configuring, restart your development server:

```bash
npm run dev
```

The application will automatically connect to your database.

## Database Schema

### profiles
Stores user information for candidates and employers.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | TEXT | Clerk user ID |
| role | TEXT | 'candidate', 'employer', or 'admin' |
| first_name | TEXT | User's first name |
| last_name | TEXT | User's last name |
| email | TEXT | Email address |
| skills | TEXT[] | Array of skills |
| resume_url | TEXT | Link to uploaded resume |

### companies
Stores employer company profiles.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| owner_id | TEXT | Clerk user ID of owner |
| name | TEXT | Company name |
| slug | TEXT | URL-friendly identifier |
| industry | TEXT | Company industry |
| verified | BOOLEAN | Verification status |

### jobs
Stores job postings.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | TEXT | Job title |
| company | TEXT | Company name |
| description | TEXT | Job description |
| salary_min | INTEGER | Minimum salary |
| salary_max | INTEGER | Maximum salary |
| location | TEXT | Job location |
| remote | BOOLEAN | Remote work option |
| status | TEXT | 'draft', 'active', 'paused', 'closed' |

### applications
Stores job applications from candidates.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| job_id | UUID | Reference to jobs table |
| candidate_id | TEXT | Clerk user ID |
| status | TEXT | Application status |
| cover_letter | TEXT | Cover letter content |
| answers | JSONB | Form answers |

### saved_jobs
Tracks bookmarked jobs.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | TEXT | Clerk user ID |
| job_id | UUID | Reference to jobs table |

### notifications
Stores in-app notifications.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | TEXT | Clerk user ID |
| type | TEXT | Notification type |
| title | TEXT | Notification title |
| message | TEXT | Notification content |
| read | BOOLEAN | Read status |

## Row Level Security (RLS)

All tables have Row Level Security enabled to ensure data privacy:

- Users can only view/modify their own profiles
- Employers can only manage their own jobs and view applications for their jobs
- Candidates can only view/manage their own applications
- Everyone can view active job listings

## Troubleshooting

### "Permission denied" errors
Make sure RLS policies are properly configured. Run the migration SQL which includes all necessary policies.

### Connection issues
1. Verify your SUPABASE_URL is correct (should start with `https://`)
2. Ensure your API keys are valid
3. Check that your project is running and accessible

### Tables not found
Make sure you've run the complete migration SQL in the correct project.

## Support

For issues with:
- Cognabase: Check the Cognabase documentation or your instance logs
- Supabase: Visit https://supabase.com/docs
- This application: Check the main project README
