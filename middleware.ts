import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const locales = ['ar', 'en'];
const defaultLocale = 'ar';
const CSRF_COOKIE = 'csrfToken';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    // CSRF protection for API routes
    if (pathname.startsWith('/api/') && (request.method === 'POST' || request.method === 'PUT' || request.method === 'DELETE')) {
        const cookieStore = await cookies();
        const cookieToken = cookieStore.get(CSRF_COOKIE)?.value;
        const headerToken = request.headers.get('x-csrf-token');
        if (!cookieToken || !headerToken || cookieToken !== headerToken) {
            return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
        }
    }
    // Locale redirect logic
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );
    if (pathnameHasLocale) return;
    request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
}

export const config = {
    matcher: ['/((?!_next).*)'],
};
