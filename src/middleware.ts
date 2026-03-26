import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/candidate(.*)',
  '/employer(.*)',
  '/admin(.*)',
  '/applications(.*)',
  '/profile(.*)',
  '/settings(.*)',
]);

// Public routes matcher - kept for reference/future use
const _isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/jobs(.*)',
  '/about(.*)',
  '/services(.*)',
  '/industries(.*)',
  '/contact(.*)',
  '/blog(.*)',
  '/faq(.*)',
  '/privacy(.*)',
  '/terms(.*)',
  '/employers(.*)',
  '/api/webhooks(.*)',
]);

// Check if Clerk is properly configured
const isClerkConfigured = () => {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  return key && key.startsWith('pk_') && !key.includes('placeholder');
};

// Development bypass middleware
function devMiddleware(request: NextRequest) {
  if (isProtectedRoute(request)) {
    const url = request.nextUrl.clone();
    url.pathname = '/sign-in';
    url.searchParams.set('dev_mode', 'true');
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

// Export appropriate middleware based on configuration
export default isClerkConfigured()
  ? clerkMiddleware(async (auth, req) => {
      if (isProtectedRoute(req)) {
        await auth.protect();
      }
    })
  : devMiddleware;

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
