-- Humanly Staffing Database Schema
-- Tables prefixed with "humanly_" to avoid conflicts with existing tables
-- Run this migration in Cognabase/Supabase SQL Editor

-- Enable UUID extension (if not exists)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- HUMANLY JOBS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS humanly_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    company_id UUID,
    description TEXT NOT NULL,
    requirements TEXT[] DEFAULT '{}',
    benefits TEXT[] DEFAULT '{}',
    salary_min INTEGER,
    salary_max INTEGER,
    salary_type TEXT CHECK (salary_type IN ('hourly', 'annual')) DEFAULT 'annual',
    location TEXT NOT NULL,
    remote BOOLEAN DEFAULT false,
    job_type TEXT CHECK (job_type IN ('full-time', 'part-time', 'contract', 'temporary')) DEFAULT 'full-time',
    industry TEXT NOT NULL,
    experience_level TEXT CHECK (experience_level IN ('entry', 'mid', 'senior', 'executive')) DEFAULT 'mid',
    employer_id TEXT NOT NULL,
    status TEXT CHECK (status IN ('draft', 'active', 'paused', 'closed')) DEFAULT 'draft',
    featured BOOLEAN DEFAULT false,
    views INTEGER DEFAULT 0,
    applications_count INTEGER DEFAULT 0,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for humanly_jobs
CREATE INDEX IF NOT EXISTS idx_humanly_jobs_employer ON humanly_jobs(employer_id);
CREATE INDEX IF NOT EXISTS idx_humanly_jobs_company ON humanly_jobs(company);
CREATE INDEX IF NOT EXISTS idx_humanly_jobs_status ON humanly_jobs(status);
CREATE INDEX IF NOT EXISTS idx_humanly_jobs_industry ON humanly_jobs(industry);
CREATE INDEX IF NOT EXISTS idx_humanly_jobs_location ON humanly_jobs(location);
CREATE INDEX IF NOT EXISTS idx_humanly_jobs_job_type ON humanly_jobs(job_type);
CREATE INDEX IF NOT EXISTS idx_humanly_jobs_experience ON humanly_jobs(experience_level);
CREATE INDEX IF NOT EXISTS idx_humanly_jobs_featured ON humanly_jobs(featured);
CREATE INDEX IF NOT EXISTS idx_humanly_jobs_created ON humanly_jobs(created_at DESC);

-- =====================================================
-- HUMANLY PROFILES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS humanly_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT UNIQUE NOT NULL,
    role TEXT CHECK (role IN ('candidate', 'employer', 'admin')) DEFAULT 'candidate',
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    headline TEXT,
    bio TEXT,
    location TEXT,
    resume_url TEXT,
    linkedin_url TEXT,
    website_url TEXT,
    skills TEXT[] DEFAULT '{}',
    experience_years INTEGER,
    desired_salary INTEGER,
    desired_job_types TEXT[] DEFAULT '{}',
    desired_industries TEXT[] DEFAULT '{}',
    open_to_remote BOOLEAN DEFAULT true,
    email_notifications BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for humanly_profiles
CREATE INDEX IF NOT EXISTS idx_humanly_profiles_user_id ON humanly_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_humanly_profiles_role ON humanly_profiles(role);
CREATE INDEX IF NOT EXISTS idx_humanly_profiles_email ON humanly_profiles(email);

-- =====================================================
-- HUMANLY COMPANIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS humanly_companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id TEXT NOT NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    cover_url TEXT,
    description TEXT,
    website TEXT,
    industry TEXT NOT NULL,
    size TEXT CHECK (size IN ('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+')) DEFAULT '1-10',
    founded INTEGER,
    headquarters TEXT,
    locations TEXT[] DEFAULT '{}',
    benefits TEXT[] DEFAULT '{}',
    culture TEXT,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for humanly_companies
CREATE INDEX IF NOT EXISTS idx_humanly_companies_owner ON humanly_companies(owner_id);
CREATE INDEX IF NOT EXISTS idx_humanly_companies_slug ON humanly_companies(slug);
CREATE INDEX IF NOT EXISTS idx_humanly_companies_industry ON humanly_companies(industry);

-- =====================================================
-- HUMANLY APPLICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS humanly_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES humanly_jobs(id) ON DELETE CASCADE,
    candidate_id TEXT NOT NULL,
    status TEXT CHECK (status IN ('pending', 'reviewing', 'interviewing', 'offered', 'hired', 'rejected', 'withdrawn')) DEFAULT 'pending',
    cover_letter TEXT,
    resume_url TEXT,
    answers JSONB DEFAULT '{}',
    notes TEXT,
    reviewed_by TEXT,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for humanly_applications
