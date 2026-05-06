import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { posts, comments } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

function validate(body: Record<string, unknown>): string | null {
  const { name, email, content, postId } = body
  if (!postId || typeof postId !== 'number')                                                   return 'Invalid post.'
  if (!name    || typeof name    !== 'string' || name.trim().length    < 2)                    return 'Name must be at least 2 characters.'
  if (!email   || typeof email   !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))   return 'Valid email required.'
  if (!content || typeof content !== 'string' || content.trim().length < 10)                   return 'Comment must be at least 10 characters.'
  if (name.trim().length    > 100)  return 'Name too long.'
  if (content.trim().length > 2000) return 'Comment too long (max 2000 chars).'
  return null
}

// Simple in-memory rate limit — 3 comments per IP per hour
const rateMap = new Map<string, { count: number; resetAt: number }>()
function isRateLimited(ip: string): boolean {
  const now   = Date.now()
  const entry = rateMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 })
    return false
  }
  if (entry.count >= 3) return true
  entry.count++
  return false
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (isRateLimited(ip))
    return NextResponse.json({ error: 'Too many comments. Try again later.' }, { status: 429 })

  let body: Record<string, unknown>
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const error = validate(body)
  if (error) return NextResponse.json({ error }, { status: 422 })

  // Verify post exists and is published
  const [post] = await db.select({ id: posts.id })
    .from(posts)
    .where(and(eq(posts.id, body.postId as number), eq(posts.published, true)))
    .limit(1)

  if (!post) return NextResponse.json({ error: 'Post not found.' }, { status: 404 })

  await db.insert(comments).values({
    postId:   body.postId as number,
    name:     (body.name    as string).trim(),
    email:    (body.email   as string).trim().toLowerCase(),
    content:  (body.content as string).trim(),
    approved: false,
  })

  return NextResponse.json(
    { ok: true, message: 'Comment submitted and awaiting approval.' },
    { status: 201 }
  )
}
