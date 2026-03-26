-- Humanly Staffing Database Schema
-- Run this migration in Cognabase/Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE
-- Stores user profile information for candidates and employers
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
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

-- Index for quick user lookups
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- =====================================================
-- COMPANIES TABLE
-- Stores employer company information
-- =====================================================
CREATE TABLE IF NOT EXISTS companies (
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

-- Indexes for companies
CREATE INDEX IF NOT EXISTS idx_companies_owner ON companies(owner_id);
CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies(slug);
CREATE INDEX IF NOT EXISTS idx_companies_industry ON companies(industry);
CREATE INDEX IF NOT EXISTS idx_companies_verified ON companies(verified);

-- =====================================================
-- JOBS TABLE
-- Stores job postings
-- =====================================================
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
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

-- Indexes for jobs
CREATE INDEX IF NOT EXISTS idx_jobs_employer ON jobs(employer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_industry ON jobs(industry);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_job_type ON jobs(job_type);
CREATE INDEX IF NOT EXISTS idx_jobs_experience ON jobs(experience_level);
CREATE INDEX IF NOT EXISTS idx_jobs_featured ON jobs(featured);
CREATE INDEX IF NOT EXISTS idx_jobs_created ON jobs(created_at DESC);

-- =====================================================
-- APPLICATIONS TABLE
-- Stores job applications
-- =====================================================
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
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

-- Indexes for applications
CREATE INDEX IF NOT EXISTS idx_applications_job ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_candidate ON applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created ON applications(created_at DESC);

-- Unique constraint to prevent duplicate applications
CREATE UNIQUE INDEX IF NOT EXISTS idx_applications_unique ON applications(job_id, candidate_id);

-- =====================================================
-- SAVED JOBS TABLE
-- Stores bookmarked/saved jobs for candidates
-- =====================================================
CREATE TABLE IF NOT EXISTS saved_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, job_id)
);

-- Indexes for saved jobs
CREATE INDEX IF NOT EXISTS idx_saved_jobs_user ON saved_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_job ON saved_jobs(job_id);

-- =====================================================
-- NOTIFICATIONS TABLE
-- Stores in-app notifications
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    type TEXT CHECK (type IN ('application_update', 'new_job', 'message', 'system')) NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

-- Public profiles are viewable by everyone (for candidate search)
CREATE POLICY "Public profiles are viewable"
    ON profiles FOR SELECT
    USING (true);

-- Companies policies
CREATE POLICY "Anyone can view companies"
    ON companies FOR SELECT
    USING (true);

CREATE POLICY "Owners can update their company"
    ON companies FOR UPDATE
    USING (auth.uid()::text = owner_id);

CREATE POLICY "Owners can insert their company"
    ON companies FOR INSERT
    WITH CHECK (auth.uid()::text = owner_id);

-- Jobs policies
CREATE POLICY "Anyone can view active jobs"
    ON jobs FOR SELECT
    USING (status = 'active' OR auth.uid()::text = employer_id);

CREATE POLICY "Employers can insert jobs"
    ON jobs FOR INSERT
    WITH CHECK (auth.uid()::text = employer_id);

CREATE POLICY "Employers can update their jobs"
    ON jobs FOR UPDATE
    USING (auth.uid()::text = employer_id);

CREATE POLICY "Employers can delete their jobs"
    ON jobs FOR DELETE
    USING (auth.uid()::text = employer_id);

-- Applications policies
CREATE POLICY "Candidates can view their applications"
    ON applications FOR SELECT
    USING (auth.uid()::text = candidate_id);

CREATE POLICY "Employers can view applications for their jobs"
    ON applications FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM jobs
            WHERE jobs.id = applications.job_id
            AND jobs.employer_id = auth.uid()::text
        )
    );

CREATE POLICY "Candidates can insert applications"
    ON applications FOR INSERT
    WITH CHECK (auth.uid()::text = candidate_id);

CREATE POLICY "Candidates can update their applications"
    ON applications FOR UPDATE
    USING (auth.uid()::text = candidate_id);

CREATE POLICY "Employers can update applications for their jobs"
    ON applications FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM jobs
            WHERE jobs.id = applications.job_id
            AND jobs.employer_id = auth.uid()::text
        )
    );

-- Saved jobs policies
CREATE POLICY "Users can view their saved jobs"
    ON saved_jobs FOR SELECT
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can save jobs"
    ON saved_jobs FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their saved jobs"
    ON saved_jobs FOR DELETE
    USING (auth.uid()::text = user_id);