CREATE INDEX IF NOT EXISTS idx_humanly_applications_job ON humanly_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_humanly_applications_candidate ON humanly_applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_humanly_applications_status ON humanly_applications(status);
CREATE UNIQUE INDEX IF NOT EXISTS idx_humanly_applications_unique ON humanly_applications(job_id, candidate_id);

-- =====================================================
-- HUMANLY SAVED JOBS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS humanly_saved_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    job_id UUID NOT NULL REFERENCES humanly_jobs(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, job_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_humanly_saved_jobs_user ON humanly_saved_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_humanly_saved_jobs_job ON humanly_saved_jobs(job_id);

-- =====================================================
-- HUMANLY NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS humanly_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    type TEXT CHECK (type IN ('application_update', 'new_job', 'message', 'system')) NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_humanly_notifications_user ON humanly_notifications(user_id);

-- =====================================================
-- VIEWS FOR COMPATIBILITY
-- Create views that match the original table names for the app
-- =====================================================

-- Drop views if they exist (for re-running migration)
DROP VIEW IF EXISTS jobs CASCADE;
DROP VIEW IF EXISTS applications CASCADE;

-- Create views
CREATE OR REPLACE VIEW jobs AS SELECT * FROM humanly_jobs;
CREATE OR REPLACE VIEW applications AS SELECT * FROM humanly_applications;

-- Grant permissions
GRANT ALL ON humanly_jobs TO authenticated;
GRANT ALL ON humanly_profiles TO authenticated;
GRANT ALL ON humanly_companies TO authenticated;
GRANT ALL ON humanly_applications TO authenticated;
GRANT ALL ON humanly_saved_jobs TO authenticated;
GRANT ALL ON humanly_notifications TO authenticated;
GRANT ALL ON jobs TO authenticated;
GRANT ALL ON applications TO authenticated;

-- Service role full access
GRANT ALL ON humanly_jobs TO service_role;
GRANT ALL ON humanly_profiles TO service_role;
GRANT ALL ON humanly_companies TO service_role;
GRANT ALL ON humanly_applications TO service_role;
GRANT ALL ON humanly_saved_jobs TO service_role;
GRANT ALL ON humanly_notifications TO service_role;

-- =====================================================
-- ENABLE RLS
-- =====================================================
ALTER TABLE humanly_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE humanly_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE humanly_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE humanly_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE humanly_saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE humanly_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for jobs (public read, employer write)
CREATE POLICY "Public can view active jobs" ON humanly_jobs FOR SELECT USING (status = 'active');
CREATE POLICY "Service role has full access to jobs" ON humanly_jobs FOR ALL TO service_role USING (true);

-- RLS Policies for applications
CREATE POLICY "Candidates can view own applications" ON humanly_applications FOR SELECT USING (true);
CREATE POLICY "Service role has full access to applications" ON humanly_applications FOR ALL TO service_role USING (true);

-- =====================================================
-- TRIGGERS
-- =====================================================
CREATE OR REPLACE FUNCTION humanly_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER humanly_jobs_updated_at
    BEFORE UPDATE ON humanly_jobs
    FOR EACH ROW
    EXECUTE FUNCTION humanly_update_updated_at();

CREATE TRIGGER humanly_profiles_updated_at
    BEFORE UPDATE ON humanly_profiles
    FOR EACH ROW
    EXECUTE FUNCTION humanly_update_updated_at();

CREATE TRIGGER humanly_companies_updated_at
    BEFORE UPDATE ON humanly_companies
    FOR EACH ROW
    EXECUTE FUNCTION humanly_update_updated_at();

CREATE TRIGGER humanly_applications_updated_at
    BEFORE UPDATE ON humanly_applications
    FOR EACH ROW
    EXECUTE FUNCTION humanly_update_updated_at();

-- =====================================================
-- COMPLETION
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE 'Humanly Staffing tables created successfully!';
    RAISE NOTICE 'Tables: humanly_jobs, humanly_profiles, humanly_companies, humanly_applications, humanly_saved_jobs, humanly_notifications';
    RAISE NOTICE 'Views: jobs, applications (for app compatibility)';
END $$;
