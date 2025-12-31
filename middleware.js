import { NextResponse } from 'next/server';

/**
 * Next.js Middleware to forward Authorization header from request
 * This allows server components to access user authentication token
 * The token is injected by AuthTokenInjector component on client-side
 */
export function middleware(request) {
  const response = NextResponse.next();
  
  // Forward Authorization header if present in request
  // This is set by AuthTokenInjector component on client-side
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    response.headers.set('authorization', authHeader);
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