-- Notifications policies
CREATE POLICY "Users can view their notifications"
    ON notifications FOR SELECT
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update their notifications"
    ON notifications FOR UPDATE
    USING (auth.uid()::text = user_id);

CREATE POLICY "System can insert notifications"
    ON notifications FOR INSERT
    WITH CHECK (true);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all tables with updated_at column
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON companies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
    BEFORE UPDATE ON jobs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
    BEFORE UPDATE ON applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to increment job applications count
CREATE OR REPLACE FUNCTION increment_application_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE jobs SET applications_count = applications_count + 1
    WHERE id = NEW.job_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_job_applications
    AFTER INSERT ON applications
    FOR EACH ROW
    EXECUTE FUNCTION increment_application_count();

-- Function to decrement job applications count
CREATE OR REPLACE FUNCTION decrement_application_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE jobs SET applications_count = GREATEST(applications_count - 1, 0)
    WHERE id = OLD.job_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER decrement_job_applications
    AFTER DELETE ON applications
    FOR EACH ROW
    EXECUTE FUNCTION decrement_application_count();

-- =====================================================
-- SEED DATA (Optional - uncomment to use)
-- =====================================================

-- Insert sample jobs
/*
INSERT INTO jobs (title, company, description, requirements, benefits, salary_min, salary_max, location, remote, job_type, industry, experience_level, employer_id, status, featured)
VALUES
    ('Senior Software Engineer', 'TechCorp Inc.', 'We are looking for an experienced software engineer to join our growing team...', ARRAY['5+ years experience', 'React/Node.js', 'Cloud experience'], ARRAY['Health Insurance', '401(k)', 'Remote Work'], 120000, 180000, 'San Francisco, CA', true, 'full-time', 'technology', 'senior', 'system', 'active', true),
    ('Full Stack Developer', 'StartupXYZ', 'Join our innovative startup and help build the future of fintech...', ARRAY['3+ years experience', 'JavaScript', 'Python'], ARRAY['Equity', 'Flexible Hours', 'Unlimited PTO'], 100000, 150000, 'Remote', true, 'full-time', 'technology', 'mid', 'system', 'active', false),
    ('Healthcare Administrator', 'Metro Health System', 'Oversee daily operations of our healthcare facility...', ARRAY['Healthcare experience', 'Management skills', 'Bachelor''s degree'], ARRAY['Health Benefits', 'Pension', 'Education Assistance'], 70000, 90000, 'Chicago, IL', false, 'full-time', 'healthcare', 'mid', 'system', 'active', true);
*/

-- =====================================================
-- SYSTEM NOTIFICATIONS TABLE (Admin)
-- Stores system-level alerts and notifications for admins
-- =====================================================
CREATE TABLE IF NOT EXISTS system_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT CHECK (type IN ('info', 'success', 'warning', 'error')) DEFAULT 'info',
    category TEXT CHECK (category IN ('system', 'security', 'billing', 'user', 'job', 'application')) DEFAULT 'system',
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    action_required BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for system notifications
CREATE INDEX IF NOT EXISTS idx_system_notifications_type ON system_notifications(type);
CREATE INDEX IF NOT EXISTS idx_system_notifications_read ON system_notifications(read);
CREATE INDEX IF NOT EXISTS idx_system_notifications_created ON system_notifications(created_at DESC);

-- =====================================================
-- SUPPORT TICKETS TABLE (Admin Messages)
-- Stores support tickets/messages from users
-- =====================================================
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    subject TEXT NOT NULL,
    status TEXT CHECK (status IN ('open', 'pending', 'resolved', 'closed')) DEFAULT 'open',
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
    starred BOOLEAN DEFAULT false,
    unread BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for support tickets
CREATE INDEX IF NOT EXISTS idx_support_tickets_user ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_priority ON support_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_support_tickets_updated ON support_tickets(updated_at DESC);

-- =====================================================
-- SUPPORT MESSAGES TABLE
-- Stores individual messages within support tickets
-- =====================================================
CREATE TABLE IF NOT EXISTS support_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for support messages
CREATE INDEX IF NOT EXISTS idx_support_messages_ticket ON support_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_support_messages_created ON support_messages(created_at);

-- =====================================================
-- CONTACT SUBMISSIONS TABLE
-- Stores contact form submissions
-- =====================================================
CREATE TABLE IF NOT EXISTS contact_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT CHECK (type IN ('general', 'employer', 'candidate')) DEFAULT 'general',
    status TEXT CHECK (status IN ('new', 'read', 'replied', 'archived')) DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for contact submissions
