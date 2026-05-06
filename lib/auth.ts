import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { createHmac, timingSafeEqual } from 'crypto'

const COOKIE_NAME = 'admin_token'
const COOKIE_MAX_AGE = 60 * 60 * 8 // 8 hours

function getSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('Missing env: JWT_SECRET')
  return new TextEncoder().encode(secret)
}

// ─── Sign ────────────────────────────────────────────────────────────────────
// Creates a signed JWT with 8h expiry
export async function signToken(): Promise<string> {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(getSecret())
}

// ─── Verify ──────────────────────────────────────────────────────────────────
// Returns true if the token in the cookie is valid and unexpired
export async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecret())
    return true
  } catch {
    return false
  }
}

// ─── Check password ──────────────────────────────────────────────────────────
// HMAC-then-timingSafeEqual: both values are hashed to the same fixed length
// (32 bytes) before comparison, eliminating the early-return length leak that
// the previous XOR loop had. timingSafeEqual is constant-time regardless of
// where the bytes differ.
function hmacDigest(value: string): Buffer {
  // Key is arbitrary — it's only used to produce equal-length buffers.
  // The real secret is the ADMIN_PASSWORD env var being compared.
  return createHmac('sha256', 'pw-compare').update(value).digest()
}

export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? ''
  try {
    return timingSafeEqual(hmacDigest(input), hmacDigest(expected))
  } catch {
    return false
  }
}

// ─── Session helpers ─────────────────────────────────────────────────────────
// Set the httpOnly cookie after login
export async function createSession() {
  const token = await signToken()
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   COOKIE_MAX_AGE,
    path:     '/',
  })
}

// Clear the cookie on logout
export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

// Read and verify the current session — used in Server Components + middleware
export async function getSession(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return false
  return verifyToken(token)
}
