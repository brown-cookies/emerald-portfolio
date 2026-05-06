import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

// Middleware runs on the Edge runtime — cannot import from lib/auth.ts
// because that imports next/headers (Node.js only).
// So we duplicate just the verify logic here using jose directly.

const COOKIE_NAME = 'admin_token'

function getSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('Missing env: JWT_SECRET')
  return new TextEncoder().encode(secret)
}

async function isAuthenticated(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(COOKIE_NAME)?.value
  if (!token) return false
  try {
    await jwtVerify(token, getSecret())
    return true
  } catch {
    return false
  }
}

export async function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl

  // Allow /blog/[slug]?preview=true for authenticated admins — lets them
  // view unpublished posts at the real URL without publishing them
  if (
    pathname.startsWith('/blog/') &&
    searchParams.get('preview') === 'true'
  ) {
    const authed = await isAuthenticated(req)
    if (!authed) return NextResponse.redirect(new URL('/admin/login', req.url))
    return NextResponse.next()
  }

  // Protect all /admin routes except /admin/login itself
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const authed = await isAuthenticated(req)
    if (!authed) {
      const loginUrl = new URL('/admin/login', req.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/blog/:path*'],
}