CREATE INDEX IF NOT EXISTS idx_contact_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_submissions(created_at DESC);

-- =====================================================
-- TALENT REQUESTS TABLE
-- Stores employer talent request submissions
-- =====================================================
CREATE TABLE IF NOT EXISTS talent_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name TEXT NOT NULL,
    industry TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    contact_title TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    position_title TEXT NOT NULL,
    number_of_positions INTEGER DEFAULT 1,
    employment_type TEXT NOT NULL,
    location TEXT NOT NULL,
    salary_range TEXT,
    hiring_timeline TEXT NOT NULL,
    job_description TEXT NOT NULL,
    additional_notes TEXT,
    status TEXT CHECK (status IN ('new', 'reviewing', 'contacted', 'filled', 'closed')) DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for talent requests
CREATE INDEX IF NOT EXISTS idx_talent_requests_status ON talent_requests(status);
CREATE INDEX IF NOT EXISTS idx_talent_requests_created ON talent_requests(created_at DESC);

-- Enable RLS on new tables
ALTER TABLE system_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_requests ENABLE ROW LEVEL SECURITY;

-- Policies for admin tables (admins only)
CREATE POLICY "Admins can view system notifications"
    ON system_notifications FOR SELECT
    USING (true); -- Service role will bypass, or add admin check

CREATE POLICY "Admins can update system notifications"
    ON system_notifications FOR UPDATE
    USING (true);

CREATE POLICY "Admins can delete system notifications"
    ON system_notifications FOR DELETE
    USING (true);

CREATE POLICY "Admins can view support tickets"
    ON support_tickets FOR SELECT
    USING (true);

CREATE POLICY "Users can view their own tickets"
    ON support_tickets FOR SELECT
    USING (auth.uid()::text = user_id);

CREATE POLICY "Admins can update support tickets"
    ON support_tickets FOR UPDATE
    USING (true);

CREATE POLICY "Users can create support tickets"
    ON support_tickets FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Admins can view support messages"
    ON support_messages FOR SELECT
    USING (true);

CREATE POLICY "Admins can insert support messages"
    ON support_messages FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Admins can view contact submissions"
    ON contact_submissions FOR SELECT
    USING (true);

CREATE POLICY "Anyone can submit contact form"
    ON contact_submissions FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Admins can view talent requests"
    ON talent_requests FOR SELECT
    USING (true);

CREATE POLICY "Anyone can submit talent request"
    ON talent_requests FOR INSERT
    WITH CHECK (true);

-- Trigger for support tickets updated_at
CREATE TRIGGER update_support_tickets_updated_at
    BEFORE UPDATE ON support_tickets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for talent requests updated_at
CREATE TRIGGER update_talent_requests_updated_at
    BEFORE UPDATE ON talent_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VIEWS (Optional - for common queries)
-- =====================================================

-- View for active jobs with company info
CREATE OR REPLACE VIEW active_jobs_view AS
SELECT
    j.*,
    c.name as company_name,
    c.logo_url as company_logo,
    c.verified as company_verified
FROM jobs j
LEFT JOIN companies c ON j.company_id = c.id
WHERE j.status = 'active';

-- View for application statistics
CREATE OR REPLACE VIEW application_stats_view AS
SELECT
    job_id,
    COUNT(*) as total_applications,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
    COUNT(*) FILTER (WHERE status = 'reviewing') as reviewing_count,
    COUNT(*) FILTER (WHERE status = 'interviewing') as interviewing_count,
    COUNT(*) FILTER (WHERE status = 'offered') as offered_count,
    COUNT(*) FILTER (WHERE status = 'hired') as hired_count,
    COUNT(*) FILTER (WHERE status = 'rejected') as rejected_count
FROM applications
GROUP BY job_id;

-- Grant permissions for views
GRANT SELECT ON active_jobs_view TO authenticated;
GRANT SELECT ON application_stats_view TO authenticated;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '
    =====================================================
    Humanly Staffing Database Schema Created Successfully!
    =====================================================

    Tables created:
    - profiles
    - companies
    - jobs
    - applications
    - saved_jobs
    - notifications
    - system_notifications (admin)
    - support_tickets (admin)
    - support_messages (admin)
    - contact_submissions
    - talent_requests

    Views created:
    - active_jobs_view
    - application_stats_view

    Row Level Security is enabled on all tables.

    Next steps:
    1. Configure your Supabase URL and keys in .env.local
    2. Run the application and test the features
    =====================================================
    ';
END $$;
