# Humanly Staffing Platform

Enterprise staffing and recruitment platform built with Next.js 15, Clerk Authentication, and Cognabase (Supabase).

## Features

- **Public Site**: Job listings, company pages, services, industries, blog
- **Candidate Portal**: Dashboard, applications, saved jobs, profile management
- **Employer Portal**: Job posting, application management, candidate search, analytics
- **Admin Dashboard**: User management, company verification, analytics, notifications

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Auth**: Clerk
- **Database**: Cognabase/Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Email**: Resend / MXRoute SMTP
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Clerk account
- Cognabase/Supabase instance

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd humanly-staffing-website

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
```

### Environment Variables

Configure the following in `.env.local`:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxx
CLERK_SECRET_KEY=sk_live_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Cognabase/Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Email (MXRoute SMTP or Resend)
SMTP_HOST=mail.mxrouting.net
SMTP_PORT=465
SMTP_USER=contact@humanlystaffing.com
SMTP_PASSWORD=your-password
EMAIL_FROM=contact@humanlystaffing.com
# Or use Resend
RESEND_API_KEY=re_xxx

# App Configuration
NEXT_PUBLIC_APP_URL=https://humanlystaffing.com
```

### Database Setup

Run the migration script in your Cognabase/Supabase SQL editor:

```bash
# Located at:
database/migrations/001_initial_schema.sql
```

This creates all required tables with Row Level Security policies.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Auth pages (sign-in, sign-up)
│   ├── admin/           # Admin dashboard (9 pages)
│   ├── api/             # API routes (26 endpoints)
│   ├── dashboard/       # Candidate dashboard (6 pages)
│   ├── employer/        # Employer dashboard (10 pages)
│   └── ...              # Public pages
├── components/
│   ├── layout/          # Header, Footer, Navigation
│   ├── sections/        # Homepage sections
│   └── ui/              # shadcn/ui components
└── lib/
    ├── supabase.ts      # Database client
    ├── email.ts         # Email templates
    └── utils.ts         # Utilities
```

## API Endpoints

| Category | Endpoints |
|----------|-----------|
| Admin | analytics, applications, companies, jobs, messages, notifications, users |
| Employer | analytics, applications, candidates, jobs, messages, notifications |
| Candidate | saved-jobs, dashboard, profiles, notifications, messages, settings |
| Public | jobs, contact, talent-requests, companies, applications |

## Database Tables

- `profiles` - User profiles
- `companies` - Employer companies
- `jobs` - Job postings
- `applications` - Job applications
- `saved_jobs` - Bookmarked jobs
- `notifications` - User notifications
- `system_notifications` - Admin alerts
- `support_tickets` - Support messages
- `support_messages` - Ticket replies
- `contact_submissions` - Contact forms
- `talent_requests` - Employer requests

## Deployment

### Coolify

1. Create new service from Git repository
2. Set environment variables
3. Build command: `npm run build`
4. Start command: `npm start`
5. Port: 3000

### Vercel

```bash
vercel --prod
```

## License

Proprietary - Humanly Staffing Inc.
