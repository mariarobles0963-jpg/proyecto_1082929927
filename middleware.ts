import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = [
  '/',
  '/login',
  '/api/auth/login',
  '/api/auth/logout',
  '/api/auth/me',
  '/api/home',
  '/api/products',
  '/api/products/',
  '/api/sales',
  '/api/users',
  '/favicon.ico',
];

const ADMIN_PATHS = ['/admin', '/config'];

function parseJwtPayload(token: string): unknown {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
    const decoded = atob(padded);
    const json = decodeURIComponent(
      Array.from(decoded, (char) => '%' + char.charCodeAt(0).toString(16).padStart(2, '0')).join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function getSessionPayload(req: NextRequest) {
  const token = req.cookies.get('sweetstock_session')?.value;
  if (!token) return null;

  const payload = parseJwtPayload(token);
  if (!payload || typeof payload !== 'object' || payload === null) return null;

  const role = (payload as Record<string, unknown>).role;
  const exp = (payload as Record<string, unknown>).exp;

  if (typeof role !== 'string') return null;
  if (typeof exp !== 'number' || exp < Math.floor(Date.now() / 1000)) return null;

  return { role, exp };
}

function isPublicPath(pathname: string) {
  return (
    PUBLIC_PATHS.includes(pathname) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/public')
  );
}

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const session = getSessionPayload(req);
  if (!session) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === '/login' || pathname === '/logout') {
    const url = req.nextUrl.clone();
    url.pathname = '/inventory';
    return NextResponse.redirect(url);
  }

  if (ADMIN_PATHS.some((path) => pathname.startsWith(path)) && session.role !== 'admin') {
    const url = req.nextUrl.clone();
    url.pathname = '/inventory';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/config/:path*',
    '/inventory/:path*',
    '/inventory',
    '/sales/:path*',
    '/sales',
    '/profile',
    '/logout',
    '/login',
  ],
};
