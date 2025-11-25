import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const role = req.cookies.get('role')?.value; // ADMIN | CUSTOMER
  const { pathname } = req.nextUrl;

  // PROTEGE /admin
  if (pathname.startsWith('/admin') && role !== 'ADMIN') {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  // Si ya está logueado, no mostrar login/register
  if ((pathname === '/login' || pathname === '/register') && role) {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login', '/register'],
};
