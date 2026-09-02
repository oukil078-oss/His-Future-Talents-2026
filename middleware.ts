import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const LOCALES = ['en', 'ar'];
const DEFAULT_LOCALE = 'en';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets, api routes, uploads
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/brand') ||
    pathname.startsWith('/logo') ||
    pathname.startsWith('/uploads') ||
    pathname.startsWith('/images') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Gracefully redirect legacy /fr routes to /en
  if (pathname.startsWith('/fr/') || pathname === '/fr') {
    const newPath = pathname.replace(/^\/fr(\/|$)/, '/en$1');
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  // Check if pathname starts with a supported locale
  const hasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (hasLocale) {
    return NextResponse.next();
  }

  // Redirect unlocalized paths like /students to /en/students
  const targetPath = pathname === '/' ? '' : pathname;
  return NextResponse.redirect(new URL(`/${DEFAULT_LOCALE}${targetPath}`, request.url));
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'],
};
