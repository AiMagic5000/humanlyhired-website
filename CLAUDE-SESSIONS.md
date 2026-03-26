# Claude Sessions - Humanly Staffing Website

## Session: January 29, 2026

### Summary
Deployed job board with 1,204+ US jobs, fixed filtering, pagination, job detail pages, and notification dropdown z-index issues.

---

### Key Learnings

#### 1. Database Filtering - Case Sensitivity
**Problem:** Filters (industry, job type) returned "no jobs found" because database values are lowercase (`technology`, `full-time`) but dropdown values are capitalized (`Technology`, `Full-time`).

**Solution:** Change Supabase queries from `eq()` to `ilike()` for case-insensitive matching:
```typescript
// Before (case-sensitive - BROKEN)
query = query.eq('industry', params.industry);
query = query.eq('job_type', params.type);

// After (case-insensitive - WORKING)
query = query.ilike('industry', params.industry);
query = query.ilike('job_type', params.type);
```

**File:** `src/lib/job-apis/aggregator.ts`

---

#### 2. Job Detail Page - Database Integration
**Problem:** Job detail pages showed "Job Not Found" because they only checked mock data, not the database.

**Solution:** Added database queries to fetch from `humanly_jobs` table:
- `src/app/jobs/[id]/page.tsx` - Server component with `getJob()` function
- `src/app/jobs/[id]/apply/page.tsx` - Client component with API fetch
- `src/app/api/jobs/[id]/route.ts` - API route queries `humanly_jobs` first

**Pattern:**
```typescript
// Check mock data first, then database
const mockJob = jobs.find((j) => j.id === id);
if (mockJob) return mockJob;

const { data: humanlyJob } = await supabaseAdmin
  .from("humanly_jobs")
  .select("*")
  .eq("id", id)
  .eq("status", "active")
  .single();
```

---

#### 3. Z-Index Stacking Context Issues
**Problem:** Notification dropdown hidden behind sidebar menu.

**Root Cause:** CSS stacking contexts. The sidebar had `z-50`, header had `z-30`. Even though dropdown had `z-[60]`, it was trapped inside the header's `z-30` stacking context.

**Solution:** Increase header z-index to be higher than sidebar:
```typescript
// src/app/dashboard/layout.tsx
// Before
<header className="sticky top-0 z-30 ...">

// After
<header className="sticky top-0 z-[55] ...">

// src/components/notifications/notification-dropdown.tsx
// Dropdown and backdrop at z-[60]
<div className="fixed inset-0 z-[60]" />
<div className="absolute ... z-[60] ...">
```

**Z-Index Hierarchy:**
- Sidebar: `z-50`
- Header: `z-[55]`
- Notification dropdown: `z-[60]`

---

#### 4. Cloudflare Tunnel Configuration
**Problem:** After Coolify deployments, the tunnel pointed to old container names, causing 502 errors.

**Solution:** Use container IP addresses instead of container names for more reliable routing:

```bash
# Get container IP
docker inspect CONTAINER_NAME --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}'

# Update tunnel via API
curl -X PUT "https://api.cloudflare.com/client/v4/accounts/ACCOUNT_ID/cfd_tunnel/TUNNEL_ID/configurations" \
  -H "X-Auth-Email: EMAIL" \
  -H "X-Auth-Key: API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"config":{"ingress":[{"service":"http://IP:3000","hostname":"domain.com"},...]}}'
```

**Why IP instead of container name:**
- Docker's embedded DNS (127.0.0.11) sometimes fails to resolve container names
- IP addresses work immediately without DNS resolution
- Downside: IP changes on each deployment, requiring tunnel config update

---

#### 5. Deployment Workflow

**Steps after code changes:**
1. `npm run build` - Verify build succeeds
2. `git add -A && git commit -m "message" && git push`
3. Trigger Coolify deployment via API
4. Wait for new container (check with `docker ps`)
5. Get new container IP
6. Update Cloudflare tunnel config with new IP
7. Verify site is accessible

**Coolify API:**
```bash
# Trigger deployment
curl -X POST "http://10.28.28.95:8000/api/v1/deploy?uuid=APP_UUID" \
  -H "Authorization: Bearer COOLIFY_TOKEN"

# Check deployment status
curl "http://10.28.28.95:8000/api/v1/deployments/DEPLOYMENT_UUID" \
  -H "Authorization: Bearer COOLIFY_TOKEN"
```

---

#### 6. Tailwind CSS v4 Arbitrary Values
This project uses Tailwind CSS v4 with PostCSS plugin (`@tailwindcss/postcss`).

**Configuration:** `postcss.config.mjs`
```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

**Arbitrary values work automatically:**
- `z-[55]` generates `z-index: 55`
- `z-[60]` generates `z-index: 60`
- No safelist or manual configuration needed

---

### Infrastructure Reference

| Resource | Value |
|----------|-------|
| Coolify App UUID | `q84s4wk88gs4o8880sssc8ww` |
| Cloudflare Tunnel ID | `d4b5f6f4-a09b-4c0b-9cbb-a80659ea775c` |
| Database | Cognabase (self-hosted Supabase) |
| Table | `humanly_jobs` |
| Jobs Count | 1,204+ |

---

### Files Modified This Session

| File | Changes |
|------|---------|
| `src/lib/job-apis/aggregator.ts` | Case-insensitive filtering, pagination fix |
| `src/app/jobs/page.tsx` | Top pagination, job card links to detail page |
| `src/app/jobs/[id]/page.tsx` | Database fetching for job details |
| `src/app/jobs/[id]/apply/page.tsx` | API fetching for job data |
| `src/app/api/jobs/[id]/route.ts` | Query humanly_jobs table first |
| `src/app/dashboard/layout.tsx` | Header z-index increased to z-[55] |
| `src/components/notifications/notification-dropdown.tsx` | Dropdown z-index to z-[60] |

---

### Commits This Session

1. `fix: case-insensitive filtering for industry, job type, and location`
2. `fix: notification dropdown z-index to appear above sidebar`
3. `fix: increase header z-index to z-[55] to escape stacking context`
