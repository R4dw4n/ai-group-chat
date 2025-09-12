import { NextResponse } from 'next/server';

const supportedLocales = ['en', 'ar']; // Supported languages
const defaultLocale = 'en'; // Default language

export function middleware(request) {
  const pathname = request.nextUrl.pathname;

  // Extract the locale from the URL (e.g., /ar/about -> 'ar')
  const locale = pathname.split('/')[1];

  // Check if the path is a protected route (chats)
  const isProtectedRoute = pathname.includes('/chats');

  // If accessing a protected route, check for authentication
  if (isProtectedRoute) {
    const accessToken = request.cookies.get('accessToken')?.value;

    // If no access token found, redirect to login
    if (!accessToken) {
      const currentLocale = supportedLocales.includes(locale) ? locale : getPreferredLocale(request);
      return NextResponse.redirect(
        new URL(`/${currentLocale}/login`, request.url)
      );
    }
  }

  // If the locale is supported, set it in a cookie
  if (supportedLocales.includes(locale)) {
    const response = NextResponse.next();
    response.cookies.set('NEXT_LOCALE', locale);
    return response;
  }

  // Check if the request is for a supported locale
  const pathnameIsMissingLocale = supportedLocales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );
  // Redirect to the default locale if no locale is specified
  if (pathnameIsMissingLocale) {
    const locale = getPreferredLocale(request); // Detect preferred locale
    return NextResponse.redirect(
      new URL(`/${locale}/${pathname}`, request.url)
    );
  }

  return NextResponse.next();
}

function getPreferredLocale(request) {
  // 1. Check cookies for a saved locale
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && supportedLocales.includes(cookieLocale)) {
    return cookieLocale;
  }

  // 2. Fallback to the default locale
  return defaultLocale;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};