import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const ADMIN_PATHS = ['/admin', '/config'];

function getRoleFromRequest(req: NextRequest){
  try{
    const cookie = req.cookies.get('token')?.value;
    if(!cookie) return null;
    const secret = process.env.JWT_SECRET || 'dev-secret';
    const decoded = jwt.verify(cookie, secret) as any;
    return decoded?.role || null;
  }catch(e){
    return null;
  }
}

export function middleware(req: NextRequest){
  const pathname = req.nextUrl.pathname;
  const isAdminPath = ADMIN_PATHS.some(p => pathname.startsWith(p));
  if(!isAdminPath) return NextResponse.next();

  const role = getRoleFromRequest(req);
  if(role !== 'admin'){
    const url = req.nextUrl.clone();
    url.pathname = '/inventory';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/config/:path*', '/config']
};
