import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const LOCALES = ['fr', 'ar'];
const DEFAULT_LOCALE = 'fr';

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

  // Check if pathname starts with a supported locale
  const hasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (hasLocale) {
    return NextResponse.next();
  }

  // Redirect unlocalized paths like /students to /fr/students
  const targetPath = pathname === '/' ? '' : pathname;
  return NextResponse.redirect(new URL(`/${DEFAULT_LOCALE}${targetPath}`, request.url));
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'],
};
